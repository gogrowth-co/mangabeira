import { ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface BlogTemplateProps {
  title: string;
  content: string | ReactNode;
  category?: string | null;
  publishedDate?: string;
}

const BlogTemplate = ({ title, content, category, publishedDate }: BlogTemplateProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Following brand guidelines */}
      <section className="relative bg-navy-deep text-white-pure overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          {category && (
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-cta text-white font-medium rounded-full text-sm uppercase tracking-wide">
                {category}
              </span>
            </div>
          )}
          
          <h1 className="font-hero text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-shadow-hero leading-tight">
            {title}
          </h1>
          
          {publishedDate && (
            <p className="text-white-soft text-lg font-body text-shadow-subtle">
              {new Date(publishedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
      </section>

      {/* Content Section - Following brand typography */}
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-navy max-w-none
            prose-headings:font-hero prose-headings:text-navy-deep prose-headings:font-bold
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:leading-tight
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:font-body prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-navy-deep prose-strong:font-semibold
            prose-ul:my-6 prose-ul:space-y-2
            prose-ol:my-6 prose-ol:space-y-2
            prose-li:text-foreground prose-li:leading-relaxed
            prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
            prose-blockquote:border-l-4 prose-blockquote:border-accent-primary 
            prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-text-secondary
            prose-code:text-accent-blue prose-code:bg-bg-mist prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-navy-deep prose-pre:text-white-pure">
            {typeof content === 'string' ? (
              <div dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(content, {
                  ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'br', 'img', 'div', 'span', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote', 'code', 'pre'],
                  ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'id', 'target', 'rel']
                })
              }} />
            ) : (
              content
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogTemplate;
