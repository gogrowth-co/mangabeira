

## Audit findings

The `/publications` page is still showing "Failed to load publications: TypeError: Failed to fetch". Based on the prior investigation and current code state, here's what I found auditing again:

### What's already in place (working)
- `usePublications.ts` has `isNetworkError` detection, `friendlyError` wrapper, retry logic (3x exponential backoff), and `try/catch` around Supabase calls.
- `Publications.tsx` surfaces the error message correctly.
- Supabase API itself is healthy (confirmed earlier via curl, 15 published rows).
- CSV parsing is fixed, CORS on the Supabase REST endpoint is fine (browser default, no custom config needed for PostgREST).

### What's still wrong — the real gap

**The error is `TypeError: Failed to fetch` — a browser-level network abort, not a Supabase response error.** This happens *before* Supabase can return anything. On mangabeira.net there are three plausible triggers, and the code doesn't defend against any of them:

1. **CSP / connect-src restriction via the SEO edge function or `_headers`.** `netlify/edge-functions/seo.ts` rewrites HTML for every request. If it (or any upstream) injects a `Content-Security-Policy` header missing `https://hetemmltaoirimmoxzku.supabase.co` in `connect-src`, the browser blocks the fetch with exactly this error. Need to verify `public/_headers` and the edge function output.
2. **Browser extension / privacy filter** blocking `*.supabase.co` — the current friendly-error message covers this, but only *after* all 3 retries fail (~7s of blank error state). And the screenshot shows the raw error, meaning the wrapping isn't triggering — likely because the error is thrown at a layer React Query isn't catching as "network".
3. **No offline/static fallback.** When the live fetch fails for any reason, the hub is dead. There's no snapshot of publications served from the same origin (mangabeira.net) that would bypass blockers entirely.

### Why the current "friendly error" isn't showing

Looking at the screenshot: the error text is literally `TypeError: Failed to fetch | TypeError: Failed to fetch at https://...` — this is the *raw* message, not the friendly one. That means `friendlyError()` isn't wrapping this particular throw path. The most likely reason: the failure happens inside React Query's own fetch retry, or the `featured-publications` query (which has the same retry config but its own error path) is the one failing, and that error surfaces through a different code path we haven't hardened.

Also worth noting: `useFeaturedPublications` has `try/catch` + `friendlyError`, but `Publications.tsx` only reads `error` from `usePublications`, not from `useFeaturedPublications`. If featured fails silently, fine — but if the shared Supabase client throws at module load or during the select with the joined `page_translations`, we'd see exactly this.

## Fix plan

### 1. Verify and fix CSP / connect-src (highest leverage)
- Read `public/_headers` and inspect the live response headers on mangabeira.net via the SEO edge function path.
- If CSP is present and missing the Supabase origin, add `https://hetemmltaoirimmoxzku.supabase.co` to `connect-src` (and `https://*.supabase.co` as a safety net).
- If the edge function is stripping/overwriting, patch it to preserve Supabase in `connect-src`.

### 2. Make the friendly error actually reach the UI
- Move `friendlyError` wrapping into a `catch` that also handles errors thrown by `supabase-js` internals (not just the outer `await`). Specifically wrap the entire `queryFn` body in `try/catch` and rethrow a friendly `Error` for any `TypeError` whose message matches the network pattern.
- Same treatment for `useFeaturedPublications`.
- Log the raw error to console before wrapping, so future debugging has the real stack.

### 3. Add a same-origin static fallback (resilience)
- Build a tiny JSON snapshot of published publications at build time or via a Netlify function proxying Supabase, served from `mangabeira.net/api/publications.json` (same origin, not blockable by Supabase-targeted filters).
- In `usePublications`, if the Supabase fetch fails with a network error after retries, fall back to the static snapshot and show a soft warning banner instead of a hard error.
- Snapshot is stale-tolerant; refresh on each deploy (or via a scheduled Netlify function).

### 4. Verification
- Reload `/publications` on mangabeira.net in normal browser, incognito, and with extensions → grid renders in all three.
- Browser devtools → Network tab: confirm no `Content-Security-Policy` header blocks Supabase.
- Block `*.supabase.co` in devtools (Request blocking) → confirm fallback snapshot renders and banner shows.

### Files touched
- `public/_headers` (CSP fix if needed)
- `netlify/edge-functions/seo.ts` (CSP passthrough if it's the source)
- `src/hooks/usePublications.ts` (broader catch + fallback read)
- `src/pages/Publications.tsx` (soft warning banner for fallback mode)
- New: `netlify/functions/publications-snapshot.js` or `public/api/publications.json` (static fallback)

### Files NOT touched
- Supabase schema/RLS — healthy
- `Publications.tsx` layout — working
- Other locales / other pages — not affected

