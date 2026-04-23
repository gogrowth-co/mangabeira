

# Fix: Make `/sitemap.xml` Always Reflect Latest Published Articles

## Root cause
- `generate-sitemap` correctly writes the fresh sitemap to Supabase Storage on every publish (verified in logs: `launchpad-scorecard` is in storage).
- But `https://mangabeira.net/sitemap.xml` is served by **Lovable hosting** as a baked-in static file from `public/sitemap.xml` (or similar), not proxied to Storage.
- The `netlify/functions/sitemap.js` proxy exists in the repo but is never invoked — there's no `netlify.toml`, no `_redirects`, and the site isn't on Netlify.
- Result: storage updates, but the live URL keeps serving the build-time copy (cached by Cloudflare too).

## Fix (single surgical change to the Cloudflare Worker)

Extend the existing `mangabeira-snapshot-router` Worker to also intercept three SEO file paths and proxy them straight to Supabase Storage, with short edge cache. Same pattern already used for the bot snapshot route.

Add at the top of the Worker's `fetch` handler, **before** the bot/snapshot logic:

```js
const STORAGE_BASE =
  "https://hetemmltaoirimmoxzku.supabase.co/storage/v1/object/public/blog-images";

const STORAGE_PROXIES = {
  "/sitemap.xml":  `${STORAGE_BASE}/sitemap.xml`,
  "/rss.xml":      `${STORAGE_BASE}/rss-en.xml`,
  "/rss/en.xml":   `${STORAGE_BASE}/rss-en.xml`,
  "/rss/br.xml":   `${STORAGE_BASE}/rss-br.xml`,
  "/rss/es.xml":   `${STORAGE_BASE}/rss-es.xml`,
  "/llms.txt":     `${STORAGE_BASE}/llms.txt`,
  "/llms-full.txt":`${STORAGE_BASE}/llms-full.txt`,
};

const target = STORAGE_PROXIES[url.pathname];
if (target) {
  const upstream = await fetch(target, {
    cf: { cacheTtl: 300, cacheEverything: true },
  });
  if (!upstream.ok) return fetch(request); // fallback to Lovable
  const headers = new Headers();
  headers.set(
    "Content-Type",
    url.pathname.endsWith(".txt")
      ? "text/plain; charset=utf-8"
      : "application/xml; charset=utf-8"
  );
  headers.set("Cache-Control", "public, max-age=300, s-maxage=600");
  headers.set("X-Served-By", "cf-worker-storage-proxy");
  return new Response(upstream.body, { status: 200, headers });
}
```

That's it for the live fix. Storage is already fresh on every publish (the `usePages` hook + edge function chain works).

## Cleanup (optional but recommended)

1. Delete `netlify/functions/sitemap.js` and `netlify/functions/citations.js` and `netlify/functions/llms-txt.js` — they are dead code and misleading future-you.
2. Delete the static `public/sitemap.xml` (and any `public/rss*.xml`, `public/llms*.txt`) if they exist, so a future build doesn't accidentally re-bake an outdated copy.
3. After deploying the Worker change, manually purge Cloudflare cache for `/sitemap.xml` once to drop the stale copy immediately (or wait ~10 min for the 600s s-maxage to expire).

## Verification steps after deploy

1. `curl -sI https://mangabeira.net/sitemap.xml` → expect header `x-served-by: cf-worker-storage-proxy`.
2. `curl -s https://mangabeira.net/sitemap.xml | grep launchpad-scorecard` → expect ≥1 match.
3. Publish a test article → wait ~5s → `curl` again → new slug appears.
4. Resubmit `/sitemap.xml` in Google Search Console.

## Why not regenerate static files at build time?
That would require a deploy on every publish — opposite of what you want. Proxying Storage gives you near-instant freshness (≤5min CF edge cache) with zero rebuilds. Same architecture as the snapshot system already in place.

## Files / surfaces touched
- **Cloudflare Worker** (`mangabeira-snapshot-router`): add storage-proxy block. Single deploy via `wrangler` or CF dashboard.
- **Repo cleanup** (optional): remove dead `netlify/functions/*` and any static `public/sitemap.xml`.
- **No code changes** to edge functions, hooks, or admin UI — they're already correct.

