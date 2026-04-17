

## What I checked

1. **Live published HTML (no special UA)** for `https://mangabeira.net/publications/definitive-guide-web3-seo`:
   - Response headers: `server: Netlify`, `cache-status: "Netlify Edge"; fwd=miss`, **NO `x-prerendered: true`**, **NO `data-rh` Helmet marker**.
   - Body: `<div id="root"><div>Loading...</div></div>` and a toaster region — that's it. No `<noscript>` block, no injected meta, no bot content block.
   - Translation: this is a **stale Prerender snapshot captured during the loading state**, served from the prerender cache. The seo.ts edge function content-injection isn't visible because Prerender served its own cached HTML before edge transforms.

2. **Live homepage** (`mangabeira.net`):
   - Returns fully prerendered HTML with `<html lang="en" data-rh="lang">` (Helmet ran), full body content. Works correctly.

3. **Live `/publications` hub**:
   - Fully prerendered (full grid of cards), but interestingly shows "Showing 0 publications" + a spinner because the React Query fetch hadn't completed when the snapshot was taken.

4. **Preview / dev sandbox**:
   - The page actually loads correctly for humans — observed full article rendering with title "Web3 SEO in 2026 – How Blockchain Changes Search".
   - Console shows missing translation keys for `case_studies.binance_impact`, `russell_impact`, `np_impact` — cosmetic warnings only.
   - All scripts return 200.

5. **Database**: 17 published pages, 19/19/17 translations EN/BR/ES. Healthy.

## What's actually broken

This isn't a "nothing loads" outage — the app works. **Three separate snapshot/SEO issues are compounding** and creating the symptom the user is seeing:

**Issue A — Prerender captures the loading state on `/publications/:slug`**
The dependent fetch chain in `DynamicPage` (`translations.csv` → `fetchSlugMappings` → `usePublicPage` → `useQuery(page-translations, enabled: !!data?.page.id)`) plus a possible `navigate(replace)` redirect means `useIsFetching === 0` flips later than Prerender's wait window. The 10-second safety timeout fires after Prerender has already snapshotted. Result: cached snapshot is the spinner, not the article.

**Issue B — Prerender captures the loading state on `/publications` hub**
Same pattern. `usePublications` finishes after the snapshot is taken, so the snapshot says "Showing 0 publications" + spinner. Featured cards are present (faster query), grid is empty.

**Issue C — UA whitelist gap (the user's original concern)**
The user's external bot crawl found GPTBot and PerplexityBot are NOT on Netlify Prerender's default whitelist, so they get the raw SPA shell with no prerender at all. ClaudeBot and Googlebot are on the list and get the (possibly stale) snapshot.

The bot-aware content injection we added in `seo.ts` would solve C — but only **if** the edge function's response actually reaches the client. Right now the prerender cache is intercepting first and the edge transform isn't visible in the served HTML for `/publications/<slug>`.

## Plan

### 1. Fix the `prerenderReady` race in `DynamicPage` (Issue A)
- Remove the early-return `<div>Loading...</div>` on `/publications/<slug>` — replace with a skeleton that contains the title (from `translation`) and a stable layout, so even a snapshot taken mid-load has indexable content.
- Set `window.prerenderReady = true` explicitly inside `DynamicPage` only after `data?.translation?.content` is present (or after a hard 8s ceiling). Don't rely solely on the global `useIsFetching` signal — chained dependent queries make it unreliable.
- Avoid the `navigate(replace)` canonical redirect during prerender by checking `window.prerenderReady === false` and skipping it for the snapshot pass.

### 2. Same fix for `Publications` hub (Issue B)
- Render the cards from `useFeaturedPublications` immediately (already works) and also render the publications grid behind a skeleton with stable layout, never "Showing 0 publications" during loading.
- Defer `prerenderReady` until both `usePublications` and `useFeaturedPublications` have settled.

### 3. Force-bust the Prerender cache after the fix
- Once the fixes above are deployed, bump a `<meta name="prerender-cache-bust" content="<timestamp>">` in `index.html` so the Prerender service re-snapshots all pages.
- Alternatively, request Netlify Prerender to recrawl via their dashboard "Recache" action.

### 4. Add GPTBot + PerplexityBot to Netlify Prerender whitelist (Issue C)
- This is a Netlify dashboard action, not a code change. Document it in the implementation plan: Netlify → Extensions → Prerender → "Custom user agents" → add `GPTBot`, `PerplexityBot`, `OAI-SearchBot`, `ChatGPT-User`, `Perplexity-User`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `Amazonbot`, `Bytespider`, `Applebot-Extended`, `meta-externalagent`, `CCBot`, `cohere-ai`.
- Our `seo.ts` already detects these UAs and injects bot-friendly content — but Prerender intercepts **before** edge functions run. With these UAs whitelisted, Prerender will serve a fresh prerendered snapshot to them.

### 5. Verification
After deploy + cache bust:
- `curl -A "Mozilla/5.0" https://mangabeira.net/publications/definitive-guide-web3-seo | grep -o '<h1[^>]*>[^<]*' ` → expect article title, not "Loading..."
- `curl -A "GPTBot" ...` → expect article title + body (via Prerender after whitelist update).
- `curl -A "Mozilla/5.0" https://mangabeira.net/publications | grep "Showing"` → expect a real number, not "Showing 0 publications".

## Files I'll touch in implementation
- `src/pages/DynamicPage.tsx` — replace loading state, gate prerenderReady, skip redirect during snapshot.
- `src/pages/Publications.tsx` — same loading-state hardening.
- `src/App.tsx` — refine `PrerenderSignal` to wait for a minimum settle window after fetches drop to 0 (currently 100ms, increase to ~500ms) so dependent queries have time to register.
- `index.html` — add cache-bust meta.
- The Netlify Prerender UA whitelist is a dashboard step, not a code change. I'll surface it as a one-step instruction after the deploy.

## What I will NOT do
- I will not turn off Netlify Prerender — the homepage proves it works when the React side cooperates.
- I will not retire `seo.ts` — it's still doing meta injection on routes Prerender doesn't cache, and the bot content block is the right long-term layer once Prerender starts honoring `prerenderReady` correctly on dynamic routes.
- I will not introduce SSR / build-time prerendering — overkill for this issue and incompatible with Lovable's hosting pipeline.

