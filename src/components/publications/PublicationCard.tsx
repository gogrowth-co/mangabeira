import { ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Locale, t } from '@/lib/translations';
import { Publication } from '@/hooks/usePublications';
import PublicationCardSchema from './PublicationCardSchema';

interface PublicationCardProps {
  publication: Publication;
  locale: Locale;
}

export default function PublicationCard({ publication, locale }: PublicationCardProps) {
  const translation = publication.translations.find(t => t.language === locale);
  const fallbackTranslation = publication.translations.find(t => t.language === 'en');
  const currentTranslation = translation || fallbackTranslation;
  
  if (!currentTranslation) return null;
  
  // Determine which languages are available
  const availableLanguages = publication.translations.map(t => t.language);
  const languageLabels: Record<string, string> = { 
    en: '🇺🇸 EN', 
    br: '🇧🇷 BR', 
    es: '🇪🇸 ES' 
  };
  
  const pathPrefix = locale === 'en' ? '' : `/${locale}`;
  const publicationUrl = `${pathPrefix}/${publication.slug}`;
  
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
      <PublicationCardSchema publication={publication} translation={currentTranslation} locale={locale} />
      
      {/* Featured Image */}
      {publication.featured_image && (
        <a href={publicationUrl} className="block relative aspect-video overflow-hidden">
          <img
            src={publication.featured_image}
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
