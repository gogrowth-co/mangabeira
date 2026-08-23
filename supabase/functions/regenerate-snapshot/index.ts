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
import {
  BASE_URL,
  LOCALE_TO_HUB,
  HTML_LANG,
  buildFullHtml,
  validateSnapshot,
  type Locale,
  type SnapshotSpec,
} from "../_shared/snapshot-html.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OG_IMAGE = `${BASE_URL}/og-image.jpg`;

async function requireAdmin(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const token = authHeader.slice(7);

  // Accept service role key for internal calls from mcp-content and other edge functions.
  // supabase.functions.invoke() passes the service role key as Bearer but it is not a
  // user JWT — anonClient.auth.getUser() would always fail with it. Checking here before
  // the user-JWT path keeps internal calls fast and avoids the false-positive 401.
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (serviceRoleKey && token === serviceRoleKey) return null;

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

const PAGE_SELECT = "slug, status, is_system_page, featured_image, created_at, updated_at, reading_time, page_translations(language, title, meta_description, slug, content)";

async function regeneratePage(supabase: any, page: any): Promise<{ uploaded: string[]; errors: { locale: Locale; message: string }[]; removed?: string[]; skipped?: string }> {
  if (page.is_system_page) return { uploaded: [], errors: [], skipped: "system_page" };

  const trList = page.page_translations || [];
  const trMap = new Map<string, any>();
  for (const tr of trList) trMap.set(tr.language, tr);

  if (page.status !== "published") {
    const removals: string[] = [];
    for (const locale of ["en", "br", "es"] as Locale[]) {
      const langKey = locale === "en" ? "en" : locale === "br" ? "pt-BR" : "es-ES";
      const tr = trMap.get(langKey) || trMap.get(locale);
      if (!tr) continue;
      const localizedSlug = tr.slug || page.slug;
      removals.push(`${LOCALE_TO_HUB[locale]}/${localizedSlug}/index.html`);
    }
    if (removals.length > 0) await supabase.storage.from("seo-snapshots").remove(removals);
    return { uploaded: [], errors: [], removed: removals };
  }

  const enTr = trMap.get("en");
  const brTr = trMap.get("pt-BR") || trMap.get("br");
  const esTr = trMap.get("es-ES") || trMap.get("es");
  const alternates: SnapshotSpec["alternates"] = {};
  if (enTr) alternates.en = `${BASE_URL}/publications/${enTr.slug || page.slug}`;
  if (brTr) alternates["pt-BR"] = `${BASE_URL}/br/artigos/${brTr.slug || page.slug}`;
  if (esTr) alternates.es = `${BASE_URL}/es/articulos/${esTr.slug || page.slug}`;

  const uploaded: string[] = [];
  const errors: { locale: Locale; message: string }[] = [];

  for (const locale of ["en", "br", "es"] as Locale[]) {
    const langKey = locale === "en" ? "en" : locale === "br" ? "pt-BR" : "es-ES";
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
      ogImage: /^https?:\/\//.test(page.featured_image || "") ? page.featured_image : OG_IMAGE,
      content: tr.content || "",
      featuredImage: /^https?:\/\//.test(page.featured_image || "") ? page.featured_image : undefined,
      datePublished: page.created_at,
      dateModified: page.updated_at,
      readTime: typeof page.reading_time === "number" && page.reading_time > 0 ? page.reading_time : undefined,
    };
    const html = buildFullHtml(spec);
    const key = `${outPath}/index.html`;
    // Never let an invalid snapshot into the bucket: storage is served first,
    // so a bad object silently becomes the permanent version Googlebot sees.
    const check = validateSnapshot(html, spec.canonical);
    if (!check.ok) {
      errors.push({ locale, message: `validation_failed: ${check.problems.join("; ")}` });
      continue;
    }
    const { error: upErr } = await supabase.storage
      .from("seo-snapshots")
      .upload(key, new Blob([html], { type: "text/html; charset=utf-8" }), {
        contentType: "text/html; charset=utf-8",
        upsert: true,
      });
    if (upErr) errors.push({ locale, message: upErr.message });
    else uploaded.push(key);
  }
  return { uploaded, errors };
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
    const body = await req.json().catch(() => ({}));
    const { slug, all } = body || {};

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (all === true) {
      const { data: pages, error } = await supabase
        .from("pages")
        .select(PAGE_SELECT)
        .eq("status", "published")
        .eq("is_system_page", false);
      if (error) {
        return new Response(JSON.stringify({ error: "db_error", message: error.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const results: any[] = [];
      for (const p of pages || []) {
        const r = await regeneratePage(supabase, p);
        results.push({ slug: p.slug, uploaded: r.uploaded.length, errors: r.errors });
      }
      const totalUploaded = results.reduce((s, r) => s + r.uploaded, 0);
      return new Response(JSON.stringify({ success: true, pages: results.length, totalUploaded, results }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!slug || typeof slug !== "string") {
      return new Response(JSON.stringify({ error: "missing_slug" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: page, error: fetchErr } = await supabase
      .from("pages")
      .select(PAGE_SELECT)
      .eq("slug", slug)
      .maybeSingle();

    if (fetchErr) {
      return new Response(JSON.stringify({ error: "db_error", message: fetchErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!page) {
      return new Response(JSON.stringify({ error: "page_not_found", slug }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (page.is_system_page) {
      return new Response(JSON.stringify({ skipped: true, reason: "system_page_built_at_deploy_time", slug }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const r = await regeneratePage(supabase, page);
    return new Response(JSON.stringify({ success: r.errors.length === 0, slug, ...r }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
