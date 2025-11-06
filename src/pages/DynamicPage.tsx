import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
import web3AthletesImage from '@/assets/web3-for-athletes.png';
import web2Web3MarketingImage from '@/assets/web2-vs-web3-cover.png';
import tokenHealthScanImage from '@/assets/token-health-scan-build-cover.png';
import web3SeoGuideImage from '@/assets/web3-seo-cover.png';

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
  // If so, force a reload to let Netlify serve it properly
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

  // Early exit if no slug
  if (!resolvedSlug) {
    return <NotFound />;
  }

  const { data, isLoading, error } = usePublicPage(resolvedSlug, locale);

  console.log('[DynamicPage] Slug:', resolvedSlug, 'Locale:', locale, 'Data:', data ? 'found' : 'not found');

  // Fetch all translations for hreflang tags (only if we have a page)
  const { data: allTranslations } = useQuery({
    queryKey: ['page-translations', data?.page.id],
    queryFn: async () => {
      if (!data?.page.id) return [];

      const { data: translations, error } = await supabase
        .from('page_translations')
        .select('language, slug')
        .eq('page_id', data.page.id);

      if (error) throw error;
      return translations || [];
    },
    enabled: !!data?.page.id,
  });

  // Extract schema markup and body content
  const { schemas, bodyContent } = useMemo(
    () => extractHTMLParts(data?.translation?.content),
    [data?.translation?.content]
  );

  // Safely inject JSON-LD schemas into document head
  useEffect(() => {
    const addedScripts: HTMLScriptElement[] = [];
    
    schemas.forEach((schemaJson, index) => {
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
  }, [schemas]);

  // Check if localized translation exists
  const hasLocalizedTranslation = allTranslations?.some(
    t => t.language === locale && (t.slug ?? '') !== ''
  );

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

  if (isLoading || isLoadingTranslations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !data?.page) {
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
          </>
        ) : (
          <>
            <link rel="alternate" hrefLang="en" href={`${baseUrl}/publications/${getLocalizedSlug('en')}`} />
            <link rel="alternate" hrefLang="pt-BR" href={`${baseUrl}/br/artigos/${getLocalizedSlug('br')}`} />
            <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/articulos/${getLocalizedSlug('es')}`} />
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
                dangerouslySetInnerHTML={{ __html: bodyContent }}
              />
            </article>
          </main>
        ) : (
          <BlogTemplate
            title={translation.title}
            content={<div dangerouslySetInnerHTML={{ __html: bodyContent }} />}
            category={page.category}
            publishedDate={page.created_at}
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