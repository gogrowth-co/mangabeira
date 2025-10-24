import { ReactNode } from 'react';
import DOMPurify from 'dompurify';
import authorAvatar from "@/assets/gabriel-profile.png";

interface BlogTemplateProps {
  title: string;
  content: string | ReactNode;
  category?: string | null;
  publishedDate?: string;
  metaDescription?: string;
  featuredImage?: string;
  readTime?: string;
}

const BlogTemplate = ({ 
  title, 
  content, 
  category, 
  publishedDate,
  metaDescription,
  featuredImage,
  readTime = "8 min read"
}: BlogTemplateProps) => {
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
                  alt="Gabriel Mangabeira headshot"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                  loading="lazy"
                />
                <div className="leading-tight">
                  <div className="font-medium">Gabriel Mangabeira</div>
                  <div className="text-sm text-muted-foreground">Olympian & Growth Strategist</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {readTime}
                </span>
                {publishedDate && (
                  <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                    Updated {new Date(publishedDate).toLocaleDateString('en-US', {
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
                  alt={title}
                  loading="lazy"
                  className="h-auto w-full object-cover"
                />
              </figure>
            )}
          </header>

          <section className="prose prose-neutral dark:prose-invert max-w-none">
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
