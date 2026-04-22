
## Move off Netlify and make crawler HTML hosting-agnostic

Goal: when the site is served from Lovable hosting / Cloudflare, every important route returns crawler-readable HTML on first response, and every page also includes a `<noscript>` fallback for JS-disabled browsers. The solution must not depend on Netlify edge functions, `_redirects`, or Netlify prerendering.

## Important constraint

A `<noscript>` block alone will not fix “all crawlers”:
- JS-disabled browsers will see it
- some bots/tools parse it
- many AI fetchers and audit tools ignore `<noscript>` and only inspect the initial body HTML

So the implementation should use both:
1. build-time/static first-response HTML for every route
2. a `<noscript>` fallback inside the route HTML for JS-off clients

## What to build

### 1) Remove Netlify-only SEO delivery from the production path
Update the app so published Lovable/Cloudflare hosting is the source of truth.

Files/areas to change:
- `netlify/edge-functions/seo.ts`
- `public/_redirects`
- `public/_headers`
- `netlify/functions/publications-snapshot.js`
- any code relying on `/api/publications-snapshot` or Netlify bot injection behavior

Result:
- no production SEO dependence on Netlify edge rewriting
- no crawler path that only works on Netlify

### 2) Add build-time prerender generation for key routes
Create a build step that generates static HTML snapshots for all crawler-critical pages before publish.

Routes to prerender:
- `/`
- `/br`
- `/es`
- `/about`
- `/br/sobre`
- `/es/acerca-de`
- `/privacy-policy`
- localized privacy routes
- `/tools`
- `/br/ferramentas`
- `/es/herramientas`
- `/tools/tokenomics-simulator`
- localized tokenomics routes
- `/services/web3-growth-audit`
- localized audit routes
- `/publications`
- `/br/artigos`
- `/es/articulos`
- every publication detail route in all available locales

Implementation shape:
- add a Vite/build script that reads route data and writes route-specific HTML files
- for static pages, use existing page copy/components as the source
- for publication pages, read published content from the database/content source during generation
- embed real headings, paragraphs, metadata, canonicals, alternates, and JSON-LD into the generated HTML

### 3) Add `<noscript>` fallback to every generated page
For every prerendered route, inject a `<noscript>` block with:
- page title/H1
- summary/intro copy
- key section headings
- article body or excerpt for publication pages
- important internal links

Placement:
- inside `<body>`, near `#root`, not in `<head>`

Purpose:
- users and tools with JavaScript disabled still see meaningful HTML
- keeps a dedicated no-JS fallback exactly as requested

### 4) Also include visible initial HTML outside `<noscript>`
To satisfy AI fetchers that ignore `<noscript>`, each prerendered page should ship with visible initial HTML in or around `#root`.

Recommended pattern:
```text
<body>
  <div id="root">
    <div data-prerender="true">...real route HTML...</div>
    <noscript>...same or simplified static HTML...</noscript>
  </div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

Why:
- fetch-style crawlers see body text immediately
- JS-off browsers see the `<noscript>` content
- hydrated React app replaces the prerender block on load

### 5) Consolidate SEO metadata so first-response HTML is correct without JS
Unify current scattered metadata across:
- `src/components/SEO.tsx`
- `src/components/SEOHead.tsx`
- page-level `Helmet` usage

Create one metadata contract used by both:
- prerender generator
- React runtime navigation

Every route should output:
- `<title>`
- meta description
- canonical
- robots
- hreflang alternates
- Open Graph tags including `og:site_name`
- Twitter tags
- route-specific JSON-LD

### 6) Make publication pages statically crawlable
Current dynamic publication pages depend on client fetches (`usePublicPage`, `usePublications`, snapshot fallback logic). Replace this for crawler-critical delivery.

Implementation:
- at build time, fetch all published pages + translations
- generate a static HTML file per publication slug and localized slug
- include full article body or a large safe excerpt in the initial HTML
- keep client hydration for interactive behavior/navigation

### 7) Remove Netlify-specific client fallbacks
Refactor client code that assumes Netlify endpoints exist.

Likely updates:
- `src/hooks/usePublications.ts` should no longer depend on `/api/publications-snapshot` or `https://mangabeira.net/api/publications-snapshot`
- `src/main.tsx` / `src/App.tsx` should keep hydration simple and not depend on Netlify prerender behavior
- any `window.prerenderReady` logic should be reduced or removed if no longer needed for production SEO

### 8) Preserve Lovable/Cloudflare publish behavior
After code changes:
- publish frontend changes through the normal publish flow
- point the custom domain to the Lovable-hosted deployment / Cloudflare path you want to keep
- do not rely on Netlify config files after cutover

## Technical details

### Suggested implementation structure
- Add a prerender script, e.g. `scripts/prerender-routes.ts`
- Add a shared route manifest describing:
  - path
  - locale
  - metadata
  - content source
- Add a shared HTML template used by the prerender script and React runtime
- Generate static route files into the build output before publish

### Content sources
- Static marketing pages: existing React page copy or a dedicated content map
- Publications: published database content + translations
- Dynamic pages: safe sanitized HTML only, reusing the same content cleaning approach already used in `DynamicPage.tsx`

### Hydration safety
- prerender block gets a marker like `data-prerender="true"`
- React mounts into the same root and replaces/reconciles it cleanly
- no duplicate visible content after hydration

## Acceptance criteria

After implementation and publish:
- with JavaScript disabled, `/` shows real homepage copy
- with JavaScript disabled, a publication URL shows real article content
- AI Eyes no longer reports 0 words
- crawler simulators no longer report “SPA shell detected”
- homepage and publication pages expose body text in first-response HTML
- every route includes a `<noscript>` fallback in the body
- metadata is route-specific and present before hydration
- no dependency on Netlify edge functions remains for SEO/AEO

## Files most likely to change

- `vite.config.ts`
- `package.json`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/components/SEO.tsx`
- `src/components/SEOHead.tsx`
- `src/hooks/usePublications.ts`
- `src/pages/DynamicPage.tsx`
- new shared prerender utilities/scripts
- remove or deprecate Netlify-specific SEO files/config from active use

## Rollout order

1. Build shared SEO + route manifest
2. Implement prerender generator for static routes
3. Extend generator to publications + localized slugs
4. Inject visible initial HTML + `<noscript>` fallback for every route
5. remove Netlify-only runtime assumptions
6. publish on Lovable hosting / Cloudflare
7. re-test with JS disabled and crawler tools
