

## Plan: Bot-aware content injection in the SEO edge function

### What changes
Single file: `netlify/edge-functions/seo.ts`

### Changes

**1. Add bot detection helper**
```ts
function isBot(userAgent: string): boolean {
  // AI crawlers (no JS): GPTBot, PerplexityBot, ClaudeBot, ChatGPT-User, 
  //                      Claude-Web, Google-Extended, anthropic-ai, cohere-ai,
  //                      Bytespider, Amazonbot, Applebot-Extended
  // Search crawlers: Googlebot, Bingbot, DuckDuckBot, YandexBot, Baiduspider
  // Social: facebookexternalhit, Twitterbot, LinkedInBot, Slackbot, Discordbot
}
```
Match case-insensitive against a single regex for performance.

**2. Extend `fetchPublicationMeta` to optionally include content**
- Add `includeContent: boolean` parameter
- When true, append `,content,featured_image_alt` to both select clauses (lines 254 and 275/284)
- Cache key becomes `pub:${locale}:${slug}:${includeContent ? "full" : "meta"}` so bot/human caches don't collide
- Add `content?: string` and `featuredImageAlt?: string` to `PageMeta` type

**3. Build a semantic content block for bots**
```ts
function buildBotContentBlock(meta: PageMeta): string {
  // <article> with <h1>{title}</h1>, optional <img> with alt, 
  // <p>{description}</p>, then sanitized content HTML, 
  // then canonical link footer.
}
```
- Wrap in `<article style="display:none" aria-hidden="true">` so any human who somehow bypasses bot detection doesn't see a duplicate article flash before hydration. Bots ignore CSS and read the DOM directly.
- Actually — better: omit the `display:none` and rely on bot detection alone. Hidden content via `display:none` is a known SEO penalty signal. Since we only inject this block for confirmed bots, visibility is fine.

**4. Wire it into the main handler**
- Read `request.headers.get("user-agent")`
- Determine `isBotRequest = isBot(ua)`
- For publication routes only, pass `isBotRequest` to `fetchPublicationMeta`
- After existing `injectMeta()` call, if `isBotRequest && meta.content`, replace the `<div id="root">` injection to also include the article block (alongside the existing `<noscript>` fallback)

**5. Keep the existing `<noscript>` block**
It still helps non-bot, non-JS scenarios (rare but real: text browsers, accessibility tools, paranoid privacy users).

### What does NOT change
- Static page metadata logic
- Helmet/SEO.tsx on the client
- Cache TTL (1h is fine)
- The existing strip+inject meta pipeline
- React hydration behavior (humans get the SPA exactly as today)

### Why this works
- AI crawlers (GPTBot, PerplexityBot, ClaudeBot) **do not execute JS** — today they see only `<noscript>` fallback + meta. After fix: they see the full article.
- Googlebot *does* render JS but uses the first-pass HTML for initial ranking signals. After fix: it gets the article on first byte.
- Humans: zero change. Same SPA, same hydration, same bundle size.
- Cost: one extra column in an existing query, no new round-trips.

### Risks & mitigations
| Risk | Mitigation |
|---|---|
| Cloaking penalty (showing bots different content than humans) | Content is **identical** to what humans see post-hydration — that's not cloaking, it's progressive enhancement. Google explicitly endorses this pattern (dynamic rendering). |
| Stale content in cache | 1h TTL is short enough; CMS edits take max 1h to propagate to bot view. Acceptable. |
| Bot UA spoofing | Worst case: a human gets an extra ~30KB of HTML once per hour per page. Negligible. |

### Verification after deploy
Curl the same publication URL with two user-agents and diff:
```bash
curl -A "Mozilla/5.0" https://mangabeira.net/publications/<slug> | wc -c
curl -A "GPTBot" https://mangabeira.net/publications/<slug> | wc -c
```
Bot response should be substantially larger and contain article body text on `grep`.

