

## Audit of the proposed plan

I reviewed the three files in question against the proposed plan. Findings:

### Bug 1 — Confirmed and accurate
`netlify/edge-functions/seo.ts` line ~628 calls `fetchPublicationMeta` for every request, not just bots. This is a real performance/timeout risk on every `/publications/:slug` view. The proposed gate `if (isBotRequest && route.type === "publication" ...)` is correct and minimally invasive.

One nuance: the third arg `includeContent` was previously `isBotRequest`. Now that the whole call is bot-gated, passing `true` is fine (matches the prior bot-only behavior of injecting full content).

### Bug 2 — Confirmed and accurate
The skip list in `seo.ts` (~line 594) excludes `/assets/`, `/_netlify/`, etc. but not `/api/`. Adding `pathname.startsWith("/api/")` is the right fix and matches the `netlify.toml` redirect that maps `/api/publications-snapshot` to the Netlify function. Without this, the edge function rewrites the JSON response or returns SPA HTML — exactly the failure mode `fetchFromSnapshot()` reports via its content-type check.

### Bug 3 & 4 — Confirmed; low-risk hardening
`PublicationCard.tsx` lines 27 and 34 deref `publication.translations` directly. The snapshot proxy and PostgREST joins can both return rows with `translations: null` under edge cases. `usePublications.ts` already uses `(pub.translations || [])` in its filter helpers — applying the same guard in the card is consistent.

### Bug 5 — Confirmed; useful
`fetchFromSnapshot()` only `console.warn`s per-URL failures and then throws a generic error. Adding a final `console.error` with the last error message will make production debugging much easier. Low-risk.

### Plan completeness check
- Doesn't touch `usePages.ts`, `DynamicPage.tsx`, `Publications.tsx`, `_redirects`, or the snapshot function itself — correct, those are already right.
- Doesn't regress bot SEO (Bug 1 fix preserves the bot path exactly).
- Doesn't break the existing snapshot fallback chain.
- Doesn't introduce new dependencies.

### One small addition I recommend
In `seo.ts`, after gating Bug 1, the variable `meta` may stay `null` for non-bot publication requests. Confirmed by reading the handler: when `meta` is null, the function falls back to `context.next()` (SPA passthrough) — which is exactly what we want. No extra change needed, just calling it out so we don't accidentally inject empty meta tags.

### Verdict
**The plan is correct, complete, and minimal.** Approve and apply as-is.

## Implementation steps

1. **`netlify/edge-functions/seo.ts`** — two surgical edits:
   - Add `pathname.startsWith("/api/") ||` to the early-return skip list (~line 594).
   - Wrap the publication meta fetch in `if (isBotRequest && ...)` (~line 628), passing `true` as the third argument.

2. **`src/components/publications/PublicationCard.tsx`** — null-guard:
   - Replace direct `.translations.find(...)` and `.translations.map(...)` with a `translationsArr = publication.translations || []` local.

3. **`src/hooks/usePublications.ts`** — better diagnostics:
   - In `fetchFromSnapshot()`, add a `console.error` summarizing the last error before the final throw.

## Verification after deploy

- `/publications` loads in incognito → grid renders.
- `/publications/definitive-guide-web3-seo` loads → article renders, no edge timeout.
- DevTools Network → `/api/publications-snapshot` returns `Content-Type: application/json`.
- With ad-blocker on → snapshot fallback kicks in, banner appears, grid still renders.
- Bot user-agent (curl with Googlebot UA) on a publication URL → still gets prerendered meta + content block.

## Files touched
- `netlify/edge-functions/seo.ts`
- `src/components/publications/PublicationCard.tsx`
- `src/hooks/usePublications.ts`

## Files NOT touched
- `netlify/functions/publications-snapshot.js`, `public/_redirects`, `src/pages/Publications.tsx`, `src/pages/DynamicPage.tsx`, `src/hooks/usePages.ts`

