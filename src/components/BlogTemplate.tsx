import { ReactNode } from 'react';
import DOMPurify from 'dompurify';
import authorAvatar from "@/assets/gabriel-profile.png";
import { Locale } from '@/lib/translations';

interface BlogTemplateProps {
  title: string;
  content: string | ReactNode;
  category?: string | null;
  publishedDate?: string;
  metaDescription?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  readTime?: string;
  locale?: Locale;
}

const translations = {
  en: {
    authorTitle: "Olympian & Growth Strategist",
    defaultReadTime: "8 min read",
    updatedPrefix: "Updated",
    avatarAlt: "Gabriel Mangabeira headshot"
  },
  br: {
    authorTitle: "Atleta Olímpico e Estrategista de Growth",
    defaultReadTime: "8 min de leitura",
    updatedPrefix: "Atualizado",
    avatarAlt: "Foto de Gabriel Mangabeira"
  },
  es: {
    authorTitle: "Atleta Olímpico y Estratega de Crecimiento",
    defaultReadTime: "8 min de lectura",
    updatedPrefix: "Actualizado",
    avatarAlt: "Foto de Gabriel Mangabeira"
  }
};

const BlogTemplate = ({ 
  title, 
  content, 
  category, 
  publishedDate,
  metaDescription,
  featuredImage,
  featuredImageAlt,
  readTime,
  locale = 'en'
}: BlogTemplateProps) => {
  const t = translations[locale];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <article className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
          <header className="mb-8 md:mb-10">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>
            {metaDescription && (
              <p className="mt-4 text-lg text-muted-foreground">{metaDescription}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={authorAvatar}
                  alt={t.avatarAlt}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                  loading="lazy"
                />
                <div className="leading-tight">
                  <div className="font-medium">Gabriel Mangabeira</div>
                  <div className="text-sm text-muted-foreground">{t.authorTitle}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {readTime || t.defaultReadTime}
                </span>
                {publishedDate && (
                  <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {t.updatedPrefix} {new Date(publishedDate).toLocaleDateString(locale === 'br' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </span>
                )}
              </div>
            </div>

            {featuredImage && (
              <figure className="mt-8 overflow-hidden rounded-lg border border-border">
                <img
                  src={featuredImage}
                  alt={featuredImageAlt || title}
                  loading="lazy"
                  className="h-auto w-full object-cover"
                />
              </figure>
            )}
          </header>

          <section className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-strong:text-primary prose-strong:font-bold prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-img:rounded-xl prose-img:shadow-xl prose-table:border prose-table:rounded-lg">
            {typeof content === 'string' ? (
              <div dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(content, {
                  ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'br', 'img', 'div', 'span', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote', 'code', 'pre', 'section', 'article', 'figure', 'figcaption'],
                  ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'id', 'target', 'rel', 'title']
                })
              }} />
            ) : (
              content
            )}
          </section>
        </article>
      </main>
    </div>
  );
};

export default BlogTemplate;
