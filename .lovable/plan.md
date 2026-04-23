

# Cleanup: Remove All Netlify References

We migrated to Cloudflare Worker proxying. Netlify artifacts are now dead weight and misleading. Audit found minimal residue — one empty directory, one stale code comment, two outdated docs, one memory file.

## Files to delete

1. **`netlify/`** — empty directory (functions already deleted last turn). Remove the parent folder.

## Files to edit

2. **`src/pages/DynamicPage.tsx`** (lines 108–118)
   - Update the comment that says "let Netlify serve it properly" → "let Cloudflare Worker / hosting serve it properly".
   - Logic stays — the static-file reload bypass still works correctly under Cloudflare. Just fix the misleading comment.

3. **`public/sitemap-generation-guide.md`** (lines 22, 28)
   - Replace `_redirects routes /sitemap.xml → storage URL` → `Cloudflare Worker (mangabeira-snapshot-router) proxies /sitemap.xml directly to Supabase Storage`.
   - Same fix for the RSS line.

## Memory to update

4. **`mem://infrastructure/sitemap-rss-delivery`**
   - Rewrite to reflect Cloudflare Worker proxy (not Netlify function). New body: "Cloudflare Worker `mangabeira-snapshot-router` intercepts `/sitemap.xml`, `/rss/*.xml`, `/llms.txt`, `/llms-full.txt` and proxies to Supabase Storage `blog-images/` bucket with 5-min edge cache. Regeneration triggered on publish/update/delete via `usePages.ts` → edge functions `generate-sitemap` / `generate-rss` / `generate-llms-txt`."

## Not touched (already clean)

- No `netlify.toml`, no `_redirects` file in repo.
- No `package.json` Netlify deps.
- Edge functions, hooks, admin UI — all already correct.

## Verification after cleanup

- `grep -ri netlify .` → returns nothing (except possibly `node_modules/`, ignore).
- Site continues serving sitemap correctly via Worker — no behavior change, just dead-code/stale-doc removal.

