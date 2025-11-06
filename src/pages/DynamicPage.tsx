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

// Helper function to extract schema markup and body content from HTML
function extractHTMLParts(htmlContent: string | null): { 
  schemas: string[], 
  bodyContent: string 
} {
  if (!htmlContent) {
    return { schemas: [], bodyContent: '' };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Extract all schema markup scripts from head
  const schemaScripts = Array.from(
    doc.querySelectorAll('script[type="application/ld+json"]')
  ).map(script => script.textContent || '');
  
  // Get body content or fall back to full content
  const body = doc.querySelector('body');
  const bodyContent = body ? body.innerHTML : htmlContent;
  
  return { schemas: schemaScripts, bodyContent };
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

  // Detect translation mismatch and redirect to English version
  useEffect(() => {
    if (data?.translation && data.translation.language !== locale && locale !== 'en') {
      const englishUrl = data.page.is_system_page 
        ? `/${data.page.slug}` 
        : `/publications/${data.page.slug}`;
      
      toast({
        title: locale === 'br' ? "Tradução em breve" : "Traducción próximamente",
        description: locale === 'br' 
          ? "Esta publicação ainda não está disponível em Português. Mostrando versão em Inglês."
          : "Esta publicación aún no está disponible en Español. Mostrando versión en Inglés.",
        duration: 5000,
      });
      
      navigate(englishUrl, { replace: true });
    }
  }, [data, locale, navigate]);

  if (isLoading || isLoadingTranslations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !data?.translation) {
    return <NotFound />;
  }

  const { page, translation } = data;
  const baseUrl = 'https://mangabeira.net';
  
  // Use localized slug if available for current locale, otherwise use base slug
  const currentSlug = translation.slug || page.slug;
  
  // Extract schema markup and body content
  const { schemas, bodyContent } = useMemo(
    () => extractHTMLParts(translation.content),
    [translation.content]
  );
  
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
            <link rel="alternate" hrefLang="en" href={`${baseUrl}/${page.slug}`} />
            <link rel="alternate" hrefLang="pt-BR" href={`${baseUrl}/br/${translation.slug || page.slug}`} />
            <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/${translation.slug || page.slug}`} />
          </>
        ) : (
          <>
            <link rel="alternate" hrefLang="en" href={`${baseUrl}/publications/${page.slug}`} />
            <link rel="alternate" hrefLang="pt-BR" href={`${baseUrl}/br/artigos/${page.slug}`} />
            <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/articulos/${page.slug}`} />
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
              {/* Render schema markup directly in body for reliable detection */}
              {schemas.map((schema, index) => (
                <script 
                  key={index} 
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: schema }}
                />
              ))}
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: bodyContent }}
              />
            </article>
          </main>
        ) : (
          <>
            {/* Render schema markup directly in body for reliable detection */}
            {schemas.map((schema, index) => (
              <script 
                key={index} 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schema }}
              />
            ))}
            <BlogTemplate
              title={translation.title}
              content={bodyContent}
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
          </>
        )}
        
        <Footer />
      </div>
    </>
  );
}
