import { ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Locale, t } from '@/lib/translations';
import { Publication } from '@/hooks/usePublications';
import PublicationCardSchema from './PublicationCardSchema';
import web3AthletesImage from '@/assets/web3-for-athletes.png';
import web2Web3MarketingImage from '@/assets/web2-vs-web3-cover.png';
import tokenHealthScanImage from '@/assets/token-health-scan-build-cover.png';
import web3SeoGuideImage from '@/assets/web3-seo-cover.png';

interface PublicationCardProps {
  publication: Publication;
  locale: Locale;
}

// Map of publication slugs to their cover images (fallback for existing publications)
// New publications uploaded via admin will use Supabase Storage URLs from the database
const coverImageMap: Record<string, string> = {
  'web3-for-athletes': web3AthletesImage,
  'web3-para-atletas': web3AthletesImage, // BR version
  'web2-vs-web3-marketing': web2Web3MarketingImage,
  'vibe-coded-token-health-scan': tokenHealthScanImage,
  'definitive-guide-web3-seo': web3SeoGuideImage,
};

export default function PublicationCard({ publication, locale }: PublicationCardProps) {
  const translationsArr = publication.translations || [];
  const translation = translationsArr.find(t => t.language === locale);
  const fallbackTranslation = translationsArr.find(t => t.language === 'en');
  const currentTranslation = translation || fallbackTranslation;
  
  if (!currentTranslation) return null;
  
  // Determine which languages are available
  const availableLanguages = translationsArr.map(t => t.language);
  const languageLabels: Record<string, string> = { 
    en: '🇺🇸 EN', 
    br: '🇧🇷 BR', 
    es: '🇪🇸 ES' 
  };
  
  const getPublicationPath = (currentLocale: string, pubSlug: string) => {
    const pathMap = {
      en: '/publications',
      br: '/br/artigos',
      es: '/es/articulos'
    };
    // Use localized slug if available
    const localizedSlug = currentTranslation?.slug || pubSlug;
    return `${pathMap[currentLocale as keyof typeof pathMap] || pathMap.en}/${localizedSlug}`;
  };
  
  const publicationUrl = getPublicationPath(locale, publication.slug);

  // Get the cover image with priority:
  // 1. Imported images map (for existing publications with known images)
  // 2. Database image if it's a valid URL (for new publications uploaded via admin)
  // 3. Fallback to hardcoded map with base slug
  const localizedSlug = currentTranslation?.slug || publication.slug;

  // Check if database path is valid (should be a full URL, not a /src/assets path)
  const isValidDatabaseImage = publication.featured_image &&
    (publication.featured_image.startsWith('http://') ||
     publication.featured_image.startsWith('https://')) &&
    !publication.featured_image.includes('/src/');

  const coverImage =
    coverImageMap[localizedSlug] ||
    coverImageMap[publication.slug] ||
    (isValidDatabaseImage ? publication.featured_image : null);

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
      <PublicationCardSchema publication={publication} translation={currentTranslation} locale={locale} />

      {/* Featured Image */}
      {coverImage && (
        <a href={publicationUrl} className="block relative aspect-video overflow-hidden">
          <img
            src={coverImage}
            alt={currentTranslation.featured_image_alt || currentTranslation.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </a>
      )}
      
      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Category & Language Badges */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs">
            {publication.category}
          </Badge>
          
          <div className="flex gap-1">
            {(['en', 'br', 'es'] as const).map(lang => {
              const isAvailable = availableLanguages.includes(lang);
              return (
                <Badge
                  key={lang}
                  variant={isAvailable ? 'default' : 'outline'}
                  className={`text-xs ${isAvailable ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}
                  title={isAvailable ? t('publications_hub', 'translation_available', locale) : t('publications_hub', 'translation_coming', locale)}
                >
                  {languageLabels[lang]}
                </Badge>
              );
            })}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="font-hero text-xl font-bold text-navy-deep mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          <a href={publicationUrl}>{currentTranslation.title}</a>
        </h3>
        
        {/* Description */}
        <p className="text-foreground text-sm mb-4 line-clamp-3 flex-1">
          {currentTranslation.meta_description}
        </p>
        
        {/* Meta Row */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {publication.reading_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {publication.reading_time} {t('publications_hub', 'read_time', locale)}
              </span>
            )}
            <span className="text-xs">
              {t('publications_hub', 'updated', locale)} {new Date(publication.updated_at).toLocaleDateString(locale === 'br' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          
          <a
            href={publicationUrl}
            className="flex items-center gap-1 text-primary font-semibold hover:underline"
          >
            {t('publications_hub', 'read_more', locale)}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
