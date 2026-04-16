import { NextResponse } from "next/server";

const FORM_IDS: Record<string, string> = {
  "All Free Resources Bundle": "2149549983",
  "Fundraising Masterclass Replay (3 Hours)": "2149549980",
  "CPG Chart of Accounts": "2149549973",
  "Capital Raise & Runway Calculator": "2149549975",
  "Unit Pricing & Break-Even Model": "2149549976",
  "Suja Lessons Learned (white paper)": "2149549977",
  "CPG Fatal Flaws (white paper)": "2149549979",
  "CPG Playbook Video Replay": "2149549982",
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

    const formId = FORM_IDS[resource];
    if (!formId) {
      console.error(`Resource signup: no form ID for "${resource}"`);
      return NextResponse.json(
        { error: "Unknown resource" },
        { status: 400 }
      );
    }

    console.log(`Resource signup: ${fullName} <${email}> requesting "${resource}" (form ${formId})`);

    const accessToken = await getKajabiToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.api+json",
    };

    // Submit through the resource-specific form — Kajabi handles the tag
    // via form automation. Works for new, existing, and ghost contacts.
    const formRes = await fetch(
      `https://api.kajabi.com/v1/forms/${formId}/submit`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: {
            type: "form_submissions",
            attributes: {
              name: first,
              email,
              custom_1: last,
              custom_3: stage || "",
            },
          },
        }),
      }
    );

    if (!formRes.ok) {
      const errText = await formRes.text();
      console.error(`Resource signup: form submit failed (${formRes.status}): ${errText.slice(0, 200)}`);
      return NextResponse.json(
        { error: "Could not register contact" },
        { status: 500 }
      );
    }

    console.log(`Resource signup: submitted to form ${formId} for ${email}`);

    // Best-effort: try to set custom_4 (challenge) and add a note via contacts API
    const contactRes = await fetch("https://api.kajabi.com/v1/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "contacts",
          attributes: {
            name: first,
            custom_1: last,
            custom_3: stage || "",
            custom_4: challenge || "",
            email,
            subscribed: true,
          },
          relationships: {
            site: {
              data: { type: "sites", id: process.env.KAJABI_SITE_ID! },
            },
          },
        },
      }),
    });

    let contactId: string | null = null;

    if (contactRes.ok) {
      const contactData = await contactRes.json();
      contactId = contactData.data.id;
    } else {
      // Contact already exists — search for it to add note and update fields
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
          await fetch(`https://api.kajabi.com/v1/contacts/${contactId}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({
              data: {
                type: "contacts",
                id: contactId,
                attributes: {
                  custom_3: stage || "",
                  custom_4: challenge || "",
                },
              },
            }),
          });
        }
      }
    }

    // Add note if we have the contact ID
    if (contactId) {
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
