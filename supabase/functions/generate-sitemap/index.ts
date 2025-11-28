import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log(`[generate-sitemap] Query returned ${pages?.length || 0} published pages`);
    if (pages) {
      console.log(`[generate-sitemap] Page slugs: ${pages.map(p => p.slug).join(', ')}`);
    }

    const baseUrl = 'https://mangabeira.net';
    const today = new Date().toISOString().split('T')[0];

    // System pages with their language variants
    // NOTE: Publications hub uses /artigos (BR) and /articulos (ES), not /publicacoes or /publicaciones
    const systemPages = [
      // Homepage
      { path: '', priority: '1.0', changefreq: 'weekly', title: 'Home' },
      { path: 'br', priority: '1.0', changefreq: 'weekly', title: 'Home (BR)' },
      { path: 'es', priority: '1.0', changefreq: 'weekly', title: 'Home (ES)' },
      
      // Publications hub - CORRECT URL STRUCTURE
      { path: 'publications', priority: '0.9', changefreq: 'weekly', title: 'Publications' },
      { path: 'br/artigos', priority: '0.9', changefreq: 'weekly', title: 'Artigos (BR)' },
      { path: 'es/articulos', priority: '0.9', changefreq: 'weekly', title: 'Artículos (ES)' },
      
      // About pages
      { path: 'about', priority: '0.9', changefreq: 'monthly', title: 'About' },
      { path: 'br/sobre', priority: '0.9', changefreq: 'monthly', title: 'Sobre (BR)' },
      { path: 'es/acerca-de', priority: '0.9', changefreq: 'monthly', title: 'Acerca de (ES)' },
      
      // Privacy policy
      { path: 'privacy-policy', priority: '0.3', changefreq: 'yearly', title: 'Privacy Policy' },
      { path: 'br/politica-de-privacidade', priority: '0.3', changefreq: 'yearly', title: 'Política de Privacidade (BR)' },
      { path: 'es/politica-de-privacidad', priority: '0.3', changefreq: 'yearly', title: 'Política de Privacidad (ES)' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // Helper to build hreflang links for system pages
    const buildSystemHreflang = (basePath: string) => {
      const pathMap: Record<string, { en: string; br: string; es: string }> = {
        'home': { en: '', br: 'br', es: 'es' },
        'publications': { en: 'publications', br: 'br/artigos', es: 'es/articulos' },
        'about': { en: 'about', br: 'br/sobre', es: 'es/acerca-de' },
        'privacy': { en: 'privacy-policy', br: 'br/politica-de-privacidade', es: 'es/politica-de-privacidad' }
      };
      
      let pageType = 'home';
      if (basePath.includes('publication') || basePath.includes('artigos') || basePath.includes('articulos')) pageType = 'publications';
      else if (basePath.includes('about') || basePath.includes('sobre') || basePath.includes('acerca')) pageType = 'about';
      else if (basePath.includes('privacy') || basePath.includes('privacidade') || basePath.includes('privacidad')) pageType = 'privacy';
      
      const paths = pathMap[pageType];
      const enUrl = paths.en ? `${baseUrl}/${paths.en}` : baseUrl;
      const brUrl = `${baseUrl}/${paths.br}`;
      const esUrl = `${baseUrl}/${paths.es}`;
      
      return `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${brUrl}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>`;
    };

    // Add system pages with proper hreflang
    for (const page of systemPages) {
      const url = page.path ? `${baseUrl}/${page.path}` : baseUrl;
      const hreflang = buildSystemHreflang(page.path);
      xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${hreflang}
  </url>
`;
    }

    // Add dynamic pages from database
    for (const page of pages as Page[]) {
      const lastmod = new Date(page.updated_at).toISOString().split('T')[0];
      const enTranslation = page.translations.find(t => t.language === 'en');
      const brTranslation = page.translations.find(t => t.language === 'br');
      const esTranslation = page.translations.find(t => t.language === 'es');

      const enSlug = enTranslation?.slug?.trim() || page.slug;
      const brSlug = brTranslation?.slug?.trim();
      const esSlug = esTranslation?.slug?.trim();

      // Build alternate links - CRITICAL: Include x-default and only existing translations
      const buildAlternateLinks = () => {
        let links = `    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/publications/${enSlug}"/>`;
        if (brSlug) {
          links += `\n    <xhtml:link rel="alternate" hreflang="pt-BR" href="${baseUrl}/br/artigos/${brSlug}"/>`;
        }
        if (esSlug) {
          links += `\n    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/articulos/${esSlug}"/>`;
        }
        // x-default ALWAYS points to English version (primary language)
        links += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/publications/${enSlug}"/>`;
        return links;
      };

      const alternateLinks = buildAlternateLinks();

      // English version (always exists)
      xml += `  <url>
    <loc>${baseUrl}/publications/${enSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternateLinks}
  </url>
`;

      // Portuguese version (if translation exists)
      if (brTranslation && brSlug) {
        xml += `  <url>
    <loc>${baseUrl}/br/artigos/${brSlug}</loc>
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
    <loc>${baseUrl}/es/articulos/${esSlug}</loc>
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
    - Total URLs: ~${totalUrls}`);

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
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
