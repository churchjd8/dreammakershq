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
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    const res = await fetch("https://api.kajabi.com/v1/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "contacts",
          attributes: {
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

    if (!res.ok) {
      const error = await res.json();
      // Kajabi returns 422 if contact already exists
      if (res.status === 422) {
        return NextResponse.json({ success: true, existing: true });
      }
      console.error("Kajabi API error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
