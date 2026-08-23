// seo-snapshot v3.0
//
// Serves bot-facing HTML for publication routes. The Cloudflare Worker
// (cloudflare-worker.js) routes any request with a bot UA + `Accept: text/html`
// here, so THIS is what Googlebot, Bingbot, GPTBot, ClaudeBot and
// PerplexityBot actually read. Humans never see it.
//
// v3.0 (2026-08-23) — fixes the incident described in _shared/snapshot-html.ts:
//   1. Snapshot HTML is now built ONLY by the shared canonical builder, so the
//      self-heal path can no longer emit a thinner page than the publish path.
//      The old inline generator produced `<body><article>{content}</article>`
//      with no <h1>, no internal links and a minimal Article schema, and then
//      uploaded that over the good object in storage.
//   2. Every upload is gated by validateSnapshot(). A snapshot that fails
//      never reaches the bucket.
//   3. Storage reads are validated too. A previously-poisoned object is
//      detected on read and regenerated in place, so the bucket heals itself
//      without a manual bulk pass.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  BASE_URL,
  LOCALE_TO_HUB,
  buildFullHtml,
  validateSnapshot,
  type Locale,
  type SnapshotSpec,
} from "../_shared/snapshot-html.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

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
  "/es/articulos/web3-seo-guia-definitivo":
    "/es/articulos/web3-seo-guia-definitiva",
};

function parsePubPath(path: string): { locale: Locale; slug: string } | null {
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
  if (lang === "br" || lang === "pt-BR") return `${BASE_URL}/br/artigos/${slug}`;
  return `${BASE_URL}/es/articulos/${slug}`;
}

async function generatePublicationSnapshot(
  supabase: any,
  locale: Locale,
  slug: string
): Promise<{ html: string; canonical: string } | null> {
  let { data: tr, error: trErr } = await supabase
    .from("page_translations")
    .select("title, meta_description, content, language, slug, page_id")
    .eq("slug", slug)
    .eq("language", locale)
    .maybeSingle();

  // The URL may use the canonical pages.slug while the translation row carries
  // a different localized slug.
  if (!tr) {
    const { data: pageBySlug } = await supabase
      .from("pages")
      .select("id")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (pageBySlug) {
      const res = await supabase
        .from("page_translations")
        .select("title, meta_description, content, language, slug, page_id")
        .eq("page_id", (pageBySlug as any).id)
        .eq("language", locale)
        .maybeSingle();
      tr = res.data;
      trErr = res.error;
    }
  }

  if (trErr || !tr) return null;

  const { data: page, error: pageErr } = await supabase
    .from("pages")
    .select("featured_image, status, created_at, updated_at, reading_time")
    .eq("id", (tr as any).page_id)
    .eq("status", "published")
    .maybeSingle();

  if (pageErr || !page) return null;

  const { data: allTrs } = await supabase
    .from("page_translations")
    .select("language, slug")
    .eq("page_id", (tr as any).page_id);

  const slugMap: Record<string, string> = {};
  for (const t of (allTrs as any[]) || []) slugMap[t.language] = t.slug;

  const alternates: SnapshotSpec["alternates"] = {};
  if (slugMap.en) alternates.en = localeToUrl("en", slugMap.en);
  const brSlug = slugMap.br || slugMap["pt-BR"];
  if (brSlug) alternates["pt-BR"] = localeToUrl("br", brSlug);
  const esSlug = slugMap.es || slugMap["es-ES"];
  if (esSlug) alternates.es = localeToUrl("es", esSlug);

  const p = page as any;
  const featured = /^https?:\/\//.test(p.featured_image || "")
    ? p.featured_image
    : undefined;
  const canonical = localeToUrl(locale, slug);

  const spec: SnapshotSpec = {
    outPath: `${LOCALE_TO_HUB[locale]}/${slug}`,
    locale,
    canonical,
    alternates,
    title: (tr as any).title || "Publication",
    description: (tr as any).meta_description || "",
    ogImage: featured || FALLBACK_OG,
    content: (tr as any).content || "",
    featuredImage: featured,
    datePublished: p.created_at,
    dateModified: p.updated_at,
    readTime:
      typeof p.reading_time === "number" && p.reading_time > 0
        ? p.reading_time
        : undefined,
  };

  return { html: buildFullHtml(spec), canonical };
}

/** Upload only if the HTML passes validation. Returns whether it was stored. */
async function safeUpload(
  supabase: any,
  objectKey: string,
  html: string,
  canonical: string
): Promise<boolean> {
  const v = validateSnapshot(html, canonical);
  if (!v.ok) {
    console.error(
      `REFUSED snapshot upload for ${objectKey}: ${v.problems.join("; ")}`
    );
    return false;
  }
  const { error } = await supabase.storage
    .from("seo-snapshots")
    .upload(objectKey, new Blob([html], { type: "text/html" }), {
      contentType: "text/html; charset=utf-8",
      upsert: true,
      cacheControl: "300",
    });
  if (error) console.error(`snapshot upload failed for ${objectKey}:`, error.message);
  return !error;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const requested = normalizePath(url.searchParams.get("path") || "/");

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
    const parsed = parsePubPath(requested);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const forceRefresh = url.searchParams.get("refresh") === "1";

    if (forceRefresh && parsed) {
      const gen = await generatePublicationSnapshot(supabase, parsed.locale, parsed.slug);
      if (gen) {
        const stored = await safeUpload(supabase, objectKey, gen.html, gen.canonical);
        return new Response(gen.html, {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Snapshot-Source": stored ? "refreshed" : "refreshed-unstored",
          },
        });
      }
    }

    // 1. Storage fast path — but verify what we found is not a poisoned object.
    const { data, error } = await supabase.storage
      .from("seo-snapshots")
      .download(objectKey);

    if (!error && data) {
      const html = await data.text();
      const expected = parsed ? localeToUrl(parsed.locale, parsed.slug) : "";
      const check = parsed ? validateSnapshot(html, expected) : { ok: true, problems: [] };

      if (check.ok) {
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

      // Poisoned or stale-format object: rebuild in place.
      console.warn(
        `stored snapshot invalid for ${objectKey}: ${check.problems.join("; ")} — regenerating`
      );
      if (parsed) {
        const gen = await generatePublicationSnapshot(supabase, parsed.locale, parsed.slug);
        if (gen) {
          const stored = await safeUpload(supabase, objectKey, gen.html, gen.canonical);
          return new Response(gen.html, {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "public, max-age=60",
              "X-Snapshot-Path": requested,
              "X-Snapshot-Source": stored ? "self-healed" : "self-healed-unstored",
            },
          });
        }
      }

      // Could not rebuild: serving a known-bad snapshot is worse than nothing,
      // but it still beats a 404 on a live article. Serve it, flagged.
      return new Response(html, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Snapshot-Path": requested,
          "X-Snapshot-Source": "storage-invalid",
        },
      });
    }

    // 2. Self-heal: generate a missing snapshot from the DB.
    if (parsed) {
      const gen = await generatePublicationSnapshot(supabase, parsed.locale, parsed.slug);
      if (gen) {
        const stored = await safeUpload(supabase, objectKey, gen.html, gen.canonical);
        return new Response(gen.html, {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=60",
            "X-Snapshot-Path": requested,
            "X-Snapshot-Source": stored ? "generated" : "generated-unstored",
          },
        });
      }
    }

    // 3. Not found — the Worker turns this into a real 404.
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
