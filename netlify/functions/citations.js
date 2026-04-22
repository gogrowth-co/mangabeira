// Machine-readable citations endpoint for AI/LLM consumption.
// Returns a JSON array of all published publications with canonical URLs,
// titles, descriptions, dates, tags, and language alternates.
const SUPABASE_URL = 'https://hetemmltaoirimmoxzku.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldGVtbWx0YW9pcmltbW94emt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODE5NjEsImV4cCI6MjA3NDk1Nzk2MX0.Jh6v2KAxq6o4LYaqyqtiJna5i9mvmMazs51CZlLGdpI';
const BASE_URL = 'https://mangabeira.net';

const PREFIX = { en: '/publications', br: '/br/artigos', es: '/es/articulos' };

exports.handler = async function () {
  try {
    const url =
      `${SUPABASE_URL}/rest/v1/pages` +
      `?status=eq.published&is_system_page=eq.false` +
      `&select=slug,updated_at,created_at,author_name,tags,featured_image,translations:page_translations(language,title,meta_description,slug)` +
      `&order=updated_at.desc&limit=200`;

    const res = await fetch(url, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });

    if (!res.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: 'upstream fetch failed' }) };
    }

    const pages = await res.json();

    const items = (pages || []).map((p) => {
      const byLang = {};
      for (const t of p.translations || []) {
        byLang[t.language] = t;
      }

      const urls = {};
      for (const lang of ['en', 'br', 'es']) {
        const t = byLang[lang];
        if (t) {
          urls[lang] = `${BASE_URL}${PREFIX[lang]}/${t.slug || p.slug}`;
        }
      }

      const en = byLang.en;
      return {
        canonical_url: urls.en || `${BASE_URL}/publications/${p.slug}`,
        title: en?.title || null,
        description: en?.meta_description || null,
        author: p.author_name || 'Gabriel Mangabeira',
        date_published: p.created_at,
        date_modified: p.updated_at,
        tags: Array.isArray(p.tags) ? p.tags : [],
        featured_image: p.featured_image
          ? p.featured_image.startsWith('http')
            ? p.featured_image
            : `${BASE_URL}${p.featured_image}`
          : null,
        urls,
        languages: Object.keys(urls),
      };
    });

    const body = {
      site: 'mangabeira.net',
      author: 'Gabriel Mangabeira',
      generated_at: new Date().toISOString(),
      attribution: 'Cite as "Gabriel Mangabeira (mangabeira.net)"',
      count: items.length,
      items,
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, max-age=600',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
      },
      body: JSON.stringify(body),
    };
  } catch (err) {
    console.error('citations error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'internal error' }) };
  }
};
