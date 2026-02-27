

# Netlify Serverless Sitemap Function

## Overview
Replace the Supabase Storage proxy approach with a Netlify serverless function that dynamically generates the sitemap XML and serves it with correct `Content-Type: application/xml` headers. This eliminates the header mismatch issue entirely.

## Changes

### 1. Create `netlify/functions/sitemap.js`
A new Netlify serverless function that:
- Connects to the database using the Supabase JS client (using environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` configured in Netlify)
- Queries `pages` table (status = published, is_system_page = false) with `page_translations` join
- Generates the full sitemap XML including:
  - System pages (homepage, publications, about, privacy) in all 3 languages with hreflang alternates
  - Dynamic publication pages with per-language URLs and hreflang links
- Returns the XML with `Content-Type: application/xml; charset=utf-8`
- The logic mirrors the existing Edge Function (`generate-sitemap/index.ts`) but runs on Netlify's infrastructure

### 2. Update `public/_redirects`
Change line 2 from:
```
/sitemap.xml https://hetemmltaoirimmoxzku.supabase.co/storage/v1/object/public/blog-images/sitemap.xml 200
```
to:
```
/sitemap.xml /.netlify/functions/sitemap 200
```

### 3. Delete `cloudflare-worker-sitemap.js`
Remove this file -- it was a workaround for the same Content-Type issue and is no longer needed.

### 4. Keep existing backup
The Supabase Edge Function (`generate-sitemap/index.ts`) and the admin "Refresh Feeds" button remain untouched as a backup mechanism.

## Technical Details

### Environment Variables Required on Netlify
The function needs these env vars set in the Netlify dashboard (they should already exist if the project is deployed there):
- `SUPABASE_URL` -- the project URL
- `SUPABASE_SERVICE_ROLE_KEY` -- service role key for server-side queries

The function will use `@supabase/supabase-js` as a bundled dependency (Netlify functions support `node_modules` imports).

### Caching Strategy
The function will set `Cache-Control: public, s-maxage=3600, max-age=600` to allow CDN caching for 1 hour while clients revalidate every 10 minutes, balancing freshness with performance.

