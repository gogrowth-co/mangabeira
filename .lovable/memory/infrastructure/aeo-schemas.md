---
name: AEO Schema Coverage
description: Edge function injects Service+Offer schema for audit, Speakable for system pages, BlogPosting for publications. dateModified uses BUILD_DATE for system pages, page.updated_at for publications.
type: feature
---
The Netlify edge function `netlify/edge-functions/seo.ts` is the source of truth for bot-served JSON-LD:
- Home/About/Privacy/Hubs/Tokenomics: `speakableSchema(canonical)` with `dateModified = BUILD_DATE`.
- Audit page: `serviceSchema(canonical, locale)` with Starter/Pro/Elite Offers ($1500/$3500/$7500) + speakable.
- Publications: `BlogPosting` schema with featured_image as og:image and dateModified from page.updated_at.

Per-publication og:image already uses `featured_image` (falls back to default OG_IMAGE).
Comprehensive Person/Organization/WebSite schemas live in src/components/SEO.tsx for human visitors via react-helmet-async.
