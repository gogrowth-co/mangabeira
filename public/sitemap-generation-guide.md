# Sitemap & RSS Feed Generation Guide for mangabeira.net

## Overview

The sitemap and RSS feeds are **automatically generated and saved to Supabase Storage** whenever publications are created, updated, published, or deleted. The sitemap is served at `https://mangabeira.net/sitemap.xml` and RSS feeds at `/rss/en.xml`, `/rss/br.xml`, and `/rss/es.xml`.

## Automated Regeneration

Both the sitemap and RSS feeds regenerate automatically on these events:
- **Publishing a page**: Triggers sitemap, RSS feeds, and IndexNow submission
- **Updating a published page**: Triggers sitemap, RSS feeds, and IndexNow submission  
- **Deleting a page**: Triggers sitemap and RSS feeds update

### Manual Regeneration
Click the **"Refresh Feeds"** button in the Admin dashboard (`/admin`) to manually regenerate both the sitemap and all RSS feeds.

## Technical Implementation

### Sitemap
1. **Edge Function**: `supabase/functions/generate-sitemap/index.ts` generates XML and saves to storage
2. **Storage**: Sitemap stored at `blog-images/sitemap.xml` in Supabase Storage
3. **Serving**: Cloudflare Worker (`mangabeira-snapshot-router`) proxies `/sitemap.xml` directly to Supabase Storage with 5-min edge cache
4. **Hooks**: `src/hooks/usePages.ts` triggers regeneration after publish/update/delete mutations

### RSS Feeds
1. **Edge Function**: `supabase/functions/generate-rss/index.ts` generates all 3 language feeds (en, br, es) and saves to storage
2. **Storage**: Feeds stored at `blog-images/rss-en.xml`, `rss-br.xml`, `rss-es.xml` in Supabase Storage
3. **Serving**: Cloudflare Worker (`mangabeira-snapshot-router`) proxies `/rss/*.xml` directly to Supabase Storage with 5-min edge cache
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

The sitemap and RSS feeds regenerate **automatically** when:
- Publishing a new article
- Updating existing published content
- Deleting a page
- Using the "Refresh Feeds" button in `/admin`

**No manual intervention needed** - the system handles this automatically!

---

## RSS Feed Structure

RSS feeds are generated for all three languages with the following structure:

### Feed URLs
- **English**: `https://mangabeira.net/rss/en.xml` (also available at `/rss.xml`)
- **Portuguese (BR)**: `https://mangabeira.net/rss/br.xml`
- **Spanish**: `https://mangabeira.net/rss/es.xml`

### Feed Format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Mangabeira.net - Web3 Growth Marketing</title>
    <link>https://mangabeira.net/publications</link>
    <description>Expert insights on Web3, DeFi, and tokenomics</description>
    <language>en-US</language>
    <lastBuildDate>Wed, 29 Jan 2025 12:00:00 GMT</lastBuildDate>
    <atom:link href="https://mangabeira.net/rss/en.xml" rel="self" type="application/rss+xml" />
    
    <item>
      <title>Article Title</title>
      <link>https://mangabeira.net/publications/article-slug</link>
      <guid isPermaLink="true">https://mangabeira.net/publications/article-slug</guid>
      <description>Meta description of the article</description>
      <content:encoded><![CDATA[Full HTML content of the article]]></content:encoded>
      <pubDate>Wed, 29 Jan 2025 10:00:00 GMT</pubDate>
      <author>Gabriel Mangabeira</author>
    </item>
  </channel>
</rss>
```

### Feed Content Rules
- **Only published, non-system pages** are included
- **Language-specific translations** - each feed only includes items with translations in that language
- **Full content** - The `<content:encoded>` tag contains the complete HTML content
- **Proper dates** - Uses RFC 822 date format for `<pubDate>` and `<lastBuildDate>`
- **Limit** - Maximum of 50 most recent publications per feed

### Feed Metadata by Language

**English (en)**
- Title: "Mangabeira.net - Web3 Growth Marketing"
- Description: "Expert insights on Web3, DeFi, and tokenomics"
- Language: en-US
- Path Prefix: /publications

**Portuguese (br)**
- Title: "Mangabeira.net - Marketing de Crescimento Web3"
- Description: "Insights especializados em Web3, DeFi e tokenomics"
- Language: pt-BR
- Path Prefix: /br/artigos

**Spanish (es)**
- Title: "Mangabeira.net - Marketing de Crecimiento Web3"
- Description: "Perspectivas expertas sobre Web3, DeFi y tokenomics"
- Language: es-ES
- Path Prefix: /es/articulos

## Verification

After generation, verify:
1. All published articles are included
2. URL structure matches routing
3. hreflang links are correct
4. Dates are properly formatted
5. No 404 URLs included
6. File is valid XML

## Notes

- **Automated approach**: Sitemap and RSS feeds stored in Supabase Storage and regenerated on content changes
- **Direct access**: Served via redirect for fast crawler access (no edge function cold starts)
- **No caching issues**: Storage files update immediately reflect on the live site
- The `generate-sitemap` and `generate-rss` edge functions handle generation and storage upload automatically
- **Content syndication**: RSS feeds enable search engines, AI crawlers, and feed readers to discover and index content efficiently
