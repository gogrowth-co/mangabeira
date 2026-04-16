import { Helmet } from 'react-helmet-async';
import { Locale, t } from '@/lib/translations';

interface PublicationsHubSEOProps {
  locale: Locale;
  publicationCount: number;
}

export default function PublicationsHubSEO({ locale, publicationCount }: PublicationsHubSEOProps) {
  const baseUrl = 'https://mangabeira.net';
  const pathByLocale: Record<Locale, string> = {
    en: '/publications',
    br: '/br/artigos',
    es: '/es/articulos',
  };
  const currentPath = pathByLocale[locale];
  
  const title = t('publications_hub', 'page_title', locale);
  const description = t('publications_hub', 'page_description', locale);
  
  // Structured data for WebPage
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    url: `${baseUrl}${currentPath}`,
    inLanguage: locale === 'br' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('publications_hub', 'breadcrumb_home', locale),
          item: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('publications_hub', 'breadcrumb_current', locale),
        },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: publicationCount,
    },
  };

  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Gabriel Mangabeira',
    url: baseUrl,
    jobTitle: 'Growth Marketing Strategist',
    description: 'Olympian and Growth Marketing Strategist',
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical & Alternates */}
      <link rel="canonical" href={`${baseUrl}${currentPath}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/publications`} />
      <link rel="alternate" hrefLang="pt-BR" href={`${baseUrl}/br/artigos`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/articulos`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/publications`} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${baseUrl}${currentPath}`} />
      <meta property="og:site_name" content="Gabriel Mangabeira" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
    </Helmet>
  );
}
