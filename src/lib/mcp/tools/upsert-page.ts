import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

const translationSchema = z.object({
  language: z.string().trim().min(2).describe("Language code: 'en', 'br' or 'es'."),
  title: z.string().trim().min(1),
  meta_description: z.string().trim().optional(),
  content: z.string().optional().describe("HTML content body."),
  localized_slug: z.string().trim().optional().describe("Localized URL slug."),
  featured_image_alt: z.string().trim().optional(),
});

export default defineTool({
  name: "upsert_page",
  title: "Create or update page",
  description:
    "Create or update a content page and its translations. Defaults to status 'draft'. Requires an admin account; system pages are protected unless force_system_page is true.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Canonical (English) URL slug."),
    category: z.string().trim().optional(),
    status: z.enum(["draft", "published"]).optional().describe("Defaults to 'draft'."),
    featured_image: z
      .string()
      .trim()
      .optional()
      .describe("Full https:// URL to the featured image."),
    author_name: z.string().trim().optional(),
    read_time: z.string().trim().optional(),
    tags: z.array(z.string()).optional(),
    is_featured: z.boolean().optional(),
    force_system_page: z
      .boolean()
      .optional()
      .describe("Set true to allow overwriting a system page."),
    translations: z
      .array(translationSchema)
      .min(1)
      .describe("At least one translation (EN recommended)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);

    if (input.featured_image && !/^https?:\/\//.test(input.featured_image)) {
      throw new ToolError(
        `featured_image must be a full https:// URL (got "${input.featured_image}").`,
      );
    }

    const { data: existing, error: fetchError } = await supabase
      .from("pages")
      .select("id, is_system_page")
      .eq("slug", input.slug)
      .maybeSingle();

    if (fetchError) {
      return { content: [{ type: "text", text: fetchError.message }], isError: true };
    }
    if (existing?.is_system_page && !input.force_system_page) {
      throw new ToolError(
        `'${input.slug}' is a system page. Set force_system_page: true to overwrite.`,
      );
    }

    const pageData = {
      category: input.category ?? null,
      status: input.status ?? "draft",
      featured_image: input.featured_image ?? null,
      author_name: input.author_name ?? null,
      read_time: input.read_time ?? null,
      tags: input.tags ?? [],
      is_featured: input.is_featured ?? false,
      updated_at: new Date().toISOString(),
    };

    let pageId: string;
    if (existing) {
      const { error } = await supabase
        .from("pages")
        .update(pageData)
        .eq("id", existing.id);
      if (error) {
        return { content: [{ type: "text", text: error.message }], isError: true };
      }
      pageId = existing.id;
      const { error: delErr } = await supabase
        .from("page_translations")
        .delete()
        .eq("page_id", pageId);
      if (delErr) {
        return { content: [{ type: "text", text: delErr.message }], isError: true };
      }
    } else {
      const { data: created, error } = await supabase
        .from("pages")
        .insert({ slug: input.slug, ...pageData })
        .select("id")
        .single();
      if (error) {
        return { content: [{ type: "text", text: error.message }], isError: true };
      }
      pageId = created.id;
    }

    const rows = input.translations.map((t) => ({
      page_id: pageId,
      language: t.language,
      title: t.title,
      meta_description: t.meta_description ?? null,
      content: t.content ?? null,
      slug: t.localized_slug ?? input.slug,
      featured_image_alt: t.featured_image_alt ?? null,
    }));

    const { error: transErr } = await supabase.from("page_translations").insert(rows);
    if (transErr) {
      return { content: [{ type: "text", text: transErr.message }], isError: true };
    }

    const result = {
      success: true,
      action: existing ? "updated" : "created",
      page_id: pageId,
      slug: input.slug,
      status: pageData.status,
      translations_count: rows.length,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
