# Fireflies call-recap automation — setup playbook

Built for Jeff Church. After every Fireflies-recorded call, this pipeline:

1. Receives a webhook at `/api/fireflies-webhook` (`{meetingId, eventType, ...}`)
2. Verifies the `x-hub-signature: sha256=<hex>` HMAC against `FIREFLIES_WEBHOOK_SECRET`
3. Fetches the full transcript + summary + attendees from Fireflies' GraphQL API
4. Generates a recap with Claude (Sonnet 4.6) using Jeff's voice/format rules
5. Builds a Word doc and uploads it to Dropbox
6. Emails the recap to Jeff with the Word doc attached

All steps run in a single Vercel function call (typically 8-16s).

---

## Files

```
src/app/api/fireflies-webhook/route.ts   # webhook handler (sig verify + orchestration)
src/lib/fireflies.ts                     # GraphQL client (transcript fetch)
src/lib/jeff-voice.ts                    # Claude system prompt with Jeff's recap rules
src/lib/meeting-recap.ts                 # Claude call + recap-to-HTML
src/lib/recap-docx.ts                    # .docx builder
src/lib/dropbox.ts                       # Dropbox refresh-token + upload
.env                                     # new env vars at the bottom
```

Dependencies: `@anthropic-ai/sdk`, `docx`.

---

## Step 1 — Vercel plan

Hobby is fine. `maxDuration = 60` works on Hobby as of 2026; Fluid Compute
extends it to 300s. Verify Fluid Compute is on (Project → Settings → Functions).

---

## Step 2 — Anthropic API key

1. https://console.anthropic.com/settings/keys → create key `cpg-fireflies-webhook`
2. Paste into `.env` as `ANTHROPIC_API_KEY=...`
3. Set a monthly budget cap (~$50/mo is plenty; each recap is ~$0.02)

---

## Step 3 — Fireflies API key + webhook

**3a. Get the API key:**
1. Sign in to Fireflies → Settings → Developer Settings → API
2. Generate an API key. Paste into `.env` as `FIREFLIES_API_KEY`.

**3b. Pick a webhook secret:**

Generate a random string yourself, e.g.:
```bash
openssl rand -hex 32
```
Save it as `FIREFLIES_WEBHOOK_SECRET` in `.env`. You'll give Fireflies the same
value in 3c.

**3c. Register the webhook with Fireflies:**

Fireflies exposes webhook creation via GraphQL. Replace `YOUR_API_KEY` and
`YOUR_WEBHOOK_SECRET` below:

```bash
curl -X POST https://api.fireflies.ai/graphql \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation SetWebhook($url: String!, $secret: String!) { updateUserSettings(webhook: $url, webhookSecret: $secret) { user { user_id } } }",
    "variables": {
      "url": "https://cpgfoundersgroup.com/api/fireflies-webhook",
      "secret": "YOUR_WEBHOOK_SECRET"
    }
  }'
```

(Alternative: Fireflies dashboard → Settings → Developer Settings → Webhooks
has a UI for this same operation if the mutation name has changed.)

Fireflies will POST `{meetingId, eventType: "Transcription completed", ...}`
to the URL every time a transcript is ready, signed with the secret.

---

## Step 4 — Dropbox app + refresh token

Same as before. Detailed below for completeness.

**4a. Create the app:**
1. https://www.dropbox.com/developers/apps → Create app
2. Scoped access → App folder (recommended) or Full Dropbox
3. Name it `cpg-call-recaps`
4. Permissions tab: enable `files.content.write` and `files.content.read`. Submit.
5. Copy App key + App secret into `.env` as `DROPBOX_APP_KEY` / `DROPBOX_APP_SECRET`.

**4b. Generate refresh token (one-time):**

Open in browser (replace `YOUR_APP_KEY`):
```
https://www.dropbox.com/oauth2/authorize?client_id=YOUR_APP_KEY&token_access_type=offline&response_type=code
```
Approve, copy the code Dropbox shows. Then:

```bash
curl -u YOUR_APP_KEY:YOUR_APP_SECRET \
  -d code=THE_CODE_FROM_BROWSER \
  -d grant_type=authorization_code \
  https://api.dropboxapi.com/oauth2/token
```

Paste the `refresh_token` from the response into `.env` as
`DROPBOX_REFRESH_TOKEN`.

**4c. Folder path:**

`DROPBOX_RECAP_FOLDER` defaults to `/CPG Founders Group/Call Recaps`. If you
chose "App folder" permission, this path is relative to `Apps/cpg-call-recaps/`.

---

## Step 5 — Resend "from" address (optional polish)

Currently `RECAP_FROM_EMAIL` points at Resend's sandbox sender
(`onboarding@resend.dev`). Works for testing. For production, verify Jeff's
sending domain in Resend and update to something like
`Jeff Church <recaps@cpgfoundersgroup.com>`.

---

## Step 6 — Mirror env to Vercel and deploy

Vercel auto-deploys on push, but the env vars need to be added in the dashboard.

Project → Settings → Environment Variables → add for Production:
- `ANTHROPIC_API_KEY`
- `FIREFLIES_API_KEY`
- `FIREFLIES_WEBHOOK_SECRET`
- `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DROPBOX_REFRESH_TOKEN`
- `DROPBOX_RECAP_FOLDER`
- `JEFF_RECAP_RECIPIENT`, `RECAP_FROM_EMAIL`

Then trigger a redeploy so they take effect.

Health check:
```bash
curl https://cpgfoundersgroup.com/api/fireflies-webhook
# {"ok":true,"name":"fireflies-webhook"}
```

---

## Step 7 — Test end-to-end

1. Have Jeff record a 2-minute test call with Fireflies on.
2. End the call. Fireflies processes for ~1-3 minutes, then fires the webhook.
3. Watch Vercel function logs (`vercel logs --follow`). You should see
   `[fireflies-webhook] processing "Test call"` and a 200.
4. Check Jeff's inbox for the recap email.
5. Check Dropbox at `DROPBOX_RECAP_FOLDER` for the `.docx`.

If signature 401s: `FIREFLIES_WEBHOOK_SECRET` doesn't match the secret you
gave Fireflies. Re-register the webhook (Step 3c) with the same value in
both places, then redeploy.

If Claude 500s: usually budget cap or invalid key. Check Vercel logs.

If Dropbox fails but email succeeds: the email still went out. Fix the
Dropbox creds and the next call uploads normally.

---

## Tuning Jeff's recap output

System prompt: `src/lib/jeff-voice.ts`. Recap structure (TL;DR, decisions,
action items, etc.) defined there as a JSON schema. After Jeff uses this
for a few weeks, tweak the prompt — no route-code changes needed.

HTML email template: `recapToHtml` in `src/lib/meeting-recap.ts`.
Word doc layout: `buildRecapDocx` in `src/lib/recap-docx.ts`.

---

## Cost rough-cut

Per 30-min call:
- Fireflies GraphQL fetch: free with API tier
- Claude Sonnet 4.6 input (~7k tokens cached): ~$0.005
- Claude output (~1k tokens): ~$0.015
- Resend + Dropbox + Vercel: negligible

**~$0.02 per call.** 100 calls/month ≈ $2.

---

## Future upgrades

- Background processing via `after()` so the webhook responds in <1s
- Slack notification when a recap lands
- Push action items to Notion / Linear / Kajabi automatically
- Voice tuning loop — capture Jeff's edits into his MCP brain's
  `_feedback/inbox/` so the prompt tightens over time
