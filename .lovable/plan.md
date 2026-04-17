
## Audit findings

Live probes against `mangabeira.net` reveal three delivery paths:

| Route | Mozilla | GPTBot / Googlebot / OAI-SearchBot / meta-externalagent | PerplexityBot / ClaudeBot |
|---|---|---|---|
| `/publications/<slug>` | 5KB shell | 40KB Netlify Prerender (`x-prerendered: true`) ✅ | 15KB seo.ts bot block ✅ |
| `/publications` (hub) | 4KB shell | 100KB Netlify Prerender, 15 cards ✅ | **4KB shell — no content** ❌ |
| `/` (home) | 4KB shell | 128KB Netlify Prerender ✅ | **4KB shell — no content** ❌ |

**Two real problems:**

1. **Perplexity & Claude get nothing on hub/home/about/tools.** Netlify Prerender's whitelist serves them the SPA shell, and `seo.ts` only injects `botContent` when `route.type === "publication"` (line 505–507, 518). For every other route, even though `meta` is built, no article block is produced — so these two crawlers index empty pages for the homepage and category hubs.
2. **Bot UA list is a single opaque regex.** The refactor the user described (four labeled groups + `PRERENDER_EXTRA_BOT_UAS` env var + regex-escaping) was proposed but never committed. Adding a new crawler today requires editing the regex, redeploying, and hoping the alternation order doesn't break.

A previously feared issue is **not** a problem: GPTBot, OAI-SearchBot, ClaudeBot, and meta-externalagent now reliably hit Netlify Prerender on publication URLs and receive full HTML. That part of the pipeline is healthy.

## Plan — single file: `netlify/edge-functions/seo.ts`

### 1. Refactor bot UA list into four labeled groups (~30 lines)
Replace the single `BOT_UA_REGEX` constant with four arrays plus a builder:
- `AI_CRAWLER_UAS` — OpenAI (GPTBot, ChatGPT-User, OAI-SearchBot), Anthropic (ClaudeBot, Claude-Web, Claude-SearchBot, anthropic-ai), Google (Google-Extended, GoogleOther), Apple (Applebot-Extended), Meta (meta-externalagent, Meta-ExternalFetcher), Perplexity (PerplexityBot, Perplexity-User), Cohere (cohere-ai), Mistral (MistralAI-User), DuckAssistBot, Kagibot, YouBot, Timpibot, Omgilibot, ImagesiftBot, Diffbot, CCBot, Bytespider, Amazonbot, PetalBot.
- `SEARCH_CRAWLER_UAS` — Googlebot, Bingbot, DuckDuckBot, YandexBot, Baiduspider, Applebot.
- `SOCIAL_PREVIEWER_UAS` — facebookexternalhit, Twitterbot, LinkedInBot, Slackbot, Discordbot, WhatsApp, TelegramBot, Pinterestbot.
- `SEO_TOOL_UAS` — AhrefsBot, SemrushBot, MJ12bot, DotBot.
- Plus `Deno.env.get("PRERENDER_EXTRA_BOT_UAS")` (comma-separated) appended at module load.
- All tokens regex-escaped with a small `escapeRegex()` helper before being joined with `|`. Final `BOT_UA_REGEX` rebuilt from the merged list.
- One inline comment per group explaining who it covers; no behavioral change for any UA already matched.

### 2. Inject bot article block on **all** routes, not just publications
Currently `botContent` is only built when `meta.content` exists, which only happens for publications. Extend the bot path so every route serves indexable HTML to bots that bypass Netlify Prerender (Perplexity, Claude):
- For non-publication routes, build a lightweight bot block from the static meta: `<article data-bot-content="true"><h1>{title}</h1><p>{description}</p><a href="{canonical}">…</a></article>`.
- For the publications hub specifically, fetch the same list of published pages from Supabase (already cached pattern) and emit a `<ul>` of `<li><a href="{canonical}">{title}</a> — {description}</li>` entries so the hub is indexable too.
- Keep the existing rich `buildBotContentBlock` for publications unchanged.

### 3. Verification (after deploy)
Re-run the same probe matrix. Expect PerplexityBot and ClaudeBot to receive >10KB on `/`, `/publications`, `/about` containing real titles + links. Expect GPTBot etc. to be unchanged (still served by Netlify Prerender first). Expect humans to be unchanged (no bot block injected).

### Files touched
- `netlify/edge-functions/seo.ts` only.

### Files NOT touched
- `index.html`, `App.tsx`, `Publications.tsx`, `DynamicPage.tsx` — the client-side hardening from earlier in this thread is working. The remaining gap is bot-side, isolated to the edge function.
- Netlify Prerender dashboard whitelist — not needed for Perplexity/Claude anymore once the edge function fills the gap directly.
