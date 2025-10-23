import { useParams } from 'react-router-dom';
import { usePublicPage } from '@/hooks/usePages';
import { useLanguage } from '@/contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogTemplate from '@/components/BlogTemplate';
import NotFound from './NotFound';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { locale, isLoading: isLoadingTranslations } = useLanguage();
  const { data, isLoading, error } = usePublicPage(slug!, locale);

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
  
  return (
    <>
      <Helmet>
        <title>{translation.title}</title>
        <meta name="description" content={translation.meta_description || ''} />
        
        {/* Canonical */}
        <link rel="canonical" href={`${baseUrl}/${locale === 'en' ? '' : locale + '/'}${page.slug}`} />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/${page.slug}`} />
        <link rel="alternate" hrefLang="pt-BR" href={`${baseUrl}/br/${page.slug}`} />
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/${page.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={translation.title} />
        <meta property="og:description" content={translation.meta_description || ''} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${baseUrl}/${locale === 'en' ? '' : locale + '/'}${page.slug}`} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header locale={locale} />
        
        <BlogTemplate
          title={translation.title}
          content={translation.content || ''}
          category={page.category}
          publishedDate={page.created_at}
        />
        
        <Footer locale={locale} />
      </div>
    </>
  );
}
