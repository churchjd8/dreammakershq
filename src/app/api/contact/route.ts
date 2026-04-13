import { NextResponse } from "next/server";

async function getAccessToken() {
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
    throw new Error("Failed to authenticate with Kajabi");
  }

  const data = await res.json();
  return data.access_token as string;
}

export async function POST(request: Request) {
  try {
    const { name, email, business, website, stage, interest, message } =
      await request.json();

    if (!name || !email || !business || !stage || !interest || !message) {
      return NextResponse.json(
        { error: "All required fields must be filled out" },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.api+json",
    };

    // Create the contact in Kajabi
    const contactRes = await fetch("https://api.kajabi.com/v1/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "contacts",
          attributes: {
            name,
            email,
            subscribed: true,
          },
          relationships: {
            site: {
              data: {
                type: "sites",
                id: process.env.KAJABI_SITE_ID!,
              },
            },
          },
        },
      }),
    });

    let contactId: string;

    if (contactRes.ok) {
      const contactData = await contactRes.json();
      contactId = contactData.data.id;
    } else if (contactRes.status === 422) {
      // Contact may already exist - search for them
      const searchRes = await fetch(
        `https://api.kajabi.com/v1/contacts?filter[email]=${encodeURIComponent(email)}`,
        { headers }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.data && searchData.data.length > 0) {
          contactId = searchData.data[0].id;
        } else {
          console.error("Contact exists but could not be found");
          return NextResponse.json(
            { error: "Failed to process contact" },
            { status: 500 }
          );
        }
      } else {
        console.error("Failed to search for existing contact");
        return NextResponse.json(
          { error: "Failed to process contact" },
          { status: 500 }
        );
      }
    } else {
      const error = await contactRes.json();
      console.error("Kajabi contact error:", error);
      return NextResponse.json(
        { error: "Failed to create contact" },
        { status: 500 }
      );
    }

    // Add a note with the full form details
    const noteBody = [
      `Contact form submission from cpgfoundersgroup.com`,
      ``,
      `Business: ${business}`,
      website ? `Website: ${website}` : null,
      `Stage: ${stage}`,
      `Interest: ${interest}`,
      ``,
      `Message:`,
      message,
    ]
      .filter(Boolean)
      .join("\n");

    await fetch("https://api.kajabi.com/v1/contact_notes", {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "contact_notes",
          attributes: { body: noteBody },
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
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
