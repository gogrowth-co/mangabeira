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
      kind: "home",
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
        kind: p.base === "about" ? "about" : "privacy",
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
      kind: "publications-hub",
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
      kind: "tools-hub",
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
      kind: "tokenomics",
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
      kind: "audit",
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
      "slug, status, is_system_page, featured_image, page_translations(language, title, meta_description, slug, content)"
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
        kind: "publication",
        bodyExtra: {
          content: tr.content || "",
          featuredImage: (page as any).featured_image || "",
        },
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

// --- Body content templates ------------------------------------------------

const NAV_BY_LOCALE: Record<Locale, { label: string; items: { href: string; text: string }[] }> = {
  en: {
    label: "Explore",
    items: [
      { href: "/about", text: "About Gabriel" },
      { href: "/publications", text: "Publications" },
      { href: "/tools", text: "Tools" },
      { href: "/tools/tokenomics-simulator", text: "Tokenomics Simulator" },
      { href: "/services/web3-growth-audit", text: "Web3 Growth Audit" },
      { href: "/privacy-policy", text: "Privacy" },
    ],
  },
  br: {
    label: "Explorar",
    items: [
      { href: "/br/sobre", text: "Sobre Gabriel" },
      { href: "/br/artigos", text: "Publicações" },
      { href: "/br/ferramentas", text: "Ferramentas" },
      { href: "/br/ferramentas/simulador-tokenomics", text: "Simulador de Tokenomics" },
      { href: "/br/servicos/web3-auditoria-de-growth", text: "Auditoria de Growth Web3" },
      { href: "/br/politica-de-privacidade", text: "Privacidade" },
    ],
  },
  es: {
    label: "Explorar",
    items: [
      { href: "/es/acerca-de", text: "Acerca de Gabriel" },
      { href: "/es/articulos", text: "Publicaciones" },
      { href: "/es/herramientas", text: "Herramientas" },
      { href: "/es/herramientas/simulador-tokenomics", text: "Simulador de Tokenomics" },
      { href: "/es/servicios/web3-auditoria-de-growth", text: "Auditoría de Growth Web3" },
      { href: "/es/politica-de-privacidad", text: "Privacidad" },
    ],
  },
};

const ALT_LANG_LINKS: Record<Locale, string> = {
  en: `<a href="/br">Português</a> · <a href="/es">Español</a>`,
  br: `<a href="/">English</a> · <a href="/es">Español</a>`,
  es: `<a href="/">English</a> · <a href="/br">Português</a>`,
};

/** Strip HTML tags + collapse whitespace to plain text. */
function htmlToText(html: string, max = 1200): string {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length > max ? stripped.slice(0, max).trimEnd() + "…" : stripped;
}

/** Convert publication HTML to a sanitized subset (h2/h3/p/ul/ol/li/blockquote/strong/em/a). */
function sanitizePublicationHtml(html: string, max = 6000): string {
  // Drop scripts/styles/iframes
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sclass="[^"]*"/gi, "");
  // Truncate
  if (cleaned.length > max) cleaned = cleaned.slice(0, max) + "…";
  return cleaned;
}

function buildBodyContent(spec: RouteSpec): string {
  const nav = NAV_BY_LOCALE[spec.locale];
  const altLangs = ALT_LANG_LINKS[spec.locale];
  const navHtml = `
    <nav aria-label="Primary" style="margin:0 0 32px;">
      <strong style="display:block;margin-bottom:8px;">${nav.label}:</strong>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:12px 20px;">
        ${nav.items.map((i) => `<li><a href="${i.href}">${escapeHtml(i.text)}</a></li>`).join("\n        ")}
      </ul>
      <p style="margin:12px 0 0;font-size:14px;">${altLangs}</p>
    </nav>`;

  const headerHtml = `
    <header>
      <p style="margin:0 0 8px;font-size:14px;color:#1FB6FF;font-weight:600;letter-spacing:.04em;text-transform:uppercase;">Gabriel Mangabeira — Mangabeira.net</p>
      <h1 style="font-family:Poppins,sans-serif;font-size:40px;line-height:1.15;margin:0 0 16px;color:#0A2540;">${escapeHtml(spec.title)}</h1>
      <p style="font-size:18px;margin:0 0 24px;">${escapeHtml(spec.description)}</p>
    </header>`;

  let sectionHtml = "";

  switch (spec.kind) {
    case "publication": {
      const cleaned = sanitizePublicationHtml(spec.bodyExtra?.content || "");
      const img = spec.bodyExtra?.featuredImage;
      sectionHtml = `
    <article>
      ${img ? `<p><img src="${img}" alt="${escapeHtml(spec.title)}" style="max-width:100%;height:auto;" /></p>` : ""}
      ${cleaned || `<p>${escapeHtml(spec.description)}</p>`}
      <p><a href="${spec.canonical}">Read the full article</a></p>
    </article>`;
      break;
    }
    case "publications-hub":
      sectionHtml = `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${spec.locale === "br" ? "Biblioteca de publicações" : spec.locale === "es" ? "Biblioteca de publicaciones" : "Publications library"}</h2>
      <p>${spec.locale === "br" ? "Pesquisa de longo formato e frameworks sobre growth Web3, tokenomics, AEO e marketing impulsionado por IA." : spec.locale === "es" ? "Investigación de formato largo y frameworks sobre growth Web3, tokenomics, AEO y marketing impulsado por IA." : "Long-form research and frameworks on Web3 growth, tokenomics, AEO, and AI-driven marketing."}</p>
    </section>`;
      break;
    case "tools-hub":
      sectionHtml = `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${spec.locale === "br" ? "Ferramentas gratuitas" : spec.locale === "es" ? "Herramientas gratuitas" : "Free tools"}</h2>
      <ul>
        <li><a href="${spec.locale === "en" ? "/tools/tokenomics-simulator" : `/${spec.locale}/${spec.locale === "br" ? "ferramentas/simulador-tokenomics" : "herramientas/simulador-tokenomics"}`}">Tokenomics Simulator</a></li>
      </ul>
    </section>`;
      break;
    case "tokenomics":
      sectionHtml = `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${spec.locale === "br" ? "Sobre o simulador" : spec.locale === "es" ? "Sobre el simulador" : "About the simulator"}</h2>
      <p>${spec.locale === "br" ? "Projete oferta circulante, demanda e preço do seu token em 5 anos com curvas de emissão, vesting e queima. Sem cadastro, 100% no navegador, código aberto." : spec.locale === "es" ? "Proyecta oferta circulante, demanda y precio de tu token a 5 años con curvas de emisión, vesting y quema. Sin registro, 100% en el navegador, código abierto." : "Project circulating supply, demand, and token price over 5 years with emission, vesting, and burn curves. No signup, 100% in-browser, open source."}</p>
    </section>`;
      break;
    case "audit":
      sectionHtml = `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${spec.locale === "br" ? "O que está incluído" : spec.locale === "es" ? "Qué incluye" : "What's included"}</h2>
      <ul>
        <li>${spec.locale === "br" ? "Auditoria do funil de aquisição, conteúdo e conversão" : spec.locale === "es" ? "Auditoría del funnel de adquisición, contenido y conversión" : "Funnel, content, and conversion audit"}</li>
        <li>${spec.locale === "br" ? "Revisão de tokenomics e economia do projeto" : spec.locale === "es" ? "Revisión de tokenomics y economía del proyecto" : "Tokenomics and economy review"}</li>
        <li>${spec.locale === "br" ? "Mapa de oportunidades de growth de 90 dias" : spec.locale === "es" ? "Mapa de oportunidades de growth de 90 días" : "90-day growth opportunity map"}</li>
        <li>${spec.locale === "br" ? "Entrega em 72h. Limitado a 5 clientes/mês." : spec.locale === "es" ? "Entrega en 72h. Limitado a 5 clientes/mes." : "Delivered in 72 hours. Limited to 5 clients/month."}</li>
      </ul>
    </section>`;
      break;
    case "about":
      sectionHtml = `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${spec.locale === "br" ? "Sobre Gabriel" : spec.locale === "es" ? "Acerca de Gabriel" : "About Gabriel"}</h2>
      <p>${spec.locale === "br" ? "Atleta olímpico de duas olimpíadas que se tornou Estrategista de Growth Marketing. Liderou growth na Binance, Coca-Cola e no Comitê Olímpico Internacional. Ajuda empresas Web3, DeFi e IA a escalar com dados, automação e storytelling." : spec.locale === "es" ? "Atleta olímpico de dos olimpiadas convertido en Estratega de Growth Marketing. Lideró growth en Binance, Coca-Cola y el Comité Olímpico Internacional. Ayuda a empresas Web3, DeFi e IA a escalar con datos, automatización y storytelling." : "Two-time Olympian turned Growth Marketing Strategist. Former growth lead at Binance, Coca-Cola, and the International Olympic Committee. Helps Web3, DeFi, and AI companies scale through data, automation, and storytelling."}</p>
    </section>`;
      break;
    case "privacy":
      sectionHtml = `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${spec.locale === "br" ? "Política de Privacidade" : spec.locale === "es" ? "Política de Privacidad" : "Privacy Policy"}</h2>
      <p>${escapeHtml(spec.description)}</p>
    </section>`;
      break;
    case "home":
    default:
      sectionHtml = `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${spec.locale === "br" ? "O que eu faço" : spec.locale === "es" ? "Qué hago" : "What I do"}</h2>
      <p>${spec.locale === "br" ? "Projeto e opero sistemas de growth para empresas baseadas em tokens e startups nativas de IA — combinando análise quantitativa, criativo de performance, automação de ciclo de vida e estratégia de conteúdo AEO/SEO." : spec.locale === "es" ? "Diseño y opero sistemas de growth para empresas basadas en tokens y startups nativas de IA — combinando análisis cuantitativo, creativo de performance, automatización de ciclo de vida y estrategia de contenido AEO/SEO." : "I design and operate growth systems for token-based businesses and AI-native startups — combining quantitative analysis, performance creative, lifecycle automation, and AEO/SEO content strategy."}</p>

      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${spec.locale === "br" ? "Capacidades" : spec.locale === "es" ? "Capacidades" : "Capabilities"}</h2>
      <ul>
        <li>${spec.locale === "br" ? "Estratégia de growth para Web3, DeFi e IA" : spec.locale === "es" ? "Estrategia de growth para Web3, DeFi e IA" : "Growth strategy for Web3, DeFi, and AI products"}</li>
        <li>${spec.locale === "br" ? "Design de tokenomics e simulação econômica de 5 anos" : spec.locale === "es" ? "Diseño de tokenomics y simulación económica de 5 años" : "Tokenomics design and 5-year economic simulation"}</li>
        <li>${spec.locale === "br" ? "Sistemas de comunidade, conteúdo e automação de ciclo de vida" : spec.locale === "es" ? "Sistemas de comunidad, contenido y automatización de ciclo de vida" : "Community, content, and lifecycle automation systems"}</li>
        <li>SEO + AEO (ChatGPT, Claude, Perplexity, Google AI Overviews)</li>
        <li>${spec.locale === "br" ? "Analytics de performance, atribuição e dashboards de receita" : spec.locale === "es" ? "Analytics de performance, atribución y dashboards de ingresos" : "Performance analytics, attribution, and revenue dashboards"}</li>
      </ul>
    </section>`;
  }

  const footerHtml = `
    <footer style="margin-top:32px;border-top:1px solid #EAF6FA;padding-top:16px;font-size:14px;color:#333;">
      <p>© Gabriel Mangabeira — <a href="${BASE_URL}/">mangabeira.net</a></p>
      <p>Connect: <a href="https://x.com/manga82" rel="me noopener">X</a> · <a href="https://linkedin.com/in/mangabeira" rel="me noopener">LinkedIn</a> · <a href="https://medium.com/@mangabeira" rel="me noopener">Medium</a></p>
    </footer>`;

  return `${headerHtml}\n${navHtml}\n${sectionHtml}\n${footerHtml}`;
}

function buildNoscript(spec: RouteSpec): string {
  const nav = NAV_BY_LOCALE[spec.locale];
  const altLangs = ALT_LANG_LINKS[spec.locale];
  return `
      <noscript>
        <div style="font-family:Inter,system-ui,sans-serif;max-width:920px;margin:0 auto;padding:32px 20px;color:#0A2540;line-height:1.6;">
          <h1 style="font-family:Poppins,sans-serif;">${escapeHtml(spec.title)}</h1>
          <p>${escapeHtml(spec.description)}</p>
          <h2>${nav.label}</h2>
          <ul>
            ${nav.items.map((i) => `<li><a href="${i.href}">${escapeHtml(i.text)}</a></li>`).join("\n            ")}
          </ul>
          <p>${altLangs}</p>
          <p>Contact: hello@mangabeira.net</p>
        </div>
      </noscript>`;
}

/**
 * Replace the head section that the baseline index.html ships with.
 * Then rewrite the in-body prerender block and <noscript> fallback per route.
 */
function rewriteHtml(baselineHtml: string, spec: RouteSpec): string {
  let html = baselineHtml;

  // <html lang>
  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${htmlLangFor(spec.locale)}"`);

  // Remove existing baseline head tags we are replacing
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

  // Inject head block
  const block = buildHead(spec);
  html = html.replace(/<\/head>/i, `    ${block}\n  </head>`);

  // Replace the off-screen <div data-prerender="true">…</div> block with route-specific body content
  const newPrerender = `<div data-prerender="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;">
        <div>
${buildBodyContent(spec)}
        </div>
      </div>`;
  html = html.replace(
    /<div\s+data-prerender="true"[\s\S]*?<\/div>\s*<\/div>/i,
    newPrerender
  );

  // Replace the <noscript>…</noscript> block inside #root with route-specific fallback
  html = html.replace(
    /<noscript>\s*<div[\s\S]*?<\/noscript>/i,
    buildNoscript(spec).trim()
  );

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
