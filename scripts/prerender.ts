/**
 * Build-time prerender plugin.
 *
 * After Vite builds the SPA, this plugin clones `dist/index.html` into per-route
 * static HTML files (e.g. `dist/about/index.html`, `dist/br/sobre/index.html`,
 * `dist/publications/some-slug/index.html`) with route-specific <title>, meta
 * description, canonical, hreflang, Open Graph, Twitter, and JSON-LD baked in.
 *
 * Lovable hosting serves static files from `dist/` as-is, so the FIRST response
 * for these routes contains the correct metadata for crawlers, AI fetchers, and
 * social unfurlers — no JS needed. React still hydrates into #root after.
 */
import type { Plugin } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";

type Locale = "en" | "br" | "es";
const LOCALES: Locale[] = ["en", "br", "es"];
const BASE_URL = "https://mangabeira.net";
const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/vPREpio8p8h1iruSSNkQMQeWPo62/social-images/social-1759804725149-og-mangabeira.png";

// --- Translations -----------------------------------------------------------

type Dict = Record<string, Record<string, string>>;
const dicts: Record<Locale, Dict> = { en: {}, br: {}, es: {} };

async function loadDict(locale: Locale): Promise<Dict> {
  const csvPath = path.resolve("public/translations", `${locale}.csv`);
  const raw = await fs.readFile(csvPath, "utf8");
  const parsed = Papa.parse<{ section: string; key: string; text: string }>(
    raw,
    { header: true, skipEmptyLines: true }
  );
  const out: Dict = {};
  for (const row of parsed.data) {
    if (!row.section || !row.key) continue;
    out[row.section] ??= {};
    out[row.section][row.key] = row.text ?? "";
  }
  return out;
}

const t = (locale: Locale, section: string, key: string, fallback = "") =>
  dicts[locale]?.[section]?.[key] || fallback;

// --- htmlLang helper --------------------------------------------------------

const htmlLangFor = (locale: Locale) =>
  locale === "br" ? "pt-BR" : locale === "es" ? "es" : "en";

// --- Route manifest ---------------------------------------------------------

interface RouteSpec {
  /** URL path, no leading slash, no trailing slash. '' = home. */
  outPath: string;
  locale: Locale;
  /** Canonical URL (absolute). */
  canonical: string;
  /** hreflang map. */
  alternates: Partial<Record<"en" | "pt-BR" | "es", string>>;
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  /** Optional JSON-LD blocks; each must be an object or array. */
  schemas?: unknown[];
  /** Page kind — drives the body content template. */
  kind?: "home" | "about" | "privacy" | "publications-hub" | "tools-hub" | "tokenomics" | "audit" | "publication";
  /** Extra context for body templates (publication body, etc.). */
  bodyExtra?: Record<string, string>;
}

function staticRoutes(): RouteSpec[] {
  const routes: RouteSpec[] = [];

  // Home (3 locales)
  for (const locale of LOCALES) {
    const outPath = locale === "en" ? "" : locale;
    routes.push({
      outPath,
      locale,
      canonical: `${BASE_URL}/${outPath}`.replace(/\/$/, "") || `${BASE_URL}/`,
      alternates: {
        en: `${BASE_URL}/`,
        "pt-BR": `${BASE_URL}/br`,
        es: `${BASE_URL}/es`,
      },
      title: t(locale, "meta", "page_title"),
      description: t(locale, "meta", "page_description"),
    });
  }

  // About / Privacy (system pages, localized slugs)
  const sysPages = [
    {
      base: "about",
      slugs: { en: "about", br: "sobre", es: "acerca-de" } as Record<Locale, string>,
      titles: {
        en: "About Gabriel Mangabeira",
        br: "Sobre Gabriel Mangabeira",
        es: "Acerca de Gabriel Mangabeira",
      } as Record<Locale, string>,
    },
    {
      base: "privacy-policy",
      slugs: {
        en: "privacy-policy",
        br: "politica-de-privacidade",
        es: "politica-de-privacidad",
      } as Record<Locale, string>,
      titles: {
        en: "Privacy Policy",
        br: "Política de Privacidade",
        es: "Política de Privacidad",
      } as Record<Locale, string>,
    },
  ];

  for (const p of sysPages) {
    const altMap = {
      en: `${BASE_URL}/${p.slugs.en}`,
      "pt-BR": `${BASE_URL}/br/${p.slugs.br}`,
      es: `${BASE_URL}/es/${p.slugs.es}`,
    };
    for (const locale of LOCALES) {
      const slug = p.slugs[locale];
      const outPath = locale === "en" ? slug : `${locale}/${slug}`;
      routes.push({
        outPath,
        locale,
        canonical: `${BASE_URL}/${outPath}`,
        alternates: altMap,
        title: `${p.titles[locale]} | Gabriel Mangabeira`,
        description: t(locale, "meta", "page_description"),
      });
    }
  }

  // Publications hub (localized)
  const pubHub: Record<Locale, string> = {
    en: "publications",
    br: "br/artigos",
    es: "es/articulos",
  };
  const pubAlts = {
    en: `${BASE_URL}/publications`,
    "pt-BR": `${BASE_URL}/br/artigos`,
    es: `${BASE_URL}/es/articulos`,
  };
  for (const locale of LOCALES) {
    routes.push({
      outPath: pubHub[locale],
      locale,
      canonical: `${BASE_URL}/${pubHub[locale]}`,
      alternates: pubAlts,
      title:
        t(locale, "publications_hub", "page_title") ||
        (locale === "br"
          ? "Publicações | Gabriel Mangabeira"
          : locale === "es"
          ? "Publicaciones | Gabriel Mangabeira"
          : "Publications | Gabriel Mangabeira"),
      description:
        t(locale, "publications_hub", "page_description") ||
        t(locale, "meta", "page_description"),
    });
  }

  // Tools hub
  const toolsHub: Record<Locale, string> = {
    en: "tools",
    br: "br/ferramentas",
    es: "es/herramientas",
  };
  const toolsAlts = {
    en: `${BASE_URL}/tools`,
    "pt-BR": `${BASE_URL}/br/ferramentas`,
    es: `${BASE_URL}/es/herramientas`,
  };
  for (const locale of LOCALES) {
    routes.push({
      outPath: toolsHub[locale],
      locale,
      canonical: `${BASE_URL}/${toolsHub[locale]}`,
      alternates: toolsAlts,
      title:
        locale === "br"
          ? "Ferramentas | Gabriel Mangabeira"
          : locale === "es"
          ? "Herramientas | Gabriel Mangabeira"
          : "Tools | Gabriel Mangabeira",
      description:
        locale === "br"
          ? "Ferramentas gratuitas e calculadoras para growth Web3, DeFi e tokenomics."
          : locale === "es"
          ? "Herramientas gratuitas y calculadoras para growth Web3, DeFi y tokenomics."
          : "Free tools and calculators for Web3, DeFi, and tokenomics growth.",
    });
  }

  // Tokenomics simulator
  const tokSim: Record<Locale, string> = {
    en: "tools/tokenomics-simulator",
    br: "br/ferramentas/simulador-tokenomics",
    es: "es/herramientas/simulador-tokenomics",
  };
  const tokAlts = {
    en: `${BASE_URL}/tools/tokenomics-simulator`,
    "pt-BR": `${BASE_URL}/br/ferramentas/simulador-tokenomics`,
    es: `${BASE_URL}/es/herramientas/simulador-tokenomics`,
  };
  for (const locale of LOCALES) {
    routes.push({
      outPath: tokSim[locale],
      locale,
      canonical: `${BASE_URL}/${tokSim[locale]}`,
      alternates: tokAlts,
      title:
        locale === "br"
          ? "Simulador de Tokenomics DeFi (5 anos) | Gabriel Mangabeira"
          : locale === "es"
          ? "Simulador de Tokenomics DeFi (5 años) | Gabriel Mangabeira"
          : "DeFi Tokenomics Simulator (5-year) | Gabriel Mangabeira",
      description:
        locale === "br"
          ? "Simule oferta, demanda e preço do seu token em 5 anos. Grátis, sem cadastro."
          : locale === "es"
          ? "Simula oferta, demanda y precio de tu token a 5 años. Gratis, sin registro."
          : "Simulate token supply, demand, and price over 5 years. Free, no signup.",
    });
  }

  // Web3 Growth Audit
  const audit: Record<Locale, string> = {
    en: "services/web3-growth-audit",
    br: "br/servicos/web3-auditoria-de-growth",
    es: "es/servicios/web3-auditoria-de-growth",
  };
  const auditAlts = {
    en: `${BASE_URL}/services/web3-growth-audit`,
    "pt-BR": `${BASE_URL}/br/servicos/web3-auditoria-de-growth`,
    es: `${BASE_URL}/es/servicios/web3-auditoria-de-growth`,
  };
  for (const locale of LOCALES) {
    routes.push({
      outPath: audit[locale],
      locale,
      canonical: `${BASE_URL}/${audit[locale]}`,
      alternates: auditAlts,
      title:
        locale === "br"
          ? "Auditoria de Growth Web3 (72h) | Gabriel Mangabeira"
          : locale === "es"
          ? "Auditoría de Growth Web3 (72h) | Gabriel Mangabeira"
          : "Web3 Growth Audit (72h delivery) | Gabriel Mangabeira",
      description:
        locale === "br"
          ? "Auditoria de funil, conteúdo, tokenomics e aquisição em 72h. 5 clientes/mês."
          : locale === "es"
          ? "Auditoría de funnel, contenido, tokenomics y adquisición en 72h. 5 clientes/mes."
          : "72-hour deep audit of your funnel, content, tokenomics, and acquisition. 5 clients/month.",
    });
  }

  return routes;
}

// --- Supabase: fetch publications ------------------------------------------

async function publicationRoutes(): Promise<RouteSpec[]> {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.warn(
      "[prerender] No Supabase env vars; skipping publication prerender."
    );
    return [];
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("pages")
    .select(
      "slug, status, is_system_page, featured_image, page_translations(language, title, meta_description, slug)"
    )
    .eq("status", "published")
    .eq("is_system_page", false);

  if (error) {
    console.warn("[prerender] Supabase fetch failed:", error.message);
    return [];
  }

  const routes: RouteSpec[] = [];
  const localeToHubBase: Record<Locale, string> = {
    en: "publications",
    br: "br/artigos",
    es: "es/articulos",
  };
  const localeKey: Record<Locale, string> = { en: "en", br: "pt-BR", es: "es-ES" };

  for (const page of data || []) {
    const trMap = new Map<string, any>();
    for (const tr of (page as any).page_translations || []) {
      trMap.set(tr.language, tr);
    }
    // Build alt map (use english slug as fallback)
    const enTr = trMap.get("en");
    const brTr = trMap.get("pt-BR") || trMap.get("br");
    const esTr = trMap.get("es-ES") || trMap.get("es");
    const alts: Record<string, string> = {};
    if (enTr) alts.en = `${BASE_URL}/publications/${enTr.slug || page.slug}`;
    if (brTr) alts["pt-BR"] = `${BASE_URL}/br/artigos/${brTr.slug || page.slug}`;
    if (esTr) alts.es = `${BASE_URL}/es/articulos/${esTr.slug || page.slug}`;

    for (const locale of LOCALES) {
      const tr = trMap.get(localeKey[locale]) || trMap.get(locale);
      if (!tr) continue;
      const slug = tr.slug || page.slug;
      const outPath = `${localeToHubBase[locale]}/${slug}`;
      routes.push({
        outPath,
        locale,
        canonical: `${BASE_URL}/${outPath}`,
        alternates: alts as RouteSpec["alternates"],
        title: tr.title || "Publication",
        description:
          tr.meta_description || t(locale, "meta", "page_description"),
        ogImage: (page as any).featured_image || undefined,
        ogType: "article",
      });
    }
  }
  return routes;
}

// --- HTML rewrite -----------------------------------------------------------

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function buildHead(spec: RouteSpec): string {
  const lang = htmlLangFor(spec.locale);
  const ogImage = spec.ogImage || OG_IMAGE;
  const ogType = spec.ogType || "website";

  const altLinks = [
    spec.alternates.en
      ? `<link rel="alternate" hreflang="en" href="${spec.alternates.en}" />`
      : "",
    spec.alternates["pt-BR"]
      ? `<link rel="alternate" hreflang="pt-BR" href="${spec.alternates["pt-BR"]}" />`
      : "",
    spec.alternates.es
      ? `<link rel="alternate" hreflang="es" href="${spec.alternates.es}" />`
      : "",
    spec.alternates.en
      ? `<link rel="alternate" hreflang="x-default" href="${spec.alternates.en}" />`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": ogType === "article" ? "Article" : "WebPage",
    url: spec.canonical,
    name: spec.title,
    headline: spec.title,
    description: spec.description,
    inLanguage: lang,
    image: ogImage,
    isPartOf: {
      "@type": "WebSite",
      url: BASE_URL,
      name: "Mangabeira.net",
    },
    author: {
      "@type": "Person",
      name: "Gabriel Mangabeira",
      url: BASE_URL,
    },
  };
  const schemas = [baseSchema, ...(spec.schemas || [])];

  return `<title>${escapeHtml(spec.title)}</title>
    <meta name="title" content="${escapeHtml(spec.title)}" />
    <meta name="description" content="${escapeHtml(spec.description)}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${spec.canonical}" />
    ${altLinks}
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="Gabriel Mangabeira" />
    <meta property="og:title" content="${escapeHtml(spec.title)}" />
    <meta property="og:description" content="${escapeHtml(spec.description)}" />
    <meta property="og:url" content="${spec.canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="${lang.replace("-", "_")}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@manga82" />
    <meta name="twitter:creator" content="@manga82" />
    <meta name="twitter:title" content="${escapeHtml(spec.title)}" />
    <meta name="twitter:description" content="${escapeHtml(spec.description)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <script type="application/ld+json">${JSON.stringify(schemas).replace(/</g, "\\u003c")}</script>`;
}

/**
 * Replace the head section that the baseline index.html ships with.
 * We strip:
 *   - <title>...</title>
 *   - any <meta name="description"|"title"|"robots"> ...
 *   - any <link rel="canonical"|"alternate" hreflang=...>
 *   - any <meta property="og:..."> / <meta name="twitter:...">
 *   - any existing <script type="application/ld+json"> blocks
 * Then inject the per-route block right before </head>.
 * Also rewrites <html lang="...">.
 */
function rewriteHtml(baselineHtml: string, spec: RouteSpec): string {
  let html = baselineHtml;

  // <html lang>
  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${htmlLangFor(spec.locale)}"`);

  // Remove existing baseline tags we are replacing
  const removers: RegExp[] = [
    /<title>[\s\S]*?<\/title>/i,
    /<meta\s+name="title"[^>]*>\s*/gi,
    /<meta\s+name="description"[^>]*>\s*/gi,
    /<meta\s+name="robots"[^>]*>\s*/gi,
    /<link\s+rel="canonical"[^>]*>\s*/gi,
    /<link\s+rel="alternate"[^>]*hreflang="[^"]*"[^>]*>\s*/gi,
    /<meta\s+property="og:[^"]+"[^>]*>\s*/gi,
    /<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi,
    /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi,
  ];
  for (const re of removers) html = html.replace(re, "");

  // Inject before </head>
  const block = buildHead(spec);
  html = html.replace(/<\/head>/i, `    ${block}\n  </head>`);

  return html;
}

// --- Plugin -----------------------------------------------------------------

export function prerenderPlugin(): Plugin {
  return {
    name: "mangabeira-prerender",
    apply: "build",
    async closeBundle() {
      const distDir = path.resolve("dist");
      const baselinePath = path.join(distDir, "index.html");
      let baseline: string;
      try {
        baseline = await fs.readFile(baselinePath, "utf8");
      } catch {
        console.warn("[prerender] dist/index.html missing; skipping.");
        return;
      }

      // Load translation dicts
      for (const locale of LOCALES) {
        try {
          dicts[locale] = await loadDict(locale);
        } catch (e) {
          console.warn(`[prerender] Could not load ${locale}.csv:`, e);
        }
      }

      const routes = [...staticRoutes(), ...(await publicationRoutes())];
      let written = 0;

      for (const spec of routes) {
        const html = rewriteHtml(baseline, spec);
        const outDir =
          spec.outPath === ""
            ? distDir
            : path.join(distDir, spec.outPath);
        await fs.mkdir(outDir, { recursive: true });
        const outFile = path.join(outDir, "index.html");
        // Don't overwrite the root index.html with the home spec — the SPA
        // fallback also lives there. But we DO want home meta there.
        // The home route's outPath === "" so this writes dist/index.html,
        // which is exactly what we want (replaces baseline meta with home meta).
        await fs.writeFile(outFile, html, "utf8");
        written++;
      }

      console.log(`[prerender] Wrote ${written} prerendered HTML files.`);
    },
  };
}

export default prerenderPlugin;
