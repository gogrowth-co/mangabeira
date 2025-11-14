import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory cache for each language
const rssCache: Record<string, { xml: string; timestamp: number }> = {};
const CACHE_TTL = 3600000; // 1 hour in milliseconds

const BASE_URL = 'https://mangabeira.net';

interface Translation {
  title: string;
  meta_description: string | null;
  content: string | null;
  slug: string | null;
}

interface Page {
  slug: string;
  updated_at: string;
  created_at: string;
  author_name: string | null;
  translations: Translation[];
}

const feedMetadata = {
  en: {
    title: 'Mangabeira.net - Web3 Growth Marketing',
    description: 'Expert insights on Web3, DeFi, and tokenomics',
    language: 'en-US',
    pathPrefix: '/publications',
  },
  br: {
    title: 'Mangabeira.net - Marketing de Crescimento Web3',
    description: 'Insights especializados em Web3, DeFi e tokenomics',
    language: 'pt-BR',
    pathPrefix: '/br/artigos',
  },
  es: {
    title: 'Mangabeira.net - Marketing de Crecimiento Web3',
    description: 'Perspectivas expertas sobre Web3, DeFi y tokenomics',
    language: 'es-ES',
    pathPrefix: '/es/articulos',
  },
};

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRFC822Date(dateString: string): string {
  const date = new Date(dateString);
  return date.toUTCString();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get language from query parameters (default to 'en')
    const url = new URL(req.url);
    const language = url.searchParams.get('lang') || 'en';
    
    // Validate language
    if (!['en', 'br', 'es'].includes(language)) {
      return new Response(
        JSON.stringify({ error: 'Invalid language. Use: en, br, or es' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check cache first
    const now = Date.now();
    if (rssCache[language] && (now - rssCache[language].timestamp) < CACHE_TTL) {
      console.log(`Returning cached RSS feed for language: ${language}`);
      return new Response(rssCache[language].xml, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch published pages with translations
    const { data: pages, error } = await supabase
      .from('pages')
      .select(`
        slug,
        updated_at,
        created_at,
        author_name,
        translations:page_translations(
          title,
          meta_description,
          content,
          slug,
          language
        )
      `)
      .eq('status', 'published')
      .eq('is_system_page', false)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const metadata = feedMetadata[language as keyof typeof feedMetadata];
    const buildDate = formatRFC822Date(new Date().toISOString());

    // Start RSS XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(metadata.title)}</title>
    <link>${BASE_URL}${metadata.pathPrefix}</link>
    <description>${escapeXml(metadata.description)}</description>
    <language>${metadata.language}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss/${language}.xml" rel="self" type="application/rss+xml" />
`;

    // Add items
    for (const page of (pages as Page[]) || []) {
      // Find translation for requested language
      const translation = page.translations.find(t => t.language === language);
      
      // Skip if no translation exists for this language
      if (!translation || !translation.slug) continue;

      const title = translation.title;
      const description = translation.meta_description || '';
      const content = translation.content || '';
      const slug = translation.slug;
      const link = `${BASE_URL}${metadata.pathPrefix}/${slug}`;
      const pubDate = formatRFC822Date(page.updated_at);
      const author = page.author_name || 'Gabriel Mangabeira';

      xml += `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(description)}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(author)}</author>
    </item>
`;
    }

    xml += `  </channel>
</rss>`;

    console.log(`Generated RSS feed for ${language} with ${pages?.length || 0} items`);

    // Update cache
    rssCache[language] = {
      xml,
      timestamp: Date.now(),
    };

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
