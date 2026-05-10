import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { generateRecap, recapToHtml, type FathomMeeting } from "@/lib/fathom-recap";
import { buildRecapDocx, docxFilename } from "@/lib/recap-docx";
import { uploadDocxToDropbox } from "@/lib/dropbox";

// Recap generation (Claude) + docx + Dropbox + email typically run 7-15s.
// 60s ceiling works on Vercel Hobby (as of 2026) and Pro alike.
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const SIG_TOLERANCE_SECONDS = 5 * 60;

function verifyStandardWebhookSignature(
  rawBody: string,
  headers: Headers,
  secret: string,
): { ok: boolean; reason?: string } {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const sigHeader = headers.get("webhook-signature");
  if (!id || !timestamp || !sigHeader) return { ok: false, reason: "missing signature headers" };

  const tsNum = Number(timestamp);
  if (!Number.isFinite(tsNum)) return { ok: false, reason: "bad timestamp" };
  const skew = Math.abs(Math.floor(Date.now() / 1000) - tsNum);
  if (skew > SIG_TOLERANCE_SECONDS) return { ok: false, reason: `timestamp skew ${skew}s` };

  // Standard Webhooks: secret is "whsec_<base64>"; the signed content is
  // `${id}.${timestamp}.${body}`, HMAC-SHA256, signature header is space-
  // delimited list of "v1,<base64>" entries — any one matching is valid.
  const secretBytes = secret.startsWith("whsec_")
    ? Buffer.from(secret.slice("whsec_".length), "base64")
    : Buffer.from(secret, "utf8");

  const signedContent = `${id}.${timestamp}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secretBytes).update(signedContent).digest("base64");

  for (const part of sigHeader.split(" ")) {
    const [version, value] = part.split(",", 2);
    if (version !== "v1" || !value) continue;
    if (
      value.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected))
    ) {
      return { ok: true };
    }
  }
  return { ok: false, reason: "signature mismatch" };
}

// Fathom's webhook schema is loosely documented; the meeting payload may sit
// at the top level or nested under "meeting". Normalize defensively.
function normalizeMeeting(payload: unknown): FathomMeeting {
  const p = (payload ?? {}) as Record<string, unknown>;
  const m = (p.meeting && typeof p.meeting === "object" ? p.meeting : p) as Record<string, unknown>;

  const attendeesRaw =
    (m.calendar_invitees as unknown[]) ||
    (m.attendees as unknown[]) ||
    (p.attendees as unknown[]) ||
    [];

  const attendees = attendeesRaw
    .filter((a): a is Record<string, unknown> => !!a && typeof a === "object")
    .map((a) => ({
      name: String(a.name ?? a.email ?? "Unknown"),
      email: a.email ? String(a.email) : undefined,
      is_external: typeof a.is_external === "boolean" ? a.is_external : undefined,
    }));

  const stringField = (...keys: string[]): string | undefined => {
    for (const k of keys) {
      const v = (m[k] ?? p[k]) as unknown;
      if (typeof v === "string" && v.trim()) return v;
      if (v && typeof v === "object") {
        const text =
          (v as Record<string, unknown>).text ??
          (v as Record<string, unknown>).markdown ??
          (v as Record<string, unknown>).content;
        if (typeof text === "string" && text.trim()) return text;
        // Last resort: stringify (handles arrays of action items).
        try {
          return JSON.stringify(v);
        } catch {
          /* ignore */
        }
      }
    }
    return undefined;
  };

  return {
    title: String(m.title ?? p.title ?? "Untitled meeting"),
    url: String(m.url ?? m.share_url ?? p.url ?? ""),
    recording_id: (m.recording_id ?? p.recording_id ?? "") as string | number,
    start_time: String(m.recording_start_time ?? m.start_time ?? p.recording_start_time ?? new Date().toISOString()),
    end_time: String(m.recording_end_time ?? m.end_time ?? p.recording_end_time ?? ""),
    attendees,
    summary: stringField("summary", "ai_summary"),
    transcript: stringField("transcript"),
    action_items: stringField("action_items"),
  };
}

async function sendRecapEmail(args: {
  to: string;
  from: string;
  subject: string;
  html: string;
  docx: Buffer;
  filename: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: args.from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      attachments: [
        {
          filename: args.filename,
          content: args.docx.toString("base64"),
        },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend send failed (${res.status}): ${err}`);
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  const secret = process.env.FATHOM_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[fathom-webhook] FATHOM_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "server misconfigured" }, { status: 500 });
  }

  const verify = verifyStandardWebhookSignature(rawBody, request.headers, secret);
  if (!verify.ok) {
    console.warn("[fathom-webhook] signature rejected:", verify.reason);
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const meeting = normalizeMeeting(payload);
  console.log(
    `[fathom-webhook] received "${meeting.title}" (${meeting.recording_id}) attendees=${meeting.attendees.length} hasTranscript=${!!meeting.transcript}`,
  );

  try {
    const recap = await generateRecap(meeting);
    const docxBuffer = await buildRecapDocx(recap, meeting);
    const filename = docxFilename(meeting);

    const dropboxFolder = (process.env.DROPBOX_RECAP_FOLDER ?? "/Call Recaps").replace(/\/+$/, "");
    const destPath = `${dropboxFolder}/${filename}`;

    // Run upload + email in parallel; surface either failure but don't let one
    // success hide the other failure.
    const [dropboxResult, emailResult] = await Promise.allSettled([
      uploadDocxToDropbox(docxBuffer, destPath),
      sendRecapEmail({
        to: process.env.JEFF_RECAP_RECIPIENT ?? "jeff@cpgfoundersgroup.com",
        from: process.env.RECAP_FROM_EMAIL ?? "CPG Founders Group <onboarding@resend.dev>",
        subject: recap.subject,
        html: recapToHtml(recap, meeting),
        docx: docxBuffer,
        filename,
      }),
    ]);

    if (dropboxResult.status === "rejected") {
      console.error("[fathom-webhook] dropbox upload failed:", dropboxResult.reason);
    }
    if (emailResult.status === "rejected") {
      console.error("[fathom-webhook] email send failed:", emailResult.reason);
    }

    return NextResponse.json({
      ok: true,
      meeting: { id: meeting.recording_id, title: meeting.title },
      dropbox:
        dropboxResult.status === "fulfilled"
          ? { uploaded: true, path: dropboxResult.value.path }
          : { uploaded: false, error: String(dropboxResult.reason) },
      email:
        emailResult.status === "fulfilled"
          ? { sent: true }
          : { sent: false, error: String(emailResult.reason) },
    });
  } catch (err) {
    console.error("[fathom-webhook] processing failed:", err);
    const msg = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: "processing failed", detail: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, name: "fathom-webhook" });
}
