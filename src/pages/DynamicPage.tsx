import { useParams } from 'react-router-dom';
import { usePublicPage } from '@/hooks/usePages';
import { useLanguage } from '@/contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotFound from './NotFound';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLanguage();
  const { data, isLoading, error } = usePublicPage(slug!, locale);

  if (isLoading) {
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
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <article 
            className="prose lg:prose-xl max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: translation.content || '' }}
          />
        </main>
        
        <Footer locale={locale} />
      </div>
    </>
  );
}
