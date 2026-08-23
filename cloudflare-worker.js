// Cloudflare Worker: mangabeira-snapshot-router v2.7
// - v2.7 (2026-08-23) EDGE REPAIR, temporary. The seo-snapshot edge function
//   currently returns article HTML with no <h1>, no internal links, and (for
//   articles authored in the CMS as complete HTML documents) a second <title>
//   and a second <link rel="canonical"> leaked into <body>. On the BR/ES copies
//   of web2-vs-web3-marketing that leaked canonical points at a URL Google
//   classifies as a Soft 404. Measured 2026-08-23: 91 of 111 live URLs failing.
//   The real fix is merged in gogrowth-co/mangabeira#29 but cannot deploy —
//   Supabase edge functions here deploy only through Lovable Cloud (DEPLOY.md)
//   and that workspace is out of credits. patchSnapshot() below repairs the
//   response at the edge in the meantime. Every step is conditional, so once
//   the fixed builder ships each branch becomes a no-op and this code stops
//   touching anything. Remove it after confirming the deploy.
// - Proxies /sitemap.xml, /rss/*.xml, /llms*.txt to Supabase Storage (all visitors)
// - Static system routes (home/about/tools/audit/privacy): bots go to ORIGIN —
//   Lovable serves the per-route prerendered dist file, which is regenerated on
//   every deploy. The Storage bucket copy goes stale when the build can't upload
//   (no service key in build env), so origin is the reliable source here.
// - Publication articles + hubs: bots get seo-snapshot (Storage-backed,
//   self-healing from DB) because origin serves the SPA shell for nested routes
//   and the hub's build-time article list is empty without DB access.
// - Propagates 3xx redirects from seo-snapshot (slug corrections)
// - Propagates 404 from seo-snapshot as a REAL 404 (v2.6). Previously an
//   unknown article slug fell through to origin, which returns index.html
//   with status 200 — a soft 404. Body still comes from origin so the SPA
//   renders its NotFound page; only the status code is corrected.
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

// Served to bots from ORIGIN (fresh per-route prerendered file every deploy).
const ORIGIN_PRERENDERED_ROUTES = new Set([
  "/", "/about", "/privacy-policy",
  "/tools", "/tools/tokenomics-simulator", "/services/web3-growth-audit",
  "/br", "/br/sobre", "/br/politica-de-privacidade",
  "/br/ferramentas", "/br/ferramentas/simulador-tokenomics", "/br/servicos/web3-auditoria-de-growth",
  "/es", "/es/acerca-de", "/es/politica-de-privacidad",
  "/es/herramientas", "/es/herramientas/simulador-tokenomics", "/es/servicios/web3-auditoria-de-growth",
]);

// Served to bots from seo-snapshot (Storage bucket, DB self-heal for articles).
const SNAPSHOT_ROUTES = new Set([
  "/publications", "/br/artigos", "/es/articulos",
]);

const DYNAMIC_PREFIXES = [
  "/publications/",
  "/br/artigos/",
  "/es/articulos/",
];

const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|chatgpt|gptbot|perplexitybot|claudebot|claude-web|anthropic|google-extended|bingbot|duckduckbot|applebot|yandex|baiduspider|ahrefsbot|semrushbot|screaming\s?frog|lighthouse/i;

// Edge repair for bot-facing snapshot HTML.
// Idempotent and self-disabling: each step runs ONLY if the defect is present,
// so once the seo-snapshot edge function ships its fixed builder, every branch
// here becomes a no-op and the worker stops changing anything.
var NAV = {
  en: { hub: "/publications", hubLabel: "More publications", about: "/about", aboutLabel: "About",
        tools: "/tools", toolsLabel: "Tools", audit: "/services/web3-growth-audit", auditLabel: "Web3 Growth Audit" },
  br: { hub: "/br/artigos", hubLabel: "Mais artigos", about: "/br/sobre", aboutLabel: "Sobre",
        tools: "/br/ferramentas", toolsLabel: "Ferramentas", audit: "/br/servicos/web3-auditoria-de-growth", auditLabel: "Auditoria de Growth Web3" },
  es: { hub: "/es/articulos", hubLabel: "Más artículos", about: "/es/acerca-de", aboutLabel: "Acerca de",
        tools: "/es/herramientas", toolsLabel: "Herramientas", audit: "/es/servicios/web3-auditoria-de-growth", auditLabel: "Auditoría de Growth Web3" },
};

function localeOf(path) {
  if (path.indexOf("/br/") === 0 || path === "/br") return "br";
  if (path.indexOf("/es/") === 0 || path === "/es") return "es";
  return "en";
}

function patchSnapshot(html, path) {
  var m = /<body[^>]*>/i.exec(html);
  if (!m) return { html: html, changed: [] };
  var openEnd = m.index + m[0].length;
  var closeIdx = html.toLowerCase().lastIndexOf("</body>");
  if (closeIdx < 0 || closeIdx < openEnd) return { html: html, changed: [] };

  var head = html.slice(0, openEnd);
  var inner = html.slice(openEnd, closeIdx);
  var tail = html.slice(closeIdx);
  var changed = [];

  // 1. Remove document scaffolding + head-only tags leaked from CMS content
  //    authored as a complete HTML document.
  var before = inner;
  inner = inner
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
    .replace(/<\/?html[^>]*>/gi, "")
    .replace(/<\/?head[^>]*>/gi, "")
    .replace(/<\/?body[^>]*>/gi, "")
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<meta[^>]*>/gi, "");
  if (inner !== before) changed.push("stripped-leaked-head-tags");

  var t = NAV[localeOf(path)];

  // 2. Inject an <h1> only when the body genuinely has none.
  if (!/<h1[\s>]/i.test(inner)) {
    var tm = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(head);
    var title = tm ? tm[1].trim() : "";
    if (title) {
      inner =
        '<h1 style="font-family:Poppins,sans-serif;font-size:40px;line-height:1.15;margin:0 0 16px;color:#0A2540;">' +
        title + "</h1>" + inner;
      changed.push("injected-h1");
    }
  }

  // 3. Give crawlers a path onward only when the page is link-starved.
  var links = inner.match(/href="\/[^"#][^"]*"/g) || [];
  var unique = {};
  for (var i = 0; i < links.length; i++) unique[links[i]] = 1;
  if (Object.keys(unique).length < 3) {
    var nav =
      '<nav aria-label="Site" style="margin:0 0 24px;font-size:14px;">' +
      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:10px 20px;">' +
      '<li><a href="' + t.hub + '">' + t.hubLabel + "</a></li>" +
      '<li><a href="' + t.about + '">' + t.aboutLabel + "</a></li>" +
      '<li><a href="' + t.tools + '">' + t.toolsLabel + "</a></li>" +
      '<li><a href="' + t.audit + '">' + t.auditLabel + "</a></li>" +
      "</ul></nav>";
    inner = nav + inner;
    changed.push("injected-nav");
  }

  if (!changed.length) return { html: html, changed: [] };
  return { html: head + inner + tail, changed: changed };
}

function normalizePath(p) {
  if (!p) return "/";
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

function isSnapshotRoute(path) {
  if (SNAPSHOT_ROUTES.has(path)) return true;
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

  if (!isHTMLRequest || !isBot) {
    return fetch(request);
  }

  // Static system routes: origin already serves the prerendered per-route file
  // (full body content + meta + JSON-LD, regenerated on every Lovable deploy).
  if (ORIGIN_PRERENDERED_ROUTES.has(path)) {
    var originResp = await fetch(request, {
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    var oh = new Headers(originResp.headers);
    oh.set("x-render-source", "cf-worker-origin-prerender");
    return new Response(originResp.body, { status: originResp.status, headers: oh });
  }

  if (!isSnapshotRoute(path)) {
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

      // Temporary edge repair (v2.7). No-op once seo-snapshot ships its fix.
      // Body is read once up front; on any patch error the original text is
      // still returned, so a bug here can never blank a live article.
      var snapHtml = await snap.text();
      var outHtml = snapHtml;
      try {
        var patched = patchSnapshot(snapHtml, path);
        if (patched.changed.length) {
          outHtml = patched.html;
          headers.set("x-snapshot-patched", patched.changed.join(","));
        }
      } catch (patchErr) {
        console.error("snapshot patch failed for " + path + ":", patchErr);
      }
      headers.delete("content-length");
      return new Response(outHtml, { status: 200, headers: headers });
    }

    // Unknown slug on a publication route. seo-snapshot self-heals from the DB,
    // so a 404 here means the page does not exist. Serve origin's body (React
    // renders NotFound) but with the correct 404 status instead of a soft 404.
    // Deliberately not cached: a transient upstream 404 must not stick at edge.
    if (snap.status === 404) {
      var nf = await fetch(request);
      var nfh = new Headers(nf.headers);
      nfh.set("Content-Type", "text/html; charset=utf-8");
      nfh.set("Cache-Control", "no-store");
      nfh.set("X-Robots-Tag", "noindex");
      nfh.set("x-render-source", "cf-worker-404");
      return new Response(nf.body, { status: 404, headers: nfh });
    }
  } catch (e) {
    console.error("Snapshot fetch failed:", e);
  }

  return fetch(request);
}
