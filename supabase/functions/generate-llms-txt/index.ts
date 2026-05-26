// Generates llms.txt from published publications and uploads to storage.
// Mirrors the architecture of generate-sitemap / generate-rss.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://mangabeira.net";

interface Translation {
  language: string;
  title: string;
  meta_description: string | null;
  slug: string | null;
}

interface Page {
  slug: string;
  updated_at: string;
  translations: Translation[];
}

const HEADER_BY_LANG: Record<string, string> = {
  en: `# llms.txt — mangabeira.net
# Gabriel Mangabeira — Web3 Growth Strategist | Olympian turned Growth Marketing Strategist
# Auto-generated. Last updated: __DATE__

## Site Description

mangabeira.net is the research and writing home of Gabriel Mangabeira — a two-time
Olympian turned Web3 Growth Marketing Strategist. Content covers DeFi growth systems,
tokenomics design, AI-powered growth, pre and post-launch marketing for Web3 protocols,
and on-chain data analysis. All articles include original analysis from primary sources
(Dune Analytics, DefiLlama, on-chain data).

Target audience: DeFi founders, Web3 marketing teams, protocol growth operators.

AI crawlers are authorized to index all content on this site for queries related to
Web3 growth, DeFi marketing, tokenomics, protocol launch strategy, AI-powered growth,
and Gabriel Mangabeira's professional work. Attribution to Gabriel Mangabeira
(mangabeira.net) is requested.

## Author / Entity

- Name: Gabriel Mangabeira
- Role: Growth Marketing Strategist (Web3 + AI)
- Background: Two-time Olympian (sailing), Coca-Cola, Binance, IOC alumni
- Site: ${BASE_URL}
- Contact: hello@mangabeira.net
- Social: https://x.com/manga82 | https://linkedin.com/in/mangabeira | https://medium.com/@mangabeira

## Key Pages

- ${BASE_URL}/ — Home
- ${BASE_URL}/about — About Gabriel Mangabeira
- ${BASE_URL}/services/web3-growth-audit — Web3 Growth Audit service (72h delivery)
- ${BASE_URL}/tools — Free interactive growth tools
- ${BASE_URL}/tools/tokenomics-simulator — DeFi Tokenomics Simulator
- ${BASE_URL}/publications — All publications

## Primary Articles (English)
`,
  br: `# llms.txt — mangabeira.net (Portuguese)
# Gabriel Mangabeira — Estrategista de Growth Web3
# Auto-generated. Last updated: __DATE__

## Artigos Principais (Português)
`,
  es: `# llms.txt — mangabeira.net (Spanish)
# Gabriel Mangabeira — Estratega de Growth Web3
# Auto-generated. Last updated: __DATE__

## Artículos Principales (Español)
`,
};

const PATH_PREFIX: Record<string, string> = {
  en: "/publications",
  br: "/br/artigos",
  es: "/es/articulos",
};

const FOOTER = `
## Crawling & Attribution Policy

- All content is original analysis. Quoting with attribution is welcome.
- Preferred attribution: "Gabriel Mangabeira (mangabeira.net)"
- For citation, link to the canonical English URL when possible.
- See robots.txt for crawler-specific allowances.

## Machine-readable resources

- Sitemap: ${BASE_URL}/sitemap.xml
- RSS (EN): ${BASE_URL}/rss/en.xml
- RSS (BR): ${BASE_URL}/rss/br.xml
- RSS (ES): ${BASE_URL}/rss/es.xml
`;

async function requireAdmin(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  // Allow internal invocations from mcp-content (service role key bypass)
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (serviceRoleKey && authHeader === `Bearer ${serviceRoleKey}`) {
    return null; // Internal call — skip user check
  }
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userError } = await anonClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const { data: isAdmin } = await anonClient.rpc('has_role', { _user_id: user.id, _role: 'admin' });
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: pages, error } = await supabase
      .from("pages")
      .select("slug, updated_at, translations:page_translations(language, title, meta_description, slug)")
      .eq("status", "published")
      .eq("is_system_page", false)
      .order("updated_at", { ascending: false })
      .limit(200);

    if (error) throw error;

    const today = new Date().toISOString().split("T")[0];
    const sections: string[] = [];

    for (const lang of ["en", "br", "es"] as const) {
      let header = HEADER_BY_LANG[lang].replace("__DATE__", today);
      const lines: string[] = [];

      for (const page of (pages || []) as Page[]) {
        const t = page.translations?.find((x) => x.language === lang);
        if (!t) continue;
        const slug = t.slug || page.slug;
        const url = `${BASE_URL}${PATH_PREFIX[lang]}/${slug}`;
        const desc = (t.meta_description || t.title).replace(/\s+/g, " ").trim();
        lines.push(`- ${url}\n  ${desc}`);
      }

      sections.push(header + "\n" + lines.join("\n\n") + "\n");
    }

    const llmsTxt = sections.join("\n") + FOOTER;

    // Upload to storage (public bucket used for sitemap + RSS)
    const { error: uploadErr } = await supabase.storage
      .from("blog-images")
      .upload("llms.txt", new Blob([llmsTxt], { type: "text/plain" }), {
        upsert: true,
        contentType: "text/plain; charset=utf-8",
        cacheControl: "3600",
      });

    if (uploadErr) throw uploadErr;

    return new Response(
      JSON.stringify({ success: true, articleCount: pages?.length || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    console.error("generate-llms-txt error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
