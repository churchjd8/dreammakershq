# Fathom call-recap automation — setup playbook

Built for Jeff Church. After every Fathom-recorded call, this pipeline:

1. Receives a Standard Webhooks payload from Fathom at `/api/fathom-webhook`
2. Generates a recap with Claude (Sonnet 4.6) using Jeff's voice/format rules
3. Builds a Word doc and uploads it to Dropbox
4. Emails the recap to Jeff with the Word doc attached

All four steps run in a single Vercel function call.

---

## Files added in this commit

```
src/app/api/fathom-webhook/route.ts   # webhook handler (signature verify + orchestration)
src/lib/jeff-voice.ts                 # Claude system prompt with Jeff's recap rules
src/lib/fathom-recap.ts               # Claude call + recap-to-HTML
src/lib/recap-docx.ts                 # .docx builder
src/lib/dropbox.ts                    # Dropbox refresh-token + upload
.env                                  # new env vars added at the bottom
```

Dependencies added: `@anthropic-ai/sdk`, `docx`.

---

## Step 1 — Vercel plan check

Recap generation typically runs 7-15s. The route sets `maxDuration = 60`,
which Vercel Hobby supports as of 2026 (was 10s historically — they bumped it).
Fluid Compute (default on new projects) extends Hobby to 300s.

**No upgrade required.** Verify the project has Fluid Compute on (Project →
Settings → Functions) just so we have headroom on long transcripts.

---

## Step 2 — Anthropic API key

1. Go to https://console.anthropic.com/settings/keys
2. Create a key. Name it `cpg-fathom-webhook`.
3. Paste into `.env` as `ANTHROPIC_API_KEY=...`
4. Set a monthly budget cap on the workspace (~$50/mo is plenty — each recap is ~$0.05).

---

## Step 3 — Dropbox app + refresh token

We need a long-lived **refresh token** (not a short-lived access token) so the
webhook works forever without manual re-auth.

**3a. Create the app:**
1. Go to https://www.dropbox.com/developers/apps
2. Click "Create app".
3. Choose: **Scoped access** → **App folder** (recommended) or **Full Dropbox** if
   the recap folder lives outside an app folder.
4. Name it something like `cpg-call-recaps`.
5. On the app's Permissions tab, enable: `files.content.write`, `files.content.read`. Click Submit.
6. Copy the **App key** and **App secret** into `.env` as `DROPBOX_APP_KEY` and `DROPBOX_APP_SECRET`.

**3b. Generate a refresh token (one-time):**

In a browser, visit (replace `YOUR_APP_KEY`):

```
https://www.dropbox.com/oauth2/authorize?client_id=YOUR_APP_KEY&token_access_type=offline&response_type=code
```

Approve. Dropbox shows an authorization code. Copy it.

Then in a terminal (replace all three values):

```bash
curl -u YOUR_APP_KEY:YOUR_APP_SECRET \
  -d code=THE_CODE_FROM_BROWSER \
  -d grant_type=authorization_code \
  https://api.dropboxapi.com/oauth2/token
```

The response includes `"refresh_token": "..."`. Paste it into `.env` as
`DROPBOX_REFRESH_TOKEN`.

**3c. Pick the destination folder:**

Set `DROPBOX_RECAP_FOLDER` to the path Jeff wants. If using the App-folder
permission, the path is relative to `Apps/cpg-call-recaps/`. If using Full
Dropbox, use the absolute path Jeff sees in his Dropbox.

Default: `/CPG Founders Group/Call Recaps`

---

## Step 4 — Resend "from" address

The recap email currently goes from `onboarding@resend.dev` (Resend's sandbox
sender). That works for testing but:

- Some inboxes mark sandbox senders as spam.
- Jeff would prefer it come from his domain.

To upgrade, verify a sending domain in Resend and update `RECAP_FROM_EMAIL` to
something like `Jeff Church <recaps@cpgfoundersgroup.com>`.

---

## Step 5 — Deploy

```bash
cd /home/joshua/jeffchurch
git add -A
git commit -m "Add Fathom call-recap webhook"
git push
```

Vercel auto-deploys. Once deployed, **mirror the new env vars in the Vercel
dashboard** (Project → Settings → Environment Variables) for Production:

- `ANTHROPIC_API_KEY`
- `FATHOM_WEBHOOK_SECRET` (set after Step 6)
- `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DROPBOX_REFRESH_TOKEN`
- `DROPBOX_RECAP_FOLDER`
- `JEFF_RECAP_RECIPIENT`, `RECAP_FROM_EMAIL`

Then redeploy.

Health check:
```bash
curl https://cpgfoundersgroup.com/api/fathom-webhook
# {"ok":true,"name":"fathom-webhook"}
```

---

## Step 6 — Create the Fathom webhook

Two options.

**Option A — Fathom Settings UI (easiest if available on Jeff's plan):**

1. Sign in to Jeff's Fathom account.
2. Settings → Integrations → Webhooks → New webhook.
3. URL: `https://cpgfoundersgroup.com/api/fathom-webhook`
4. Events: enable "New meeting content ready" (or equivalent).
5. Includes: enable transcript, summary, action items.
6. Trigger: "After my own meetings" + "After meetings shared with me" (per Jeff's preference).
7. Save. Fathom shows the **signing secret** (starts with `whsec_`) one time.
   Paste it immediately into `.env` and the Vercel env vars as `FATHOM_WEBHOOK_SECRET`.

**Option B — Fathom REST API (if UI doesn't expose webhooks):**

Generate a Fathom API key at Fathom Settings → API. Then:

```bash
curl -X POST https://api.fathom.ai/external/v1/webhooks \
  -H "Authorization: Bearer $FATHOM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://cpgfoundersgroup.com/api/fathom-webhook",
    "include_transcript": true,
    "include_summary": true,
    "include_action_items": true
  }'
```

The response includes the `signing_secret`. Same drill — paste it into `.env`
and Vercel env vars as `FATHOM_WEBHOOK_SECRET`, then redeploy.

---

## Step 7 — Test end-to-end

1. Have Jeff record a 2-minute test call with Fathom turned on.
2. End the call. Fathom processes for 1-3 minutes, then fires the webhook.
3. Watch Vercel function logs (`vercel logs --follow` or via dashboard).
   You should see `[fathom-webhook] received "Test call"` and a 200 response.
4. Check Jeff's inbox for the recap email.
5. Check Dropbox at `DROPBOX_RECAP_FOLDER` for the `.docx`.

If the webhook 401s, the `FATHOM_WEBHOOK_SECRET` is wrong or stale. Re-copy it
from Fathom and redeploy.

If Claude fails (most common: budget cap, invalid key), the route returns 500
with the error in `detail`. Vercel logs have full stack traces.

If Dropbox fails but email succeeds, the recap email still went out — Jeff
isn't blocked. Fix the Dropbox creds and the next call uploads normally.

---

## Tuning Jeff's recap output

The system prompt is in `src/lib/jeff-voice.ts`. The recap structure (TL;DR,
decisions, action items, etc.) is defined there as a JSON schema. After Jeff
uses this for a few weeks, ask him what's missing or what's noise, and tweak
the prompt directly. No need to change route code.

The HTML email template is `recapToHtml` in `src/lib/fathom-recap.ts`. The
Word doc layout is `buildRecapDocx` in `src/lib/recap-docx.ts`. Both are pure
functions — easy to iterate.

---

## Cost rough-cut

Per call (assuming a 30-min meeting, ~5k words of transcript):

- Claude Sonnet 4.6 input: ~7k tokens cached after first call → ~$0.005
- Claude output: ~1k tokens → ~$0.015
- Resend: free tier covers <3k/month
- Dropbox: free tier covers <2GB
- Vercel function: a couple seconds of Pro compute, negligible

**~$0.02 per call.** 100 calls/month ≈ $2.

---

## Future upgrades (not in v1)

- **Background processing**: respond to Fathom in <1s, do the heavy work in
  Vercel's `after()` callback so the webhook can't time out. Worth doing if
  Jeff ever drops to Hobby plan.
- **Slack notification**: ping a channel when a recap is ready, with a
  one-click link to the Dropbox doc.
- **CRM sync**: push action items to Linear/Notion/Kajabi automatically.
- **Multi-recipient**: copy specific attendees on relevant recaps.
- **Voice tuning loop**: after Jeff edits a recap, capture the diff in his
  brain's `_feedback/inbox/` so the prompt tightens over time (mirrors the
  CrossCourt/Jeff-brain feedback ritual).
