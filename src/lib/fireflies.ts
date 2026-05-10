// Fireflies.ai GraphQL client. The webhook only sends a meetingId — we call
// the GraphQL API to pull the actual transcript, summary, and attendees.

const ENDPOINT = "https://api.fireflies.ai/graphql";

type GqlResponse<T> = { data?: T; errors?: { message: string }[] };

const TRANSCRIPT_QUERY = `
  query Transcript($id: String!) {
    transcript(id: $id) {
      id
      title
      date
      dateString
      duration
      transcript_url
      host_email
      organizer_email
      meeting_attendees {
        displayName
        email
        name
      }
      sentences {
        speaker_name
        text
      }
      summary {
        overview
        short_summary
        action_items
        keywords
        outline
        bullet_gist
        topics_discussed
      }
    }
  }
`;

export type FirefliesAttendee = {
  displayName?: string | null;
  email?: string | null;
  name?: string | null;
};

export type FirefliesSentence = {
  speaker_name?: string | null;
  text?: string | null;
};

export type FirefliesSummary = {
  overview?: string | null;
  short_summary?: string | null;
  action_items?: string | null;
  keywords?: string[] | null;
  outline?: string | null;
  bullet_gist?: string | null;
  topics_discussed?: string[] | null;
};

export type FirefliesTranscript = {
  id: string;
  title: string;
  date: number; // unix ms
  dateString: string;
  duration: number | null;
  transcript_url: string | null;
  host_email: string | null;
  organizer_email: string | null;
  meeting_attendees: FirefliesAttendee[] | null;
  sentences: FirefliesSentence[] | null;
  summary: FirefliesSummary | null;
};

export async function fetchTranscript(meetingId: string): Promise<FirefliesTranscript> {
  const apiKey = process.env.FIREFLIES_API_KEY;
  if (!apiKey) throw new Error("FIREFLIES_API_KEY missing");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: TRANSCRIPT_QUERY,
      variables: { id: meetingId },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fireflies GraphQL HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  const body = (await res.json()) as GqlResponse<{ transcript: FirefliesTranscript }>;
  if (body.errors?.length) {
    throw new Error(`Fireflies GraphQL errors: ${body.errors.map((e) => e.message).join("; ")}`);
  }
  if (!body.data?.transcript) {
    throw new Error(`Fireflies returned no transcript for id ${meetingId}`);
  }
  return body.data.transcript;
}

// Flatten the sentences array into one transcript string.
// Cap at ~80k chars (~20k tokens) so we never blow up Claude's context.
const MAX_TRANSCRIPT_CHARS = 80_000;

export function flattenTranscript(sentences: FirefliesSentence[] | null): string {
  if (!sentences?.length) return "";
  const lines: string[] = [];
  let total = 0;
  for (const s of sentences) {
    const speaker = (s.speaker_name ?? "Speaker").trim();
    const text = (s.text ?? "").trim();
    if (!text) continue;
    const line = `${speaker}: ${text}`;
    if (total + line.length > MAX_TRANSCRIPT_CHARS) {
      lines.push("... [transcript truncated]");
      break;
    }
    lines.push(line);
    total += line.length + 1;
  }
  return lines.join("\n");
}

// Build a plaintext block of whatever summary fields Fireflies populated.
export function summaryBlock(s: FirefliesSummary | null): string {
  if (!s) return "";
  const parts: string[] = [];
  if (s.overview?.trim()) parts.push(`OVERVIEW:\n${s.overview.trim()}`);
  else if (s.short_summary?.trim()) parts.push(`SHORT SUMMARY:\n${s.short_summary.trim()}`);
  if (s.outline?.trim()) parts.push(`OUTLINE:\n${s.outline.trim()}`);
  if (s.bullet_gist?.trim()) parts.push(`BULLET GIST:\n${s.bullet_gist.trim()}`);
  if (s.action_items?.trim()) parts.push(`ACTION ITEMS (Fireflies):\n${s.action_items.trim()}`);
  if (s.topics_discussed?.length) parts.push(`TOPICS: ${s.topics_discussed.join(", ")}`);
  if (s.keywords?.length) parts.push(`KEYWORDS: ${s.keywords.join(", ")}`);
  return parts.join("\n\n");
}
