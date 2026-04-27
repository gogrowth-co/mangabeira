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
    title: string | null;
  }[];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanSlug(slug: string | null | undefined): string | null {
  const trimmed = slug?.trim();
  return trimmed ? trimmed : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[generate-sitemap] Starting sitemap generation...');

    // Fetch all published pages with translations
    const { data: pages, error } = await supabase
      .from('pages')
      .select(`
        slug,
        updated_at,
        translations:page_translations(language, slug, title)
      `)
      .eq('status', 'published')
      .eq('is_system_page', false)
      .order('updated_at', { ascending: false });

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
      
      // Tools hub
      { path: 'tools', priority: '0.8', changefreq: 'monthly', title: 'Tools' },
      { path: 'br/ferramentas', priority: '0.8', changefreq: 'monthly', title: 'Ferramentas (BR)' },
      { path: 'es/herramientas', priority: '0.8', changefreq: 'monthly', title: 'Herramientas (ES)' },
      
      // Tokenomics Simulator
      { path: 'tools/tokenomics-simulator', priority: '0.8', changefreq: 'monthly', title: 'Tokenomics Simulator' },
      { path: 'br/ferramentas/simulador-tokenomics', priority: '0.8', changefreq: 'monthly', title: 'Simulador Tokenomics (BR)' },
      { path: 'es/herramientas/simulador-tokenomics', priority: '0.8', changefreq: 'monthly', title: 'Simulador Tokenomics (ES)' },

      // Web3 Growth Audit service
      { path: 'services/web3-growth-audit', priority: '0.9', changefreq: 'monthly', title: 'Web3 Growth Audit' },
      { path: 'br/servicos/web3-auditoria-de-growth', priority: '0.9', changefreq: 'monthly', title: 'Auditoria de Growth Web3 (BR)' },
      { path: 'es/servicios/web3-auditoria-de-growth', priority: '0.9', changefreq: 'monthly', title: 'Auditoría de Growth Web3 (ES)' },
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
        'privacy': { en: 'privacy-policy', br: 'br/politica-de-privacidade', es: 'es/politica-de-privacidad' },
        'tokenomics': { en: 'tools/tokenomics-simulator', br: 'br/ferramentas/simulador-tokenomics', es: 'es/herramientas/simulador-tokenomics' },
        'tools': { en: 'tools', br: 'br/ferramentas', es: 'es/herramientas' },
        'audit': { en: 'services/web3-growth-audit', br: 'br/servicos/web3-auditoria-de-growth', es: 'es/servicios/web3-auditoria-de-growth' },
      };
      
      let pageType = 'home';
      if (basePath.includes('web3-growth-audit') || basePath.includes('web3-auditoria-de-growth')) pageType = 'audit';
      else if (basePath.includes('tokenomics') || basePath.includes('simulador-tokenomics')) pageType = 'tokenomics';
      else if (basePath.includes('tools') || basePath.includes('ferramentas') || basePath.includes('herramientas')) pageType = 'tools';
      else if (basePath.includes('publication') || basePath.includes('artigos') || basePath.includes('articulos')) pageType = 'publications';
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

    let dynamicUrlCount = 0;

    // Add dynamic pages from database
    for (const page of pages as Page[]) {
      const lastmod = new Date(page.updated_at).toISOString().split('T')[0];
      const enTranslation = page.translations.find(t => t.language === 'en');
      const brTranslation = page.translations.find(t => t.language === 'br');
      const esTranslation = page.translations.find(t => t.language === 'es');

      const enSlug = cleanSlug(enTranslation?.slug) || cleanSlug(page.slug);
      const brSlug = cleanSlug(brTranslation?.slug);
      const esSlug = cleanSlug(esTranslation?.slug);

      if (!enTranslation || !enSlug) {
        console.warn(`[generate-sitemap] Skipping page without English translation/slug: ${page.slug}`);
        continue;
      }

      // Build alternate links - CRITICAL: Include x-default and only existing translations
      const buildAlternateLinks = () => {
        let links = `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(`${baseUrl}/publications/${enSlug}`)}"/>`;
        if (brSlug) {
          links += `\n    <xhtml:link rel="alternate" hreflang="pt-BR" href="${escapeXml(`${baseUrl}/br/artigos/${brSlug}`)}"/>`;
        }
        if (esSlug) {
          links += `\n    <xhtml:link rel="alternate" hreflang="es" href="${escapeXml(`${baseUrl}/es/articulos/${esSlug}`)}"/>`;
        }
        // x-default ALWAYS points to English version (primary language)
        links += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${baseUrl}/publications/${enSlug}`)}"/>`;
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
      dynamicUrlCount++;

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
        dynamicUrlCount++;
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
        dynamicUrlCount++;
      }
    }

    xml += `</urlset>`;

    const totalSystemPages = systemPages.length;
    const totalDynamicPages = pages?.length || 0;
    const totalUrls = totalSystemPages + dynamicUrlCount;
    
    console.log(`[generate-sitemap] Generated sitemap successfully:
    - System pages: ${totalSystemPages}
    - Dynamic pages: ${totalDynamicPages}
    - Dynamic URLs emitted: ${dynamicUrlCount}
    - Total URLs: ${totalUrls}`);

    // Save to storage bucket for serving
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload('sitemap.xml', new Blob([xml], { type: 'application/xml' }), {
        contentType: 'application/xml',
        upsert: true,
      });

    if (uploadError) {
      console.error('[generate-sitemap] Failed to upload to storage:', uploadError);
      throw uploadError;
    }

    console.log('[generate-sitemap] Sitemap saved to storage successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Sitemap generated and saved',
      totalUrls 
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[generate-sitemap] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate sitemap' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
