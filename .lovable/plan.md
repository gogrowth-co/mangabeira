

## Fix: Remove Hardcoded OG & Twitter Meta Tags from index.html

### Problem
Lines 154-157 in `index.html` contain hardcoded `og:title`, `og:description`, `twitter:title`, and `twitter:description` tags. Just like the meta description we already fixed, these cause every page to show the same social sharing info regardless of which page is being shared. The `SEO` component already sets all of these dynamically per page, but the hardcoded versions in `index.html` compete with them.

### Solution

**Step 1: Remove hardcoded OG and Twitter title/description from `index.html`**
Delete these 4 lines (154-157):
- `og:title`
- `twitter:title`  
- `og:description`
- `twitter:description`

Keep the following tags that are NOT set dynamically elsewhere and serve as valid defaults:
- `og:type` (line 27) -- generic "website" type, fine as default
- `og:image` (line 28) -- default social image
- `twitter:card` (line 30) -- card type
- `twitter:site` (line 31) -- Twitter handle
- `twitter:image` (line 32) -- default social image

**Step 2: Add fallback OG/Twitter tags in `App.tsx` root Helmet**
Expand the existing root `<Helmet>` to include default fallbacks for `og:title`, `og:description`, `twitter:title`, and `twitter:description`. These will be overridden by page-specific Helmets (SEO component, DynamicPage, etc.).

### Files to Modify
1. **`index.html`** -- Remove lines 154-157 (4 hardcoded meta tags)
2. **`src/App.tsx`** -- Add `og:title`, `og:description`, `twitter:title`, `twitter:description` fallbacks to the root Helmet

### Result
- Social sharing previews will show the correct per-page title and description
- A sensible fallback exists if any page fails to set its own tags
- No duplicate/competing tags in the raw HTML

