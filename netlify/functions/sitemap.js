const { createClient } = require('@supabase/supabase-js');

const BASE_URL = 'https://mangabeira.net';

const systemPages = [
  { path: '', priority: '1.0', changefreq: 'weekly', group: 'home' },
  { path: 'br', priority: '1.0', changefreq: 'weekly', group: 'home' },
  { path: 'es', priority: '1.0', changefreq: 'weekly', group: 'home' },
  { path: 'publications', priority: '0.9', changefreq: 'weekly', group: 'publications' },
  { path: 'br/artigos', priority: '0.9', changefreq: 'weekly', group: 'publications' },
  { path: 'es/articulos', priority: '0.9', changefreq: 'weekly', group: 'publications' },
  { path: 'about', priority: '0.9', changefreq: 'monthly', group: 'about' },
  { path: 'br/sobre', priority: '0.9', changefreq: 'monthly', group: 'about' },
  { path: 'es/acerca-de', priority: '0.9', changefreq: 'monthly', group: 'about' },
  { path: 'privacy-policy', priority: '0.3', changefreq: 'yearly', group: 'privacy' },
  { path: 'br/politica-de-privacidade', priority: '0.3', changefreq: 'yearly', group: 'privacy' },
  { path: 'es/politica-de-privacidad', priority: '0.3', changefreq: 'yearly', group: 'privacy' },
];

const hreflangMap = {
  home: { en: '', br: 'br', es: 'es' },
  publications: { en: 'publications', br: 'br/artigos', es: 'es/articulos' },
  about: { en: 'about', br: 'br/sobre', es: 'es/acerca-de' },
  privacy: { en: 'privacy-policy', br: 'br/politica-de-privacidade', es: 'es/politica-de-privacidad' },
};

function buildHreflang(paths) {
  const enUrl = paths.en ? `${BASE_URL}/${paths.en}` : BASE_URL;
  return [
    `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>`,
    `    <xhtml:link rel="alternate" hreflang="pt-BR" href="${BASE_URL}/${paths.br}"/>`,
    `    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/${paths.es}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>`,
  ].join('\n');
}

exports.handler = async function () {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { statusCode: 500, body: 'Missing environment variables' };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: pages, error } = await supabase
      .from('pages')
      .select('slug, updated_at, translations:page_translations(language, slug)')
      .eq('status', 'published')
      .eq('is_system_page', false);

    if (error) throw error;

    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // System pages
    for (const page of systemPages) {
      const url = page.path ? `${BASE_URL}/${page.path}` : BASE_URL;
      const hreflang = buildHreflang(hreflangMap[page.group]);
      xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${hreflang}
  </url>
`;
    }

    // Dynamic publication pages
    for (const page of pages || []) {
      const lastmod = new Date(page.updated_at).toISOString().split('T')[0];
      const enT = page.translations.find((t) => t.language === 'en');
      const brT = page.translations.find((t) => t.language === 'br');
      const esT = page.translations.find((t) => t.language === 'es');

      const enSlug = enT?.slug?.trim() || page.slug;
      const brSlug = brT?.slug?.trim();
      const esSlug = esT?.slug?.trim();

      // Build alternate links
      let alternates = `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/publications/${enSlug}"/>`;
      if (brSlug) alternates += `\n    <xhtml:link rel="alternate" hreflang="pt-BR" href="${BASE_URL}/br/artigos/${brSlug}"/>`;
      if (esSlug) alternates += `\n    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/articulos/${esSlug}"/>`;
      alternates += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/publications/${enSlug}"/>`;

      // English (always)
      xml += `  <url>
    <loc>${BASE_URL}/publications/${enSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternates}
  </url>
`;

      // Portuguese
      if (brSlug) {
        xml += `  <url>
    <loc>${BASE_URL}/br/artigos/${brSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternates}
  </url>
`;
      }

      // Spanish
      if (esSlug) {
        xml += `  <url>
    <loc>${BASE_URL}/es/articulos/${esSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternates}
  </url>
`;
      }
    }

    xml += `</urlset>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, max-age=600',
        'X-Content-Type-Options': 'nosniff',
      },
      body: xml,
    };
  } catch (err) {
    console.error('Sitemap generation error:', err);
    return { statusCode: 500, body: 'Failed to generate sitemap' };
  }
};
