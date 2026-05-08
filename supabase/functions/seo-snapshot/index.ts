// Serves prerendered per-route HTML snapshots stored in the `seo-snapshots`
// storage bucket. Used by the inline bootstrap in index.html so crawlers /
// audit tools / no-JS clients receive route-specific meta + body even though
// Lovable hosting always serves the SPA shell for extensionless URLs.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function normalizePath(raw: string): string {
  let p = (raw || "/").trim();
  if (!p.startsWith("/")) p = "/" + p;
  // strip query/hash if present
  p = p.split("?")[0].split("#")[0];
  // collapse trailing slash (except root)
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  // disallow path traversal
  if (p.includes("..")) p = "/";
  return p;
}

function pathToObjectKey(p: string): string {
  if (p === "/") return "index.html";
  return p.replace(/^\//, "") + "/index.html";
}

// Permanent redirects (old path -> new path) for crawlers
const REDIRECTS: Record<string, string> = {
  "/es/articulos/estudo-de-caso-defi-avici": "/es/articulos/estudio-de-caso-defi-avici",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const requested = normalizePath(url.searchParams.get("path") || "/");
    const objectKey = pathToObjectKey(requested);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase.storage
      .from("seo-snapshots")
      .download(objectKey);

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: "snapshot_not_found", path: requested }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const html = await data.text();
    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=86400",
        "X-Snapshot-Path": requested,
      },
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
