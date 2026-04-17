
## Investigation: "No publications found" on `/publications`

### What the user reported
The `/publications` hub is showing the empty state ("No publications found / Try adjusting your filters or search query") instead of the publications grid.

### What I need to check before planning

The recent thread has touched many moving parts: `usePublications.ts`, `Publications.tsx` loading-state hardening, the `PrerenderSignal`, canonical redirects in `DynamicPage`, and now the SEO edge function. The empty-state symptom on `/publications` could be caused by:

1. **Locale mismatch** — `usePublications` filters non-EN locales to only show pubs that have a translation in that locale. If `locale` is being computed wrong (e.g. defaulting to `br`/`es` for an EN visitor, or vice versa), the filter strips everything.
2. **Category filter stuck** — `categoryFilter` state defaults to `'all'`, but if something writes a stale value the query filters everything out.
3. **Search query stuck** — same logic.
4. **Query error swallowed** — `usePublications` throws on error but the UI only checks `isLoading` + `length === 0`, so a failed query renders as "no results".
5. **Skeleton-vs-empty race** — recent fix gates the empty state on `!isLoading`, but if the query resolves to `[]` (e.g. RLS regression, locale filter strips all), empty state shows correctly but for the wrong reason.
6. **Recent edge-function refactor side effect** — unlikely to affect client rendering, but worth a quick scan.

I need to read the current state of: `Publications.tsx`, `usePublications.ts`, `LanguageContext.tsx`, and check the live Supabase data + browser console / network to know which of the above it actually is. Since I'm in read-only plan mode and the user's preview is on `/`, I'll lay out the diagnostic + fix plan.

### Plan

**Step 1 — Diagnose (in default mode)**
- Read `src/contexts/LanguageContext.tsx` to confirm what `locale` resolves to on `/publications` (no locale prefix → should be `'en'`).
- Run a Supabase read to confirm `pages` where `status='published' AND is_system_page=false` exist and have `language='en'` translations. (We know from earlier audit there are 17 published pages with 19 EN translations — should be fine, but reconfirm.)
- Open the preview, navigate to `/publications`, and read browser console + network requests for the Supabase query. Look for: empty `data` array, RLS error, locale value in the React Query devtools/cache key.
- Check whether `categoryFilter` is being reset to a stale category on mount (e.g. via URL, localStorage).

**Step 2 — Fix the most likely cause**
Based on past patterns in this codebase, the most likely cause is one of:

- **(A) `categoryFilter` on the query is too strict.** `usePublications` passes `categoryFilter` directly to `.eq('category', categoryFilter)`. If a publication's `category` is null or differs in case/whitespace from what the badge sends, `'all'` works but other filters return nothing. Symptom matches if the user clicked a category badge.
- **(B) Locale filter strips everything.** If `locale` is `'br'` or `'es'` due to `detectBrowserLanguage()` and the user is on the bare `/publications` route (which is the EN route), `usePublications` filters out all 17 pubs that don't have a BR/ES translation matching. Wait — 19 BR and 17 ES translations exist, so this shouldn't strip everything either. But if the route mismatches the locale (visiting `/publications` while context says `br`), and the join returns translations but the locale filter `pub.translations.some(t => t.language === 'br')` happens to fail for a transient reason, we'd see empty.
- **(C) Query error.** `useQuery` throws but UI doesn't surface it. Add `error` handling to show a real error vs "no results."

**Step 3 — Hardening regardless of root cause**
- In `Publications.tsx`, distinguish three states clearly: `isLoading` (skeleton), `isError` (error message + retry), `data.length === 0` with no filters active (true empty), `data.length === 0` with filters active ("try adjusting filters"). Currently it only shows the third regardless.
- In `usePublications.ts`, log/expose the raw count vs filtered count so we can tell if the locale filter is what's stripping results.
- Verify `categoryFilter` defaults and that clicking "All" resets cleanly.

**Step 4 — Verify**
- Reload `/publications`, confirm grid renders with all 17 EN articles.
- Click each category, confirm filter works.
- Switch to `/br/publications` and `/es/publications`, confirm those work.
- Confirm "no results" only appears when search/filter genuinely yields zero.

### Files I'll touch
- `src/pages/Publications.tsx` — split error vs empty state, surface query error.
- `src/hooks/usePublications.ts` — minor: only `.eq('category', ...)` when not `'all'` (already handled), confirm no other strict filter regressions; possibly add a console.warn when locale-filter strips everything so we can see it in logs.

### What I will NOT touch
- `netlify/edge-functions/seo.ts` — the recent bot UA refactor is unrelated to client rendering of `/publications` for a human visitor. No changes needed there for this issue.
- `LanguageContext.tsx` — only read it; don't refactor unless diagnostic proves it's the cause.
- The Prerender / snapshot pipeline — that's an SEO concern, not why a human sees "No publications found" right now.

### Open question I need to ask before implementing

Before I touch code, one quick clarification will save a wrong fix:

When you see "No publications found", are you:
- (a) On `/publications` (English, no prefix), fresh load, no filters clicked, and the grid is empty? → likely locale or query regression.
- (b) On `/publications` after clicking a category badge or typing in search? → likely filter logic.
- (c) On `/br/publications` or `/es/publications`? → likely the locale-filter in `usePublications` stripping pubs.

I'll ask this as a single multiple-choice before implementing so the fix targets the right code path.
