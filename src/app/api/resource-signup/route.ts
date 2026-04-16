import { NextResponse } from "next/server";

const DEFAULT_FORM_ID = process.env.KAJABI_DEFAULT_FORM_ID!;

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

  if (!res.ok) throw new Error(`Kajabi auth failed (${res.status})`);
  const data = await res.json();
  return data.access_token as string;
}

async function findContactByEmail(
  email: string,
  headers: Record<string, string>
): Promise<string | null> {
  // Try search filter first
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
    if (match) return match.id;
  }

  // Kajabi search index is unreliable — paginate through all contacts as fallback
  console.log(`Resource signup: email search failed for ${email}, paginating...`);
  let page = 1;
  while (page <= 20) {
    const pageRes = await fetch(
      `https://api.kajabi.com/v1/contacts?page[number]=${page}&page[size]=100&sort=-created_at`,
      { headers }
    );
    if (!pageRes.ok) break;
    const pageData = await pageRes.json();
    const contacts = pageData.data || [];
    if (contacts.length === 0) break;

    const found = contacts.find(
      (c: { attributes: { email: string } }) =>
        c.attributes.email.toLowerCase() === email.toLowerCase()
    );
    if (found) {
      console.log(`Resource signup: found ${email} on page ${page}`);
      return found.id;
    }

    if (!pageData.links?.next) break;
    page++;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, name, email, resource, stage, challenge } = body;

    const first = firstName || name || "";
    const last = lastName || "";
    const fullName = last ? `${first} ${last}` : first;

    if (!first || !email || !resource) {
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

    // Step 1: Try to create contact directly
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
      console.log(`Resource signup: created contact ${contactId}`);
    } else {
      // Contact exists — submit through default form to ensure they're updated,
      // then find them by email (with paginated fallback)
      console.log(`Resource signup: contact exists, submitting via form`);
      await fetch(`https://api.kajabi.com/v1/forms/${DEFAULT_FORM_ID}/submit`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: {
            type: "form_submissions",
            attributes: { name: first, email },
          },
        }),
      });

      contactId = await findContactByEmail(email, headers);
    }

    if (!contactId) {
      console.error(`Resource signup: FAILED — could not find contact for ${email}`);
      return NextResponse.json(
        { error: "Could not create contact" },
        { status: 500 }
      );
    }

    // Step 2: Apply tag
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
        console.error(`Resource signup: tag failed (${tagRes.status})`);
      } else {
        console.log(`Resource signup: tagged ${contactId} with ${resource}`);
      }
    }

    // Step 3: Add note
    await fetch("https://api.kajabi.com/v1/contact_notes", {
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resource signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
