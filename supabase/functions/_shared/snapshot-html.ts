// _shared/snapshot-html.ts
//
// THE single canonical builder for bot-facing SEO snapshots.
//
// Why this file exists (incident 2026-08-23):
// Two generators used to build snapshot HTML independently — `regenerate-snapshot`
// (rich: header, h1, author meta, footer, links) and `seo-snapshot`'s inline
// self-heal fallback (lean: `<body><article>{content}</article></body>`).
// The lean one had no <h1>, no internal links, and only a minimal Article schema.
// Because `seo-snapshot` UPLOADS whatever it generates into the `seo-snapshots`
// bucket, and then serves storage-first forever after, every self-heal
// permanently replaced a good snapshot with a broken one. Result: 77 of 111 live
// URLs served Googlebot a page with zero <h1> and zero internal links.
//
// Rule from here on: nothing builds snapshot HTML except buildFullHtml(), and
// nothing uploads a snapshot without passing validateSnapshot() first.

export type Locale = "en" | "br" | "es";

export const BASE_URL = "https://mangabeira.net";

export const LOCALE_TO_HUB: Record<Locale, string> = {
  en: "publications",
  br: "br/artigos",
  es: "es/articulos",
};

export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  br: "pt-BR",
  es: "es-ES",
};

export interface SnapshotSpec {
  outPath: string;
  locale: Locale;
  canonical: string;
  alternates: { en?: string; "pt-BR"?: string; es?: string };
  title: string;
  description: string;
  ogImage: string;
  content: string;
  featuredImage?: string;
  datePublished?: string;
  dateModified?: string;
  readTime?: number;
}

export const escapeHtml = (s: unknown): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Strip scripts/styles/iframes/inline handlers AND any full-document scaffolding
 * that authors paste into the CMS `content` field.
 *
 * Several articles were authored as complete standalone HTML documents
 * (`<!DOCTYPE html><html><head><title>…</title><link rel=canonical …>…`).
 * Embedding that inside <article> leaked a SECOND <title> and a SECOND
 * <link rel="canonical"> into the page. On the BR/ES copies of
 * web2-vs-web3-marketing the leaked canonical pointed at
 * /publications/web2-vs-web3-marketing-br, a URL Google classifies as a
 * Soft 404 — i.e. the article was telling Google its authoritative version
 * was a dead page. Strip the scaffolding here so it can never reach output.
 */
export function sanitizePublicationHtml(html: string, max = 500000): string {
  let cleaned = String(html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    // Whole nested <head> block, including the title/canonical/meta inside it.
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
    // Document scaffolding tags that may appear without a matching head block.
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<\/?html[^>]*>/gi, "")
    .replace(/<\/?head[^>]*>/gi, "")
    .replace(/<\/?body[^>]*>/gi, "")
    // Any stray head-only elements left loose in the body.
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sclass="[^"]*"/gi, "");
  if (cleaned.length > max) cleaned = cleaned.slice(0, max) + "…";
  return cleaned.trim();
}

const AUTHOR_STRINGS: Record<
  Locale,
  { byline: string; readSuffix: string; localeFmt: string; hub: string; more: string; nav: Record<string, string> }
> = {
  en: {
    byline:
      'By <a href="/about" style="color:#0A2540;font-weight:600;text-decoration:none;">Gabriel Mangabeira</a> — Web3 growth consultant, ex-Olympic athlete',
    readSuffix: "min read",
    localeFmt: "en-US",
    hub: "/publications",
    more: "More publications",
    nav: { about: "/about", tools: "/tools", audit: "/services/web3-growth-audit", aboutLabel: "About", toolsLabel: "Tools", auditLabel: "Web3 Growth Audit" },
  },
  br: {
    byline:
      'Por <a href="/br/sobre" style="color:#0A2540;font-weight:600;text-decoration:none;">Gabriel Mangabeira</a> — Consultor de growth Web3, ex-atleta olímpico',
    readSuffix: "min de leitura",
    localeFmt: "pt-BR",
    hub: "/br/artigos",
    more: "Mais artigos",
    nav: { about: "/br/sobre", tools: "/br/ferramentas", audit: "/br/servicos/web3-auditoria-de-growth", aboutLabel: "Sobre", toolsLabel: "Ferramentas", auditLabel: "Auditoria de Growth Web3" },
  },
  es: {
    byline:
      'Por <a href="/es/acerca-de" style="color:#0A2540;font-weight:600;text-decoration:none;">Gabriel Mangabeira</a> — Consultor de growth Web3, ex-atleta olímpico',
    readSuffix: "min de lectura",
    localeFmt: "es-ES",
    hub: "/es/articulos",
    more: "Más artículos",
    nav: { about: "/es/acerca-de", tools: "/es/herramientas", audit: "/es/servicios/web3-auditoria-de-growth", aboutLabel: "Acerca de", toolsLabel: "Herramientas", auditLabel: "Auditoría de Growth Web3" },
  },
};

function fmtDate(iso: string | undefined, localeFmt: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(localeFmt, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function buildHead(spec: SnapshotSpec): string {
  const lang = HTML_LANG[spec.locale];
  const altLinks = [
    spec.alternates.en ? `<link rel="alternate" hreflang="en" href="${spec.alternates.en}" />` : "",
    spec.alternates["pt-BR"] ? `<link rel="alternate" hreflang="pt-BR" href="${spec.alternates["pt-BR"]}" />` : "",
    spec.alternates.es ? `<link rel="alternate" hreflang="es" href="${spec.alternates.es}" />` : "",
    spec.alternates.en ? `<link rel="alternate" hreflang="x-default" href="${spec.alternates.en}" />` : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    url: spec.canonical,
    name: spec.title,
    headline: spec.title,
    description: spec.description,
    inLanguage: lang,
    image: spec.ogImage,
    isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Mangabeira.net" },
    author: {
      "@type": "Person",
      name: "Gabriel Mangabeira",
      url: `${BASE_URL}/about`,
      jobTitle: "Web3 Growth Consultant",
    },
    publisher: { "@type": "Person", name: "Gabriel Mangabeira", url: BASE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": spec.canonical },
  };
  if (spec.datePublished) article.datePublished = spec.datePublished;
  if (spec.dateModified) article.dateModified = spec.dateModified;

  const t = AUTHOR_STRINGS[spec.locale];
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Mangabeira.net", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: t.more, item: `${BASE_URL}${t.hub}` },
      { "@type": "ListItem", position: 3, name: spec.title, item: spec.canonical },
    ],
  };

  const ld = JSON.stringify([article, breadcrumb]).replace(/</g, "\\u003c");

  return `<title>${escapeHtml(spec.title)}</title>
    <meta name="title" content="${escapeHtml(spec.title)}" />
    <meta name="description" content="${escapeHtml(spec.description)}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${spec.canonical}" />
    ${altLinks}
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Gabriel Mangabeira" />
    <meta property="og:title" content="${escapeHtml(spec.title)}" />
    <meta property="og:description" content="${escapeHtml(spec.description)}" />
    <meta property="og:url" content="${spec.canonical}" />
    <meta property="og:image" content="${spec.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="${lang.replace("-", "_")}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@manga82" />
    <meta name="twitter:creator" content="@manga82" />
    <meta name="twitter:title" content="${escapeHtml(spec.title)}" />
    <meta name="twitter:description" content="${escapeHtml(spec.description)}" />
    <meta name="twitter:image" content="${spec.ogImage}" />
    <script type="application/ld+json">${ld}</script>`;
}

export function buildBody(spec: SnapshotSpec): string {
  const cleaned = sanitizePublicationHtml(spec.content);
  const contentHasH1 = /<h1[\s>]/i.test(cleaned);
  const img = spec.featuredImage;
  const t = AUTHOR_STRINGS[spec.locale];
  const dateStr = fmtDate(spec.datePublished || spec.dateModified, t.localeFmt);
  const dateIso = spec.datePublished || spec.dateModified || "";
  const readBlock = spec.readTime
    ? `<span aria-hidden="true">·</span><span>${spec.readTime} ${t.readSuffix}</span>`
    : "";

  const authorMeta = `
    <div class="author-meta" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:14px;color:#555;margin:0 0 32px;border-top:1px solid #eee;border-bottom:1px solid #eee;padding:12px 0;">
      <span>${t.byline}</span>
      ${dateIso ? `<span aria-hidden="true">·</span><time datetime="${escapeHtml(dateIso)}">${escapeHtml(dateStr)}</time>` : ""}
      ${readBlock}
    </div>`;

  // Crawl paths. Bots reaching an article previously found ZERO internal links,
  // so no equity flowed anywhere and there was no path back to the hub.
  const altNav = [
    spec.alternates.en && spec.locale !== "en" ? `<li><a href="${spec.alternates.en}">English</a></li>` : "",
    spec.alternates["pt-BR"] && spec.locale !== "br" ? `<li><a href="${spec.alternates["pt-BR"]}">Português</a></li>` : "",
    spec.alternates.es && spec.locale !== "es" ? `<li><a href="${spec.alternates.es}">Español</a></li>` : "",
  ]
    .filter(Boolean)
    .join("");

  const nav = `
    <nav aria-label="Site" style="margin:0 0 32px;font-size:14px;">
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:10px 20px;">
        <li><a href="${t.hub}">${t.more}</a></li>
        <li><a href="${t.nav.about}">${t.nav.aboutLabel}</a></li>
        <li><a href="${t.nav.tools}">${t.nav.toolsLabel}</a></li>
        <li><a href="${t.nav.audit}">${t.nav.auditLabel}</a></li>
        ${altNav}
      </ul>
    </nav>`;

  const article = `
    <article>
      ${img ? `<p><img src="${img}" alt="${escapeHtml(spec.title)}" style="max-width:100%;height:auto;" /></p>` : ""}
      ${cleaned || `<p>${escapeHtml(spec.description)}</p>`}
    </article>`;

  return `<header>
      <p style="margin:0 0 8px;font-size:14px;color:#1FB6FF;font-weight:600;letter-spacing:.04em;text-transform:uppercase;">Gabriel Mangabeira — Mangabeira.net</p>
      ${contentHasH1 ? "" : `<h1 style="font-family:Poppins,sans-serif;font-size:40px;line-height:1.15;margin:0 0 16px;color:#0A2540;">${escapeHtml(spec.title)}</h1>`}
      ${authorMeta}
      <p style="font-size:18px;margin:0 0 24px;">${escapeHtml(spec.description)}</p>
    </header>
${nav}
${article}
    <footer style="margin-top:32px;border-top:1px solid #EAF6FA;padding-top:16px;font-size:14px;color:#333;">
      <p><a href="${t.hub}">${t.more}</a> · <a href="${BASE_URL}/">mangabeira.net</a></p>
      <p>© Gabriel Mangabeira</p>
    </footer>`;
}

export function buildFullHtml(spec: SnapshotSpec): string {
  const body = buildBody(spec);
  return `<!doctype html>
<html lang="${HTML_LANG[spec.locale]}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${buildHead(spec)}
  </head>
  <body>
    <div data-prerender="true">
      <div>
${body}
      </div>
    </div>
  </body>
</html>`;
}

export interface SnapshotValidation {
  ok: boolean;
  problems: string[];
}

/**
 * Gate every upload. A snapshot that fails this must never reach the
 * `seo-snapshots` bucket, because storage is served first and a bad object
 * silently becomes the permanent version Googlebot sees.
 */
export function validateSnapshot(html: string, expectedCanonical: string): SnapshotValidation {
  const problems: string[] = [];
  const head = (html.split(/<\/head>/i)[0] || "");
  const body = (html.split(/<body[^>]*>/i)[1] || "");

  const titles = html.match(/<title[\s>]/gi) || [];
  if (titles.length !== 1) problems.push(`expected exactly 1 <title>, found ${titles.length}`);

  const canonicals = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
  if (canonicals.length !== 1) {
    problems.push(`expected exactly 1 canonical, found ${canonicals.length} (${canonicals.join(", ")})`);
  } else if (canonicals[0] !== expectedCanonical) {
    problems.push(`canonical mismatch: got ${canonicals[0]}, expected ${expectedCanonical}`);
  }

  if (!/<h1[\s>]/i.test(body)) problems.push("no <h1> in body");

  const internalLinks = new Set(
    [...body.matchAll(/href="(\/[^"#][^"]*)"/g)].map((m) => m[1])
  );
  if (internalLinks.size < 3) problems.push(`only ${internalLinks.size} internal links (need >= 3)`);

  if (/<!DOCTYPE/i.test(body)) problems.push("nested <!DOCTYPE> inside body");
  if (/<html[\s>]/i.test(body)) problems.push("nested <html> inside body");
  if (/<title[\s>]/i.test(body)) problems.push("<title> leaked into body");

  if (!/application\/ld\+json/i.test(head)) problems.push("no JSON-LD in head");

  const text = body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.split(" ").filter(Boolean).length < 150) problems.push("body text under 150 words");

  return { ok: problems.length === 0, problems };
}
