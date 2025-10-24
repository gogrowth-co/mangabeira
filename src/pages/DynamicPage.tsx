import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { usePublicPage } from '@/hooks/usePages';
import { useLanguage } from '@/contexts/LanguageContext';
import { Locale } from '@/lib/translations';
import { Helmet } from 'react-helmet-async';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogTemplate from '@/components/BlogTemplate';
import NotFound from './NotFound';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { locale, isLoading: isLoadingTranslations } = useLanguage();
  const { data, isLoading, error } = usePublicPage(slug!, locale);

  // Detect translation mismatch and redirect to English version
  useEffect(() => {
    if (data?.translation && data.translation.language !== locale && locale !== 'en') {
      const englishUrl = `/publications/${data.page.slug}`;
      
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
  
  const getPathPrefix = (targetLocale: Locale) => {
    if (targetLocale === 'en') return 'publications';
    if (targetLocale === 'br') return 'br/artigos';
    return 'es/articulos';
  };
  
  return (
    <>
      <Helmet>
        <title>{translation.title}</title>
        <meta name="description" content={translation.meta_description || ''} />
        
        {/* Canonical */}
        <link rel="canonical" href={`${baseUrl}/${getPathPrefix(locale)}/${currentSlug}`} />
        
        {/* Language alternates - use base slug, routing will handle localized lookup */}
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/publications/${page.slug}`} />
        <link rel="alternate" hrefLang="pt-BR" href={`${baseUrl}/br/artigos/${page.slug}`} />
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/articulos/${page.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={translation.title} />
        <meta property="og:description" content={translation.meta_description || ''} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${baseUrl}/${getPathPrefix(locale)}/${currentSlug}`} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header locale={locale} />
        
        <BlogTemplate
          title={translation.title}
          content={translation.content || ''}
          category={page.category}
          publishedDate={page.created_at}
          metaDescription={translation.meta_description || ''}
          featuredImage={page.featured_image || undefined}
          readTime={page.read_time || undefined}
          locale={locale}
        />
        
        <Footer />
      </div>
    </>
  );
}
