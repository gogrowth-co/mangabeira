# Sitemap Generation Guide for mangabeira.net

## Overview
The sitemap is **automatically generated and saved to Supabase Storage** whenever publications are created, updated, published, or deleted. It's served at `https://mangabeira.net/sitemap.xml`.

## Automated Regeneration

The sitemap regenerates automatically on these events:
- **Publishing a page**: Triggers sitemap update and IndexNow submission
- **Updating a published page**: Triggers sitemap update and IndexNow submission  
- **Deleting a page**: Triggers sitemap update

### Manual Regeneration
Click the **"Refresh Sitemap"** button in the Admin dashboard (`/admin`) to manually regenerate the sitemap.

## Technical Implementation

1. **Edge Function**: `supabase/functions/generate-sitemap/index.ts` generates XML and saves to storage
2. **Storage**: Sitemap stored at `blog-images/sitemap.xml` in Supabase Storage
3. **Serving**: `_redirects` routes `/sitemap.xml` → storage URL for direct access
4. **Hooks**: `src/hooks/usePages.ts` triggers regeneration after publish/update/delete mutations

## URL Structure

### System Pages
- **Homepage**: `/` (EN), `/br` (BR), `/es` (ES)
- **Publications Hub**: `/publications` (EN), `/br/artigos` (BR), `/es/articulos` (ES)
- **About**: `/about` (EN), `/br/sobre` (BR), `/es/acerca-de` (ES)
- **Privacy Policy**: `/privacy-policy` (EN), `/br/politica-de-privacidade` (BR), `/es/politica-de-privacidad` (ES)

### Publication Pages
- **English**: `/publications/{slug}`
- **Portuguese (BR)**: `/br/artigos/{slug}`
- **Spanish**: `/es/articulos/{slug}`

## Sitemap Format Requirements

### XML Declaration and Namespace
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
```

### URL Entry Structure
Each URL entry MUST include:

1. **Location**: `<loc>` - Full URL including domain
2. **Last Modified**: `<lastmod>` - Date in YYYY-MM-DD format
3. **Change Frequency**: `<changefreq>` - Crawl frequency hint
4. **Priority**: `<priority>` - Relative importance (0.0-1.0)
5. **Language Alternates**: `<xhtml:link>` - ALL language versions INCLUDING x-default

### Complete Example
```xml
<url>
  <loc>https://mangabeira.net/publications/web3-for-athletes</loc>
  <lastmod>2025-11-07</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
  <xhtml:link rel="alternate" hreflang="en" href="https://mangabeira.net/publications/web3-for-athletes" />
  <xhtml:link rel="alternate" hreflang="pt-BR" href="https://mangabeira.net/br/artigos/web3-para-atletas" />
  <xhtml:link rel="alternate" hreflang="es" href="https://mangabeira.net/es/articulos/web3-para-atletas" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://mangabeira.net/publications/web3-for-athletes" />
</url>
```

### Critical Rules for hreflang

1. **Include ALL language versions** for every URL
2. **x-default MUST point to English version** (primary language)
3. **Use pt-BR for Brazilian Portuguese** (not just "pt")
4. **Only include translations that exist** - if a publication doesn't have ES translation, omit the ES hreflang link
5. **Duplicate hreflang on all language versions** - EN, BR, and ES pages all have the same hreflang links

## Priority Guidelines

| Page Type | Priority | Change Frequency |
|-----------|----------|------------------|
| Homepage | 1.0 | weekly |
| Publications Hub | 0.9 | weekly |
| About | 0.9 | monthly |
| Publications | 0.8 | monthly |
| Privacy Policy | 0.3 | yearly |

## Database Query for Publications

Use this SQL query to fetch published publications with translations:

```sql
SELECT 
  p.slug,
  p.updated_at,
  pt_en.slug as en_slug,
  pt_br.slug as br_slug,
  pt_es.slug as es_slug
FROM pages p
LEFT JOIN page_translations pt_en ON p.id = pt_en.page_id AND pt_en.language = 'en'
LEFT JOIN page_translations pt_br ON p.id = pt_br.page_id AND pt_br.language = 'br'
LEFT JOIN page_translations pt_es ON p.id = pt_es.page_id AND pt_es.language = 'es'
WHERE p.status = 'published' 
  AND p.is_system_page = false
ORDER BY p.updated_at DESC
```

## Generation Steps

1. **Query Database**: Fetch all published publications using the query above
2. **Start XML**: Add XML declaration and urlset opening tag
3. **Add System Pages**: Include all 12 system page URLs (homepage, publications hub, about, privacy × 3 languages)
4. **Add Publications**: For each publication:
   - Check which translations exist
   - Add URL entries for each existing language version
   - Include proper hreflang links
   - Use database `updated_at` for `lastmod`
5. **Close XML**: Add closing `</urlset>` tag
6. **Save**: Write to `public/sitemap.xml`

## SEO/AEO Best Practices

✅ **DO:**
- Use static sitemap file in `/public` folder (faster crawling)
- Include ALL language variants with proper hreflang
- Use YYYY-MM-DD format for dates
- Add x-default pointing to English
- Keep URL structure consistent
- Update dates when content changes

❌ **DON'T:**
- Use redirects for sitemap
- Include draft/unpublished pages
- Forget x-default hreflang
- Use incorrect URL patterns
- Cache aggressively (affects freshness)

## When to Regenerate

The sitemap regenerates **automatically** when:
- Publishing a new article
- Updating existing published content
- Deleting a page
- Using the "Refresh Sitemap" button in `/admin`

**No manual intervention needed** - the system handles this automatically!

## Verification

After generation, verify:
1. All published articles are included
2. URL structure matches routing
3. hreflang links are correct
4. Dates are properly formatted
5. No 404 URLs included
6. File is valid XML

## Notes

- **Automated approach**: Sitemap stored in Supabase Storage and regenerated on content changes
- **Direct access**: Served via redirect for fast crawler access (no edge function cold starts)
- **No caching issues**: Storage file updates immediately reflect on the live site
- The `generate-sitemap` edge function handles generation and storage upload automatically
