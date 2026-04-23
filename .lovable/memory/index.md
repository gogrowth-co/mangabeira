# Memory: index.md
Updated: just now

# Project Memory

## Core
Dark theme: Navy bg, Aqua highlights, Gold primary CTAs.
Fonts: Poppins, Montserrat, Inter. Playfair Display for accents.
URLs: Remove trailing slashes via 301 redirects. Route localized pages canonically.
SEO: react-helmet-async only; no hardcoded meta tags in index.html.
Security: DOMPurify HTML, strict CSP, IP rate limit (10/min), XOR secret validation.
Auth: Secure admin resources using `public.has_role(auth.uid(), 'admin')`.
`seo-snapshot` edge function (via Cloudflare Worker `mangabeira-snapshot-router`) is sole source of truth for bot meta+JSON-LD.

## Memories
- [Brand Color Palette](mem://style/color-palette) — Navy backgrounds, Aqua highlights, Gold primary CTAs
- [Typography Rules](mem://style/typography) — Poppins, Montserrat, Inter with Playfair Display for accents
- [Web3 Growth Audit](mem://features/web3-growth-audit) — High-conversion landing page with specific business rules (72h delivery, 5 clients/month)
- [Stripe Audit Checkout](mem://integrations/stripe-audit) — Payment links for Starter/Pro/Elite tiers, redirects to success page
- [Notion CMS Sync](mem://integrations/notion-sync) — One-way webhook from Notion to Supabase via edge function
- [Canonical URL Routing](mem://infrastructure/seo-canonical-routing) — Enforces canonical URLs for localized content with redirects
- [Audit Intake Form](mem://features/audit-intake-form) — HubSpot form embedded on payment success page
- [Dynamic SEO Metadata](mem://infrastructure/seo-metadata) — react-helmet-async for tags, IndexNow integration
- [AEO Schema Coverage](mem://infrastructure/aeo-schemas) — Service+Offer for audit, Speakable for system pages, BlogPosting for publications
- [LLM Discovery Endpoints](mem://infrastructure/llm-discovery) — Auto-generated /llms.txt and /api/citations.json
- [Global Security Standards](mem://infrastructure/security-standards) — DOMPurify, script-src none, timing-safe edge function secrets, rate limiting
- [RBAC Role Management](mem://auth/rbac-role-management) — Admin role validation using public.has_role database function
- [Sitemap and RSS Delivery](mem://infrastructure/sitemap-rss-delivery) — Cloudflare Worker proxies /sitemap.xml, /rss/*.xml, /llms*.txt to Supabase Storage
- [Tokenomics Simulator](mem://features/tokenomics-simulator) — Client-side 5-year projections, URL state sync, localized
- [Tools Hub](mem://features/tools-hub) — Localized index page for interactive calculators and frameworks
- [Claude MCP Content Server](mem://integrations/claude-mcp-server) — Supabase Edge Function MCP server for native CMS management
- [SEO Snapshot Edge Function](mem://infrastructure/seo-snapshot-edge) — Per-route prerendered HTML in Storage + edge function + index.html bootstrap (works around Lovable SPA fallback)
