

# SEO/AEO Recovery Plan — Full Audit Fix

## Overview
This plan addresses all 23 findings from the audit, grouped into 6 implementation batches. Each batch can be verified independently.

---

## Batch 1: Fix `index.html` — Remove Duplicate Tags + Fix Favicon

**File: `index.html`**
- Remove lines 23-28 (hardcoded `og:type`, `og:image`, `twitter:card`, `twitter:site`, `twitter:image`) — the edge function injects these per-route
- Change favicon (line 14) from external GCS URL to local: `<link rel="icon" type="image/x-icon" href="/favicon.ico">`

*Fixes: #1 (duplicate OG/Twitter), #11 (external favicon)*

---

## Batch 2: Fix Edge Function — Add Missing Tags + Fix ES Privacy Slug

**File: `netlify/edge-functions/seo.ts`**

1. **Fix ES privacy slug** (line 52): `politica-de-privacidade` → `politica-de-privacidad`
2. **Fix privacy alternates** (line 150-155): ES alternate → `/es/politica-de-privacidad`
3. **Add to `buildMetaTags()`**:
   - `og:locale` (derived from `meta.htmlLang`: en→en_US, pt-BR→pt_BR, es→es_ES)
   - `og:site_name` = "Gabriel Mangabeira"
   - `og:image:width` = 1200, `og:image:height` = 630, `og:image:type` = image/png
   - `twitter:site` = `@gabmangabeira`

*Fixes: #3 (ES slug), #12 (image dimensions), #16 (og:locale), #17 (og:site_name), #25 (twitter:site)*

---

## Batch 3: Fix `SEO.tsx` — Homepage Schemas + OG Image

**File: `src/components/SEO.tsx`**

1. **Replace swimming-icon with proper OG banner** (lines 208, 219): Use the CDN OG image URL already in the edge function (`OG_IMAGE` constant)
2. **Remove `SearchAction`** from WebSite schema (lines 84-88) — routes don't exist
3. **Change `AboutPage` → `WebPage`** in schema index 3 (line 150)
4. **Remove standalone `BreadcrumbList`** schema (lines 167-178) — single-item self-referencing
5. **Remove `inLanguage` from WebSite schema** (line 74) — the WebSite entity is multilingual, not per-locale
6. **Fix Organization `logo`** (line 95): change from swimming-icon to OG banner or a proper logo URL

*Fixes: #2 (OG image = icon), #6 (SearchAction), #7 (AboutPage on home), #8 (BreadcrumbList), #22 (WebSite inLanguage)*

---

## Batch 4: Fix Component-Level Issues

**File: `src/components/publications/PublicationCardSchema.tsx`**
- Fix `mainEntityOfPage` URL (line 35): Change pathPrefix logic to include `/publications/` for EN, `/br/artigos/` for BR, `/es/articulos/` for ES

**File: `src/components/publications/PublicationsHubSEO.tsx`**
- Fix hreflang `es-ES` → `es` (line 70)

**File: `src/pages/DynamicPage.tsx`**
- Add `<link rel="alternate" hrefLang="x-default" href=...>` to the Helmet block (after line 337)

**File: `src/App.tsx`**
- Fix line 112: `/es/politica-de-privacidade` → `/es/politica-de-privacidad`

*Fixes: #4 (publication URL), #9 (es-ES), #10 (x-default), #3 (App.tsx ES redirect)*

---

## Batch 5: Standardize Entity Graph — Social URLs

Canonical set: `https://x.com/manga82`, `https://linkedin.com/in/mangabeira`, `https://medium.com/@mangabeira`

**Files to update:**
- `src/pages/About.tsx` (lines 63-68): Replace sameAs array with canonical set + keep Wikipedia
- `src/components/admin/SchemaEditor.tsx` (lines 44-47): Update person template sameAs
- `public/llms-full.txt` (lines 66-69): Update LinkedIn/Medium URLs
- `index.html` line 27: Confirm `@gabmangabeira` is correct twitter:site — but this tag is being removed in Batch 1, so no action needed

*Fixes: #5 (conflicting sameAs), #20 (SchemaEditor templates)*

---

## Batch 6: Fix Remaining Medium Issues

**File: `public/_redirects`**
- Change RSS redirect status from `301` to `302` (lines 5-8)

**File: `public/llms-full.txt`**
- Fix dead routes: `/services` → `/services/web3-growth-audit`, remove `/methods` and `/case-studies` or change to `/#methods`, `/#case-studies`

**File: `public/_headers`**
- Remove duplicate `X-Content-Type-Options` and `Referrer-Policy` from the `/*` block (lines 12-15) — already in `netlify.toml`

*Fixes: #13 (dead links), #15 (RSS 301→302), #19 (duplicate headers)*

---

## Not Addressed (Intentional)

| # | Why skipped |
|---|---|
| #14 | `RootRedirect` — audit notes this is fine; edge function handles bots correctly |
| #18 | About page EN-only — existing DB-driven translations via DynamicPage work; adding localized React components is a separate feature |
| #21 | Auto-generating `llms.txt` — a nice-to-have for a future edge function, not critical now |
| #23 | Author avatar hashed path in BlogTemplate — cosmetic, no SEO impact |
| #24 | Schema array vs `@graph` — Google handles arrays fine |

---

## Technical Summary

```
Files Modified (10):
  index.html
  netlify/edge-functions/seo.ts
  src/components/SEO.tsx
  src/components/publications/PublicationCardSchema.tsx
  src/components/publications/PublicationsHubSEO.tsx
  src/pages/DynamicPage.tsx
  src/pages/About.tsx
  src/App.tsx
  src/components/admin/SchemaEditor.tsx
  public/_redirects

Files Modified (static content, 2):
  public/llms-full.txt
  public/_headers
```

After deploying, we'll re-run IndexNow submission to get all pages re-crawled with the corrected metadata.

