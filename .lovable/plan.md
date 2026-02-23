

## Fix: Meta Description Duplication Across the Site

### Root Cause
The file `index.html` (line 15) contains a hardcoded meta description:
```
<meta name="description" content="Blending AI, Web3, and performance marketing...">
```
This tag is served in the raw HTML before any JavaScript runs. Search engine crawlers and social media bots read this initial HTML, so they always see the same description regardless of which page is visited. `react-helmet-async` updates it client-side, but bots typically don't wait for that.

### Solution

**Step 1: Remove the hardcoded meta description from `index.html`**
- Delete line 15 (`<meta name="description" content="...">`) from `index.html`
- This ensures there is no "default" description competing with the dynamic one

**Step 2: Audit all pages to ensure every route sets its own meta description**
Pages already using `react-helmet-async` with descriptions (no changes needed):
- Homepage (`Index.tsx`) -- uses `SEO` component
- Homepage BR/ES -- uses `SEO` component
- `DynamicPage.tsx` -- sets `translation.meta_description`
- `Web3GrowthAudit.tsx` -- sets its own description
- `Publications.tsx` / `PublicationsBR` / `PublicationsES` -- uses `PublicationsHubSEO`

Pages that use custom `useSEO()` hooks (already set description via DOM manipulation):
- `About.tsx`
- `PrivacyPolicy.tsx`

All pages are covered -- no additional components need changes.

**Step 3: Add a fallback meta description in `main.tsx` (or a root-level Helmet)**
To prevent a blank description if a page somehow fails to set one, add a default `<Helmet>` at the app root level inside `HelmetProvider` that acts as a fallback. Individual page Helmets will override it.

### Technical Details
- Remove 1 line from `index.html`
- Add a root-level `<Helmet>` with a sensible default description inside `App.tsx` (within the existing `HelmetProvider`)
- No other files need changes since all pages already set their own descriptions

### Impact
- Every page will serve its unique meta description to crawlers from initial render (via SSR/prerender) and client-side
- The prerender edge function already outputs per-page descriptions correctly, so bot traffic is already handled for dynamic pages
- This fix ensures the SPA client-side rendering also produces unique descriptions

