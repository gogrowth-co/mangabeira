import { Publication } from '@/hooks/usePublications';
import { Locale } from '@/lib/translations';

interface PublicationCardSchemaProps {
  publication: Publication;
  translation: {
    title: string;
    meta_description: string | null;
  };
  locale: Locale;
}

export default function PublicationCardSchema({ publication, translation, locale }: PublicationCardSchemaProps) {
  const baseUrl = 'https://mangabeira.net';
  const pathPrefix = locale === 'en' ? '' : `/${locale}`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: translation.title,
    description: translation.meta_description || '',
    image: publication.featured_image ? `${baseUrl}${publication.featured_image}` : undefined,
    datePublished: publication.created_at,
    dateModified: publication.updated_at,
    author: {
      '@type': 'Person',
      name: publication.author_name || 'Gabriel Mangabeira',
    },
    publisher: {
      '@type': 'Person',
      name: 'Gabriel Mangabeira',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${pathPrefix}/${publication.slug}`,
    },
    keywords: publication.tags.join(', '),
    inLanguage: locale === 'br' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
  };
  
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
