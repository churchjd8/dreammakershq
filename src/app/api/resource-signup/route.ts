import { NextResponse } from "next/server";

const TAG_IDS: Record<string, string> = {
  "All Free Resources Bundle": "2150128581",
  "Fundraising Masterclass Replay (3 Hours)": "2150128582",
  "CPG Chart of Accounts": "2150128583",
  "Capital Raise & Runway Calculator": "2150128584",
  "Unit Pricing & Break-Even Model": "2150128587",
  "Suja Lessons Learned (white paper)": "2150128588",
  "CPG Fatal Flaws (white paper)": "2150128589",
  "CPG Playbook Video Replay": "2150128590",
};

async function getKajabiToken() {
  const res = await fetch("https://api.kajabi.com/v1/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.KAJABI_API_KEY!,
      client_secret: process.env.KAJABI_API_SECRET!,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kajabi auth failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, name, email, resource, stage, challenge } = body;

    // Support both new (firstName/lastName) and legacy (name) formats
    const first = firstName || name || "";
    const last = lastName || "";
    const fullName = last ? `${first} ${last}` : first;

    if (!first || !email || !resource) {
      console.error("Resource signup: missing fields", { first, email, resource });
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    console.log(`Resource signup: ${fullName} <${email}> requesting "${resource}"`);

    const accessToken = await getKajabiToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.api+json",
    };

    let contactId: string | null = null;

    // Step 1: Try to create contact
    const contactRes = await fetch("https://api.kajabi.com/v1/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "contacts",
          attributes: { name: first, custom_1: last, email, subscribed: true },
          relationships: {
            site: {
              data: { type: "sites", id: process.env.KAJABI_SITE_ID! },
            },
          },
        },
      }),
    });

    if (contactRes.ok) {
      const contactData = await contactRes.json();
      contactId = contactData.data.id;
      console.log(`Resource signup: created new contact ${contactId}`);
    } else {
      const errText = await contactRes.text();
      console.log(`Resource signup: contact create returned ${contactRes.status} — ${errText.slice(0, 200)}`);

      // Step 2: Contact likely exists — search by email
      const searchRes = await fetch(
        `https://api.kajabi.com/v1/contacts?filter[email_contains]=${encodeURIComponent(email)}`,
        { headers }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const match = searchData.data?.find(
          (c: { attributes: { email: string } }) =>
            c.attributes.email.toLowerCase() === email.toLowerCase()
        );
        if (match) {
          contactId = match.id;
          console.log(`Resource signup: found existing contact ${contactId}`);
        } else {
          console.error(`Resource signup: email search returned ${searchData.data?.length ?? 0} results but no exact match for ${email}`);
        }
      } else {
        console.error(`Resource signup: email search failed (${searchRes.status})`);
      }
    }

    if (!contactId) {
      console.error(`Resource signup: FAILED — could not create or find contact for ${email}`);
      return NextResponse.json(
        { error: "Could not create contact" },
        { status: 500 }
      );
    }

    // Step 3: Apply tag
    const tagId = TAG_IDS[resource];
    if (tagId) {
      const tagRes = await fetch(
        `https://api.kajabi.com/v1/contacts/${contactId}/relationships/tags`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            data: [{ type: "contact_tags", id: tagId }],
          }),
        }
      );
      if (!tagRes.ok) {
        console.error(`Resource signup: tag apply failed (${tagRes.status}) for contact ${contactId}`);
      } else {
        console.log(`Resource signup: applied tag ${tagId} (${resource}) to contact ${contactId}`);
      }
    } else {
      console.error(`Resource signup: no tag ID found for resource "${resource}"`);
    }

    // Step 4: Add note
    const noteRes = await fetch("https://api.kajabi.com/v1/contact_notes", {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "contact_notes",
          attributes: {
            body: `Free resource request from cpgfoundersgroup.com/resources\n\nName: ${fullName}\nResource: ${resource}\nBusiness Stage: ${stage || "Not provided"}\nBiggest Challenge: ${challenge || "Not provided"}`,
          },
          relationships: {
            contact: {
              data: { type: "contacts", id: contactId },
            },
          },
        },
      }),
    });
    if (!noteRes.ok) {
      console.error(`Resource signup: note creation failed (${noteRes.status})`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resource signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
