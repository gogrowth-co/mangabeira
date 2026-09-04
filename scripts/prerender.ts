// prerender v3.0 — static divorce: all content comes from the in-repo
// `content/` store; no Supabase anywhere in the build.
/**
 * Build-time prerender plugin.
 *
 * After Vite builds the SPA, this plugin clones `dist/index.html` into per-route
 * static HTML files (e.g. `dist/about/index.html`, `dist/br/sobre/index.html`,
 * `dist/publications/some-slug/index.html`) with route-specific <title>, meta
 * description, canonical, hreflang, Open Graph, Twitter, and JSON-LD baked in.
 * Publication routes carry the FULL article body (h1, byline + date, sanitized
 * content, BreadcrumbList + per-article schema) so crawlers and AI fetchers get
 * complete content with no JS — structure mirrors the retired seo-snapshot v3.0
 * edge function (supabase/functions/_shared/snapshot-html.ts), which is the
 * HTML that was ranking.
 *
 * Also emits the discovery files that used to live in Supabase Storage:
 *   dist/sitemap.xml, dist/rss/{en,br,es}.xml, dist/llms.txt,
 *   dist/_redirects-map.json (slug corrections for the Cloudflare worker).
 *
 * Static hosting serves these files from `dist/` as-is, so the FIRST response
 * for these routes contains the correct content for crawlers, AI fetchers, and
 * social unfurlers — no JS needed. React still hydrates into #root after.
 */
import type { Plugin } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import {
  TOOLS_CONTENT,
  faqSchema,
  type FaqEntry,
} from "../src/content/tools-content";

type Locale = "en" | "br" | "es";
const LOCALES: Locale[] = ["en", "br", "es"];
const BASE_URL = "https://mangabeira.net";
const OG_IMAGE = `${BASE_URL}/og-mangabeira.png`;

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

// Audit landing copy lives in its own CSV (key,en,pt-br,es) because the React
// page loads it at runtime via src/lib/auditTranslations.ts. The snapshot reads
// the same file so bots get the audit page in the locale they asked for,
// instead of the English component tree at all three routes.
type AuditDict = Record<string, Record<string, string>>;
const auditDict: AuditDict = {};

async function loadAuditDict(): Promise<void> {
  const raw = await fs.readFile(
    path.resolve("public/translations", "audit.csv"),
    "utf8"
  );
  const parsed = Papa.parse<{ key: string; en: string; "pt-br": string; es: string }>(
    raw,
    { header: true, skipEmptyLines: true }
  );
  for (const row of parsed.data) {
    if (!row.key) continue;
    auditDict[row.key] = {
      en: row.en ?? "",
      br: row["pt-br"] ?? "",
      es: row.es ?? "",
    };
  }
}

/** Audit copy for a locale, falling back to English when a cell is blank. */
const ta = (locale: Locale, key: string, fallback = ""): string =>
  auditDict[key]?.[locale] || auditDict[key]?.en || fallback;

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
  /** Article dates (publications only) — surfaced in JSON-LD + visible byline. */
  datePublished?: string;
  dateModified?: string;
  readTime?: number;
}

// Localized byline strings — must match cloudflare-worker.js BYLINE and the
// retired seo-snapshot builder verbatim (this is the currently-ranking HTML).
const AUTHOR_STRINGS: Record<
  Locale,
  { by: string; role: string; about: string; localeFmt: string; hub: string; more: string }
> = {
  en: {
    by: "By",
    role: "Web3 growth consultant, ex-Olympic athlete",
    about: "/about",
    localeFmt: "en-US",
    hub: "/publications",
    more: "More publications",
  },
  br: {
    by: "Por",
    role: "Consultor de growth Web3, ex-atleta olímpico",
    about: "/br/sobre",
    localeFmt: "pt-BR",
    hub: "/br/artigos",
    more: "Mais artigos",
  },
  es: {
    by: "Por",
    role: "Consultor de growth Web3, ex-atleta olímpico",
    about: "/es/acerca-de",
    localeFmt: "es-ES",
    hub: "/es/articulos",
    more: "Más artículos",
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
    return String(iso).slice(0, 10);
  }
}

// Audit page copy — mirrors the live React components exactly (Web3GrowthAudit.tsx
// mounts the same English-only component tree at all 3 locale routes; there is no
// per-locale copy to translate, so the snapshot must match verbatim, not invent one).
const AUDIT_PRICING: { name: string; price: string; description: string; badge?: string; features: string[] }[] = [
  {
    name: "Starter",
    price: "$197",
    description: "For early teams needing fast clarity.",
    features: ["6–8 key insights", "Light audit + actions", "Delivered in 72 hours", "Notion report"],
  },
  {
    name: "Pro",
    price: "$497",
    description: "For teams who want clarity and a plan.",
    badge: "Best for 90% of teams",
    features: ["Full audit (all channels)", "12–20 high-impact insights", "90-day roadmap", "Loom walkthrough", "Priority delivery"],
  },
  {
    name: "Elite",
    price: "$997",
    description: "For funded teams or major launches.",
    features: ["Everything in Pro", "Deeper cohort & sentiment analysis", "Token + narrative + liquidity loop audit", "Launch/campaign prep insights", "Advanced cross-platform funnel map"],
  },
];

const AUDIT_FAQS: { q: string; a: string }[] = [
  { q: "Do you need private data?", a: "Mostly no. Reddit, Discord, on-chain, SEO & social are public. Dashboards optional." },
  { q: "How fast is delivery?", a: "Within 72 hours." },
  { q: "Who runs the audit?", a: "Me — a former Olympian and Web3 growth operator with 10+ years experience." },
  { q: "What happens after I buy?", a: "You immediately get an intake form + your delivery date." },
  { q: "Do you accept crypto?", a: "Yes — USDC/USDT across major L1s." },
];

/** Service + Offer×3 + FAQPage JSON-LD for the audit money page, matching PricingSection.tsx / FAQSection.tsx verbatim. */
function auditSchemas(canonical: string): unknown[] {
  const faqEntities = AUDIT_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }));
  const offers = AUDIT_PRICING.map((tier) => ({
    "@type": "Offer",
    name: tier.name,
    price: tier.price.replace(/[^0-9.]/g, ""),
    priceCurrency: "USD",
    url: canonical,
    availability: "https://schema.org/InStock",
    description: tier.description,
  }));
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Web3 Growth Audit",
      name: "Web3 Growth Audit",
      description:
        "AI + human Web3 growth audit delivered in 72 hours, covering on-chain, social, community, and funnel insights.",
      url: canonical,
      provider: { "@type": "Person", name: "Gabriel Mangabeira", url: BASE_URL },
      areaServed: "Worldwide",
      offers,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntities,
    },
  ];
}

// --- Site-level schema (mirrors src/components/SEO.tsx so bot HTML carries the
// same Person/Organization/WebSite entities the hydrated DOM injects) ---------

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gabriel Mangabeira",
  url: BASE_URL,
  jobTitle: "Web3 Growth Strategist",
  description:
    "Two-time Olympian turned growth marketing strategist. Former growth lead at Binance, Coca-Cola, and the International Olympic Committee.",
  sameAs: [
    "https://x.com/manga82",
    "https://linkedin.com/in/mangabeira",
    "https://medium.com/@gmangabeira",
  ],
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mangabeira.net",
  url: BASE_URL,
  logo: OG_IMAGE,
  founder: { "@type": "Person", name: "Gabriel Mangabeira" },
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mangabeira.net",
  url: BASE_URL,
  inLanguage: ["en", "pt-BR", "es"],
  publisher: { "@type": "Person", name: "Gabriel Mangabeira", url: BASE_URL },
};

function staticRoutes(
  sysBodies: Record<string, Record<Locale, string>> = {}
): RouteSpec[] {
  const routes: RouteSpec[] = [];

  // Home (3 locales)
  for (const locale of LOCALES) {
    const outPath = locale === "en" ? "" : locale;
    routes.push({
      outPath,
      locale,
      canonical: `${BASE_URL}/${outPath}`.replace(/\/$/, "") || `${BASE_URL}/`,
      // Slash-less, so the en/x-default hreflang matches the canonical and the
      // sitemap <loc> byte for byte. hreflang reciprocity is string-exact:
      // BASE_URL/ vs BASE_URL made the home cluster the only non-reciprocal set.
      alternates: {
        en: BASE_URL,
        "pt-BR": `${BASE_URL}/br`,
        es: `${BASE_URL}/es`,
      },
      title: t(locale, "meta", "page_title"),
      description: t(locale, "meta", "page_description"),
      kind: "home",
      schemas: [PERSON_SCHEMA, ORG_SCHEMA, WEBSITE_SCHEMA],
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
        schemas: p.base === "about" ? [PERSON_SCHEMA] : undefined,
        bodyExtra: { content: sysBodies[p.base]?.[locale] || "" },
      });
    }
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
      schemas: [faqSchema(TOOLS_CONTENT[locale].tools.faqs)],
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
      schemas: [faqSchema(TOOLS_CONTENT[locale].simulator.faqs)],
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
      schemas: auditSchemas(`${BASE_URL}/${audit[locale]}`),
    });
  }

  return routes;
}

// --- Content store: read publications from `content/` -----------------------

const CONTENT_DIR = path.resolve("content");

async function readJson(p: string): Promise<any> {
  return JSON.parse(await fs.readFile(p, "utf8"));
}

/**
 * Loads every published, non-system page from the in-repo content store,
 * shaped like the old Supabase `pages + page_translations(...)` join so the
 * downstream route builders work unchanged (plus dates / reading_time /
 * author for bylines, feeds, and sitemap lastmod).
 */
/**
 * Featured images were uploaded to the (retiring) Supabase `blog-images`
 * bucket; Phase 0 mirrored every file into content/media. Rewrite those URLs
 * to the same-origin /media/ copy so nothing references the dead project.
 */
function rewriteFeaturedImage(url: string | null | undefined): string | null {
  if (!url) return url ?? null;
  if (!/supabase\.co\/storage\//.test(url)) return url;
  const name = url.split("/").pop();
  return name ? `${BASE_URL}/media/${name}` : url;
}

/**
 * System pages (privacy, about) are excluded from fetchPublishedPages by the
 * is_system_page filter, so their translated body never reached the snapshot —
 * bots saw a heading and the meta description only. Load them directly from the
 * content store, keyed by base slug then locale.
 */
async function fetchSystemPageBodies(): Promise<Record<string, Record<Locale, string>>> {
  const rawPages: any[] = await readJson(path.join(CONTENT_DIR, "pages.json"));
  const sysById = new Map<string, string>();
  for (const p of rawPages) {
    if (p.is_system_page && p.status === "published") sysById.set(p.id, p.slug);
  }
  const out: Record<string, Record<Locale, string>> = {};
  for (const locale of LOCALES) {
    const dir = path.join(CONTENT_DIR, locale);
    for (const file of await fs.readdir(dir)) {
      if (!file.endsWith(".json")) continue;
      const tr = await readJson(path.join(dir, file));
      const base = sysById.get(tr.page_id);
      if (!base) continue;
      out[base] ??= { en: "", br: "", es: "" };
      out[base][locale] = tr.content || "";
    }
  }
  return out;
}

async function fetchPublishedPages(): Promise<any[]> {
  const rawPages: any[] = await readJson(path.join(CONTENT_DIR, "pages.json"));
  const pages = rawPages.map((p) => ({
    ...p,
    featured_image: rewriteFeaturedImage(p.featured_image),
  }));
  const byId = new Map<string, any>(
    pages.map((p) => [p.id, { ...p, page_translations: [] as any[] }])
  );
  for (const locale of LOCALES) {
    const dir = path.join(CONTENT_DIR, locale);
    for (const file of await fs.readdir(dir)) {
      if (!file.endsWith(".json")) continue;
      const tr = await readJson(path.join(dir, file));
      const page = byId.get(tr.page_id);
      if (page) page.page_translations.push(tr);
    }
  }
  return [...byId.values()].filter(
    (p) => p.status === "published" && !p.is_system_page
  );
}

/** Publications hub (localized) — built from the same fetched page list as the article routes. */
function hubRoutes(pages: any[]): RouteSpec[] {
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
  const localeKey: Record<Locale, string> = { en: "en", br: "br", es: "es" };

  const routes: RouteSpec[] = [];
  for (const locale of LOCALES) {
    const items: { title: string; href: string; description: string }[] = [];
    for (const page of pages) {
      const trMap = new Map<string, any>();
      for (const tr of page.page_translations || []) trMap.set(tr.language, tr);
      const tr =
        trMap.get(localeKey[locale]) ||
        trMap.get(locale === "br" ? "pt-BR" : locale === "es" ? "es-ES" : locale);
      if (!tr) continue;
      const slug = tr.slug || page.slug;
      items.push({
        title: tr.title || "Untitled",
        href: `/${pubHub[locale]}/${slug}`,
        description: tr.meta_description || "",
      });
    }
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
      bodyExtra: { articles: JSON.stringify(items) },
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Publications by Gabriel Mangabeira",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${BASE_URL}${item.href}`,
            name: item.title,
          })),
        },
      ],
    });
  }
  return routes;
}

function publicationRoutes(pages: any[]): RouteSpec[] {
  const routes: RouteSpec[] = [];
  const localeToHubBase: Record<Locale, string> = {
    en: "publications",
    br: "br/artigos",
    es: "es/articulos",
  };
  const localeKey: Record<Locale, string> = { en: "en", br: "br", es: "es" };

  for (const page of pages) {
    const trMap = new Map<string, any>();
    for (const tr of (page as any).page_translations || []) {
      trMap.set(tr.language, tr);
    }
    const enTr = trMap.get("en");
    const brTr = trMap.get("br") || trMap.get("pt-BR");
    const esTr = trMap.get("es") || trMap.get("es-ES");
    const alts: Record<string, string> = {};
    if (enTr) alts.en = `${BASE_URL}/publications/${enTr.slug || page.slug}`;
    if (brTr) alts["pt-BR"] = `${BASE_URL}/br/artigos/${brTr.slug || page.slug}`;
    if (esTr) alts.es = `${BASE_URL}/es/articulos/${esTr.slug || page.slug}`;

    for (const locale of LOCALES) {
      const tr = trMap.get(localeKey[locale]) || trMap.get(locale);
      if (!tr) continue;
      const slug = tr.slug || page.slug;
      const outPath = `${localeToHubBase[locale]}/${slug}`;
      // Carry the translation's DB schema (Article/FAQPage/Breadcrumb @graph the
      // app injects client-side) into the bot snapshot so non-JS crawlers see it.
      let dbSchemas: unknown[] = [];
      if (tr.schema) {
        try {
          const parsed = typeof tr.schema === "string" ? JSON.parse(tr.schema) : tr.schema;
          dbSchemas = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          console.warn(`[prerender] Invalid DB schema for ${outPath}; skipping.`);
        }
      }
      const canonical = `${BASE_URL}/${outPath}`;
      const strings = AUTHOR_STRINGS[locale];
      const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Mangabeira.net", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: strings.more, item: `${BASE_URL}${strings.hub}` },
          { "@type": "ListItem", position: 3, name: tr.title || "Publication", item: canonical },
        ],
      };
      routes.push({
        outPath,
        locale,
        canonical,
        alternates: alts as RouteSpec["alternates"],
        title: tr.title || "Publication",
        description:
          tr.meta_description || t(locale, "meta", "page_description"),
        ogImage: /^https?:\/\//.test((page as any).featured_image || "") ? (page as any).featured_image : undefined,
        ogType: "article",
        kind: "publication",
        schemas: [breadcrumb, ...dbSchemas],
        datePublished: (page as any).created_at || undefined,
        dateModified: (page as any).updated_at || undefined,
        readTime:
          typeof (page as any).reading_time === "number" && (page as any).reading_time > 0
            ? (page as any).reading_time
            : undefined,
        bodyExtra: {
          content: tr.content || "",
          featuredImage: /^https?:\/\//.test((page as any).featured_image || "") ? (page as any).featured_image : "",
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

/**
 * One entity per page-level type in the emitted JSON-LD.
 *
 * A publication carries hand-authored schema in the CMS (`page_translations.schema`)
 * that usually declares its own Article and BreadcrumbList. Emitting those next to
 * the ones this script generates left two Article and two BreadcrumbList nodes in
 * the same graph, disagreeing on `datePublished` format. Google dedupes, but the
 * page was asserting two versions of one fact.
 *
 * Rule: generated nodes are the floor, authored nodes win. For each singleton type
 * the authored object is merged over the generated one, field by field, so authored
 * values take precedence while generated-only fields (image, publisher,
 * mainEntityOfPage) survive. Types that legitimately repeat are left untouched.
 *
 * `assertNoDuplicateSchemaTypes` enforces the result at build time, so a future
 * article with richer authored schema cannot silently reintroduce the duplication.
 */
const SCHEMA_TYPE_ALIASES: Record<string, string> = {
  Article: "Article",
  BlogPosting: "Article",
  NewsArticle: "Article",
  TechArticle: "Article",
};

/** Page-level types that must appear at most once in a page's graph. */
const SINGLETON_SCHEMA_TYPES = new Set([
  "Article",
  "WebPage",
  "WebSite",
  "BreadcrumbList",
  "FAQPage",
]);

function schemaTypeKey(entity: unknown): string | null {
  if (!entity || typeof entity !== "object") return null;
  const raw = (entity as Record<string, unknown>)["@type"];
  const type = Array.isArray(raw) ? raw[0] : raw;
  if (typeof type !== "string") return null;
  return SCHEMA_TYPE_ALIASES[type] || type;
}

/** Flattens any `@graph` wrappers so every node can be inspected on its own. */
function flattenSchemaNodes(input: unknown[]): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    if (Array.isArray(item)) {
      out.push(...flattenSchemaNodes(item));
      continue;
    }
    const node = item as Record<string, unknown>;
    if (Array.isArray(node["@graph"])) {
      out.push(...flattenSchemaNodes(node["@graph"] as unknown[]));
      continue;
    }
    out.push(node);
  }
  return out;
}

export function normalizeSchemas(input: unknown[]): Record<string, unknown>[] {
  const nodes = flattenSchemaNodes(input);
  const order: string[] = [];
  const byKey = new Map<string, Record<string, unknown>>();
  const passthrough: Record<string, unknown>[] = [];

  for (const node of nodes) {
    const key = schemaTypeKey(node);
    if (!key || !SINGLETON_SCHEMA_TYPES.has(key)) {
      passthrough.push(node);
      continue;
    }
    const existing = byKey.get(key);
    if (!existing) {
      order.push(key);
      byKey.set(key, { ...node });
      continue;
    }
    // Later node is the authored one: its fields win, generated extras remain.
    byKey.set(key, { ...existing, ...node });
  }

  return [...order.map((k) => byKey.get(k)!), ...passthrough];
}

/**
 * Build-time guard. Throws if any emitted page declares a page-level type twice,
 * which fails the Pages build instead of shipping conflicting structured data.
 */
export function assertNoDuplicateSchemaTypes(
  html: string,
  routeLabel: string,
): void {
  const blocks = [
    ...html.matchAll(
      /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  const counts = new Map<string, number>();
  for (const [, body] of blocks) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(body.trim());
    } catch {
      throw new Error(
        `[prerender] ${routeLabel}: emitted JSON-LD is not valid JSON.`,
      );
    }
    for (const node of flattenSchemaNodes(
      Array.isArray(parsed) ? parsed : [parsed],
    )) {
      const key = schemaTypeKey(node);
      if (!key || !SINGLETON_SCHEMA_TYPES.has(key)) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  const dupes = [...counts.entries()].filter(([, n]) => n > 1);
  if (dupes.length) {
    throw new Error(
      `[prerender] ${routeLabel}: duplicate JSON-LD entities ` +
        dupes.map(([t, n]) => `${t}×${n}`).join(", ") +
        `. Page-level types must appear once; see normalizeSchemas().`,
    );
  }
}


// --- Tools copy, shared with the React pages ------------------------------
// Renders the same strings src/components/tools/ToolsProse.tsx renders, using
// <details>/<summary> so the answers sit in the HTML with no JavaScript.

function proseHtml(heading: string, paragraphs: string[]): string {
  return `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${escapeHtml(heading)}</h2>
      ${paragraphs.map((x) => `<p>${escapeHtml(x)}</p>`).join("\n      ")}
    </section>`;
}

function stepsHtml(heading: string, items: { title: string; text: string }[]): string {
  return `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${escapeHtml(heading)}</h2>
      <ol>
        ${items.map((i) => `<li><strong>${escapeHtml(i.title)}</strong> ${escapeHtml(i.text)}</li>`).join("\n        ")}
      </ol>
    </section>`;
}

function faqHtml(heading: string, faqs: FaqEntry[]): string {
  return `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${escapeHtml(heading)}</h2>
      ${faqs
        .map(
          (f) => `<details><summary><strong>${escapeHtml(f.q)}</strong></summary><p>${escapeHtml(f.a)}</p></details>`,
        )
        .join("\n      ")}
    </section>`;
}

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

  const baseSchema: Record<string, unknown> = {
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
    ...(ogType === "article"
      ? {
          publisher: { "@type": "Person", name: "Gabriel Mangabeira", url: BASE_URL },
          mainEntityOfPage: { "@type": "WebPage", "@id": spec.canonical },
        }
      : {}),
  };
  if (spec.datePublished) baseSchema.datePublished = spec.datePublished;
  if (spec.dateModified) baseSchema.dateModified = spec.dateModified;
  const schemas = normalizeSchemas([baseSchema, ...(spec.schemas || [])]);

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

/**
 * Strip scripts/styles/iframes/inline handlers AND any full-document
 * scaffolding pasted into the CMS `content` field. Ported verbatim from
 * supabase/functions/_shared/snapshot-html.ts (v3.0): several articles were
 * authored as complete HTML documents, and embedding their <head> leaked a
 * second <title> + <link rel=canonical> into the page (Google Soft-404s).
 */
function sanitizePublicationHtml(html: string, max = 500000): string {
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

function buildSectionContent(spec: RouteSpec): string {
  let sectionHtml = "";

  switch (spec.kind) {
    case "publication": {
      const cleaned = sanitizePublicationHtml(spec.bodyExtra?.content || "");
      const img = spec.bodyExtra?.featuredImage;
      const strings = AUTHOR_STRINGS[spec.locale];
      const dateIso = spec.datePublished || spec.dateModified || "";
      const dateStr = fmtDate(dateIso, strings.localeFmt);
      const readBlock = spec.readTime
        ? `<span aria-hidden="true">·</span><span>${spec.readTime} ${
            spec.locale === "en" ? "min read" : spec.locale === "br" ? "min de leitura" : "min de lectura"
          }</span>`
        : "";
      // Visible byline + publish date — matches cloudflare-worker.js BYLINE and
      // the seo-snapshot v3.0 author-meta block (the freshness signal every
      // ranking competitor shows).
      const authorMeta = `
      <div class="author-meta" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:14px;color:#555;margin:0 0 32px;border-top:1px solid #eee;border-bottom:1px solid #eee;padding:12px 0;">
        <span>${strings.by} <a href="${strings.about}" style="color:#0A2540;font-weight:600;text-decoration:none;">Gabriel Mangabeira</a> — ${escapeHtml(strings.role)}</span>
        ${dateIso ? `<span aria-hidden="true">·</span><time datetime="${escapeHtml(dateIso)}">${escapeHtml(dateStr)}</time>` : ""}
        ${readBlock}
      </div>`;
      sectionHtml = `${authorMeta}
    <article>
      ${img ? `<p><img src="${img}" alt="${escapeHtml(spec.title)}" style="max-width:100%;height:auto;" /></p>` : ""}
      ${cleaned || `<p>${escapeHtml(spec.description)}</p>`}
    </article>`;
      break;
    }
    case "publications-hub": {
      const items: { title: string; href: string; description: string }[] =
        spec.bodyExtra?.articles ? JSON.parse(spec.bodyExtra.articles) : [];
      const listHtml = items.length
        ? `<ul>
        ${items
          .map(
            (i) =>
              `<li><a href="${i.href}">${escapeHtml(i.title)}</a>${
                i.description ? ` — ${escapeHtml(i.description)}` : ""
              }</li>`
          )
          .join("\n        ")}
      </ul>`
        : `<p>${
            spec.locale === "br"
              ? "Nenhuma publicação encontrada."
              : spec.locale === "es"
              ? "No se encontraron publicaciones."
              : "No publications found."
          }</p>`;
      sectionHtml = `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${spec.locale === "br" ? "Biblioteca de publicações" : spec.locale === "es" ? "Biblioteca de publicaciones" : "Publications library"}</h2>
      <p>${spec.locale === "br" ? "Pesquisa de longo formato e frameworks sobre growth Web3, tokenomics, AEO e marketing impulsionado por IA." : spec.locale === "es" ? "Investigación de formato largo y frameworks sobre growth Web3, tokenomics, AEO y marketing impulsado por IA." : "Long-form research and frameworks on Web3 growth, tokenomics, AEO, and AI-driven marketing."}</p>
      ${listHtml}
    </section>`;
      break;
    }
    case "tools-hub": {
      // Mirrors the live Tools section cards (translations CSV `tools` section).
      const L = spec.locale;
      const simHref = L === "en" ? "/tools/tokenomics-simulator" : `/${L}/${L === "br" ? "ferramentas/simulador-tokenomics" : "herramientas/simulador-tokenomics"}`;
      // Onchain Attribution Kit has no translations-CSV entry; its copy lives in
      // src/pages/tools/strings.ts, so it is appended from there below.
      const kit = {
        en: {
          title: "Onchain Attribution Kit",
          desc: "Connect UTM campaigns to wallet activity. See which channels produce wallets that actually transact.",
        },
        br: {
          title: "Onchain Attribution Kit",
          desc: "Conecte campanhas UTM à atividade de carteiras. Veja quais canais geram carteiras que realmente transacionam.",
        },
        es: {
          title: "Onchain Attribution Kit",
          desc: "Conecta campañas UTM a la actividad de billeteras. Ve qué canales generan billeteras que realmente transaccionan.",
        },
      }[L];
      const cards = ["growth_exp", "web3_roast", "token_health", "shopify"]
        .map((k) => {
          const title = t(L, "tools", `${k}_title`);
          const desc = t(L, "tools", `${k}_description`);
          const cat = t(L, "tools", `${k}_category`);
          return title ? `<li><strong>${escapeHtml(title)}</strong>${cat ? ` (${escapeHtml(cat)})` : ""}${desc ? ` — ${escapeHtml(desc)}` : ""}</li>` : "";
        })
        .filter(Boolean)
        .join("\n        ");
      sectionHtml = `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${escapeHtml(t(L, "tools", "section_title", L === "br" ? "Ferramentas gratuitas" : L === "es" ? "Herramientas gratuitas" : "Free tools"))}</h2>
      <p>${escapeHtml(t(L, "tools", "section_subtitle", ""))}</p>
      <ul>
        <li><a href="${simHref}">${L === "br" ? "Simulador de Tokenomics DeFi (5 anos)" : L === "es" ? "Simulador de Tokenomics DeFi (5 años)" : "DeFi Tokenomics Simulator (5-year)"}</a> — ${L === "br" ? "Projete oferta, demanda e preço do token. Grátis, sem cadastro." : L === "es" ? "Proyecta oferta, demanda y precio del token. Gratis, sin registro." : "Project token supply, demand, and price. Free, no signup."}</li>
        ${cards}
        <li><a href="https://github.com/gmangabeira/onchain-attribution-kit" rel="noopener">${escapeHtml(kit.title)}</a> — ${escapeHtml(kit.desc)}</li>
      </ul>
    </section>` + proseHtml(TOOLS_CONTENT[L].tools.introHeading, TOOLS_CONTENT[L].tools.introParagraphs)
      + faqHtml(TOOLS_CONTENT[L].tools.faqHeading, TOOLS_CONTENT[L].tools.faqs);
      break;
    }
    case "tokenomics": {
      const C = TOOLS_CONTENT[spec.locale].simulator;
      sectionHtml =
        proseHtml(C.aboutHeading, C.aboutParagraphs) +
        stepsHtml(C.howHeading, C.howItems) +
        faqHtml(C.faqHeading, C.faqs);
      break;
    }
    case "audit": {
      // Locale-aware, driven by public/translations/audit.csv — the same file the
      // React page loads at runtime. Before this the snapshot hardcoded English
      // copy from an older version of the page and served it at all three locale
      // routes, so bots got an English sales body under /br/ and /es/.
      const L = spec.locale;
      const h2 = (txt: string) =>
        `<h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${escapeHtml(txt)}</h2>`;
      const li = (txt: string) => `<li>${escapeHtml(txt)}</li>`;

      const proofHtml = [1, 2, 3]
        .map((n) => {
          const title = ta(L, `audit.proof.card${n}.title`);
          if (!title) return "";
          const ctx = ta(L, `audit.proof.card${n}.context`);
          const res = ta(L, `audit.proof.card${n}.result`);
          return `<li><strong>${escapeHtml(title)}</strong>${ctx ? ` ${escapeHtml(ctx)}` : ""}${res ? ` — ${escapeHtml(res)}` : ""}</li>`;
        })
        .filter(Boolean)
        .join("\n        ");

      const stepsHtml = [1, 2, 3]
        .map((n) => {
          const title = ta(L, `audit.process.step${n}.title`);
          if (!title) return "";
          const day = ta(L, `audit.process.step${n}.day`);
          const sub = ta(L, `audit.process.step${n}.subtitle`);
          const items = [1, 2, 3, 4, 5]
            .map((i) => ta(L, `audit.process.step${n}.item${i}`))
            .filter(Boolean)
            .map(li)
            .join("\n            ");
          const footer = ta(L, `audit.process.step${n}.footer`);
          return `<li><strong>${escapeHtml(day)}: ${escapeHtml(title)}</strong>${sub ? ` — ${escapeHtml(sub)}` : ""}
          ${items ? `<ul>\n            ${items}\n          </ul>` : ""}
          ${footer ? `<p>${escapeHtml(footer)}</p>` : ""}</li>`;
        })
        .filter(Boolean)
        .join("\n        ");

      const featuresHtml = [1, 2, 3, 4, 5, 6]
        .map((n) => {
          const title = ta(L, `audit.features.item${n}.title`);
          if (!title) return "";
          const desc = ta(L, `audit.features.item${n}.description`);
          return `<li><strong>${escapeHtml(title)}</strong>${desc ? ` — ${escapeHtml(desc)}` : ""}</li>`;
        })
        .filter(Boolean)
        .join("\n        ");

      const pricingHtml = [1, 2, 3]
        .map((n) => {
          const name = ta(L, `audit.pricing.tier${n}.name`);
          if (!name) return "";
          const price = ta(L, `audit.pricing.tier${n}.price`);
          const badge = ta(L, `audit.pricing.tier${n}.badge`);
          const ideal = ta(L, `audit.pricing.tier${n}.ideal`);
          const feats = [1, 2, 3, 4, 5]
            .map((i) => ta(L, `audit.pricing.tier${n}.feature${i}`))
            .filter(Boolean)
            .map(li)
            .join("\n            ");
          return `<div style="border:1px solid #EAF6FA;border-radius:8px;padding:16px;margin:0 0 12px;">
          <h3 style="font-family:Poppins,sans-serif;font-size:20px;margin:0 0 4px;">${escapeHtml(name)}${badge ? ` — ${escapeHtml(badge)}` : ""}</h3>
          <p style="font-size:28px;font-weight:700;margin:0 0 4px;color:#0A2540;">${escapeHtml(price)}</p>
          ${ideal ? `<p style="margin:0 0 8px;">${escapeHtml(ideal)}</p>` : ""}
          ${feats ? `<ul>\n            ${feats}\n          </ul>` : ""}
        </div>`;
        })
        .filter(Boolean)
        .join("\n      ");

      const faqHtml = [1, 2, 3, 4, 5]
        .map((n) => {
          const q = ta(L, `audit.faq.q${n}.question`);
          if (!q) return "";
          const a = ta(L, `audit.faq.q${n}.answer`);
          return `<li><strong>${escapeHtml(q)}</strong><br />${escapeHtml(a)}</li>`;
        })
        .filter(Boolean)
        .join("\n        ");

      const trust = [1, 2, 3]
        .map((n) => ta(L, `audit.final.trust${n}`))
        .filter(Boolean)
        .join(" · ");

      sectionHtml = `
    <section>
      <p><strong>${escapeHtml(ta(L, "audit.hero.eyebrow"))}</strong></p>
      ${h2(ta(L, "audit.hero.headline"))}
      <p>${escapeHtml(ta(L, "audit.hero.subheadline"))}</p>
      <p>${escapeHtml(ta(L, "audit.hero.trust.label"))} ${escapeHtml(ta(L, "audit.hero.trust.logos"))}</p>

      ${h2(ta(L, "audit.proof.title"))}
      <ul>
        ${proofHtml}
      </ul>
      <p><em>${escapeHtml(ta(L, "audit.proof.caption"))}</em></p>

      ${h2(ta(L, "audit.process.title"))}
      <p>${escapeHtml(ta(L, "audit.process.subtitle"))}</p>
      <ol>
        ${stepsHtml}
      </ol>

      ${h2(ta(L, "audit.features.title"))}
      <ul>
        ${featuresHtml}
      </ul>

      ${h2(ta(L, "audit.pricing.title"))}
      <p>${escapeHtml(ta(L, "audit.pricing.subtitle"))}</p>
      ${pricingHtml}
      <p><em>${escapeHtml(ta(L, "audit.pricing.guarantee"))}</em></p>

      ${h2(ta(L, "audit.faq.title"))}
      <ul>
        ${faqHtml}
      </ul>

      ${h2(ta(L, "audit.final.title"))}
      <p>${escapeHtml(ta(L, "audit.final.subtext"))}</p>
      ${trust ? `<p>${escapeHtml(trust)}</p>` : ""}
    </section>`;
      break;
    }
    case "about": {
      // Mirrors the live About/Journey sections — copy sourced from the same
      // translations CSV the React components render.
      const L = spec.locale;
      const signals = ["olympian", "transition", "leader", "global"]
        .map((s) => {
          const title = t(L, "about", `signal_${s}_title`);
          const desc = t(L, "about", `signal_${s}_desc`);
          return title ? `<li><strong>${escapeHtml(title)}</strong>${desc ? ` — ${escapeHtml(desc)}` : ""}</li>` : "";
        })
        .filter(Boolean)
        .join("\n        ");
      const milestones = ["1999", "2004", "2008", "2014", "2016", "2017", "2020", "2022", "2023", "2025"]
        .map((y) => {
          const role = t(L, "journey", `milestone_${y}_role`);
          const desc = t(L, "journey", `milestone_${y}_desc`);
          const year = t(L, "journey", `milestone_${y}_year`, y);
          return role ? `<li><strong>${escapeHtml(year)} — ${escapeHtml(role)}:</strong> ${escapeHtml(desc)}</li>` : "";
        })
        .filter(Boolean)
        .join("\n        ");
      sectionHtml = `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${escapeHtml(t(L, "about", "section_title", L === "br" ? "Sobre Gabriel" : L === "es" ? "Acerca de Gabriel" : "About Gabriel"))}</h2>
      <p>${escapeHtml(t(L, "about", "narrative_para1", "Two-time Olympian turned Growth Marketing Strategist. Former growth lead at Binance, Coca-Cola, and the International Olympic Committee."))}</p>
      <p>${escapeHtml(t(L, "about", "narrative_para2", ""))}</p>
      ${signals ? `<ul>\n        ${signals}\n      </ul>` : ""}
      ${milestones ? `<h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${escapeHtml(t(L, "journey", "section_title", "Journey"))}</h2>\n      <ul>\n        ${milestones}\n      </ul>` : ""}
    </section>`;
      break;
    }
    case "privacy": {
      // The translated policy lives in the content store; before this it never
      // reached the snapshot, so bots saw a heading and nothing else.
      const policy = sanitizePublicationHtml(spec.bodyExtra?.content || "");
      const heading =
        spec.locale === "br" ? "Política de Privacidade" : spec.locale === "es" ? "Política de Privacidad" : "Privacy Policy";
      // The stored policy carries its own <h1>; only fall back to a heading +
      // description when the content store has nothing for this locale.
      sectionHtml = policy
        ? `
    <section>
      ${policy}
    </section>`
        : `
    <section>
      <h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${heading}</h2>
      <p>${escapeHtml(spec.description)}</p>
    </section>`;
      break;
    }
    case "home":
    default: {
      // Mirrors the live homepage section-by-section (hero, stats, about,
      // case studies, capabilities, methods, testimonials, CTA) using the same
      // translations CSV the React components render from.
      const L = spec.locale;
      const h2 = (text: string) =>
        `<h2 style="font-family:Poppins,sans-serif;font-size:24px;margin:24px 0 8px;">${escapeHtml(text)}</h2>`;

      const heroProofs = ["proof_olympian", "proof_readers", "proof_raised"]
        .map((k) => t(L, "hero", k))
        .filter(Boolean)
        .map((p) => `<li>${escapeHtml(p)}</li>`)
        .join("\n        ");

      const stats = ["olympian", "raised", "readers", "ad_spend"]
        .map((s) => {
          const num = t(L, "social_proof", `stat_${s}_number`);
          const suffix = t(L, "social_proof", `stat_${s}_suffix`);
          const label = t(L, "social_proof", `stat_${s}_label`);
          const sub = t(L, "social_proof", `stat_${s}_subtitle`);
          return num ? `<li><strong>${escapeHtml(num)}${escapeHtml(suffix)} ${escapeHtml(label)}</strong>${sub ? ` — ${escapeHtml(sub)}` : ""}</li>` : "";
        })
        .filter(Boolean)
        .join("\n        ");

      const labelChallenge = t(L, "case_studies", "label_challenge", "Challenge");
      const labelApproach = t(L, "case_studies", "label_approach", "Approach");
      const labelImpact = t(L, "case_studies", "label_impact", "Impact");
      const cases = ["binance", "np", "russell", "coca_cola"]
        .map((c) => {
          const title = t(L, "case_studies", `${c}_title`);
          if (!title) return "";
          const challenge = t(L, "case_studies", `${c}_challenge`);
          const approach = t(L, "case_studies", `${c}_approach`);
          const resultNum = t(L, "case_studies", `${c}_result_number`);
          const resultText = t(L, "case_studies", `${c}_result_text`);
          return `<li><strong>${escapeHtml(title)}.</strong> ${escapeHtml(labelChallenge)}: ${escapeHtml(challenge)} ${escapeHtml(labelApproach)}: ${escapeHtml(approach)} ${escapeHtml(labelImpact)}: <strong>${escapeHtml(resultNum)}</strong> ${escapeHtml(resultText)}</li>`;
        })
        .filter(Boolean)
        .join("\n        ");

      const capabilities = ["ai", "web3", "data"]
        .map((c) => {
          const title = t(L, "capabilities", `${c}_title`);
          if (!title) return "";
          const desc = t(L, "capabilities", `${c}_description`);
          const toolsList = [1, 2, 3].map((i) => t(L, "capabilities", `${c}_tool_${i}`)).filter(Boolean).join(", ");
          return `<li><strong>${escapeHtml(title)}</strong> — ${escapeHtml(desc)}${toolsList ? ` (${escapeHtml(toolsList)})` : ""}</li>`;
        })
        .filter(Boolean)
        .join("\n        ");

      const methods = ["funnel", "loops", "media"]
        .map((m) => {
          const title = t(L, "methods", `${m}_title`);
          if (!title) return "";
          const sub = t(L, "methods", `${m}_subtitle`);
          const desc = t(L, "methods", `${m}_description`);
          return `<li><strong>${escapeHtml(title)}</strong>${sub ? ` (${escapeHtml(sub)})` : ""} — ${escapeHtml(desc)}</li>`;
        })
        .filter(Boolean)
        .join("\n        ");

      const journeyMilestones = ["1999", "2004", "2008", "2014", "2016", "2017", "2020", "2022", "2023", "2025"]
        .map((y) => {
          const role = t(L, "journey", `milestone_${y}_role`);
          if (!role) return "";
          const desc = t(L, "journey", `milestone_${y}_desc`);
          const year = t(L, "journey", `milestone_${y}_year`, y);
          return `<li><strong>${escapeHtml(year)} — ${escapeHtml(role)}:</strong> ${escapeHtml(desc)}</li>`;
        })
        .filter(Boolean)
        .join("\n        ");

      const toolCards = ["growth_exp", "web3_roast", "token_health", "shopify"]
        .map((k) => {
          const title = t(L, "tools", `${k}_title`);
          if (!title) return "";
          const desc = t(L, "tools", `${k}_description`);
          const cat = t(L, "tools", `${k}_category`);
          return `<li><strong>${escapeHtml(title)}</strong>${cat ? ` (${escapeHtml(cat)})` : ""} — ${escapeHtml(desc)}</li>`;
        })
        .filter(Boolean)
        .join("\n        ");

      const pubTeasers = ["web3_athletes", "web2_vs_web3", "vibe_coded"]
        .map((k) => {
          const title = t(L, "publications", `${k}_title`);
          if (!title) return "";
          const desc = t(L, "publications", `${k}_description`);
          return `<li><strong>${escapeHtml(title)}</strong> — ${escapeHtml(desc)}</li>`;
        })
        .filter(Boolean)
        .join("\n        ");

      const testimonials = ["will", "lucas", "jonathan", "lambert"]
        .map((w) => {
          const quote = t(L, "testimonials", `${w}_quote`);
          if (!quote) return "";
          const name = t(L, "testimonials", `${w}_name`);
          const title = t(L, "testimonials", `${w}_title`);
          const company = t(L, "testimonials", `${w}_company`);
          const attribution = [name, title, company].filter(Boolean).join(", ");
          return `<blockquote style="margin:0 0 12px;border-left:3px solid #1FB6FF;padding-left:12px;">"${escapeHtml(quote)}" — <strong>${escapeHtml(attribution)}</strong></blockquote>`;
        })
        .filter(Boolean)
        .join("\n      ");

      sectionHtml = `
    <section>
      ${h2(t(L, "hero", "main_headline", "Growth systems for Web3 and AI-native companies"))}
      <p>${escapeHtml(t(L, "hero", "subheadline", ""))}</p>
      ${heroProofs ? `<ul>\n        ${heroProofs}\n      </ul>` : ""}

      ${h2(t(L, "social_proof", "section_title", "Track record"))}
      <p>${escapeHtml(t(L, "social_proof", "section_subtitle", ""))}</p>
      ${stats ? `<ul>\n        ${stats}\n      </ul>` : ""}

      ${h2(t(L, "about", "section_title", "About Gabriel"))}
      <p>${escapeHtml(t(L, "about", "narrative_para1", ""))}</p>
      <p>${escapeHtml(t(L, "about", "narrative_para2", ""))}</p>

      ${h2(t(L, "case_studies", "section_title", "Case studies"))}
      <p>${escapeHtml(t(L, "case_studies", "section_subtitle", ""))}</p>
      ${cases ? `<ul>\n        ${cases}\n      </ul>` : ""}

      ${h2(t(L, "capabilities", "section_title", "Capabilities"))}
      <p>${escapeHtml(t(L, "capabilities", "section_subtitle", ""))}</p>
      ${capabilities ? `<ul>\n        ${capabilities}\n      </ul>` : ""}

      ${h2(t(L, "methods", "section_title", "Methods"))}
      <p>${escapeHtml(t(L, "methods", "section_subtitle", ""))}</p>
      ${methods ? `<ul>\n        ${methods}\n      </ul>` : ""}

      ${h2(t(L, "journey", "section_title", "Journey"))}
      <p>${escapeHtml(t(L, "journey", "section_subtitle", ""))}</p>
      ${journeyMilestones ? `<ul>\n        ${journeyMilestones}\n      </ul>` : ""}

      ${h2(t(L, "tools", "section_title", "Tools & experiments"))}
      <p>${escapeHtml(t(L, "tools", "section_subtitle", ""))}</p>
      ${toolCards ? `<ul>\n        ${toolCards}\n      </ul>` : ""}

      ${h2(t(L, "publications", "section_title", "Publications"))}
      <p>${escapeHtml(t(L, "publications", "section_subtitle", ""))}</p>
      ${pubTeasers ? `<ul>\n        ${pubTeasers}\n      </ul>` : ""}

      ${h2(t(L, "testimonials", "section_title", "What operators say"))}
      ${testimonials}

      ${h2(t(L, "cta", "section_headline", "Work with me"))}
      <p>${escapeHtml(t(L, "cta", "section_subheadline", ""))}</p>
    </section>`;
    }
  }

  return sectionHtml;
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

  const sectionHtml = buildSectionContent(spec);
  const sectionHasH1 = /<h1[\s>]/i.test(sectionHtml);

  const headerHtml = `
    <header>
      <p style="margin:0 0 8px;font-size:14px;color:#1FB6FF;font-weight:600;letter-spacing:.04em;text-transform:uppercase;">Gabriel Mangabeira — Mangabeira.net</p>
      ${sectionHasH1 ? "" : `<h1 style="font-family:Poppins,sans-serif;font-size:40px;line-height:1.15;margin:0 0 16px;color:#0A2540;">${escapeHtml(spec.title)}</h1>`}
      <p style="font-size:18px;margin:0 0 24px;">${escapeHtml(spec.description)}</p>
    </header>`;

  const footerHtml = `
    <footer style="margin-top:32px;border-top:1px solid #EAF6FA;padding-top:16px;font-size:14px;color:#333;">
      <p>© Gabriel Mangabeira — <a href="${BASE_URL}/">mangabeira.net</a></p>
      <p>Connect: <a href="https://x.com/manga82" rel="me noopener">X</a> · <a href="https://linkedin.com/in/mangabeira" rel="me noopener">LinkedIn</a> · <a href="https://medium.com/@gmangabeira" rel="me noopener">Medium</a></p>
    </footer>`;

  return `${headerHtml}\n${navHtml}\n${sectionHtml}\n${footerHtml}`;
}

function buildNoscript(spec: RouteSpec): string {
  // Intentionally slim: the full route content already sits in the visible
  // <div data-prerender> block, so repeating it here doubled every snapshot's
  // payload and made bot-vs-rendered word counts read ~2x. No-JS visitors
  // still get title, description, and full navigation.
  const nav = NAV_BY_LOCALE[spec.locale];
  const altLangs = ALT_LANG_LINKS[spec.locale];
  return `
      <noscript>
        <div style="font-family:Inter,system-ui,sans-serif;max-width:920px;margin:0 auto;padding:32px 20px;color:#0A2540;line-height:1.6;">
          <p><strong>${escapeHtml(spec.title)}</strong></p>
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
  const newPrerender = `<div data-prerender="true" style="min-height:100vh;">
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

// --- Discovery files (formerly Supabase edge functions) ---------------------

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const cleanSlug = (slug: string | null | undefined): string | null => {
  const trimmed = slug?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Slug-correction redirects, ported verbatim from
 * supabase/functions/seo-snapshot/index.ts (REDIRECTS). Emitted as
 * dist/_redirects-map.json for the Cloudflare worker to consume; a committed
 * copy lives at scripts/redirects-map.json.
 */
const REDIRECTS: Record<string, string> = {
  "/es/articulos/estudo-de-caso-defi-avici":
    "/es/articulos/estudio-de-caso-defi-avici",
  "/br/artigos/checklist-go-to-market-defi":
    "/br/artigos/defi-gtm-checklist",
  "/es/articulos/lista-verificacion-gtm-defi":
    "/es/articulos/defi-gtm-checklist",
  "/es/articulos/web3-seo-guia-definitivo":
    "/es/articulos/web3-seo-guia-definitiva",
  "/es/articulos/seo-defi-lending-dex-yield":
    "/es/articulos/seo-para-protocolos-defi",
};

/** Ports supabase/functions/generate-sitemap — same URL set, hreflang, priorities. */
function buildSitemapXml(pages: any[]): string {
  const baseUrl = BASE_URL;
  const today = new Date().toISOString().split("T")[0];

  const systemPages = [
    { path: "", priority: "1.0", changefreq: "weekly" },
    { path: "br", priority: "1.0", changefreq: "weekly" },
    { path: "es", priority: "1.0", changefreq: "weekly" },
    { path: "publications", priority: "0.9", changefreq: "weekly" },
    { path: "br/artigos", priority: "0.9", changefreq: "weekly" },
    { path: "es/articulos", priority: "0.9", changefreq: "weekly" },
    { path: "about", priority: "0.9", changefreq: "monthly" },
    { path: "br/sobre", priority: "0.9", changefreq: "monthly" },
    { path: "es/acerca-de", priority: "0.9", changefreq: "monthly" },
    { path: "privacy-policy", priority: "0.3", changefreq: "yearly" },
    { path: "br/politica-de-privacidade", priority: "0.3", changefreq: "yearly" },
    { path: "es/politica-de-privacidad", priority: "0.3", changefreq: "yearly" },
    { path: "tools", priority: "0.8", changefreq: "monthly" },
    { path: "br/ferramentas", priority: "0.8", changefreq: "monthly" },
    { path: "es/herramientas", priority: "0.8", changefreq: "monthly" },
    { path: "tools/tokenomics-simulator", priority: "0.8", changefreq: "monthly" },
    { path: "br/ferramentas/simulador-tokenomics", priority: "0.8", changefreq: "monthly" },
    { path: "es/herramientas/simulador-tokenomics", priority: "0.8", changefreq: "monthly" },
    { path: "services/web3-growth-audit", priority: "0.9", changefreq: "monthly" },
    { path: "br/servicos/web3-auditoria-de-growth", priority: "0.9", changefreq: "monthly" },
    { path: "es/servicios/web3-auditoria-de-growth", priority: "0.9", changefreq: "monthly" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  const buildSystemHreflang = (basePath: string) => {
    const pathMap: Record<string, { en: string; br: string; es: string }> = {
      home: { en: "", br: "br", es: "es" },
      publications: { en: "publications", br: "br/artigos", es: "es/articulos" },
      about: { en: "about", br: "br/sobre", es: "es/acerca-de" },
      privacy: { en: "privacy-policy", br: "br/politica-de-privacidade", es: "es/politica-de-privacidad" },
      tokenomics: { en: "tools/tokenomics-simulator", br: "br/ferramentas/simulador-tokenomics", es: "es/herramientas/simulador-tokenomics" },
      tools: { en: "tools", br: "br/ferramentas", es: "es/herramientas" },
      audit: { en: "services/web3-growth-audit", br: "br/servicos/web3-auditoria-de-growth", es: "es/servicios/web3-auditoria-de-growth" },
    };

    let pageType = "home";
    if (basePath.includes("web3-growth-audit") || basePath.includes("web3-auditoria-de-growth")) pageType = "audit";
    else if (basePath.includes("tokenomics") || basePath.includes("simulador-tokenomics")) pageType = "tokenomics";
    else if (basePath.includes("tools") || basePath.includes("ferramentas") || basePath.includes("herramientas")) pageType = "tools";
    else if (basePath.includes("publication") || basePath.includes("artigos") || basePath.includes("articulos")) pageType = "publications";
    else if (basePath.includes("about") || basePath.includes("sobre") || basePath.includes("acerca")) pageType = "about";
    else if (basePath.includes("privacy") || basePath.includes("privacidade") || basePath.includes("privacidad")) pageType = "privacy";

    const paths = pathMap[pageType];
    const enUrl = paths.en ? `${baseUrl}/${paths.en}` : baseUrl;
    const brUrl = `${baseUrl}/${paths.br}`;
    const esUrl = `${baseUrl}/${paths.es}`;

    return `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${brUrl}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>`;
  };

  for (const page of systemPages) {
    const url = page.path ? `${baseUrl}/${page.path}` : baseUrl;
    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${buildSystemHreflang(page.path)}
  </url>
`;
  }

  const sorted = [...pages].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  for (const page of sorted) {
    const lastmod = new Date(page.updated_at).toISOString().split("T")[0];
    const trs: any[] = page.page_translations || [];
    const enTranslation = trs.find((t) => t.language === "en");
    const brTranslation = trs.find((t) => t.language === "br");
    const esTranslation = trs.find((t) => t.language === "es");

    const enSlug = cleanSlug(enTranslation?.slug) || cleanSlug(page.slug);
    const brSlug = cleanSlug(brTranslation?.slug);
    const esSlug = cleanSlug(esTranslation?.slug);

    if (!enTranslation || !enSlug) continue;

    let alternateLinks = `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(`${baseUrl}/publications/${enSlug}`)}"/>`;
    if (brSlug) alternateLinks += `\n    <xhtml:link rel="alternate" hreflang="pt-BR" href="${escapeXml(`${baseUrl}/br/artigos/${brSlug}`)}"/>`;
    if (esSlug) alternateLinks += `\n    <xhtml:link rel="alternate" hreflang="es" href="${escapeXml(`${baseUrl}/es/articulos/${esSlug}`)}"/>`;
    alternateLinks += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${baseUrl}/publications/${enSlug}`)}"/>`;

    const emit = (loc: string) => {
      xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternateLinks}
  </url>
`;
    };

    emit(`${baseUrl}/publications/${enSlug}`);
    if (brTranslation && brSlug) emit(`${baseUrl}/br/artigos/${brSlug}`);
    if (esTranslation && esSlug) emit(`${baseUrl}/es/articulos/${esSlug}`);
  }

  xml += `</urlset>`;
  return xml;
}

/** Ports supabase/functions/generate-rss — one feed per language, same format. */
function buildRssXml(pages: any[], language: Locale): string {
  const feedMetadata: Record<Locale, { title: string; description: string; language: string; pathPrefix: string }> = {
    en: {
      title: "Mangabeira.net - Web3 Growth Marketing",
      description: "Expert insights on Web3, DeFi, and tokenomics",
      language: "en-US",
      pathPrefix: "/publications",
    },
    br: {
      title: "Mangabeira.net - Marketing de Crescimento Web3",
      description: "Insights especializados em Web3, DeFi e tokenomics",
      language: "pt-BR",
      pathPrefix: "/br/artigos",
    },
    es: {
      title: "Mangabeira.net - Marketing de Crecimiento Web3",
      description: "Perspectivas expertas sobre Web3, DeFi y tokenomics",
      language: "es-ES",
      pathPrefix: "/es/articulos",
    },
  };

  const metadata = feedMetadata[language];
  const buildDate = new Date().toUTCString();
  const sorted = [...pages]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 50);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(metadata.title)}</title>
    <link>${BASE_URL}${metadata.pathPrefix}</link>
    <description>${escapeXml(metadata.description)}</description>
    <language>${metadata.language}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss/${language}.xml" rel="self" type="application/rss+xml" />
`;

  for (const page of sorted) {
    const translation = (page.page_translations || []).find(
      (t: any) => t.language === language
    );
    if (!translation || !translation.slug) continue;

    const link = `${BASE_URL}${metadata.pathPrefix}/${translation.slug}`;
    xml += `    <item>
      <title>${escapeXml(translation.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(translation.meta_description || "")}</description>
      <content:encoded><![CDATA[${translation.content || ""}]]></content:encoded>
      <pubDate>${new Date(page.updated_at).toUTCString()}</pubDate>
      <author>${escapeXml(page.author_name || "Gabriel Mangabeira")}</author>
    </item>
`;
  }

  xml += `  </channel>
</rss>`;
  return xml;
}

/** Ports supabase/functions/generate-llms-txt — same headers, order, footer. */
function buildLlmsTxt(pages: any[]): string {
  const HEADER_BY_LANG: Record<string, string> = {
    en: `# llms.txt — mangabeira.net
# Gabriel Mangabeira — Web3 Growth Strategist | Olympian turned Growth Marketing Strategist
# Auto-generated. Last updated: __DATE__

## Site Description

mangabeira.net is the research and writing home of Gabriel Mangabeira — a two-time
Olympian turned Web3 Growth Marketing Strategist. Content covers DeFi growth systems,
tokenomics design, AI-powered growth, pre and post-launch marketing for Web3 protocols,
and on-chain data analysis. All articles include original analysis from primary sources
(Dune Analytics, DefiLlama, on-chain data).

Target audience: DeFi founders, Web3 marketing teams, protocol growth operators.

AI crawlers are authorized to index all content on this site for queries related to
Web3 growth, DeFi marketing, tokenomics, protocol launch strategy, AI-powered growth,
and Gabriel Mangabeira's professional work. Attribution to Gabriel Mangabeira
(mangabeira.net) is requested.

## Author / Entity

- Name: Gabriel Mangabeira
- Role: Growth Marketing Strategist (Web3 + AI)
- Background: Two-time Olympian (sailing), Coca-Cola, Binance, IOC alumni
- Site: ${BASE_URL}
- Contact: hello@mangabeira.net
- Social: https://x.com/manga82 | https://linkedin.com/in/mangabeira | https://medium.com/@gmangabeira

## Key Pages

- ${BASE_URL}/ — Home
- ${BASE_URL}/about — About Gabriel Mangabeira
- ${BASE_URL}/services/web3-growth-audit — Web3 Growth Audit service (72h delivery)
- ${BASE_URL}/tools — Free interactive growth tools
- ${BASE_URL}/tools/tokenomics-simulator — DeFi Tokenomics Simulator
- ${BASE_URL}/publications — All publications

## Primary Articles (English)
`,
    br: `# llms.txt — mangabeira.net (Portuguese)
# Gabriel Mangabeira — Estrategista de Growth Web3
# Auto-generated. Last updated: __DATE__

## Artigos Principais (Português)
`,
    es: `# llms.txt — mangabeira.net (Spanish)
# Gabriel Mangabeira — Estratega de Growth Web3
# Auto-generated. Last updated: __DATE__

## Artículos Principales (Español)
`,
  };

  const PATH_PREFIX: Record<string, string> = {
    en: "/publications",
    br: "/br/artigos",
    es: "/es/articulos",
  };

  const FOOTER = `
## Crawling & Attribution Policy

- All content is original analysis. Quoting with attribution is welcome.
- Preferred attribution: "Gabriel Mangabeira (mangabeira.net)"
- For citation, link to the canonical English URL when possible.
- See robots.txt for crawler-specific allowances.

## Machine-readable resources

- Sitemap: ${BASE_URL}/sitemap.xml
- RSS (EN): ${BASE_URL}/rss/en.xml
- RSS (BR): ${BASE_URL}/rss/br.xml
- RSS (ES): ${BASE_URL}/rss/es.xml
`;

  const sorted = [...pages]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 200);
  const today = new Date().toISOString().split("T")[0];
  const sections: string[] = [];

  for (const lang of LOCALES) {
    const header = HEADER_BY_LANG[lang].replace("__DATE__", today);
    const lines: string[] = [];
    for (const page of sorted) {
      const tr = (page.page_translations || []).find((x: any) => x.language === lang);
      if (!tr) continue;
      const slug = tr.slug || page.slug;
      const url = `${BASE_URL}${PATH_PREFIX[lang]}/${slug}`;
      const desc = (tr.meta_description || tr.title).replace(/\s+/g, " ").trim();
      lines.push(`- ${url}\n  ${desc}`);
    }
    sections.push(header + "\n" + lines.join("\n\n") + "\n");
  }

  return sections.join("\n") + FOOTER;
}

/**
 * llms-full.txt = the hand-authored entity/guidance preamble in
 * public/llms-full.txt, plus a generated per-locale inventory. It used to ship
 * straight from public/ as an English-only static file with zero /br/ or /es/
 * URLs, so an LLM ingesting the "full" file saw a monolingual site.
 */
function buildLlmsFullTxt(pages: any[], preamble: string): string {
  const today = new Date().toISOString().split("T")[0];
  const LANG_LABEL: Record<Locale, string> = {
    en: "English (/)",
    br: "Portuguese — pt-BR (/br)",
    es: "Spanish — es (/es)",
  };
  const PATH_PREFIX: Record<Locale, string> = {
    en: "/publications",
    br: "/br/artigos",
    es: "/es/articulos",
  };
  const sorted = [...pages].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  const out: string[] = [
    preamble.trimEnd(),
    "",
    "## Languages",
    "",
    "This site publishes every article in three languages. Each locale has its own",
    "URL, its own localized slug, and a reciprocal hreflang set. Cite the URL that",
    "matches the language of the answer you are producing.",
    "",
    "- English — https://mangabeira.net/publications/<slug>",
    "- Portuguese (pt-BR) — https://mangabeira.net/br/artigos/<slug>",
    "- Spanish (es) — https://mangabeira.net/es/articulos/<slug>",
    "",
    `## Full content inventory (generated ${today})`,
  ];
  for (const lang of LOCALES) {
    out.push("", `### ${LANG_LABEL[lang]}`, "");
    for (const page of sorted) {
      const tr = (page.page_translations || []).find((x: any) => x.language === lang);
      if (!tr) continue;
      const slug = tr.slug || page.slug;
      const url = `${BASE_URL}${PATH_PREFIX[lang]}/${slug}`;
      const title = (tr.title || "").replace(/\s+/g, " ").trim();
      const desc = (tr.meta_description || "").replace(/\s+/g, " ").trim();
      out.push(`- ${title}`, `  ${url}`);
      if (desc) out.push(`  ${desc}`);
    }
  }
  out.push(
    "",
    "## Machine-readable resources",
    "",
    `- Sitemap: ${BASE_URL}/sitemap.xml`,
    `- llms.txt: ${BASE_URL}/llms.txt`,
    `- RSS (EN): ${BASE_URL}/rss/en.xml`,
    `- RSS (BR): ${BASE_URL}/rss/br.xml`,
    `- RSS (ES): ${BASE_URL}/rss/es.xml`,
    ""
  );
  return out.join("\n");
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

      try {
        await loadAuditDict();
      } catch (e) {
        console.warn("[prerender] Could not load audit.csv:", e);
      }

      const sysBodies = await fetchSystemPageBodies();
      const pages = await fetchPublishedPages();
      const routes = [
        ...staticRoutes(sysBodies),
        ...hubRoutes(pages),
        ...publicationRoutes(pages),
      ];
      let written = 0;

      for (const spec of routes) {
        const html = rewriteHtml(baseline, spec);
        // Fail the build rather than ship conflicting structured data.
        assertNoDuplicateSchemaTypes(html, `/${spec.outPath}`);
        const outDir =
          spec.outPath === ""
            ? distDir
            : path.join(distDir, spec.outPath);
        await fs.mkdir(outDir, { recursive: true });
        const outFile = path.join(outDir, "index.html");
        await fs.writeFile(outFile, html, "utf8");
        if (spec.outPath !== "") {
          const aliasFile = path.join(distDir, `${spec.outPath}.html`);
          await fs.mkdir(path.dirname(aliasFile), { recursive: true });
          await fs.writeFile(aliasFile, html, "utf8");
        }
        written++;
      }

      console.log(`[prerender] Wrote ${written} prerendered HTML files.`);

      // ------ Discovery files (sitemap / RSS / llms.txt) --------------------
      // Formerly generated by Supabase edge functions into a Storage bucket
      // proxied by the Cloudflare worker; now plain files in dist/.
      await fs.writeFile(
        path.join(distDir, "sitemap.xml"),
        buildSitemapXml(pages),
        "utf8"
      );
      await fs.mkdir(path.join(distDir, "rss"), { recursive: true });
      for (const locale of LOCALES) {
        await fs.writeFile(
          path.join(distDir, "rss", `${locale}.xml`),
          buildRssXml(pages, locale),
          "utf8"
        );
      }
      await fs.writeFile(
        path.join(distDir, "llms.txt"),
        buildLlmsTxt(pages),
        "utf8"
      );
      // llms-full.txt: authored preamble from public/, plus a generated
      // three-locale inventory so the "full" file is not English-only.
      try {
        const preamble = await fs.readFile(
          path.resolve("public/llms-full.txt"),
          "utf8"
        );
        await fs.writeFile(
          path.join(distDir, "llms-full.txt"),
          buildLlmsFullTxt(pages, preamble),
          "utf8"
        );
      } catch (e) {
        console.warn("[prerender] Could not build llms-full.txt:", e);
      }

      // ------ Redirects map for the Cloudflare worker -----------------------
      const redirectsJson = JSON.stringify(REDIRECTS, null, 2) + "\n";
      await fs.writeFile(
        path.join(distDir, "_redirects-map.json"),
        redirectsJson,
        "utf8"
      );
      await fs.writeFile(
        path.resolve("scripts", "redirects-map.json"),
        redirectsJson,
        "utf8"
      );

      console.log(
        "[prerender] Wrote sitemap.xml, rss/{en,br,es}.xml, llms.txt, _redirects-map.json."
      );
    },
  };
}

export default prerenderPlugin;
