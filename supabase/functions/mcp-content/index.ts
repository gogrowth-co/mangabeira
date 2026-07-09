import { Hono } from "hono";
import { McpServer, StreamableHttpTransport } from "mcp-lite";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MAX_REQUEST_SIZE = 5 * 1024 * 1024; // 5MB

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  let mismatch = 0;
  for (let i = 0; i < bufA.length; i++) {
    mismatch |= bufA[i] ^ bufB[i];
  }
  return mismatch === 0;
}

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

const mcpServer = new McpServer({
  name: "mangabeira-content",
  version: "1.0.0",
});

// ─── list_pages ───
mcpServer.tool("list_pages", {
  description: "List all pages with optional status filter. Returns slug, status, category, and available languages.",
  inputSchema: {
    type: "object" as const,
    properties: {
      status: { type: "string" as const, enum: ["all", "published", "draft"], description: "Filter by page status. Defaults to 'all'." },
    },
  },
  handler: async (args: any) => {
    const status = args?.status;
    const supabase = getSupabase();
    let query = supabase
      .from("pages")
      .select("slug, status, category, is_system_page, is_featured, updated_at, translations:page_translations(language)")
      .order("updated_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
    }

    const pages = (data || []).map((p: any) => ({
      slug: p.slug,
      status: p.status,
      category: p.category,
      is_system_page: p.is_system_page,
      is_featured: p.is_featured,
      updated_at: p.updated_at,
      languages: (p.translations || []).map((t: any) => t.language),
    }));

    return { content: [{ type: "text" as const, text: JSON.stringify(pages, null, 2) }] };
  },
});

// ─── get_page ───
mcpServer.tool("get_page", {
  description: "Get full page details by slug, including all translations with content, meta descriptions, and schema.",
  inputSchema: {
    type: "object" as const,
    properties: {
      slug: { type: "string" as const, description: "The page slug (English/base slug)." },
    },
    required: ["slug"] as const,
  },
  handler: async (args: any) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("pages")
      .select("*, translations:page_translations(*)")
      .eq("slug", args.slug)
      .maybeSingle();

    if (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
    }
    if (!data) {
      return { content: [{ type: "text" as const, text: `Page not found: ${args.slug}` }], isError: true };
    }

    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── upsert_page ───
mcpServer.tool("upsert_page", {
  description: "Create or update a page with translations. Defaults to status 'draft'. Blocks overwrites on system pages unless force_system_page is true. On publish, triggers sitemap/RSS/IndexNow.",
  inputSchema: {
    type: "object" as const,
    properties: {
      slug: { type: "string" as const, description: "URL slug for the page (English)." },
      category: { type: "string" as const, description: "Page category." },
      status: { type: "string" as const, enum: ["draft", "published"], description: "Defaults to 'draft'." },
      featured_image: { type: "string" as const, description: "URL to the featured image." },
      author_name: { type: "string" as const, description: "Author display name." },
      read_time: { type: "string" as const, description: "Estimated read time." },
      tags: { type: "array" as const, items: { type: "string" as const }, description: "Tag strings." },
      is_featured: { type: "boolean" as const },
      is_system_page: { type: "boolean" as const },
      force_system_page: { type: "boolean" as const, description: "Set true to overwrite system pages." },
      translations: {
        type: "array" as const,
        description: "Array of translations. At minimum provide EN.",
        items: {
          type: "object" as const,
          properties: {
            language: { type: "string" as const, description: "Language code: 'en', 'br', or 'es'." },
            title: { type: "string" as const },
            meta_description: { type: "string" as const },
            content: { type: "string" as const, description: "HTML content body." },
            schema: { type: "object" as const, description: "JSON-LD schema." },
            localized_slug: { type: "string" as const, description: "Localized URL slug." },
            featured_image_alt: { type: "string" as const },
          },
          required: ["language", "title"] as const,
        },
      },
    },
    required: ["slug", "translations"] as const,
  },
  handler: async (input: any) => {
    const supabase = getSupabase();
    const {
      slug, category, featured_image, author_name, read_time,
      tags, is_featured, is_system_page, force_system_page, translations,
    } = input;
    const status = input.status || "draft";

    if (!translations || translations.length === 0) {
      return { content: [{ type: "text" as const, text: "Error: At least one translation is required." }], isError: true };
    }

    // Featured images must be hosted URLs. Dev-only paths like
    // /src/assets/foo.png resolve in the Vite dev server but 404 in
    // production (assets are hashed at build), which shipped three broken
    // covers before this guard (fixed 2026-07-09).
    if (featured_image && !/^https?:\/\//.test(featured_image)) {
      return {
        content: [{
          type: "text" as const,
          text: `Error: featured_image must be a full https:// URL (got "${featured_image}"). Upload the image first with the upload_image tool and use the returned public_url.`,
        }],
        isError: true,
      };
    }

    const { data: existingPage, error: fetchError } = await supabase
      .from("pages")
      .select("id, is_system_page")
      .eq("slug", slug)
      .maybeSingle();

    if (fetchError) {
      return { content: [{ type: "text" as const, text: `Error: ${fetchError.message}` }], isError: true };
    }

    if (existingPage?.is_system_page && !force_system_page) {
      return {
        content: [{ type: "text" as const, text: `Error: '${slug}' is a system page. Set force_system_page: true to overwrite.` }],
        isError: true,
      };
    }

    let pageId: string;
    const pageData = {
      category,
      status,
      featured_image,
      author_name,
      read_time,
      tags: tags || [],
      is_featured: is_featured || false,
      is_system_page: is_system_page || false,
      updated_at: new Date().toISOString(),
    };

    if (existingPage) {
      const { error: updateError } = await supabase.from("pages").update(pageData).eq("id", existingPage.id);
      if (updateError) {
        return { content: [{ type: "text" as const, text: `Error updating: ${updateError.message}` }], isError: true };
      }
      pageId = existingPage.id;
      const { error: deleteErr } = await supabase.from("page_translations").delete().eq("page_id", pageId);
      if (deleteErr) {
        return { content: [{ type: "text" as const, text: `Error deleting translations: ${deleteErr.message}` }], isError: true };
      }
    } else {
      const { data: newPage, error: insertError } = await supabase
        .from("pages")
        .insert({ slug, ...pageData })
        .select("id")
        .single();
      if (insertError) {
        return { content: [{ type: "text" as const, text: `Error creating: ${insertError.message}` }], isError: true };
      }
      pageId = newPage.id;
    }

    const translationRows = translations.map((t: any) => ({
      page_id: pageId,
      language: t.language,
      title: t.title,
      meta_description: t.meta_description || null,
      content: t.content || null,
      schema: t.schema || null,
      slug: t.localized_slug || slug,
      featured_image_alt: t.featured_image_alt || null,
    }));

    const { error: transErr } = await supabase.from("page_translations").insert(translationRows);
    if (transErr) {
      return { content: [{ type: "text" as const, text: `Error inserting translations: ${transErr.message}` }], isError: true };
    }

    const triggers: string[] = [];
    // Always regenerate snapshot (handles publish + unpublish cleanup)
    try { await supabase.functions.invoke("regenerate-snapshot", { body: { slug } }); triggers.push("snapshot"); } catch (_) {}
    if (status === "published") {
      try { await supabase.functions.invoke("generate-sitemap", {}); triggers.push("sitemap"); } catch (_) {}
      try { await supabase.functions.invoke("generate-rss", {}); triggers.push("rss"); } catch (_) {}
      try { await supabase.functions.invoke("generate-llms-txt", {}); triggers.push("llms-txt"); } catch (_) {}
      try { await supabase.functions.invoke("submit-indexnow", { body: { slug } }); triggers.push("indexnow"); } catch (_) {}
    }

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          success: true,
          action: existingPage ? "updated" : "created",
          page_id: pageId, slug, status,
          translations_count: translations.length,
          triggers_fired: triggers,
        }, null, 2),
      }],
    };
  },
});

// ─── delete_page ───
mcpServer.tool("delete_page", {
  description: "Delete a page by slug. Blocks system pages. Triggers sitemap/RSS regeneration.",
  inputSchema: {
    type: "object" as const,
    properties: {
      slug: { type: "string" as const, description: "The page slug to delete." },
    },
    required: ["slug"] as const,
  },
  handler: async (args: any) => {
    const supabase = getSupabase();
    const { data: page, error: fetchErr } = await supabase
      .from("pages").select("id, is_system_page").eq("slug", args.slug).maybeSingle();

    if (fetchErr) return { content: [{ type: "text" as const, text: `Error: ${fetchErr.message}` }], isError: true };
    if (!page) return { content: [{ type: "text" as const, text: `Page not found: ${args.slug}` }], isError: true };
    if (page.is_system_page) return { content: [{ type: "text" as const, text: `Cannot delete system page '${args.slug}'.` }], isError: true };

    // Capture translation slugs before deletion so we can purge snapshots
    const { data: trs } = await supabase
      .from("page_translations")
      .select("language, slug")
      .eq("page_id", page.id);

    await supabase.from("page_translations").delete().eq("page_id", page.id);
    const { error: deleteErr } = await supabase.from("pages").delete().eq("id", page.id);
    if (deleteErr) return { content: [{ type: "text" as const, text: `Error: ${deleteErr.message}` }], isError: true };

    // Purge snapshots for every locale
    const localeToHub: Record<string, string> = { en: "publications", br: "br/artigos", es: "es/articulos" };
    const langToLocale: Record<string, string> = { en: "en", "pt-BR": "br", br: "br", "es-ES": "es", es: "es" };
    const removals = (trs || [])
      .map((tr: any) => {
        const locale = langToLocale[tr.language];
        if (!locale) return null;
        const localizedSlug = tr.slug || args.slug;
        return `${localeToHub[locale]}/${localizedSlug}/index.html`;
      })
      .filter(Boolean) as string[];
    if (removals.length > 0) {
      try { await supabase.storage.from("seo-snapshots").remove(removals); } catch (_) {}
    }

    try { await supabase.functions.invoke("generate-sitemap", {}); } catch (_) {}
    try { await supabase.functions.invoke("generate-rss", {}); } catch (_) {}
    try { await supabase.functions.invoke("generate-llms-txt", {}); } catch (_) {}

    return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, deleted: args.slug, snapshots_removed: removals }) }] };
  },
});

// ─── upload_image ───
mcpServer.tool("upload_image", {
  description: "Upload an image to Supabase Storage (blog-images bucket). Returns the public URL for use as featured_image in upsert_page. Max ~3.5MB decoded image size.",
  inputSchema: {
    type: "object" as const,
    properties: {
      filename: { type: "string" as const, description: "Filename with extension (e.g. cover.png). Used as the storage path." },
      base64_data: { type: "string" as const, description: "Base64-encoded image data (no data URI prefix)." },
      mime_type: { type: "string" as const, description: "MIME type. Defaults to image/png." },
    },
    required: ["filename", "base64_data"] as const,
  },
  handler: async (args: any) => {
    const supabase = getSupabase();
    const { filename, base64_data, mime_type = "image/png" } = args;
    let binaryData: Uint8Array;
    try {
      binaryData = Uint8Array.from(atob(base64_data), (c) => c.charCodeAt(0));
    } catch {
      return { content: [{ type: "text" as const, text: "Error: Invalid base64 data." }], isError: true };
    }
    const { error } = await supabase.storage
      .from("blog-images")
      .upload(filename, binaryData, { contentType: mime_type, upsert: true });
    if (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
    }
    const { data: { publicUrl } } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filename);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: true, filename, public_url: publicUrl }, null, 2),
      }],
    };
  },
});

// Wire up transport
const transport = new StreamableHttpTransport();
const httpHandler = transport.bind(mcpServer);

const app = new Hono();

// Auth middleware
app.use("/*", async (c, next) => {
  if (c.req.method === "OPTIONS") return next();

  const secret = Deno.env.get("MCP_CONTENT_SECRET");
  if (!secret) return c.json({ error: "MCP_CONTENT_SECRET not configured" }, 500);

  const provided = c.req.header("X-MCP-Secret") || "";
  if (!provided || !timingSafeEqual(provided, secret)) return c.json({ error: "Unauthorized" }, 401);

  const contentLength = parseInt(c.req.header("content-length") || "0", 10);
  if (contentLength > MAX_REQUEST_SIZE) {
    return c.json({ error: `Request too large. Max ${MAX_REQUEST_SIZE / 1024}KB.` }, 413);
  }

  return next();
});

app.all("/*", async (c) => {
  return await httpHandler(c.req.raw);
});

Deno.serve(app.fetch);
