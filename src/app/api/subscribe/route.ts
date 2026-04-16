import { NextResponse } from "next/server";

const NEWSLETTER_FORM_ID = "2149549985";

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

  if (!res.ok) throw new Error("Failed to authenticate with Kajabi");
  const data = await res.json();
  return data.access_token as string;
}

export async function POST(request: Request) {
  try {
    const { email, first_name, last_name } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.api+json",
    };

    // Submit through the General Newsletter Sub form — Kajabi applies the
    // tag via form automation. Works for new, existing, and ghost contacts.
    const formRes = await fetch(
      `https://api.kajabi.com/v1/forms/${NEWSLETTER_FORM_ID}/submit`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: {
            type: "form_submissions",
            attributes: {
              name: first_name || "",
              email,
              custom_1: last_name || "",
            },
          },
        }),
      }
    );

    if (!formRes.ok) {
      const errText = await formRes.text();
      console.error(`Newsletter subscribe failed (${formRes.status}): ${errText.slice(0, 200)}`);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    console.log(`Newsletter subscribe: ${first_name} ${last_name} <${email}>`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
