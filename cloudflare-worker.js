// Cloudflare Worker: mangabeira-snapshot-router v2.3
// - Proxies /sitemap.xml, /rss/*.xml, /llms*.txt to Supabase Storage (all visitors)
// - Serves seo-snapshot pre-rendered HTML to bots (HTML bot requests only)
// - Propagates 3xx redirects from seo-snapshot (slug corrections)
// - Falls back to origin for all other requests

const SNAPSHOT_ENDPOINT =
  "https://hetemmltaoirimmoxzku.supabase.co/functions/v1/seo-snapshot";

const STORAGE_BASE =
  "https://hetemmltaoirimmoxzku.supabase.co/storage/v1/object/public/blog-images";

// Paths to proxy directly to Supabase Storage
const STORAGE_PROXY = {
  "/sitemap.xml": STORAGE_BASE + "/sitemap.xml",
  "/rss/en.xml": STORAGE_BASE + "/rss-en.xml",
  "/rss/br.xml": STORAGE_BASE + "/rss-br.xml",
  "/rss/es.xml": STORAGE_BASE + "/rss-es.xml",
  "/rss.xml": STORAGE_BASE + "/rss-en.xml",
  "/llms.txt": STORAGE_BASE + "/llms.txt",
  "/llms-full.txt": STORAGE_BASE + "/llms-full.txt",
};

const STATIC_ROUTES = new Set([
  "/", "/about", "/publications", "/privacy-policy",
  "/tools", "/tools/tokenomics-simulator", "/services/web3-growth-audit",
  "/br", "/br/sobre", "/br/artigos", "/br/politica-de-privacidade",
  "/es", "/es/acerca-de", "/es/articulos", "/es/politica-de-privacidad",
]);

const DYNAMIC_PREFIXES = [
  "/publications/",
  "/br/artigos/",
  "/es/articulos/",
];

const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|chatgpt|gptbot|perplexitybot|claudebot|claude-web|anthropic|google-extended|bingbot|duckduckbot|applebot|yandex|baiduspider|ahrefsbot|semrushbot|screaming\s?frog|lighthouse/i;

function normalizePath(p) {
  if (!p) return "/";
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

function isKnownRoute(path) {
  if (STATIC_ROUTES.has(path)) return true;
  return DYNAMIC_PREFIXES.some(function(pre) { return path.startsWith(pre); });
}

addEventListener("fetch", function(event) {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  var url = new URL(request.url);
  var path = normalizePath(url.pathname);

  // Storage proxy: sitemap, RSS, llms — serve to all visitors, not just bots
  if (request.method === "GET" && STORAGE_PROXY[path]) {
    try {
      var storageResp = await fetch(STORAGE_PROXY[path], {
        cf: { cacheTtl: 300, cacheEverything: true },
      });
      if (storageResp.ok) {
        var sh = new Headers(storageResp.headers);
        if (path.endsWith(".xml")) {
          sh.set("Content-Type", "application/xml; charset=utf-8");
        } else if (path.endsWith(".txt")) {
          sh.set("Content-Type", "text/plain; charset=utf-8");
        }
        sh.set("Cache-Control", "public, max-age=300, s-maxage=300");
        sh.set("x-render-source", "cf-worker-storage");
        return new Response(storageResp.body, { status: 200, headers: sh });
      }
    } catch (e) {
      console.error("Storage proxy failed for " + path + ":", e);
    }
    return fetch(request);
  }

  // Bot snapshot: only for HTML bot requests on known routes
  var ua = request.headers.get("user-agent") || "";
  var accept = request.headers.get("accept") || "";
  var isBot = BOT_UA.test(ua);
  var isHTMLRequest = request.method === "GET" && accept.includes("text/html");

  if (!isHTMLRequest || !isBot || !isKnownRoute(path)) {
    return fetch(request);
  }

  try {
    var snap = await fetch(
      SNAPSHOT_ENDPOINT + "?path=" + encodeURIComponent(path),
      { cf: { cacheTtl: 300, cacheEverything: true }, redirect: "manual" }
    );

    if (snap.status >= 300 && snap.status < 400) {
      var loc = snap.headers.get("Location") || "https://mangabeira.net/";
      return new Response(null, {
        status: snap.status,
        headers: {
          "Location": loc,
          "Cache-Control": "public, max-age=86400",
          "x-render-source": "cf-worker-redirect",
        },
      });
    }

    if (snap.ok) {
      var headers = new Headers(snap.headers);
      headers.set("Content-Type", "text/html; charset=utf-8");
      headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
      headers.set("x-render-source", "cf-worker-snapshot");
      return new Response(snap.body, { status: 200, headers: headers });
    }
  } catch (e) {
    console.error("Snapshot fetch failed:", e);
  }

  return fetch(request);
}
