

# Updated SEO/AEO Fix Plan — Informed by Netlify Prerender Docs

## How Netlify Prerender Actually Works

From the docs: The Prerender extension adds two components:
1. **Edge function** — detects crawler user-agents, rewrites requests to a serverless function
2. **Serverless function** — uses a **headless browser** to fully render the page, returns the HTML snapshot

This means crawlers get: Edge Function output (injected meta) → Headless browser renders React → Helmet runs → `window.prerenderReady` signals completion → snapshot returned.

**The problem**: Your `seo.ts` edge function injects meta tags into raw HTML. Then the headless browser runs React + Helmet, which adds a SECOND set of the same tags. The snapshot has **duplicate everything**. And if data fetches stall, `prerenderReady` never fires and the snapshot is "Loading...".

---

## Changes (3 files)

### 1. `netlify/edge-functions/seo.ts` — Strip existing tags before injecting + add noscript content

Update `injectMeta()` to **remove** existing `<meta name="description">`, `<link rel="canonical">`, `<meta property="og:*">`, `<meta name="twitter:*">`, and `<link rel="alternate" hreflang="*">` tags from the HTML BEFORE appending the edge function's clean set. This prevents the double-tag problem regardless of whether Helmet runs later or not.

Also inject a `<noscript>` block after `<div id="root">` with the page title, description, and canonical URL as visible text. This gives non-JS crawlers (AI bots that bypass prerender) actual indexable content.

### 2. `src/App.tsx` — Add 10-second timeout to PrerenderSignal

The current `PrerenderSignal` only sets `window.prerenderReady = true` when all React Query fetches complete. If a Supabase fetch stalls or times out, the headless browser never gets the "ready" signal and returns a "Loading..." page.

Add a 10-second maximum timeout: if fetches haven't resolved after 10s, set `prerenderReady = true` anyway. This ensures the Netlify Prerender serverless function always captures rendered content rather than a loading spinner.

### 3. `src/pages/About.tsx` — Fix og:image to stable CDN URL

Replace the Vite-hashed asset import for `og:image` with the stable CDN OG banner URL. Hashed paths change every build, breaking cached social card images.

---

## Why This Fixes Visibility

| Problem | Root cause | Fix |
|---|---|---|
| Duplicate meta tags in snapshots | `injectMeta()` appends without stripping | Strip before inject |
| "Loading..." snapshots | No timeout on `prerenderReady` | 10s safety timeout |
| Empty body for non-JS AI bots | No fallback content | `<noscript>` block |
| Broken social cards on About | Hashed asset path for og:image | Stable CDN URL |

After deploying, re-trigger IndexNow to get all URLs re-crawled with clean snapshots.

