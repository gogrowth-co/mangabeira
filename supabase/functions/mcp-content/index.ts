import { Hono } from "hono";
import { McpServer, StreamableHttpTransport } from "mcp-lite";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MAX_REQUEST_SIZE = 200 * 1024; // 200KB

// Timing-safe secret comparison
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

const app = new Hono();

// Auth middleware — validate secret on all non-OPTIONS requests
app.use("/*", async (c, next) => {
  if (c.req.method === "OPTIONS") return next();

  const secret = Deno.env.get("MCP_CONTENT_SECRET");
  if (!secret) {
    return c.json({ error: "MCP_CONTENT_SECRET not configured" }, 500);
  }

  const provided = c.req.header("X-MCP-Secret") || "";
  if (!provided || !timingSafeEqual(provided, secret)) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Check request size via content-length header
  const contentLength = parseInt(c.req.header("content-length") || "0", 10);
  if (contentLength > MAX_REQUEST_SIZE) {
    return c.json({ error: `Request too large. Maximum size is ${MAX_REQUEST_SIZE / 1024}KB.` }, 413);
  }

  return next();
});

// Create MCP server
const mcpServer = new McpServer({
  name: "mangabeira-content",
  version: "1.0.0",
});

// ─── list_pages ───
mcpServer.tool({
  name: "list_pages",
  description: "List all pages with optional status filter. Returns slug, status, category, and available languages.",
  inputSchema: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["all", "published", "draft"],
        description: "Filter by page status. Defaults to 'all'.",
      },
    },
  },
  handler: async ({ status }: { status?: string }) => {
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
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
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

    return { content: [{ type: "text", text: JSON.stringify(pages, null, 2) }] };
  },
});

// ─── get_page ───
mcpServer.tool({
  name: "get_page",
  description: "Get full page details by slug, including all translations with content, meta descriptions, and schema.",
  inputSchema: {
    type: "object",
    properties: {
      slug: { type: "string", description: "The page slug (English/base slug)." },
    },
    required: ["slug"],
  },
  handler: async ({ slug }: { slug: string }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("pages")
      .select("*, translations:page_translations(*)")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
    if (!data) {
      return { content: [{ type: "text", text: `Page not found: ${slug}` }], isError: true };
    }

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── upsert_page ───
mcpServer.tool({
  name: "upsert_page",
  description: `Create or update a page with translations. Defaults to status 'draft' unless explicitly set to 'published'. Blocks overwrites on system pages unless force_system_page is true. On publish, triggers sitemap/RSS/IndexNow. featured_image accepts a URL string (no upload). Accepts partial translations (EN-only is fine).`,
  inputSchema: {
    type: "object",
    properties: {
      slug: { type: "string", description: "URL slug for the page (English)." },
      category: { type: "string", description: "Page category (e.g. 'blog', 'case-study')." },
      status: { type: "string", enum: ["draft", "published"], description: "Page status. Defaults to 'draft'." },
      featured_image: { type: "string", description: "URL to the featured/hero image." },
      author_name: { type: "string", description: "Author display name." },
      read_time: { type: "string", description: "Estimated read time (e.g. '5 min')." },
      tags: { type: "array", items: { type: "string" }, description: "Array of tag strings." },
      is_featured: { type: "boolean", description: "Whether this is a featured page." },
      is_system_page: { type: "boolean", description: "Whether this is a system page." },
      force_system_page: { type: "boolean", description: "Set to true to allow overwriting system pages." },
      translations: {
        type: "array",
        description: "Array of translations. At minimum provide EN.",
        items: {
          type: "object",
          properties: {
            language: { type: "string", description: "Language code: 'en', 'br', or 'es'." },
            title: { type: "string", description: "Page title in this language." },
            meta_description: { type: "string", description: "SEO meta description." },
            content: { type: "string", description: "HTML content body." },
            schema: { type: "object", description: "JSON-LD schema object." },
            localized_slug: { type: "string", description: "Localized URL slug for this language." },
            featured_image_alt: { type: "string", description: "Alt text for featured image." },
          },
          required: ["language", "title"],
        },
      },
    },
    required: ["slug", "translations"],
  },
  handler: async (input: any) => {
    const supabase = getSupabase();
    const {
      slug, category, featured_image, author_name, read_time,
      tags, is_featured, is_system_page, force_system_page, translations,
    } = input;
    const status = input.status || "draft";

    if (!translations || translations.length === 0) {
      return { content: [{ type: "text", text: "Error: At least one translation is required." }], isError: true };
    }

    // Check if page exists
    const { data: existingPage, error: fetchError } = await supabase
      .from("pages")
      .select("id, is_system_page")
      .eq("slug", slug)
      .maybeSingle();

    if (fetchError) {
      return { content: [{ type: "text", text: `Error: ${fetchError.message}` }], isError: true };
    }

    // Block system page overwrites
    if (existingPage?.is_system_page && !force_system_page) {
      return {
        content: [{ type: "text", text: `Error: Page '${slug}' is a system page. Set force_system_page: true to overwrite.` }],
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
      const { error: updateError } = await supabase
        .from("pages")
        .update(pageData)
        .eq("id", existingPage.id);

      if (updateError) {
        return { content: [{ type: "text", text: `Error updating page: ${updateError.message}` }], isError: true };
      }
      pageId = existingPage.id;

      // Delete old translations
      const { error: deleteErr } = await supabase
        .from("page_translations")
        .delete()
        .eq("page_id", pageId);

      if (deleteErr) {
        return { content: [{ type: "text", text: `Error deleting old translations: ${deleteErr.message}` }], isError: true };
      }
    } else {
      const { data: newPage, error: insertError } = await supabase
        .from("pages")
        .insert({ slug, ...pageData })
        .select("id")
        .single();

      if (insertError) {
        return { content: [{ type: "text", text: `Error creating page: ${insertError.message}` }], isError: true };
      }
      pageId = newPage.id;
    }

    // Insert translations
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

    const { error: transErr } = await supabase
      .from("page_translations")
      .insert(translationRows);

    if (transErr) {
      return { content: [{ type: "text", text: `Error inserting translations: ${transErr.message}` }], isError: true };
    }

    // If publishing, trigger sitemap/RSS/IndexNow
    const triggers: string[] = [];
    if (status === "published") {
      try {
        await supabase.functions.invoke("generate-sitemap", {});
        triggers.push("sitemap");
      } catch (e) { console.warn("Sitemap trigger failed:", e); }

      try {
        await supabase.functions.invoke("generate-rss", {});
        triggers.push("rss");
      } catch (e) { console.warn("RSS trigger failed:", e); }

      try {
        await supabase.functions.invoke("submit-indexnow", { body: { slug } });
        triggers.push("indexnow");
      } catch (e) { console.warn("IndexNow trigger failed:", e); }
    }

    const result = {
      success: true,
      action: existingPage ? "updated" : "created",
      page_id: pageId,
      slug,
      status,
      translations_count: translations.length,
      triggers_fired: triggers,
    };

    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },
});

// ─── delete_page ───
mcpServer.tool({
  name: "delete_page",
  description: "Delete a page by slug. Blocks deletion of system pages. Triggers sitemap/RSS regeneration.",
  inputSchema: {
    type: "object",
    properties: {
      slug: { type: "string", description: "The page slug to delete." },
    },
    required: ["slug"],
  },
  handler: async ({ slug }: { slug: string }) => {
    const supabase = getSupabase();

    const { data: page, error: fetchErr } = await supabase
      .from("pages")
      .select("id, is_system_page")
      .eq("slug", slug)
      .maybeSingle();

    if (fetchErr) {
      return { content: [{ type: "text", text: `Error: ${fetchErr.message}` }], isError: true };
    }
    if (!page) {
      return { content: [{ type: "text", text: `Page not found: ${slug}` }], isError: true };
    }
    if (page.is_system_page) {
      return { content: [{ type: "text", text: `Error: Cannot delete system page '${slug}'.` }], isError: true };
    }

    // Delete translations first, then page
    await supabase.from("page_translations").delete().eq("page_id", page.id);
    const { error: deleteErr } = await supabase.from("pages").delete().eq("id", page.id);

    if (deleteErr) {
      return { content: [{ type: "text", text: `Error deleting page: ${deleteErr.message}` }], isError: true };
    }

    // Trigger regeneration
    try { await supabase.functions.invoke("generate-sitemap", {}); } catch (_) {}
    try { await supabase.functions.invoke("generate-rss", {}); } catch (_) {}

    return {
      content: [{ type: "text", text: JSON.stringify({ success: true, deleted: slug }) }],
    };
  },
});

// Wire up transport
const transport = new StreamableHttpTransport();

app.all("/*", async (c) => {
  return await transport.handleRequest(c.req.raw, mcpServer);
});

Deno.serve(app.fetch);
