import { Helmet } from 'react-helmet-async';
import { Locale, t } from '@/lib/translations';

interface SEOProps {
  locale: Locale;
  path?: string;
}

const SEO = ({ locale, path = '/' }: SEOProps) => {
  const baseUrl = 'https://mangabeira.net';
  
  // Get localized meta content
  const title = t('meta', 'page_title', locale);
  const description = t('meta', 'page_description', locale);
  const ogTitle = t('meta', 'og_title', locale);
  const ogDescription = t('meta', 'og_description', locale);
  const twitterTitle = t('meta', 'twitter_title', locale);
  const twitterDescription = t('meta', 'twitter_description', locale);

  // Build canonical and alternate URLs
  const cleanPath = path.replace(/^\/(br|es)/, '') || '/';
  const canonicalUrl = locale === 'en' 
    ? `${baseUrl}${cleanPath}`
    : `${baseUrl}/${locale}${cleanPath}`;

  const alternateUrls = {
    en: `${baseUrl}${cleanPath}`,
    br: `${baseUrl}/br${cleanPath}`,
    es: `${baseUrl}/es${cleanPath}`,
  };

  // Language attribute
  const htmlLang = locale === 'br' ? 'pt-BR' : locale === 'es' ? 'es' : 'en';

  // Structured data for Person schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Gabriel Mangabeira",
    "jobTitle": t('hero', 'profile_title', locale),
    "description": description,
    "url": baseUrl,
    "image": `${baseUrl}/og-mangabeira.png`,
    "sameAs": [
      "https://www.linkedin.com/in/mangabeira/",
      "https://twitter.com/gabrielmangabe1",
      "https://github.com/gabrielmangabeira",
      "https://www.olympics.com/en/athletes/gabriel-mangabeira"
    ],
    "knowsAbout": ["Growth Marketing", "Web3", "AI", "SEO", "Performance Marketing"],
    "alumniOf": "Brazilian Olympic Team",
    "award": ["Olympic Athlete", "2x Olympian"],
    "inLanguage": [htmlLang]
  };

  // Structured data for WebPage
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": canonicalUrl,
    "inLanguage": htmlLang,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Gabriel Mangabeira",
      "url": baseUrl
    },
    "about": {
      "@type": "Person",
      "name": "Gabriel Mangabeira"
    }
  };

  return (
    <Helmet>
      {/* HTML lang attribute */}
      <html lang={htmlLang} />

      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang Tags */}
      <link rel="alternate" hrefLang="en" href={alternateUrls.en} />
      <link rel="alternate" hrefLang="pt-BR" href={alternateUrls.br} />
      <link rel="alternate" hrefLang="es" href={alternateUrls.es} />
      <link rel="alternate" hrefLang="x-default" href={alternateUrls.en} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={`${baseUrl}/og-mangabeira.png`} />
      <meta property="og:locale" content={htmlLang.replace('-', '_')} />
      {locale !== 'en' && <meta property="og:locale:alternate" content="en_US" />}
      {locale !== 'br' && <meta property="og:locale:alternate" content="pt_BR" />}
      {locale !== 'es' && <meta property="og:locale:alternate" content="es_ES" />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={twitterTitle} />
      <meta property="twitter:description" content={twitterDescription} />
      <meta property="twitter:image" content={`${baseUrl}/og-mangabeira.png`} />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#0a1f34" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
