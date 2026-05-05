# Jeff Church MCP Server

MCP server that gives Claude access to Jeff's voice profile, stories, contacts, and CPG Founders Group content.

## Live URL

```
https://mcp-server-mauve-eight.vercel.app/sse
```

## How Jeff Connects

In Claude Desktop, go to **Settings → MCP Servers** and add:

```json
{
  "mcpServers": {
    "jeff-church": {
      "url": "https://mcp-server-mauve-eight.vercel.app/sse"
    }
  }
}
```

Or for Claude Code CLI, add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "jeff-church": {
      "url": "https://mcp-server-mauve-eight.vercel.app/sse"
    }
  }
}
```

## What's Included

### Resources (auto-loaded context)
- **voice-profile** — Complete writing voice guide (tone, structure, patterns, format rules)
- **stories** — Jeff's signature anecdotes with usage context
- **offers** — Full CPG Founders Group offer stack with pricing
- **contacts** — Applicants, outreach history, key relationships
- **background** — Bio, career stats, frameworks, benchmarks

### Tools (on-demand lookups)
- `get_voice_profile` — Full voice profile for content creation
- `get_story` — Search stories by topic/category
- `get_contact` — Look up a contact by name/company
- `get_offer` — Get details on a specific program
- `get_aphorism` — Jeff's signature quotes, optionally filtered
- `get_background` — Bio, stats, frameworks, benchmarks
- `write_as_jeff` — Get format-specific voice rules (linkedin, blog, email, book, social)

### Prompts (templates)
- `write-linkedin-post` — Generate a LinkedIn post in Jeff's voice
- `write-email-to-founder` — Draft an outreach email from Joshua

## Usage Examples

Once connected, Claude can:
- "Write a LinkedIn post about gross margin" → uses voice profile + aphorisms
- "What's the story about Suja's margin pivot?" → returns the story with context
- "Look up Morgan Mayer" → returns contact details and status
- "How much is the 90-Day Breakthrough?" → returns full pricing and inclusions
- "Write an email to a founder who applied for the 90-Day" → uses email template + voice

## Development

```bash
cd mcp-server
npm install
npm start
```

Runs locally on port 3001.
