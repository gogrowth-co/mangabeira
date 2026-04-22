

# Stay on Netlify — Fix First-Response HTML for All Crawlers

Goal: every crawler (AI Eyes, lovablehtml, ChatGPT, Claude, generic fetch, browsers with JS off) sees real metadata and visible body text on the first HTTP response, with no SPA shell fallback.

## Root cause

The Netlify edge function currently splits behavior by User-Agent:
- Bots get full `<article data-bot-content>` + JSON-LD
- Everyone else only gets a `<noscript>` block (which JS-off audit tools and many AI fetchers ignore because it's inside `<noscript>`)

Tools like AI Eyes and lovablehtml's "ChatGPT Fetch" simulator parse the rendered DOM. `<noscript>` content is invisible to them, so they report 0 words.

Also, baseline meta tags (`robots`, `og:site_name`) are missing, and the React shell ships untranslated i18n keys (`header.brand_name`) in first paint.

## Fix strategy

Serve the same crawler-visible HTML to everyone — not gated by UA, not hidden inside `<noscript>`. React hydration will replace it cleanly because it lives inside `<div id="root">` and React reconciles on mount.

## Changes

### 1. `netlify/edge-functions/seo.ts` — unify the injection path
- Remove UA-based branching for content injection. Always:
  - Replace `<title>` and meta description with route-specific values
  - Inject canonical, alternates, `robots`, `og:site_name`, `og:type`, `og:url`, `og:image`, twitter tags
  - Inject route-specific JSON-LD
  - Inject visible body content into `<div id="root">` as a normal `<div data-prerender="true">` (NOT inside `<noscript>`)
- Keep `data-prerender="true"` so React can detect and cleanly hydrate over it
- Add route handlers for: `/`, `/br`, `/es`, `/about`, `/tools`, `/tools/tokenomics-simulator` (+ localized), `/services/web3-growth-audit`, `/publications`, `/br/artigos`, `/es/articulos`, `/publications/:slug` (+ localized)
- Each handler returns: `{ h1, intro, sections: [{h2, body}], ctaText }` from translations or DB
- Keep existing publication DB fetch; extend to also pull article body excerpt (first ~500 words) for prerender block

### 2. `index.html` — strip duplicate shell tags
- Remove hardcoded `<title>`, `<meta description>`, `<meta og:*>`, canonical from the shell
- Keep only: charset, viewport, favicon, fonts, root div
- Reason: lovablehtml flags every shell tag as "duplicate shell tag" and downgrades the score; edge function will inject the real ones

### 3. `src/App.tsx` — no client-side root redirect
- Remove `RootRedirect` for `/`. Render `<Index />` directly at `/`
- Locale switching stays available via header dropdown and `/br`, `/es` routes
- Reason: client redirect leaves `/` as an empty shell for crawlers

### 4. `src/components/SEO.tsx` + `SEOHead.tsx` — consolidate
- Merge into a single `<PageSEO />` component with required props: `title`, `description`, `canonical`, `locale`, `path`, `ogImage?`, `schema?`
- Always emits: title, description, canonical, hreflang alternates, robots, og:* (incl. `og:site_name`), twitter:*, JSON-LD
- Update all pages to use `<PageSEO />` (remove split usage)

### 5. React shell first-paint i18n
- In `src/main.tsx` (or `LanguageProvider`), preload the active locale's translations synchronously from the CSV before first React render so shell text is never raw keys like `header.brand_name`
- Alternative: have edge function inject translated header/nav text into the prerender block (already covered by step 1)

### 6. Netlify config sanity
- Confirm Netlify Prerender Extension stays enabled (you already verified)
- `netlify.toml` already routes edge function to `/*` — no change
- Ensure no caching header strips the edge-injected HTML for bots

## Acceptance tests (after deploy)

| Test | Expected |
|---|---|
| `curl https://mangabeira.net/` (no UA) | Contains `<h1>`, body copy, JSON-LD, full meta |
| Browser with JS disabled, load `/` | Sees H1, hero copy, sections |
| AI Eyes extension on `/publications/<slug>` | Word count > 1000, no "content loss" |
| lovablehtml ChatGPT Fetch on `/` | SEO score ≥ 90, word count > 200, no "SPA shell detected" |
| `curl -A "ClaudeBot/1.0" /` | Same content as above (no regression) |
| Real browser load | Page hydrates without flash, no duplicate content |

## Out of scope (you said handle manually)
- Per-page schema customization
- llms.txt content tuning
- Manual datemodified updates

