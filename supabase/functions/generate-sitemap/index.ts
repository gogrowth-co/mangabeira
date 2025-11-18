import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory cache
let sitemapCache: { xml: string; timestamp: number } | null = null;
const CACHE_TTL = 3600000; // 1 hour in milliseconds

interface Page {
  slug: string;
  updated_at: string;
  translations: {
    language: string;
    slug: string | null;
  }[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check cache first
    const now = Date.now();
    if (sitemapCache && (now - sitemapCache.timestamp) < CACHE_TTL) {
      console.log('Returning cached sitemap');
      return new Response(sitemapCache.xml, {
        headers: {
          ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all published pages with translations
    const { data: pages, error } = await supabase
      .from('pages')
      .select(`
        slug,
        updated_at,
        translations:page_translations(language, slug)
      `)
      .eq('status', 'published')
      .eq('is_system_page', false);

    if (error) throw error;

    const baseUrl = 'https://mangabeira.net';
    const now = new Date().toISOString().split('T')[0];

    // System pages with their language variants
    const systemPages = [
      // Homepage
      { path: '', priority: '1.0', changefreq: 'weekly', title: 'Home' },
      { path: 'br', priority: '1.0', changefreq: 'weekly', title: 'Home (BR)' },
      { path: 'es', priority: '1.0', changefreq: 'weekly', title: 'Home (ES)' },
      
      // Publications hub
      { path: 'publications', priority: '0.9', changefreq: 'daily', title: 'Publications' },
      { path: 'br/artigos', priority: '0.9', changefreq: 'daily', title: 'Artigos (BR)' },
      { path: 'es/articulos', priority: '0.9', changefreq: 'daily', title: 'Artículos (ES)' },
      
      // About pages
      { path: 'about', priority: '0.8', changefreq: 'monthly', title: 'About' },
      { path: 'br/sobre', priority: '0.8', changefreq: 'monthly', title: 'Sobre (BR)' },
      { path: 'es/acerca-de', priority: '0.8', changefreq: 'monthly', title: 'Acerca de (ES)' },
      
      // Privacy policy
      { path: 'privacy-policy', priority: '0.3', changefreq: 'yearly', title: 'Privacy Policy' },
      { path: 'br/politica-de-privacidade', priority: '0.3', changefreq: 'yearly', title: 'Política de Privacidade (BR)' },
      { path: 'es/politica-de-privacidad', priority: '0.3', changefreq: 'yearly', title: 'Política de Privacidad (ES)' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // Add system pages
    for (const page of systemPages) {
      const url = page.path ? `${baseUrl}/${page.path}` : baseUrl;
      xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add dynamic pages from database
    for (const page of pages as Page[]) {
      const lastmod = new Date(page.updated_at).toISOString().split('T')[0];
      const enTranslation = page.translations.find(t => t.language === 'en');
      const brTranslation = page.translations.find(t => t.language === 'br');
      const esTranslation = page.translations.find(t => t.language === 'es');

      const enSlug = enTranslation?.slug || page.slug;
      const brSlug = brTranslation?.slug;
      const esSlug = esTranslation?.slug;

      // Build alternate links only for languages that have translations
      const buildAlternateLinks = () => {
        let links = `    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/${enSlug}"/>`;
        if (brSlug) {
          links += `\n    <xhtml:link rel="alternate" hreflang="pt-BR" href="${baseUrl}/br/${brSlug}"/>`;
        }
        if (esSlug) {
          links += `\n    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/${esSlug}"/>`;
        }
        links += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/${enSlug}"/>`;
        return links;
      };

      const alternateLinks = buildAlternateLinks();

      // English version (always exists)
      xml += `  <url>
    <loc>${baseUrl}/${enSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternateLinks}
  </url>
`;

      // Portuguese version (if translation exists)
      if (brTranslation && brSlug) {
        xml += `  <url>
    <loc>${baseUrl}/br/${brSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternateLinks}
  </url>
`;
      }

      // Spanish version (if translation exists)
      if (esTranslation && esSlug) {
        xml += `  <url>
    <loc>${baseUrl}/es/${esSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternateLinks}
  </url>
`;
      }
    }

    xml += `</urlset>`;

    const totalSystemPages = systemPages.length;
    const totalDynamicPages = pages?.length || 0;
    const totalUrls = totalSystemPages + (totalDynamicPages * 3); // Each dynamic page can have up to 3 language versions
    
    console.log(`Generated sitemap successfully:
    - System pages: ${totalSystemPages}
    - Dynamic pages: ${totalDynamicPages}
    - Total URLs: ~${totalUrls}
    - Cache TTL: ${CACHE_TTL / 1000 / 60} minutes`);

    // Update cache
    sitemapCache = {
      xml,
      timestamp: Date.now(),
    };

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
