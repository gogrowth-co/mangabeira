// Regenerates per-route SEO snapshots in the `seo-snapshots` storage bucket
// for a single page (all of its locales). Called from MCP upsert_page on
// publish, and from the admin publish flow.
//
// The bootstrap script in index.html only swaps:
//   - <title>
//   - head meta (title/description/canonical/alternate/og/twitter)
//   - JSON-LD <script type="application/ld+json">
//   - the [data-prerender="true"] body block
//   - <html lang>
//
// So a minimal standalone HTML doc with just those pieces is sufficient for
// crawlers / no-JS clients fetched via the seo-snapshot edge function.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BASE_URL = "https://mangabeira.net";
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;

type Locale = "en" | "br" | "es";
const LOCALE_TO_HUB: Record<Locale, string> = {
  en: "publications",
  br: "br/artigos",
  es: "es/articulos",
};
const HTML_LANG: Record<Locale, string> = {
  en: "en",
  br: "pt-BR",
  es: "es-ES",
};

const escapeHtml = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function sanitizePublicationHtml(html: string, max = 6000): string {
  let cleaned = String(html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sclass="[^"]*"/gi, "");
  if (cleaned.length > max) cleaned = cleaned.slice(0, max) + "…";
  return cleaned;
}

interface SnapshotSpec {
  outPath: string;
  locale: Locale;
  canonical: string;
  alternates: { en?: string; "pt-BR"?: string; es?: string };
  title: string;
  description: string;
  ogImage: string;
  content: string;
  featuredImage?: string;
  datePublished?: string;
  dateModified?: string;
  readTime?: number;
}

const AUTHOR_STRINGS: Record<Locale, { byline: string; readSuffix: string; localeFmt: string }> = {
  en: { byline: 'By <a href="/about" style="color:#0A2540;font-weight:600;text-decoration:none;">Gabriel Mangabeira</a> — Web3 growth consultant, ex-Olympic athlete', readSuffix: "min read", localeFmt: "en-US" },
  br: { byline: 'Por <a href="/about" style="color:#0A2540;font-weight:600;text-decoration:none;">Gabriel Mangabeira</a> — Consultor de growth Web3, ex-atleta olímpico', readSuffix: "min de leitura", localeFmt: "pt-BR" },
  es: { byline: 'Por <a href="/about" style="color:#0A2540;font-weight:600;text-decoration:none;">Gabriel Mangabeira</a> — Consultor de growth Web3, ex-atleta olímpico', readSuffix: "min de lectura", localeFmt: "es-ES" },
};

function fmtDate(iso: string | undefined, localeFmt: string): string {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString(localeFmt, { year: "numeric", month: "short", day: "numeric" }); }
  catch { return iso; }
}

function buildHead(spec: SnapshotSpec): string {
  const lang = HTML_LANG[spec.locale];
  const altLinks = [
    spec.alternates.en
      ? `<link rel="alternate" hreflang="en" href="${spec.alternates.en}" />`
      : "",
    spec.alternates["pt-BR"]
      ? `<link rel="alternate" hreflang="pt-BR" href="${spec.alternates["pt-BR"]}" />`
      : "",
    spec.alternates.es
      ? `<link rel="alternate" hreflang="es" href="${spec.alternates.es}" />`
      : "",
    spec.alternates.en
      ? `<link rel="alternate" hreflang="x-default" href="${spec.alternates.en}" />`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    url: spec.canonical,
    name: spec.title,
    headline: spec.title,
    description: spec.description,
    inLanguage: lang,
    image: spec.ogImage,
    isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Mangabeira.net" },
    author: { "@type": "Person", name: "Gabriel Mangabeira", url: BASE_URL },
  };

  return `<title>${escapeHtml(spec.title)}</title>
    <meta name="title" content="${escapeHtml(spec.title)}" />
    <meta name="description" content="${escapeHtml(spec.description)}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${spec.canonical}" />
    ${altLinks}
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Gabriel Mangabeira" />
    <meta property="og:title" content="${escapeHtml(spec.title)}" />
    <meta property="og:description" content="${escapeHtml(spec.description)}" />
    <meta property="og:url" content="${spec.canonical}" />
    <meta property="og:image" content="${spec.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="${lang.replace("-", "_")}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@manga82" />
    <meta name="twitter:creator" content="@manga82" />
    <meta name="twitter:title" content="${escapeHtml(spec.title)}" />
    <meta name="twitter:description" content="${escapeHtml(spec.description)}" />
    <meta name="twitter:image" content="${spec.ogImage}" />
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
}

function buildBody(spec: SnapshotSpec): string {
  const cleaned = sanitizePublicationHtml(spec.content);
  const img = spec.featuredImage;
  const article = `
    <article>
      ${img ? `<p><img src="${img}" alt="${escapeHtml(spec.title)}" style="max-width:100%;height:auto;" /></p>` : ""}
      ${cleaned || `<p>${escapeHtml(spec.description)}</p>`}
      <p><a href="${spec.canonical}">Read the full article</a></p>
    </article>`;

  return `<header>
      <p style="margin:0 0 8px;font-size:14px;color:#1FB6FF;font-weight:600;letter-spacing:.04em;text-transform:uppercase;">Gabriel Mangabeira — Mangabeira.net</p>
      <h1 style="font-family:Poppins,sans-serif;font-size:40px;line-height:1.15;margin:0 0 16px;color:#0A2540;">${escapeHtml(spec.title)}</h1>
      <p style="font-size:18px;margin:0 0 24px;">${escapeHtml(spec.description)}</p>
    </header>
${article}
    <footer style="margin-top:32px;border-top:1px solid #EAF6FA;padding-top:16px;font-size:14px;color:#333;">
      <p>© Gabriel Mangabeira — <a href="${BASE_URL}/">mangabeira.net</a></p>
    </footer>`;
}

function buildFullHtml(spec: SnapshotSpec): string {
  return `<!doctype html>
<html lang="${HTML_LANG[spec.locale]}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${buildHead(spec)}
  </head>
  <body>
    <div data-prerender="true">
      <div>
${buildBody(spec)}
      </div>
    </div>
    <noscript>
      <div style="font-family:Inter,system-ui,sans-serif;max-width:920px;margin:0 auto;padding:32px 20px;color:#0A2540;line-height:1.6;">
${buildBody(spec)}
      </div>
    </noscript>
  </body>
</html>`;
}

async function requireAdmin(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { slug } = await req.json().catch(() => ({}));
    if (!slug || typeof slug !== "string") {
      return new Response(JSON.stringify({ error: "missing_slug" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: page, error: fetchErr } = await supabase
      .from("pages")
      .select(
        "slug, status, is_system_page, featured_image, page_translations(language, title, meta_description, slug, content)"
      )
      .eq("slug", slug)
      .maybeSingle();

    if (fetchErr) {
      return new Response(
        JSON.stringify({ error: "db_error", message: fetchErr.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (!page) {
      return new Response(JSON.stringify({ error: "page_not_found", slug }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (page.is_system_page) {
      return new Response(
        JSON.stringify({
          skipped: true,
          reason: "system_page_built_at_deploy_time",
          slug,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (page.status !== "published") {
      // Remove any stale snapshots for unpublished page
      const removals: string[] = [];
      const trList = (page as any).page_translations || [];
      const trMap = new Map<string, any>();
      for (const tr of trList) trMap.set(tr.language, tr);
      for (const locale of ["en", "br", "es"] as Locale[]) {
        const tr =
          trMap.get(locale) ||
          trMap.get(locale === "br" ? "pt-BR" : locale === "es" ? "es-ES" : "en");
        if (!tr) continue;
        const localizedSlug = tr.slug || page.slug;
        removals.push(`${LOCALE_TO_HUB[locale]}/${localizedSlug}/index.html`);
      }
      if (removals.length > 0) {
        await supabase.storage.from("seo-snapshots").remove(removals);
      }
      return new Response(
        JSON.stringify({ removed: removals, status: page.status }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build alternates map
    const trList = (page as any).page_translations || [];
    const trMap = new Map<string, any>();
    for (const tr of trList) trMap.set(tr.language, tr);
    const enTr = trMap.get("en");
    const brTr = trMap.get("pt-BR") || trMap.get("br");
    const esTr = trMap.get("es-ES") || trMap.get("es");
    const alternates: SnapshotSpec["alternates"] = {};
    if (enTr) alternates.en = `${BASE_URL}/publications/${enTr.slug || page.slug}`;
    if (brTr)
      alternates["pt-BR"] = `${BASE_URL}/br/artigos/${brTr.slug || page.slug}`;
    if (esTr)
      alternates.es = `${BASE_URL}/es/articulos/${esTr.slug || page.slug}`;

    const uploaded: string[] = [];
    const errors: { locale: Locale; message: string }[] = [];

    for (const locale of ["en", "br", "es"] as Locale[]) {
      const langKey =
        locale === "en" ? "en" : locale === "br" ? "pt-BR" : "es-ES";
      const tr = trMap.get(langKey) || trMap.get(locale);
      if (!tr) continue;
      const localizedSlug = tr.slug || page.slug;
      const outPath = `${LOCALE_TO_HUB[locale]}/${localizedSlug}`;
      const spec: SnapshotSpec = {
        outPath,
        locale,
        canonical: `${BASE_URL}/${outPath}`,
        alternates,
        title: tr.title || "Publication",
        description: tr.meta_description || "",
        ogImage: (page as any).featured_image || OG_IMAGE,
        content: tr.content || "",
        featuredImage: (page as any).featured_image || undefined,
      };
      const html = buildFullHtml(spec);
      const key = `${outPath}/index.html`;
      const { error: upErr } = await supabase.storage
        .from("seo-snapshots")
        .upload(key, new Blob([html], { type: "text/html; charset=utf-8" }), {
          contentType: "text/html; charset=utf-8",
          upsert: true,
        });
      if (upErr) errors.push({ locale, message: upErr.message });
      else uploaded.push(key);
    }

    return new Response(
      JSON.stringify({ success: errors.length === 0, slug, uploaded, errors }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "server_error", message: String(e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
