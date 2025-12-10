import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

interface Translation {
  language: string;
  title: string;
  meta_description?: string;
  content?: string;
  schema?: object;
  localized_slug?: string;
  featured_image_alt?: string;
}

interface NotionWebhookPayload {
  notion_page_id: string;
  slug: string;
  category?: string;
  status?: string;
  featured_image?: string;
  author_name?: string;
  read_time?: string;
  tags?: string[];
  is_featured?: boolean;
  is_system_page?: boolean;
  translations: Translation[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Validate webhook secret
    const webhookSecret = req.headers.get("x-webhook-secret");
    const expectedSecret = Deno.env.get("NOTION_WEBHOOK_SECRET");

    if (!expectedSecret) {
      console.error("NOTION_WEBHOOK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (webhookSecret !== expectedSecret) {
      console.error("Invalid webhook secret provided");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse payload
    const payload: NotionWebhookPayload = await req.json();
    console.log("Received webhook payload for slug:", payload.slug);

    // Validate required fields
    if (!payload.slug || !payload.translations || payload.translations.length === 0) {
      console.error("Missing required fields: slug or translations");
      return new Response(JSON.stringify({ error: "Missing required fields: slug and translations" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if page exists by slug
    const { data: existingPage, error: fetchError } = await supabase
      .from("pages")
      .select("id")
      .eq("slug", payload.slug)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching existing page:", fetchError);
      throw fetchError;
    }

    let pageId: string;

    if (existingPage) {
      // UPDATE existing page
      console.log("Updating existing page:", existingPage.id);
      
      const { error: updateError } = await supabase
        .from("pages")
        .update({
          category: payload.category,
          status: payload.status || "published",
          featured_image: payload.featured_image,
          author_name: payload.author_name,
          read_time: payload.read_time,
          tags: payload.tags || [],
          is_featured: payload.is_featured || false,
          is_system_page: payload.is_system_page || false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingPage.id);

      if (updateError) {
        console.error("Error updating page:", updateError);
        throw updateError;
      }

      pageId = existingPage.id;

      // Delete existing translations and re-insert (simpler than upsert logic)
      const { error: deleteTransError } = await supabase
        .from("page_translations")
        .delete()
        .eq("page_id", pageId);

      if (deleteTransError) {
        console.error("Error deleting old translations:", deleteTransError);
        throw deleteTransError;
      }
    } else {
      // INSERT new page
      console.log("Creating new page with slug:", payload.slug);
      
      const { data: newPage, error: insertError } = await supabase
        .from("pages")
        .insert({
          slug: payload.slug,
          category: payload.category,
          status: payload.status || "published",
          featured_image: payload.featured_image,
          author_name: payload.author_name,
          read_time: payload.read_time,
          tags: payload.tags || [],
          is_featured: payload.is_featured || false,
          is_system_page: payload.is_system_page || false,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Error inserting page:", insertError);
        throw insertError;
      }

      pageId = newPage.id;
    }

    // Insert translations
    const translationInserts = payload.translations.map((t) => ({
      page_id: pageId,
      language: t.language,
      title: t.title,
      meta_description: t.meta_description,
      content: t.content,
      schema: t.schema,
      slug: t.localized_slug || payload.slug,
      featured_image_alt: t.featured_image_alt,
    }));

    const { error: transInsertError } = await supabase
      .from("page_translations")
      .insert(translationInserts);

    if (transInsertError) {
      console.error("Error inserting translations:", transInsertError);
      throw transInsertError;
    }

    console.log(`Successfully synced page ${payload.slug} with ${payload.translations.length} translations`);

    // Trigger sitemap regeneration (fire and forget)
    try {
      await supabase.functions.invoke("generate-sitemap", {});
      console.log("Sitemap regeneration triggered");
    } catch (sitemapErr) {
      console.warn("Failed to trigger sitemap regeneration:", sitemapErr);
    }

    // Trigger RSS regeneration (fire and forget)
    try {
      await supabase.functions.invoke("generate-rss", {});
      console.log("RSS regeneration triggered");
    } catch (rssErr) {
      console.warn("Failed to trigger RSS regeneration:", rssErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: existingPage ? "Page updated" : "Page created",
        page_id: pageId,
        translations_count: payload.translations.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
