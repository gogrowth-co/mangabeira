import { ArrowRight } from "lucide-react";
import web3AthletesCover from "@/assets/web3-for-athletes.png";
import web2Web3MarketingCover from "@/assets/web2-vs-web3-cover.png";
import tokenHealthScanCover from "@/assets/vibe-coding-lovable.png";
import web3SeoGuideCover from "@/assets/web3-seo-cover.png";
import { Locale, t } from "@/lib/translations";

interface PublicationsContentProps {
  locale: Locale;
}

const PublicationsContent = ({ locale }: PublicationsContentProps) => {
  // Helper function to generate locale-specific publication paths
  const getPublicationLink = (englishSlug: string): string => {
    const localizedSlugs: Record<string, Record<Locale, string>> = {
      'web3-for-athletes': {
        en: 'web3-for-athletes',
        br: 'web3-para-atletas',
        es: 'web3-for-athletes'
      },
      'web2-vs-web3-marketing': {
        en: 'web2-vs-web3-marketing',
        br: 'web2-vs-web3-marketing',
        es: 'web2-vs-web3-marketing'
      },
      'vibe-coded-token-health-scan': {
        en: 'vibe-coded-token-health-scan',
        br: 'vibe-coded-token-health-scan',
        es: 'vibe-coded-token-health-scan'
      },
      'definitive-guide-web3-seo': {
        en: 'definitive-guide-web3-seo',
        br: 'definitive-guide-web3-seo',
        es: 'definitive-guide-web3-seo'
      }
    };

    const localizedSlug = localizedSlugs[englishSlug]?.[locale] || englishSlug;

    if (locale === 'br') return `/br/artigos/${localizedSlug}`;
    if (locale === 'es') return `/es/articulos/${localizedSlug}`;
    return `/publications/${localizedSlug}`;
  };

  const publications = [
    {
      cover: web3AthletesCover,
      title: t('publications', 'web3_athletes_title', locale),
      description: t('publications', 'web3_athletes_description', locale),
      category: t('publications', 'web3_athletes_category', locale),
      link: getPublicationLink('web3-for-athletes'),
    },
    {
      cover: web2Web3MarketingCover,
      title: t('publications', 'web2_vs_web3_title', locale),
      description: t('publications', 'web2_vs_web3_description', locale),
      category: t('publications', 'web2_vs_web3_category', locale),
      link: getPublicationLink('web2-vs-web3-marketing'),
    },
    {
      cover: tokenHealthScanCover,
      title: t('publications', 'vibe_coded_title', locale),
      description: t('publications', 'vibe_coded_description', locale),
      category: t('publications', 'vibe_coded_category', locale),
      link: getPublicationLink('vibe-coded-token-health-scan'),
    },
    {
      cover: web3SeoGuideCover,
      title: t('publications', 'web3_seo_title', locale),
      description: t('publications', 'web3_seo_description', locale),
      category: t('publications', 'web3_seo_category', locale),
      link: getPublicationLink('definitive-guide-web3-seo'),
    },
  ];

  const getCategoryColor = (category: string) => {
    const web3Label = t('publications', 'web3_athletes_category', locale);
    const marketingLabel = t('publications', 'web2_vs_web3_category', locale);
    
    if (category === web3Label) return "#DD6B20";
    if (category === marketingLabel) return "#1A202C";
    return "#DD6B20"; // default to web3 color
  };

  return (
    <section id="publications" className="py-8 md:py-9 lg:py-10 px-6 bg-[#FFFFFF] relative">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[rgba(10,31,52,0.06)] to-transparent pointer-events-none"></div>
      
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-4 md:mb-5 lg:mb-6">
          <h2 className="font-bold mb-3 md:mb-1.5 lg:mb-2" style={{ fontSize: 'clamp(32px, 3.5vw, 36px)', lineHeight: '1.2', fontWeight: 800, color: '#1A202C' }}>
            {t('publications', 'section_title', locale)}
          </h2>
          <p className="font-body max-w-[720px] mx-auto" style={{ fontSize: '16px', fontWeight: 500, color: '#2D3748' }}>
            {t('publications', 'section_subtitle', locale)}
          </p>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 lg:gap-6">
          {publications.map((publication, index) => (
            <a
              key={index}
              href={publication.link}
              className="group bg-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                borderRadius: '16px', 
                boxShadow: '0 6px 24px rgba(15, 23, 42, 0.08)',
                border: '1px solid #E6EAF0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(15, 23, 42, 0.10)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(15, 23, 42, 0.08)';
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 126, 41, 0.25)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(15, 23, 42, 0.08)';
              }}
            >
              {/* Cover Image - Square 1:1 ratio */}
              <div className="relative overflow-hidden w-full" style={{ aspectRatio: '1/1' }}>
                <img
                  src={publication.cover}
                  alt={publication.title}
                  className="w-full h-full object-cover transition-transform duration-150 group-hover:scale-102"
                  loading="lazy"
                  style={{ borderRadius: '12px' }}
                />
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 
                  className="font-hero font-bold leading-tight mb-3 line-clamp-2"
                  style={{ 
                    fontSize: 'clamp(15px, 1.3vw, 16px)',
                    color: '#1A202C'
                  }}
                >
                  {publication.title}
                </h3>
                <p 
                  className="mb-3 line-clamp-2 flex-1"
                  style={{ 
                    fontSize: 'clamp(13px, 1.1vw, 14px)',
                    lineHeight: '1.5',
                    color: '#4A5568'
                  }}
                >
                  {publication.description}
                </p>

                {/* Meta Row */}
                <div className="flex items-center justify-between mt-auto">
                  {/* Category Tag */}
                  <span 
                    className="px-2.5 py-1 text-xs font-medium"
                    style={{ 
                      borderRadius: '999px',
                      backgroundColor: '#EDF2F7',
                      color: getCategoryColor(publication.category)
                    }}
                  >
                    {publication.category}
                  </span>

                  {/* CTA Link */}
                  <span 
                    className="flex items-center text-sm font-semibold transition-colors group-hover:underline"
                    style={{ color: '#FF7E29' }}
                  >
                    {t('publications', 'web3_athletes_cta', locale)}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublicationsContent;
