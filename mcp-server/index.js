import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { voiceProfile } from "./data/voice-profile.js";
import { stories } from "./data/stories.js";
import { contacts, keyRelationships } from "./data/contacts.js";
import { offers, positioning } from "./data/offers.js";
import { background } from "./data/background.js";

const server = new McpServer({
  name: "jeff-church-cpg",
  version: "1.0.0",
  description: "Jeff Church's voice profile, stories, contacts, and CPG Founders Group knowledge base"
});

// --- RESOURCES ---

server.resource(
  "voice-profile",
  "jeff://voice-profile",
  { description: "Jeff Church's complete writing voice profile — tone, structure, patterns, and rules for all content formats" },
  () => ({
    contents: [{
      uri: "jeff://voice-profile",
      mimeType: "application/json",
      text: JSON.stringify(voiceProfile, null, 2)
    }]
  })
);

server.resource(
  "stories",
  "jeff://stories",
  { description: "Jeff Church's signature stories and anecdotes with usage context" },
  () => ({
    contents: [{
      uri: "jeff://stories",
      mimeType: "application/json",
      text: JSON.stringify(stories, null, 2)
    }]
  })
);

server.resource(
  "offers",
  "jeff://offers",
  { description: "CPG Founders Group full offer stack — all programs, pricing, and positioning" },
  () => ({
    contents: [{
      uri: "jeff://offers",
      mimeType: "application/json",
      text: JSON.stringify({ offers, positioning }, null, 2)
    }]
  })
);

server.resource(
  "contacts",
  "jeff://contacts",
  { description: "CPG Founders Group contacts — applicants, outreach history, and key relationships" },
  () => ({
    contents: [{
      uri: "jeff://contacts",
      mimeType: "application/json",
      text: JSON.stringify({ contacts, keyRelationships }, null, 2)
    }]
  })
);

server.resource(
  "background",
  "jeff://background",
  { description: "Jeff Church's full background — bio, career stats, frameworks, benchmarks, and platforms" },
  () => ({
    contents: [{
      uri: "jeff://background",
      mimeType: "application/json",
      text: JSON.stringify(background, null, 2)
    }]
  })
);

// --- TOOLS ---

server.tool(
  "get_voice_profile",
  "Get Jeff Church's complete voice profile for writing content in his voice. Returns tone, structure, patterns, format-specific rules, and what NOT to do.",
  {},
  async () => ({
    content: [{ type: "text", text: JSON.stringify(voiceProfile, null, 2) }]
  })
);

server.tool(
  "get_story",
  "Look up a specific Jeff Church story by topic or ID. Use for finding the right anecdote for a piece of content.",
  { query: z.string().describe("Topic, category, or story ID to search for (e.g. 'fundraising', 'retail', 'vulnerability', 'suja_margin_pivot')") },
  async ({ query }) => {
    const q = query.toLowerCase();
    const matches = stories.filter(s =>
      s.id.includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.category.includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      (s.use_for && s.use_for.some(u => u.includes(q)))
    );

    if (matches.length === 0) {
      return { content: [{ type: "text", text: `No stories found for "${query}". Available categories: core_metaphor, personal, business_failure, cash_management, humility, retail_failure, strategy, operations, financial_mistake, client_success, retail, leadership, current` }] };
    }

    return { content: [{ type: "text", text: JSON.stringify(matches, null, 2) }] };
  }
);

server.tool(
  "get_contact",
  "Look up a contact in the CPG Founders Group network by name or company.",
  { query: z.string().describe("Name or company to search for") },
  async ({ query }) => {
    const q = query.toLowerCase();
    const matches = contacts.filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );

    if (matches.length === 0) {
      return { content: [{ type: "text", text: `No contacts found for "${query}". Try searching by first name, last name, or company name.` }] };
    }

    return { content: [{ type: "text", text: JSON.stringify(matches, null, 2) }] };
  }
);

server.tool(
  "get_offer",
  "Get details about a specific CPG Founders Group offer/program.",
  { program: z.string().describe("Program name: 'free', 'babu', 'mba', '90day', 'vip', 'advisory', or 'all'") },
  async ({ program }) => {
    const p = program.toLowerCase();
    let result;

    if (p === "all") {
      result = { offers, positioning };
    } else if (p.includes("free")) {
      result = offers.free_tier;
    } else if (p.includes("babu")) {
      result = offers.babu_ai;
    } else if (p.includes("mba")) {
      result = offers.mba_for_cpg;
    } else if (p.includes("90") || p.includes("breakthrough")) {
      result = offers.ninety_day_breakthrough;
    } else if (p.includes("vip")) {
      result = offers.vip_day;
    } else if (p.includes("advisory") || p.includes("strategic")) {
      result = offers.advisory;
    } else {
      result = { error: "Unknown program. Use: free, babu, mba, 90day, vip, advisory, or all" };
    }

    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_aphorism",
  "Get Jeff's signature aphorisms/quotes, optionally filtered by topic.",
  { topic: z.string().optional().describe("Optional topic to filter: 'margin', 'fundraising', 'retail', 'team', 'cash', etc.") },
  async ({ topic }) => {
    if (!topic) {
      return { content: [{ type: "text", text: JSON.stringify(voiceProfile.recurring_aphorisms, null, 2) }] };
    }

    const t = topic.toLowerCase();
    const matches = voiceProfile.recurring_aphorisms.filter(a => a.toLowerCase().includes(t));

    if (matches.length === 0) {
      return { content: [{ type: "text", text: `No aphorisms matching "${topic}". Here are all available:\n${voiceProfile.recurring_aphorisms.join("\n")}` }] };
    }

    return { content: [{ type: "text", text: JSON.stringify(matches, null, 2) }] };
  }
);

server.tool(
  "get_background",
  "Get Jeff Church's background info — bio, career stats, key companies, frameworks, or benchmarks.",
  { section: z.string().optional().describe("Optional section: 'bio', 'stats', 'companies', 'frameworks', 'benchmarks', 'platforms', or omit for all") },
  async ({ section }) => {
    if (!section) {
      return { content: [{ type: "text", text: JSON.stringify(background, null, 2) }] };
    }

    const s = section.toLowerCase();
    let result;

    if (s.includes("bio") || s.includes("personal")) {
      result = { ...background.bio, personal: background.personal };
    } else if (s.includes("stat") || s.includes("career")) {
      result = background.career_stats;
    } else if (s.includes("compan")) {
      result = background.key_companies;
    } else if (s.includes("framework")) {
      result = background.core_frameworks;
    } else if (s.includes("bench") || s.includes("metric")) {
      result = background.key_benchmarks;
    } else if (s.includes("platform") || s.includes("url") || s.includes("link")) {
      result = background.current_platforms;
    } else {
      result = background;
    }

    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "write_as_jeff",
  "Get the complete voice guide for writing as Jeff in a specific format. Returns all rules, patterns, and calibration for that format.",
  { format: z.enum(["linkedin", "blog", "email", "book", "social"]).describe("Content format to get voice rules for") },
  async ({ format }) => {
    const rules = {
      tone: voiceProfile.tone,
      sentence_structure: voiceProfile.sentence_structure,
      signature_patterns: voiceProfile.signature_patterns,
      what_not_to_do: voiceProfile.what_jeff_does_NOT_do,
      calibration: voiceProfile.format_calibration[format === "social" ? "social_media" : format === "blog" ? "blog_post" : format === "email" ? "email_to_founders" : format === "book" ? "book_long_article" : "linkedin"],
      format_specific_rules: format === "linkedin" ? voiceProfile.linkedin_rules : format === "email" ? voiceProfile.email_rules : null,
      aphorisms: voiceProfile.recurring_aphorisms
    };

    return { content: [{ type: "text", text: JSON.stringify(rules, null, 2) }] };
  }
);

// --- PROMPTS ---

server.prompt(
  "write-linkedin-post",
  "Generate a LinkedIn post in Jeff Church's voice on a given topic",
  { topic: z.string().describe("The topic or principle to write about") },
  ({ topic }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Write a LinkedIn post as Jeff Church about: ${topic}

Use these voice rules:
${JSON.stringify(voiceProfile.linkedin_rules, null, 2)}

Tone calibration: Raw, punchy. 1-2 sentence stories max. Medium polish. Quick/sharp vulnerability. Occasional profanity when authentic.

Key rules:
- Should feel like a transcribed voice note, not polished copy
- Lead with the sharpest point — no warm-up
- One principle per post — go deep
- Use Jeff's natural aphorisms where relevant
- End with invitational warmth + a punchy truth
- No emojis. No em-dashes. Never use "honestly" as a softener.
- CTAs should be warm and generous

Available aphorisms: ${voiceProfile.recurring_aphorisms.join(" | ")}

Jeff's background for context: 8x founder, HBS grad, co-founded Suja Juice ($300M+ revenue, Coca-Cola acquisition), 35+ years in CPG, currently building Proda and CPG Founders Group.`
      }
    }]
  })
);

server.prompt(
  "write-email-to-founder",
  "Draft an email to a CPG founder (from Joshua on Jeff's behalf)",
  { founder_name: z.string(), context: z.string().describe("What you know about the founder and what the email is about") },
  ({ founder_name, context }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Draft an email to ${founder_name} from Joshua (who works with Jeff Church at CPG Founders Group).

Context: ${context}

Email style rules:
- Warm, conversational, validates the founder specifically
- Clear on pricing when relevant
- Soft CTA, de-risks with guarantee
- No pressure tactics
- Personalize paragraph 2 to what you know about their brand/challenge
- Sign off as "Joshua"

Offer details if needed:
${JSON.stringify(offers.ninety_day_breakthrough, null, 2)}`
      }
    }]
  })
);

// --- START ---

const transport = new StdioServerTransport();
await server.connect(transport);
