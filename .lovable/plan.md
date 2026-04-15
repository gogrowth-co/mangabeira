

# SEO Recovery Plan: Netlify Edge Function for Server-Side Meta Injection

## Problem Summary
The Netlify Prerender Extension strips the `<head>` section from all pages served to bots. Every page is missing title, description, canonical, hreflang, OG tags, and structured data in the crawled HTML. This is the root cause of zero organic traffic despite impressions.

## Architecture

```text
Request → Netlify CDN
  ↓
Edge Function (ALL traffic, bots + humans)
  ↓
Fetches index.html via context.next()
  ↓
HTMLRewriter injects: <title>, <meta description>,
  <link canonical>, <link hreflang>, <meta og:*>,
  <script type="application/ld+json">
  ↓
Returns modified HTML
  ↓
Browser hydrates React app (Helmet overwrites are harmless — same values)
```

## Step-by-Step Plan

### Step 1: Create Netlify Edge Function (`netlify/edge-functions/seo.ts`)
- Intercepts ALL requests (bots + humans) for HTML pages
- Parses URL path to determine: locale (en/br/es), page type (home, publication, tool, audit, about, privacy, publications hub)
- For **static/system pages** (home, about, privacy, tools hub, tokenomics simulator, web3 growth audit): hardcoded SEO metadata map
- For **dynamic pages** (publications): fetches title + meta_description + featured_image from Supabase `pages` + `page_translations` tables via REST API (using anon key, RLS allows public SELECT on published pages)
- Uses `HTMLRewriter` to:
  - Replace `<title>` content
  - Upsert `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:url">`, `<meta property="og:image">`, `<meta name="twitter:title">`, `<meta name="twitter:description">`
  - Inject `<link rel="canonical">`, three `<link rel="alternate" hreflang="...">` tags
  - Inject `<script type="application/ld+json">` with appropriate schema
- Passes through non-HTML requests (JS, CSS, images, API calls) untouched
- Caches DB lookups in-memory with 1-hour TTL

### Step 2: Register edge function in `netlify.toml`
```toml
[[edge_functions]]
  function = "seo"
  path = "/*"
```
With exclusion patterns for static assets.

### Step 3: Delete orphaned Supabase prerender function
- Delete `supabase/functions/prerender/` (index.ts)
- Remove `[functions.prerender]` from `supabase/config.toml`
- Remove any references to the prerender function

### Step 4: Fix RSS path mismatch in `SEO.tsx`
- Change `/rss/rss-en.xml` → `/rss/en.xml` (and br/es) to match `_redirects` and `index.html`

### Step 5: Remove duplicate global Helmet from `App.tsx`
- Delete the `<Helmet>` block at lines 80-86 that sets description/og/twitter — per-page `<SEO>` components handle this

### Step 6: Clean up `index.html`
- Remove the hardcoded JSON-LD block (lines 35-149) — the edge function now handles structured data server-side, and Helmet handles it client-side
- Keep: charset, viewport, title (as fallback), favicon, fonts, GTM, og:image, twitter:card/image, RSS links

### Step 7: Standardize About.tsx and PrivacyPolicy.tsx
- Replace manual `document.querySelector` DOM manipulation with `react-helmet-async` `<Helmet>` — consistent with every other page

### Step 8: Add hreflang to Web3GrowthAudit.tsx
- Add `<Helmet>` hreflang alternate links for EN/BR/ES routes

### Step 9: Fix root redirect for bots (App.tsx)
- Replace `window.location.href = '/br'` with React Router `<Navigate>` to avoid breaking bot crawling of `/`

### Step 10: Regenerate sitemap and RSS
- Trigger `generate-sitemap` and `generate-rss` edge functions to produce fresh feeds with correct alternate URLs

## Technical Details

### Edge Function URL Parsing Logic
```text
/                           → locale=en, type=home
/br                         → locale=br, type=home
/es                         → locale=es, type=home
/publications               → locale=en, type=publications-hub
/br/artigos                 → locale=br, type=publications-hub
/es/articulos               → locale=es, type=publications-hub
/publications/:slug         → locale=en, type=publication, fetch from DB
/br/artigos/:slug           → locale=br, type=publication, fetch from DB
/es/articulos/:slug         → locale=es, type=publication, fetch from DB
/about                      → locale=en, type=about (hardcoded meta)
/tools                      → locale=en, type=tools-hub
/tools/tokenomics-simulator → locale=en, type=tokenomics
/services/web3-growth-audit → locale=en, type=audit
/privacy-policy             → locale=en, type=privacy
... (+ BR/ES variants)
```

### Files Created
- `netlify/edge-functions/seo.ts` — the core edge function

### Files Modified
- `netlify.toml` — register edge function
- `supabase/config.toml` — remove prerender entry
- `src/components/SEO.tsx` — fix RSS paths
- `src/App.tsx` — remove global Helmet, fix RootRedirect
- `index.html` — remove duplicate JSON-LD
- `src/pages/About.tsx` — migrate to react-helmet-async
- `src/pages/PrivacyPolicy.tsx` — migrate to react-helmet-async
- `src/pages/Web3GrowthAudit.tsx` — add hreflang

### Files Deleted
- `supabase/functions/prerender/index.ts`

