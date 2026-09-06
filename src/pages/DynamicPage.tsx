import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { usePublicPage } from '@/hooks/usePages';
import { useLanguage } from '@/contexts/LanguageContext';
import { Locale } from '@/lib/translations';
import { Helmet } from 'react-helmet-async';
import { toast } from '@/hooks/use-toast';
import DOMPurify from 'dompurify';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogTemplate from '@/components/BlogTemplate';
import NotFound from './NotFound';
import { getBaseSlugFromLocalized, isSystemPageSlug } from '@/lib/systemPageRoutes';
import { cleanContentForRendering } from '@/lib/contentCleaner';
import web3AthletesImage from '@/assets/web3-for-athletes.png';
import web2Web3MarketingImage from '@/assets/web2-vs-web3-cover.png';
import tokenHealthScanImage from '@/assets/token-health-scan-build-cover.png';
import web3SeoGuideImage from '@/assets/web3-seo-cover.png';

// DOMPurify allowlist for CMS article body content (dangerouslySetInnerHTML).
// Kept as a single shared constant so the two sanitize() call sites below
// (system-page path and BlogTemplate path) can never drift apart again --
// they silently diverged from BlogTemplate.tsx's own (more permissive, but
// dead-code-for-this-flow) allowlist for months. Missing 'nav' here is what
// caused the Web3 SEO hub's "In this article" TOC box to render as an
// unstyled wall of links: DOMPurify strips any tag not in ALLOWED_TAGS by
// unwrapping it (keeping children, dropping the tag), so the whole
// `<nav class="grid gap-2 md:grid-cols-2">` wrapper vanished, found via
// direct DOM inspection 2026-09-06 (article-lint / JSON-source checks never
// catch this class of bug, since they read the pre-sanitize source).
// 'section', 'article', and 'input' (checkbox-only, see ALLOWED_ATTR) are
// real, currently-used content patterns found by scanning content/**/*.json
// that were also silently being stripped. The SVG element set is added
// proactively for the inline diagram work the design-review pass
// recommended (_ops/design-review-web3-seo-hub-2026-09-06.md) -- GEO-crawlable
// hand-authored SVG, never a flattened raster image of a diagram.
const CONTENT_ALLOWED_TAGS = [
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'br',
  'img', 'div', 'span', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote', 'code',
  'pre', 'figure', 'figcaption', 'hr', 'sub', 'sup', 'video', 'source',
  'nav', 'section', 'article', 'input',
  // SVG primitives for hand-authored, crawlable diagrams (never raster-image a diagram).
  'svg', 'g', 'circle', 'rect', 'line', 'polyline', 'polygon', 'path', 'text', 'tspan',
  'defs', 'marker', 'ellipse',
];
const CONTENT_ALLOWED_ATTR = [
  'href', 'src', 'alt', 'class', 'id', 'target', 'rel', 'title', 'width', 'height',
  'loading', 'muted', 'loop', 'playsinline', 'controls', 'preload', 'autoplay', 'type',
  'checked', 'disabled',
  // SVG attributes.
  'viewBox', 'xmlns', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
  'd', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'transform',
  'font-size', 'font-family', 'font-weight', 'text-anchor', 'opacity',
];

// Map of publication slugs to their hero images (fallback for existing publications)
// New publications uploaded via admin will use Supabase Storage URLs from the database
const heroImageMap: Record<string, string> = {
  'web3-for-athletes': web3AthletesImage,
  'web3-para-atletas': web3AthletesImage, // BR version
  'web2-vs-web3-marketing': web2Web3MarketingImage,
  'vibe-coded-token-health-scan': tokenHealthScanImage,
  'definitive-guide-web3-seo': web3SeoGuideImage,
};

// Helper function to validate and sanitize JSON-LD schema
function validateSchema(schemaText: string): string | null {
  try {
    // First validate it's parseable JSON
    const parsed = JSON.parse(schemaText);

    // Re-stringify to ensure clean, safe JSON
    const cleanJson = JSON.stringify(parsed);

    // Escape any closing script tags that could break DOM injection
    // This prevents malformed admin content from breaking the page
    const safeJson = cleanJson.replace(/<\/script>/gi, '<\\/script>');

    return safeJson;
  } catch (error) {
    console.warn('[DynamicPage] Invalid JSON-LD schema, skipping:', error);
    return null;
  }
}

// Helper function to extract schema markup and body content from HTML
function extractHTMLParts(htmlContent: string | null): {
  schemas: string[],
  bodyContent: string
} {
  if (!htmlContent) {
    return { schemas: [], bodyContent: '' };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Extract all schema markup scripts (JSON-LD)
    const schemaScriptEls = Array.from(
      doc.querySelectorAll('script[type="application/ld+json"]')
    );

    // Validate and sanitize each schema before including it
    const schemaScripts = schemaScriptEls
      .map(script => validateSchema(script.textContent || ''))
      .filter((schema): schema is string => schema !== null);

    // Remove JSON-LD scripts from the document body to avoid duplicates
    schemaScriptEls.forEach(el => el.remove());

    // Strip potentially global-affecting tags/styles from imported HTML to avoid site-wide overrides
    // Remove any <style> tags and external stylesheets/metadata that could leak globally
    doc.querySelectorAll('style, link[rel="stylesheet"], meta').forEach(el => el.remove());

    // Remove any remaining script tags for safety (we already captured JSON-LD)
    doc.querySelectorAll('script').forEach(el => el.remove());

    // Get body content or fall back to full content
    const body = doc.querySelector('body');
    const bodyContent = body ? body.innerHTML : htmlContent;

    console.log('[DynamicPage] Extracted schemas:', schemaScripts.length, 'Body content length:', bodyContent.length);

    return { schemas: schemaScripts, bodyContent: bodyContent || htmlContent };
  } catch (error) {
    console.error('[DynamicPage] Error parsing HTML:', error);
    // On error, return full content as-is to prevent blank pages
    return { schemas: [], bodyContent: htmlContent };
  }
}

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { locale, isLoading: isLoadingTranslations } = useLanguage();

  // Derive slug from pathname if useParams doesn't provide it
  const rawSlug = slug ?? location.pathname.split('/').filter(Boolean).pop() ?? '';

  // Check if this looks like a static file request (has a file extension)
  // If so, force a reload to let the Cloudflare Worker / hosting serve it properly
  useEffect(() => {
    const staticFileExtensions = ['.xml', '.txt', '.pdf', '.json', '.ico', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const hasFileExtension = staticFileExtensions.some(ext => rawSlug.toLowerCase().endsWith(ext));

    if (hasFileExtension) {
      // Force a full page reload to bypass React Router
      window.location.href = location.pathname;
    }
  }, [rawSlug, location.pathname]);

  // Try to resolve system page slug if it's a localized version
  const resolvedSlug = getBaseSlugFromLocalized(rawSlug) || rawSlug;

  const { data, isLoading, error } = usePublicPage(resolvedSlug, locale);

  console.log('[DynamicPage] Slug:', resolvedSlug, 'Locale:', locale, 'Data:', data ? 'found' : 'not found');

  // All translations for hreflang tags — the static article document already
  // carries every language's localized slug (no extra request needed).
  const allTranslations = useMemo(() => {
    if (!data?.alternates) return undefined;
    return Object.entries(data.alternates).map(([language, slug]) => ({
      language,
      slug: slug as string,
    }));
  }, [data?.alternates]);

  // Clean and extract content
  const { schemas: contentSchemas, bodyContent: rawBodyContent } = useMemo(
    () => extractHTMLParts(data?.translation?.content),
    [data?.translation?.content]
  );
  
  // Apply content cleaning to unescape entities and remove wrappers
  const bodyContent = useMemo(
    () => cleanContentForRendering(rawBodyContent),
    [rawBodyContent]
  );

  // Get schema from database (prioritize this over content-extracted schemas)
  const dbSchema = useMemo(() => {
    const translationData: any = data?.translation;
    if (translationData?.schema) {
      try {
        const schemaJson = typeof translationData.schema === 'string' 
          ? translationData.schema 
          : JSON.stringify(translationData.schema);
        return validateSchema(schemaJson);
      } catch (e) {
        console.warn('[DynamicPage] Invalid schema in database:', e);
        return null;
      }
    }
    return null;
  }, [data?.translation]);

  // Combine database schema with content-extracted schemas (db schema takes priority)
  const allSchemas = useMemo(() => {
    const schemas: string[] = [];
    if (dbSchema) schemas.push(dbSchema);
    // Add content schemas as fallback/additional schemas
    schemas.push(...contentSchemas);
    return schemas;
  }, [dbSchema, contentSchemas]);

  // Safely inject JSON-LD schemas into document head
  useEffect(() => {
    const addedScripts: HTMLScriptElement[] = [];
    
    allSchemas.forEach((schemaJson, index) => {
      try {
        // Parse and re-stringify to ensure validity
        const parsed = JSON.parse(schemaJson);
        const safeJson = JSON.stringify(parsed).replace(/<\/script>/gi, '<\\/script>');
        
        const scriptEl = document.createElement('script');
        scriptEl.type = 'application/ld+json';
        scriptEl.text = safeJson;
        scriptEl.setAttribute('data-dynamic-schema', index.toString());
        
        document.head.appendChild(scriptEl);
        addedScripts.push(scriptEl);
      } catch (e) {
        console.warn('[DynamicPage] Skipping invalid JSON-LD schema:', e);
      }
    });
    
    // Cleanup on unmount or when schemas change
    return () => {
      addedScripts.forEach(el => el.remove());
    };
  }, [allSchemas]);

  // Check if localized translation exists
  const hasLocalizedTranslation = allTranslations?.some(
    t => t.language === locale && (t.slug ?? '') !== ''
  );

  // Redirect non-canonical URLs to canonical localized URLs
  // e.g., /es/articulos/defi-tokenomics-for-founders → /es/articulos/defi-tokenomics-para-founders
  useEffect(() => {
    if (
      data?.matchedViaFallback && 
      data.canonicalSlug && 
      locale !== 'en' &&
      rawSlug !== data.canonicalSlug
    ) {
      console.log('[DynamicPage] Redirecting to canonical URL:', data.canonicalSlug);
      
      // Build canonical path based on page type and locale
      let canonicalPath: string;
      if (data.page.is_system_page) {
        canonicalPath = locale === 'br' 
          ? `/br/${data.canonicalSlug}`
          : `/es/${data.canonicalSlug}`;
      } else {
        canonicalPath = locale === 'br'
          ? `/br/artigos/${data.canonicalSlug}`
          : `/es/articulos/${data.canonicalSlug}`;
      }
      
      navigate(canonicalPath, { replace: true });
      return;
    }
  }, [data, locale, navigate, rawSlug]);

  // Redirect bare publication slugs (e.g. /alternatives-airdrop-defi-founders)
  // to canonical /publications/<slug> to consolidate authority and avoid duplicate indexing.
  useEffect(() => {
    if (!data?.page || data.page.is_system_page) return;

    const pathname = location.pathname;
    // Only act on EN bare paths — locale-prefixed routes are handled separately.
    const isLocalePrefixed = pathname.startsWith('/br/') || pathname.startsWith('/es/');
    const isAlreadyCanonical = pathname.startsWith('/publications/');
    if (isLocalePrefixed || isAlreadyCanonical) return;

    const canonicalPath = `/publications/${data.translation?.slug || data.page.slug}`;
    if (pathname !== canonicalPath) {
      navigate(canonicalPath, { replace: true });
    }
  }, [data, location.pathname, navigate]);

  // Only redirect to English if locale is not English AND no localized translation exists
  useEffect(() => {
    if (
      locale !== 'en' && 
      data?.translation && 
      data.translation.language !== locale && 
      allTranslations && 
      !hasLocalizedTranslation
    ) {
      const englishUrl = data.page.is_system_page 
        ? `/${data.page.slug}` 
        : `/publications/${data.page.slug}`;
      
      toast({
        title: locale === 'br' ? "Tradução em breve" : "Traducción próximamente",
        description: locale === 'br' 
          ? "Esta publicação ainda não está disponível em Português. Mostrando versão em Inglês."
          : "Esta publicación aún no está disponible en Español. Mostrando versão en Inglês.",
        duration: 5000,
      });
      
      navigate(englishUrl, { replace: true });
    }
  }, [data, locale, navigate, allTranslations, hasLocalizedTranslation]);

  // No prerenderReady gating — static HTML in index.html serves crawlers.

  if ((isLoading || isLoadingTranslations) && !data?.translation) {
    // Stable skeleton (not a bare "Loading..." div) so any snapshot taken
    // mid-load still contains layout + indexable scaffolding.
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header locale={locale} />
        <main className="pt-20 md:pt-24 pb-16 flex-1">
          <article className="container mx-auto px-4 max-w-4xl">
            <div className="h-10 w-3/4 bg-muted rounded animate-pulse mb-6" />
            <div className="h-4 w-full bg-muted rounded animate-pulse mb-3" />
            <div className="h-4 w-11/12 bg-muted rounded animate-pulse mb-3" />
            <div className="h-4 w-10/12 bg-muted rounded animate-pulse mb-8" />
            <div className="h-64 w-full bg-muted rounded animate-pulse" />
          </article>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data?.page || !resolvedSlug) {
    return <NotFound />;
  }

  const { page, translation } = data;
  const baseUrl = 'https://mangabeira.net';
  
  // Use localized slug if available for current locale, otherwise use base slug
  const currentSlug = translation.slug || page.slug;
  
  const getPathPrefix = (targetLocale: Locale) => {
    if (page.is_system_page) {
      if (targetLocale === 'en') return '';
      if (targetLocale === 'br') return 'br';
      return 'es';
    }
    if (targetLocale === 'en') return 'publications';
    if (targetLocale === 'br') return 'br/artigos';
    return 'es/articulos';
  };
  
  const getCurrentPath = () => {
    const prefix = getPathPrefix(locale);
    return prefix ? `${prefix}/${currentSlug}` : currentSlug;
  };

  // Helper to get localized slug for a specific language from allTranslations
  const getLocalizedSlug = (targetLocale: Locale): string => {
    if (!allTranslations) return page.slug;

    const localeTranslation = allTranslations.find(t => t.language === targetLocale);
    // Use translation slug if available and non-empty, otherwise fall back to page.slug
    return localeTranslation?.slug || page.slug;
  };

  return (
    <>
      <Helmet>
        <title>{translation.title}</title>
        <meta name="description" content={translation.meta_description || ''} />

        {/* Canonical */}
        <link rel="canonical" href={`${baseUrl}/${getCurrentPath()}`} />

        {/* Language alternates */}
        {page.is_system_page ? (
          <>
            <link rel="alternate" hrefLang="en" href={`${baseUrl}/${getLocalizedSlug('en')}`} />
            <link rel="alternate" hrefLang="pt-BR" href={`${baseUrl}/br/${getLocalizedSlug('br')}`} />
            <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/${getLocalizedSlug('es')}`} />
            <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/${getLocalizedSlug('en')}`} />
          </>
        ) : (
          <>
            <link rel="alternate" hrefLang="en" href={`${baseUrl}/publications/${getLocalizedSlug('en')}`} />
            <link rel="alternate" hrefLang="pt-BR" href={`${baseUrl}/br/artigos/${getLocalizedSlug('br')}`} />
            <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/articulos/${getLocalizedSlug('es')}`} />
            <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/publications/${getLocalizedSlug('en')}`} />
          </>
        )}
        
        {/* Open Graph */}
        <meta property="og:title" content={translation.title} />
        <meta property="og:description" content={translation.meta_description || ''} />
        <meta property="og:type" content={page.is_system_page ? "website" : "article"} />
        <meta property="og:url" content={`${baseUrl}/${getCurrentPath()}`} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header locale={locale} />
        
        {page.is_system_page ? (
          <main className="pt-20 md:pt-24 pb-16 flex-1">
            <article className="container mx-auto px-4 max-w-4xl">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyContent, {
                  ALLOWED_TAGS: CONTENT_ALLOWED_TAGS,
                  ALLOWED_ATTR: CONTENT_ALLOWED_ATTR
                }) }}
              />
            </article>
          </main>
        ) : (
          <BlogTemplate
            title={translation.title}
            content={<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyContent, {
              ALLOWED_TAGS: CONTENT_ALLOWED_TAGS,
              ALLOWED_ATTR: CONTENT_ALLOWED_ATTR
            }) }} />}
            category={page.category}
            publishedDate={page.updated_at || page.created_at}
            metaDescription={translation.meta_description || ''}
            featuredImage={
              heroImageMap[rawSlug] ||
              heroImageMap[page.slug] ||
              (page.featured_image &&
                (page.featured_image.startsWith('http://') || page.featured_image.startsWith('https://')) &&
                !page.featured_image.includes('/src/')
                  ? page.featured_image
                  : undefined) ||
              undefined
            }
            featuredImageAlt={translation.featured_image_alt || translation.title}
            readTime={page.read_time || undefined}
            locale={locale}
          />
        )}
        
        <Footer />
      </div>
    </>
  );
}