// Cloudflare Worker: mangabeira-snapshot-router v2
// Serves seo-snapshot pre-rendered HTML to bots. Falls back to origin for real users.

const SNAPSHOT_ENDPOINT =
  "https://hetemmltaoirimmoxzku.supabase.co/functions/v1/seo-snapshot";

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
  return DYNAMIC_PREFIXES.some((pre) => path.startsWith(pre));
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = normalizePath(url.pathname);
    const ua = request.headers.get("user-agent") || "";
    const accept = request.headers.get("accept") || "";
    const isBot = BOT_UA.test(ua);
    const isHTMLRequest = request.method === "GET" && accept.includes("text/html");

    if (!isHTMLRequest || !isBot || !isKnownRoute(path)) {
      return fetch(request);
    }

    try {
      const snap = await fetch(
        `${SNAPSHOT_ENDPOINT}?path=${encodeURIComponent(path)}`,
        { cf: { cacheTtl: 300, cacheEverything: true } }
      );
      if (snap.ok) {
        const headers = new Headers(snap.headers);
        headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
        headers.set("x-render-source", "cf-worker-snapshot");
        return new Response(snap.body, { status: 200, headers });
      }
    } catch (e) {
      console.error("Snapshot fetch failed:", e);
    }

    return fetch(request);
  },
};
