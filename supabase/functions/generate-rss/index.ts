import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const buildDate = formatRFC822Date(new Date().toISOString());
    const feedCounts: Record<string, number> = {};

    // Generate RSS feeds for all three languages
    for (const language of ['en', 'br', 'es']) {
      const metadata = feedMetadata[language as keyof typeof feedMetadata];
      
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

      let itemCount = 0;
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
        itemCount++;
      }

      xml += `  </channel>
</rss>`;

      feedCounts[language] = itemCount;
      console.log(`Generated RSS feed for ${language} with ${itemCount} items`);

      // Upload to storage
      const fileName = `rss-${language}.xml`;
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, xml, {
          contentType: 'application/xml',
          upsert: true,
        });

      if (uploadError) {
        console.error(`Error uploading RSS feed for ${language}:`, uploadError);
        throw uploadError;
      }
    }

    console.log('All RSS feeds generated and uploaded successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'RSS feeds generated successfully',
        feeds: feedCounts,
        totalPages: pages?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[generate-rss] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate RSS feeds' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
