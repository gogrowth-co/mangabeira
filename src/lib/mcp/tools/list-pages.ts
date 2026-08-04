import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_pages",
  title: "List pages",
  description:
    "List content pages (articles and system pages) with slug, status, category and available languages.",
  inputSchema: {
    status: z
      .enum(["all", "published", "draft"])
      .optional()
      .describe("Filter by page status. Defaults to 'all'."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(200)
      .optional()
      .describe("Maximum number of pages to return. Defaults to 50."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("pages")
      .select(
        "slug, status, category, is_system_page, is_featured, updated_at, translations:page_translations(language, title)",
      )
      .order("updated_at", { ascending: false })
      .limit(limit ?? 50);

    if (status && status !== "all") query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }

    const pages = (data ?? []).map((p: any) => ({
      slug: p.slug,
      status: p.status,
      category: p.category,
      is_system_page: p.is_system_page,
      is_featured: p.is_featured,
      updated_at: p.updated_at,
      languages: (p.translations ?? []).map((t: any) => t.language),
      title: p.translations?.[0]?.title ?? null,
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(pages, null, 2) }],
      structuredContent: { pages },
    };
  },
});
