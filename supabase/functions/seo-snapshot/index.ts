// seo-snapshot v2.1 — self-healing: generates missing publication snapshots on-demand
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const BASE_URL = "https://mangabeira.net";
const FALLBACK_OG =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/vPREpio8p8h1iruSSNkQMQeWPo62/social-images/social-1759804725149-og-mangabeira.png";

function normalizePath(raw: string): string {
  let p = (raw || "/").trim();
  if (!p.startsWith("/")) p = "/" + p;
  p = p.split("?")[0].split("#")[0];
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  if (p.includes("..")) p = "/";
  return p;
}

function pathToObjectKey(p: string): string {
  if (p === "/") return "index.html";
  return p.replace(/^\//, "") + "/index.html";
}

const REDIRECTS: Record<string, string> = {
  "/es/articulos/estudo-de-caso-defi-avici":
    "/es/articulos/estudio-de-caso-defi-avici",
  "/br/artigos/defi-gtm-checklist":
    "/br/artigos/checklist-go-to-market-defi",
  "/es/articulos/defi-gtm-checklist":
    "/es/articulos/lista-verificacion-gtm-defi",
};

function parsePubPath(
  path: string
): { locale: "en" | "br" | "es"; slug: string } | null {
  if (path.startsWith("/publications/")) {
    const slug = path.slice("/publications/".length).replace(/\/$/, "");
    return slug ? { locale: "en", slug } : null;
  }
  if (path.startsWith("/br/artigos/")) {
    const slug = path.slice("/br/artigos/".length).replace(/\/$/, "");
    return slug ? { locale: "br", slug } : null;
  }
  if (path.startsWith("/es/articulos/")) {
    const slug = path.slice("/es/articulos/".length).replace(/\/$/, "");
    return slug ? { locale: "es", slug } : null;
  }
  return null;
}

function localeToUrl(lang: string, slug: string): string {
  if (lang === "en") return `${BASE_URL}/publications/${slug}`;
  if (lang === "br") return `${BASE_URL}/br/artigos/${slug}`;
  return `${BASE_URL}/es/articulos/${slug}`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function generatePublicationSnapshot(
  supabase: ReturnType<typeof createClient>,
  locale: "en" | "br" | "es",
  slug: string
): Promise<string | null> {
  const { data: tr, error: trErr } = await supabase
    .from("page_translations")
    .select("title, meta_description, content, language, slug, page_id")
    .eq("slug", slug)
    .eq("language", locale)
    .maybeSingle();

  if (trErr || !tr) return null;

  const { data: page, error: pageErr } = await supabase
    .from("pages")
    .select("featured_image, status")
    .eq("id", tr.page_id)
    .eq("status", "published")
    .maybeSingle();

  if (pageErr || !page) return null;

  const { data: allTrs } = await supabase
    .from("page_translations")
    .select("language, slug")
    .eq("page_id", tr.page_id);

  const slugMap: Record<string, string> = {};
  for (const t of allTrs || []) slugMap[t.language] = t.slug;

  const canonical = localeToUrl(locale, slug);
  const htmlLang =
    locale === "br" ? "pt-BR" : locale === "es" ? "es" : "en";

  const altLinks: string[] = [];
  if (slugMap.en)
    altLinks.push(
      `<link rel="alternate" hreflang="en" href="${localeToUrl("en", slugMap.en)}" />`
    );
  if (slugMap.br)
    altLinks.push(
      `<link rel="alternate" hreflang="pt-BR" href="${localeToUrl("br", slugMap.br)}" />`
    );
  if (slugMap.es)
    altLinks.push(
      `<link rel="alternate" hreflang="es" href="${localeToUrl("es", slugMap.es)}" />`
    );
  if (slugMap.en)
    altLinks.push(
      `<link rel="alternate" hreflang="x-default" href="${localeToUrl("en", slugMap.en)}" />`
    );

  const ogImage = (page as any).featured_image || FALLBACK_OG;
  const title = esc(tr.title || "");
  const description = esc(tr.meta_description || "");

  const sanitized = (tr.content || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "");

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    url: canonical,
    headline: tr.title,
    description: tr.meta_description || "",
    image: ogImage,
    inLanguage: htmlLang,
    author: {
      "@type": "Person",
      name: "Gabriel Mangabeira",
      url: BASE_URL,
    },
  }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${canonical}" />
${altLinks.join("\n")}
<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${ogImage}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${ogImage}" />
<script type="application/ld+json">${schema}</script>
</head>
<body>
<article>
${sanitized}
</article>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const requested = normalizePath(url.searchParams.get("path") || "/");

    // Permanent redirect check
    if (REDIRECTS[requested]) {
      const target = REDIRECTS[requested];
      return new Response(null, {
        status: 301,
        headers: {
          ...corsHeaders,
          Location: `${BASE_URL}${target}`,
          "Cache-Control": "public, max-age=300, s-maxage=86400",
        },
      });
    }

    const objectKey = pathToObjectKey(requested);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Try storage first (fast path)
    const { data, error } = await supabase.storage
      .from("seo-snapshots")
      .download(objectKey);

    if (!error && data) {
      const html = await data.text();
      return new Response(html, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300, s-maxage=86400",
          "X-Snapshot-Path": requested,
          "X-Snapshot-Source": "storage",
        },
      });
    }

    // 2. Self-heal: generate missing publication snapshot from DB
    const parsed = parsePubPath(requested);
    if (parsed) {
      const generated = await generatePublicationSnapshot(
        supabase,
        parsed.locale,
        parsed.slug
      );
      if (generated) {
        // Upload async so next request hits storage
        supabase.storage
          .from("seo-snapshots")
          .upload(objectKey, new Blob([generated], { type: "text/html" }), {
            contentType: "text/html; charset=utf-8",
            upsert: true,
            cacheControl: "300",
          });

        return new Response(generated, {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=60",
            "X-Snapshot-Path": requested,
            "X-Snapshot-Source": "generated",
          },
        });
      }
    }

    // 3. Not found
    return new Response(
      JSON.stringify({ error: "snapshot_not_found", path: requested }),
      {
        status: 404,
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
