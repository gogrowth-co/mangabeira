import { Helmet } from 'react-helmet-async';
import { Locale, t } from '@/lib/translations';

interface SEOProps {
  locale: Locale;
  path?: string;
}

const OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/vPREpio8p8h1iruSSNkQMQeWPo62/social-images/social-1759804725149-og-mangabeira.png";

const SEO = ({ locale, path = '/' }: SEOProps) => {
  const baseUrl = 'https://mangabeira.net';
  
  const title = t('meta', 'page_title', locale);
  const description = t('meta', 'page_description', locale);
  const ogTitle = t('meta', 'og_title', locale);
  const ogDescription = t('meta', 'og_description', locale);
  const twitterTitle = t('meta', 'twitter_title', locale);
  const twitterDescription = t('meta', 'twitter_description', locale);

  const cleanPath = path.replace(/^\/(br|es)/, '') || '/';
  const canonicalUrl = locale === 'en' 
    ? `${baseUrl}${cleanPath}`
    : `${baseUrl}/${locale}${cleanPath}`;

  const alternateUrls = {
    en: `${baseUrl}${cleanPath}`,
    br: `${baseUrl}/br${cleanPath}`,
    es: `${baseUrl}/es${cleanPath}`,
  };

  const htmlLang = locale === 'br' ? 'pt-BR' : locale === 'es' ? 'es' : 'en';

  const localizedOrgDescriptions = {
    en: "A digital growth lab led by Gabriel Mangabeira, helping Web3 and AI-driven companies grow through data, automation, and storytelling.",
    br: "Um laboratório de crescimento digital liderado por Gabriel Mangabeira, ajudando empresas de Web3 e IA a crescer através de dados, automação e storytelling.",
    es: "Un laboratorio de crecimiento digital dirigido por Gabriel Mangabeira, ayudando a empresas de Web3 e IA a crecer a través de datos, automatización y storytelling."
  };

  const localizedPersonDescriptions = {
    en: "Gabriel Mangabeira is a two-time Olympian turned Growth Marketing Strategist helping Web3 and AI companies scale with data, creativity, and automation.",
    br: "Gabriel Mangabeira é um atleta olímpico de duas olimpíadas que se tornou Estrategista de Growth Marketing ajudando empresas de Web3 e IA a escalar com dados, criatividade e automação.",
    es: "Gabriel Mangabeira es un atleta olímpico de dos olimpiadas convertido en Estratega de Growth Marketing que ayuda a empresas de Web3 e IA a escalar con datos, creatividad y automatización."
  };

  const localizedPageDescriptions = {
    en: "Homepage of Gabriel Mangabeira — Growth Marketing Strategist and former Olympian, building AI-driven Web3 growth systems and digital communities.",
    br: "Página inicial de Gabriel Mangabeira — Estrategista de Growth Marketing e ex-atleta olímpico, construindo sistemas de crescimento Web3 impulsionados por IA e comunidades digitais.",
    es: "Página de inicio de Gabriel Mangabeira — Estratega de Growth Marketing y ex-atleta olímpico, construyendo sistemas de crecimiento Web3 impulsados por IA y comunidades digitales."
  };

  const comprehensiveSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": baseUrl,
      "name": "Mangabeira.net",
      "alternateName": "Gabriel Mangabeira",
      "publisher": {
        "@type": "Organization",
        "name": "Mangabeira.net",
        "logo": {
          "@type": "ImageObject",
          "url": OG_IMAGE
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Mangabeira.net",
      "url": baseUrl,
      "logo": OG_IMAGE,
      "description": localizedOrgDescriptions[locale],
      "founder": {
        "@type": "Person",
        "name": "Gabriel Mangabeira",
        "url": `${baseUrl}/about`
      },
      "sameAs": [
        "https://x.com/manga82",
        "https://linkedin.com/in/mangabeira",
        "https://medium.com/@mangabeira"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Business inquiries",
        "email": "hello@mangabeira.net",
        "availableLanguage": ["en", "pt-BR", "es"]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Gabriel Mangabeira",
      "url": baseUrl,
      "image": `${baseUrl}/images/gabriel-professional-about.png`,
      "jobTitle": t('hero', 'profile_title', locale),
      "worksFor": {
        "@type": "Organization",
        "name": "Mangabeira.net"
      },
      "alumniOf": [
        { "@type": "Organization", "name": "University of Florida" },
        { "@type": "Organization", "name": "Coca-Cola Company" },
        { "@type": "Organization", "name": "Binance" },
        { "@type": "Organization", "name": "International Olympic Committee" }
      ],
      "sameAs": [
        "https://x.com/manga82",
        "https://linkedin.com/in/mangabeira",
        "https://medium.com/@mangabeira"
      ],
      "knowsAbout": [
        "Growth Marketing",
        "Web3 Strategy",
        "Tokenomics",
        "DeFi Marketing",
        "AI-powered Growth",
        "Community Building",
        "Content Systems",
        "SEO and AEO"
      ],
      "description": localizedPersonDescriptions[locale]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": canonicalUrl,
      "name": title,
      "description": localizedPageDescriptions[locale],
      "inLanguage": htmlLang
    }
  ];

  return (
    <Helmet>
      <html lang={htmlLang} />

      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <link rel="alternate" hrefLang="en" href={alternateUrls.en} />
      <link rel="alternate" hrefLang="pt-BR" href={alternateUrls.br} />
      <link rel="alternate" hrefLang="es" href={alternateUrls.es} />
      <link rel="alternate" hrefLang="x-default" href={alternateUrls.en} />

      <link rel="alternate" type="application/rss+xml" title="Mangabeira.net RSS Feed (English)" href={`${baseUrl}/rss/en.xml`} hrefLang="en" />
      <link rel="alternate" type="application/rss+xml" title="Mangabeira.net RSS Feed (Portuguese)" href={`${baseUrl}/rss/br.xml`} hrefLang="pt-BR" />
      <link rel="alternate" type="application/rss+xml" title="Mangabeira.net RSS Feed (Spanish)" href={`${baseUrl}/rss/es.xml`} hrefLang="es" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:locale" content={htmlLang.replace('-', '_')} />
      {locale !== 'en' && <meta property="og:locale:alternate" content="en_US" />}
      {locale !== 'br' && <meta property="og:locale:alternate" content="pt_BR" />}
      {locale !== 'es' && <meta property="og:locale:alternate" content="es_ES" />}

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={twitterTitle} />
      <meta property="twitter:description" content={twitterDescription} />
      <meta property="twitter:image" content={OG_IMAGE} />

      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#0a1f34" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      <script type="application/ld+json">
        {JSON.stringify(comprehensiveSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
