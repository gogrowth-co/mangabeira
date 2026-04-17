
## Root cause

The user's "Failed to load publications / Unknown error" screenshot maps to the `isError` branch in `Publications.tsx`. The current live site works (15 publications render), so the immediate Supabase query is healthy. But there's a **real, latent bug** that produced that error and will keep causing intermittent failures:

**`public/translations/en.csv` row 281 is malformed.** It has a stray double comma:
```
chat,empty_state_line1,Ask me anything about Gabriel's journey,,Empty state message
```
This produces 5 fields when the header defines 4. Papa Parse logs `TooManyFields` at row 281 (confirmed in console), and downstream rows in the file get misaligned. That's also why the page shows warnings like `Section not found: publications_hub for locale en` and `Section not found: header for locale en` — sections that come *after* the broken row in the CSV silently get dropped or shifted.

Two compounding issues in the code make this worse:

1. **Error message is hidden.** `usePublications` does `if (error) throw error` — but Supabase's `error` is a plain object, not an `Error` instance. In `Publications.tsx`, `error instanceof Error ? error.message : 'Unknown error'` then prints "Unknown error", erasing all diagnostic info. Same applies if the error originates anywhere else in the queryFn (e.g. a `pub.tags.some(...)` on a null tags column).
2. **`pub.tags` may be null.** Schema default is `'[]'::jsonb` but column is nullable. When `searchQuery` is set, `pub.tags.some(...)` throws `TypeError: Cannot read properties of null`, which would surface as "Unknown error".

## Fix plan (3 small edits, 1 file each)

### 1. Fix the broken CSV row — `public/translations/en.csv` line 281
Change:
```
chat,empty_state_line1,Ask me anything about Gabriel's journey,,Empty state message
```
to:
```
chat,empty_state_line1,Ask me anything about Gabriel's journey,Empty state message
```
(remove the stray empty field). This restores correct parsing of every row after 281, eliminates the `Section not found` warnings, and removes the most likely trigger of intermittent failures.

### 2. Harden `usePublications.ts` so errors are real `Error` objects and `tags` is null-safe
- Wrap Supabase errors: `throw new Error(error.message || 'Supabase query failed')` (preserve `error.code`/`error.details` in the message).
- In the search filter, guard tags: `(pub.tags || []).some(...)`.

### 3. Improve error surfacing in `Publications.tsx`
Change the error block to:
```ts
{error instanceof Error ? error.message : (error ? String(error) : 'Unknown error')}
```
so any future failure shows a real message instead of "Unknown error".

## What I will NOT touch
- The Supabase tables / RLS — query is succeeding, data is correct (15 published rows confirmed via DB read).
- `Publications.tsx` layout, locale logic, or featured query — all working.
- The SEO edge function — unrelated to the human-side error.
- Other CSV files (`br.csv`, `es.csv`) — not flagged by the parser; only `en.csv` row 281 is broken.

## Verification after deploy
1. Reload `/publications` — confirm grid + featured render, no "Failed to load" banner.
2. Browser console — confirm `TooManyFields` and `Section not found` warnings are gone.
3. Type something in the search box — confirm no crash even on rows with null `tags`.
4. Hit `/br/publications` and `/es/publications` — confirm still healthy.
