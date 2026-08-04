import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_content",
  title: "Search content",
  description:
    "Full-text-ish search across page translations (title, meta description and body) for a keyword, optionally scoped to one language.",
  inputSchema: {
    query: z.string().trim().min(2).describe("Keyword or phrase to look for."),
    language: z
      .string()
      .trim()
      .optional()
      .describe("Optional language filter: 'en', 'br' or 'es'."),
    limit: z.number().int().min(1).max(50).optional().describe("Defaults to 10."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, language, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const escaped = query.replace(/[%,]/g, " ").trim();
    let q = supabase
      .from("page_translations")
      .select("language, slug, title, meta_description, page_id, pages(slug, status)")
      .or(
        `title.ilike.%${escaped}%,meta_description.ilike.%${escaped}%,content.ilike.%${escaped}%`,
      )
      .limit(limit ?? 10);

    if (language) q = q.eq("language", language);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }

    const results = (data ?? []).map((r: any) => ({
      language: r.language,
      localized_slug: r.slug,
      canonical_slug: r.pages?.slug ?? null,
      status: r.pages?.status ?? null,
      title: r.title,
      meta_description: r.meta_description,
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      structuredContent: { results },
    };
  },
});
