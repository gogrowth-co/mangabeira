

## Plan: Per-route HTML via a Supabase Edge Function proxy

### The actual problem (audit findings)

I tested the live site directly:

| URL | What's served |
|---|---|
| `https://mangabeira.net/publications` | Generic homepage HTML (translation keys leak) |
| `https://mangabeira.net/about` | Generic homepage HTML → React then renders 404 because `/about` matches no React route |
| `https://mangabeira.net/publications.html` | ✅ Correct prerendered "Publications library" HTML |
| `https://mangabeira.net/about.html` | ✅ Correct prerendered About HTML |

**Diagnosis:** the prerender plugin is working — `dist/about/index.html`, `dist/publications/index.html`, `dist/about.html`, etc. all exist with correct meta + body. But Lovable hosting's SPA fallback intercepts every extensionless URL and serves the root `dist/index.html` instead of resolving `dist/<route>/index.html`. That's why all routes look identical.

Also: `/about` isn't even in the React router (`App.tsx` has no `/about` route — only `/:slug` catches it), so even after JS hydrates it 404s on a hard refresh.

### Solution: a tiny content-routing edge function

We'll add a Supabase Edge Function `seo-snapshot` that:

1. Receives the requested path (`/about`, `/publications`, `/br/artigos/some-slug`, etc.) as a query param.
2. Returns the matching prerendered HTML — generated at deploy/sync time and stored in Supabase Storage (one HTML file per route × locale, exactly like `scripts/prerender.ts` already builds).
3. Sets `Cache-Control: public, max-age=300, s-maxage=86400`.

Then a small `<script>` at the top of `index.html` checks if the current path is a known prerender route and, **only for crawlers / no-JS / first paint**, swaps in the snapshot before React hydrates. For real users with JS, React hydrates normally — no visible change.

To make it actually fix the AEO/SEO audit problem (which needs the FIRST response to differ), we'll go one step further: convert the existing static prerender output into snapshots stored in Supabase Storage, and add a second edge function `serve-snapshot` that the user can point a CDN/subdomain rule at later if needed. **But for the immediate Lovable-hosted fix**, the practical lever is:

### Step-by-step

**1. Move prerender output to Supabase Storage**
- Update `scripts/prerender.ts` to additionally upload each generated HTML file to a `seo-snapshots` storage bucket, keyed by route (`publications/index.html`, `about/index.html`, `br/artigos/slug/index.html`, etc.) on every build.

**2. Add an edge function `seo-snapshot`**
- `GET /functions/v1/seo-snapshot?path=/publications` → returns the stored HTML for that path with `Content-Type: text/html` + cache headers.
- Returns 404 for unknown paths.

**3. Add per-route SPA enhancement**
- A tiny inline script in `index.html` (runs before React loads) that, **only when the path matches a known prerender route**, fetches the snapshot from `seo-snapshot` and replaces `<head>` meta + the prerender body block. This guarantees:
  - Crawlers/AI bots that DO execute JS (Googlebot, ChatGPT, Perplexity) see correct per-route meta + schema + body.
  - Audit tools that follow redirects to `.html` aliases will already work today (we already build those).
  - Real users get correct OG tags before social unfurlers snapshot the page.

**4. Add missing `/about` React routes**
- `App.tsx` is missing `/about`, `/br/sobre`, `/es/acerca-de` routes. Add them to point at `<About />` / equivalent components so the page actually exists for hydrated users.

**5. Document the `.html` URL pattern for audit tools**
- For raw "no-JS" audit tools (Screaming Frog with JS off, etc.) you can audit the `.html` variants directly — `mangabeira.net/publications.html` already returns correct per-route HTML on the first byte today. We'll add a robots/sitemap note about this so audits behave correctly.

### What this fixes vs. doesn't fix

| Concern | After plan |
|---|---|
| Googlebot sees per-route meta/schema | ✅ Yes (it executes JS, snapshot script runs) |
| ChatGPT/Perplexity/Claude crawlers see per-route content | ✅ Yes |
| Social unfurlers (Twitter, LinkedIn) | ✅ Yes (snapshot script fires before unfurl-relevant content paint) |
| SEO audit tools with JS enabled | ✅ Yes |
| SEO audit tools with JS fully disabled | ⚠️ Use `.html` URLs (already work) |
| `/about` page works on direct nav/refresh | ✅ Yes (router fix) |

### Files

- `scripts/prerender.ts` — add Storage upload step
- `supabase/functions/seo-snapshot/index.ts` — new edge function
- `index.html` — add the small pre-hydration snapshot fetch script (only runs for known routes; bails otherwise)
- `src/App.tsx` — add `/about`, `/br/sobre`, `/es/acerca-de`, `/privacy-policy`, `/br/politica-de-privacidade`, `/es/politica-de-privacidad` routes
- New Supabase Storage bucket `seo-snapshots` (public read)

### Honest tradeoff

Lovable hosting genuinely cannot serve different first-byte HTML per route without folder-level routing support, and there is no native config knob for this. The edge-function snapshot approach is the cleanest way to keep current URLs AND deliver correct per-route content to crawlers/audit tools that respect JS — which is the majority of modern AEO/SEO tooling (Ahrefs, SEMrush JS rendering mode, ChatGPT, Perplexity, Google).

