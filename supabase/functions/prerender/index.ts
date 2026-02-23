import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory cache for prerendered pages (1 hour TTL)
const cache = new Map<string, { html: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Bot user agents to detect
const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp', // Yahoo
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'slackbot',
  'discordbot',
  'pinterestbot',
  'tumblr',
  'redditbot',
  'applebot',
  'petalbot',
];

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

// Allowlist-based HTML sanitizer - only permits safe tags and attributes
const ALLOWED_TAGS = new Set([
  'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'img', 'strong', 'em', 'b', 'i', 'u',
  'code', 'pre', 'blockquote', 'br', 'hr', 'table', 'thead',
  'tbody', 'tr', 'th', 'td', 'figure', 'figcaption', 'picture',
  'source', 'video', 'audio', 'section', 'article', 'header',
  'footer', 'nav', 'main', 'aside', 'details', 'summary', 'mark',
  'small', 'sub', 'sup', 'dl', 'dt', 'dd', 'abbr', 'time',
  'address', 'cite', 'caption', 'col', 'colgroup',
]);

const ALLOWED_ATTRS = new Set([
  'href', 'src', 'alt', 'class', 'id', 'title', 'lang', 'dir',
  'width', 'height', 'loading', 'decoding', 'srcset', 'sizes',
  'target', 'rel', 'type', 'datetime', 'colspan', 'rowspan',
  'scope', 'headers', 'media',
]);

function sanitizeHTML(html: string): string {
  // Remove all script, style, iframe, object, embed, form, and input tags entirely
  let clean = html
    .replace(/<(script|style|iframe|object|embed|form|input|textarea|select|button)\b[^]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe|object|embed|form|input|textarea|select|button)\b[^>]*\/?>/gi, '');

  // Remove all event handlers (on*=...) including encoded variants
  clean = clean.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

  // Remove javascript:, vbscript:, data: protocol URLs (including encoded variants)
  clean = clean.replace(/(href|src|action|formaction|poster|background)\s*=\s*(?:"[^"]*(?:javascript|vbscript|data)\s*:[^"]*"|'[^']*(?:javascript|vbscript|data)\s*:[^']*')/gi, '');

  // Remove HTML-encoded script variants
  clean = clean.replace(/&#\d+;?/g, (match) => {
    const code = parseInt(match.replace(/&#|;/g, ''), 10);
    const char = String.fromCharCode(code);
    return /[<>"'&]/.test(char) ? '' : char;
  });

  // Strip disallowed tags but keep their text content
  clean = clean.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (fullMatch, tagName) => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return '';

    // For closing tags, just return them
    if (fullMatch.startsWith('</')) return `</${tag}>`;

    // For opening tags, filter attributes to allowed ones only
    const attrString = fullMatch.slice(fullMatch.indexOf(tagName) + tagName.length, fullMatch.endsWith('/>') ? -2 : -1);
    const attrs: string[] = [];
    const attrRegex = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      const attrValue = attrMatch[2] ?? attrMatch[3] ?? '';
      if (ALLOWED_ATTRS.has(attrName)) {
        // Ensure href/src values don't contain dangerous protocols
        if ((attrName === 'href' || attrName === 'src') &&
            /^\s*(javascript|vbscript|data)\s*:/i.test(attrValue)) {
          continue;
        }
        attrs.push(`${attrName}="${attrValue.replace(/"/g, '&quot;')}"`);
      }
    }
    const selfClose = fullMatch.endsWith('/>') ? ' /' : '';
    return `<${tag}${attrs.length ? ' ' + attrs.join(' ') : ''}${selfClose}>`;
  });

  return clean;
}

function generateHTML(data: {
  title: string;
  description: string;
  content: string;
  schema?: object;
  featuredImage?: string;
  locale: string;
  canonicalUrl: string;
  alternateUrls: { locale: string; url: string }[];
}): string {
  const schemaScript = data.schema 
    ? `<script type="application/ld+json">${JSON.stringify(data.schema)}</script>`
    : '';

  const ogImage = data.featuredImage || 'https://mangabeira.net/og-mangabeira.png';

  return `<!DOCTYPE html>
<html lang="${data.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <meta name="description" content="${data.description}">
  <link rel="canonical" href="${data.canonicalUrl}">
  ${data.alternateUrls.map(alt => 
    `<link rel="alternate" hreflang="${alt.locale}" href="${alt.url}">`
  ).join('\n  ')}
  
  <!-- Open Graph -->
  <meta property="og:title" content="${data.title}">
  <meta property="og:description" content="${data.description}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:url" content="${data.canonicalUrl}">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${data.title}">
  <meta name="twitter:description" content="${data.description}">
  <meta name="twitter:image" content="${ogImage}">
  
  ${schemaScript}
</head>
<body>
  <main>
    ${sanitizeHTML(data.content)}
  </main>
</body>
</html>`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const userAgent = req.headers.get('user-agent') || '';
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '/';

    console.log('Prerender request:', { path, userAgent, isBot: isBot(userAgent) });

    // If not a bot, return a simple redirect instruction
    if (!isBot(userAgent)) {
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': path,
        },
      });
    }

    // Check cache
    const cacheKey = path;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      console.log('Serving from cache:', cacheKey);
      return new Response(cached.html, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse locale and slug from path
    const pathParts = path.split('/').filter(Boolean);
    let locale = 'en';
    let slug = '';

    if (pathParts.length === 0) {
      // Homepage
      locale = 'en';
      slug = 'home';
    } else if (pathParts.length === 1 && ['br', 'es'].includes(pathParts[0])) {
      // Localized homepage
      locale = pathParts[0];
      slug = 'home';
    } else if (pathParts.length === 1) {
      // English page
      locale = 'en';
      slug = pathParts[0];
    } else if (pathParts.length === 2 && ['br', 'es'].includes(pathParts[0])) {
      // Localized page
      locale = pathParts[0];
      slug = pathParts[1];
    }

    console.log('Parsed path:', { locale, slug });

    // First, try to find by localized slug for non-English locales
    let pageData: any = null;
    let matchedViaFallback = false;
    
    if (locale !== 'en') {
      // Try localized slug first
      const { data: translationMatch } = await supabase
        .from('page_translations')
        .select(`
          language,
          title,
          meta_description,
          content,
          schema,
          slug,
          page:pages!inner(id, slug, featured_image, status, is_system_page)
        `)
        .eq('slug', slug)
        .eq('language', locale)
        .eq('pages.status', 'published')
        .maybeSingle();
      
      if (translationMatch && translationMatch.page) {
        const page = Array.isArray(translationMatch.page) ? translationMatch.page[0] : translationMatch.page;
        pageData = {
          id: page.id,
          slug: page.slug,
          featured_image: page.featured_image,
          status: page.status,
          is_system_page: page.is_system_page,
          page_translations: [translationMatch]
        };
        console.log('Found by localized slug - canonical match');
      }
    }
    
    // Fall back to base slug lookup
    if (!pageData) {
      const { data, error } = await supabase
        .from('pages')
        .select(`
          id,
          slug,
          featured_image,
          status,
          is_system_page,
          page_translations!inner(
            language,
            title,
            meta_description,
            content,
            schema,
            slug
          )
        `)
        .eq('status', 'published')
        .or(`slug.eq.${slug},page_translations.slug.eq.${slug}`)
        .maybeSingle();
      
      if (error) {
        console.error('Database error:', error);
      }
      
      pageData = data;
      
      // Check if this was a fallback match (base slug used for non-English)
      if (pageData && locale !== 'en' && slug === pageData.slug) {
        matchedViaFallback = true;
        
        // Find the canonical localized slug
        const localizedTranslation = pageData.page_translations.find(
          (t: any) => t.language === locale && t.slug
        );
        
        if (localizedTranslation?.slug && localizedTranslation.slug !== slug) {
          // Build canonical URL and issue 301 redirect
          const localePrefix = locale === 'br' ? 'br' : 'es';
          const pathPrefix = pageData.is_system_page 
            ? `/${localePrefix}` 
            : `/${localePrefix}/${locale === 'br' ? 'artigos' : 'articulos'}`;
          const canonicalPath = `${pathPrefix}/${localizedTranslation.slug}`;
          
          console.log('301 Redirect: non-canonical URL to', canonicalPath);
          
          return new Response(null, {
            status: 301,
            headers: {
              ...corsHeaders,
              'Location': `https://mangabeira.net${canonicalPath}`,
              'Cache-Control': 'public, max-age=86400', // Cache redirect for 1 day
            },
          });
        }
      }
    }

    if (error || !pageData) {
      console.error('Page not found:', error);
      const notFoundHTML = generateHTML({
        title: '404 - Page Not Found',
        description: 'The requested page could not be found.',
        content: '<h1>404 - Page Not Found</h1><p>The requested page could not be found.</p>',
        locale,
        canonicalUrl: `https://mangabeira.net${path}`,
        alternateUrls: [],
      });
      return new Response(notFoundHTML, {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Find the translation for the current locale
    const translation = pageData.page_translations.find(
      (t: any) => t.language === locale
    ) || pageData.page_translations[0];

    const baseUrl = 'https://mangabeira.net';
    const localePrefix = locale === 'en' ? '' : `/${locale}`;
    const canonicalUrl = `${baseUrl}${localePrefix}/${translation.slug || slug}`;

    // Build alternate URLs
    const alternateUrls = pageData.page_translations.map((t: any) => ({
      locale: t.language === 'br' ? 'pt-BR' : t.language === 'es' ? 'es-ES' : 'en-US',
      url: `${baseUrl}${t.language === 'en' ? '' : `/${t.language}`}/${t.slug || slug}`,
    }));

    // Generate HTML
    const html = generateHTML({
      title: translation.title,
      description: translation.meta_description || '',
      content: translation.content || '<p>Content not available.</p>',
      schema: translation.schema,
      featuredImage: pageData.featured_image,
      locale: locale === 'br' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en',
      canonicalUrl,
      alternateUrls,
    });

    // Cache the result
    cache.set(cacheKey, { html, timestamp: Date.now() });

    // Clean old cache entries
    if (cache.size > 100) {
      const entries = Array.from(cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toDelete = entries.slice(0, 50);
      toDelete.forEach(([key]) => cache.delete(key));
    }

    console.log('Generated and cached prerendered HTML for:', path);

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Content-Security-Policy': "default-src 'self'; script-src 'none'; object-src 'none'; base-uri 'self'",
      },
    });

  } catch (error) {
    console.error('Prerender error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});
