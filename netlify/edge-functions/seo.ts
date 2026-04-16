// Netlify Edge Function: Server-side SEO meta injection
// Runs on ALL traffic (bots + humans) to ensure <head> always has correct metadata

import type { Context } from "@netlify/edge-functions";

const BASE_URL = "https://mangabeira.net";
const SUPABASE_URL = "https://hetemmltaoirimmoxzku.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldGVtbWx0YW9pcmltbW94emt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODE5NjEsImV4cCI6MjA3NDk1Nzk2MX0.Jh6v2KAxq6o4LYaqyqtiJna5i9mvmMazs51CZlLGdpI";

const OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/vPREpio8p8h1iruSSNkQMQeWPo62/social-images/social-1759804725149-og-mangabeira.png";

// ─── In-memory cache ─────────────────────────────────────────────────────
interface CacheEntry { data: PageMeta | null; ts: number; }
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// ─── Types ───────────────────────────────────────────────────────────────
interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogType: string;
  ogImage?: string;
  locale: string;
  htmlLang: string;
  schema?: object[];
  alternates: { lang: string; href: string }[];
}

type Locale = "en" | "br" | "es";

// ─── Route parsing ───────────────────────────────────────────────────────
interface ParsedRoute {
  locale: Locale;
  type: "home" | "about" | "privacy" | "publications-hub" | "publication" | "tools-hub" | "tokenomics" | "audit" | "audit-success" | "unknown";
  slug?: string;
}

function parseRoute(pathname: string): ParsedRoute {
  const p = pathname.replace(/\/+$/, "") || "/";

  if (p === "/") return { locale: "en", type: "home" };
  if (p === "/br") return { locale: "br", type: "home" };
  if (p === "/es") return { locale: "es", type: "home" };

  if (p === "/about") return { locale: "en", type: "about" };
  if (p === "/br/sobre") return { locale: "br", type: "about" };
  if (p === "/es/acerca-de") return { locale: "es", type: "about" };

  if (p === "/privacy-policy") return { locale: "en", type: "privacy" };
  if (p === "/br/politica-de-privacidade") return { locale: "br", type: "privacy" };
  if (p === "/es/politica-de-privacidad") return { locale: "es", type: "privacy" };

  if (p === "/publications") return { locale: "en", type: "publications-hub" };
  if (p === "/br/artigos") return { locale: "br", type: "publications-hub" };
  if (p === "/es/articulos") return { locale: "es", type: "publications-hub" };

  if (p === "/tools") return { locale: "en", type: "tools-hub" };
  if (p === "/br/ferramentas") return { locale: "br", type: "tools-hub" };
  if (p === "/es/herramientas") return { locale: "es", type: "tools-hub" };

  if (p === "/tools/tokenomics-simulator") return { locale: "en", type: "tokenomics" };
  if (p === "/br/ferramentas/simulador-tokenomics") return { locale: "br", type: "tokenomics" };
  if (p === "/es/herramientas/simulador-tokenomics") return { locale: "es", type: "tokenomics" };

  if (p === "/services/web3-growth-audit") return { locale: "en", type: "audit" };
  if (p === "/br/servicos/web3-auditoria-de-growth") return { locale: "br", type: "audit" };
  if (p === "/es/servicios/web3-auditoria-de-growth") return { locale: "es", type: "audit" };

  if (p === "/services/web3-growth-audit/payment-success") return { locale: "en", type: "audit-success" };

  const enPub = p.match(/^\/publications\/(.+)$/);
  if (enPub) return { locale: "en", type: "publication", slug: enPub[1] };
  const brPub = p.match(/^\/br\/artigos\/(.+)$/);
  if (brPub) return { locale: "br", type: "publication", slug: brPub[1] };
  const esPub = p.match(/^\/es\/articulos\/(.+)$/);
  if (esPub) return { locale: "es", type: "publication", slug: esPub[1] };

  if (p.startsWith("/br/")) return { locale: "br", type: "unknown" };
  if (p.startsWith("/es/")) return { locale: "es", type: "unknown" };

  return { locale: "en", type: "unknown" };
}

// ─── Static metadata ─────────────────────────────────────────────────────
function getHtmlLang(locale: Locale): string {
  return locale === "br" ? "pt-BR" : locale === "es" ? "es" : "en";
}

function homeAlternates(): { lang: string; href: string }[] {
  return [
    { lang: "en", href: `${BASE_URL}/` },
    { lang: "pt-BR", href: `${BASE_URL}/br` },
    { lang: "es", href: `${BASE_URL}/es` },
    { lang: "x-default", href: `${BASE_URL}/` },
  ];
}

function buildAlternates(enPath: string, brPath: string, esPath: string): { lang: string; href: string }[] {
  return [
    { lang: "en", href: `${BASE_URL}${enPath}` },
    { lang: "pt-BR", href: `${BASE_URL}${brPath}` },
    { lang: "es", href: `${BASE_URL}${esPath}` },
    { lang: "x-default", href: `${BASE_URL}${enPath}` },
  ];
}

function getStaticMeta(route: ParsedRoute): PageMeta | null {
  const locale = route.locale;
  const htmlLang = getHtmlLang(locale);

  const metaMap: Record<string, () => PageMeta> = {
    home: () => {
      const titles: Record<Locale, string> = {
        en: "Gabriel Mangabeira | Olympian & Growth Marketing Strategist",
        br: "Gabriel Mangabeira | Olimpiano & Estrategista de Growth Marketing",
        es: "Gabriel Mangabeira | Olímpico & Estratega de Growth Marketing",
      };
      const descs: Record<Locale, string> = {
        en: "Gabriel Mangabeira — Olympian turned Growth Marketing Strategist. Blending AI, Web3, and performance marketing to deliver measurable growth.",
        br: "Gabriel Mangabeira — Olimpiano transformado em Estrategista de Growth Marketing. Combinando IA, Web3 e marketing de performance para entregar crescimento mensurável.",
        es: "Gabriel Mangabeira — Olímpico convertido en Estratega de Growth Marketing. Combinando IA, Web3 y marketing de rendimiento para entregar crecimiento medible.",
      };
      const canonicals: Record<Locale, string> = { en: `${BASE_URL}/`, br: `${BASE_URL}/br`, es: `${BASE_URL}/es` };
      return {
        title: titles[locale], description: descs[locale], canonical: canonicals[locale],
        ogType: "website", ogImage: OG_IMAGE, locale, htmlLang,
        alternates: homeAlternates(),
      };
    },
    about: () => {
      const titles: Record<Locale, string> = {
        en: "About Gabriel Mangabeira | Olympian & Growth Marketing Strategist",
        br: "Sobre Gabriel Mangabeira | Olimpiano & Estrategista de Growth Marketing",
        es: "Sobre Gabriel Mangabeira | Olímpico & Estratega de Growth Marketing",
      };
      const descs: Record<Locale, string> = {
        en: "From Olympic discipline to Web3 growth strategy — discover how Gabriel Mangabeira blends AI, data, and storytelling to help brands grow with precision and focus.",
        br: "Da disciplina olímpica à estratégia de crescimento Web3 — descubra como Gabriel Mangabeira combina IA, dados e storytelling para ajudar marcas a crescer com precisão e foco.",
        es: "De la disciplina olímpica a la estrategia de crecimiento Web3 — descubre cómo Gabriel Mangabeira combina IA, datos y storytelling para ayudar a marcas a crecer con precisión y enfoque.",
      };
      const paths: Record<Locale, string> = { en: "/about", br: "/br/sobre", es: "/es/acerca-de" };
      return {
        title: titles[locale], description: descs[locale], canonical: `${BASE_URL}${paths[locale]}`,
        ogType: "profile", ogImage: OG_IMAGE, locale, htmlLang,
        alternates: buildAlternates("/about", "/br/sobre", "/es/acerca-de"),
      };
    },
    privacy: () => {
      const paths: Record<Locale, string> = { en: "/privacy-policy", br: "/br/politica-de-privacidade", es: "/es/politica-de-privacidad" };
      return {
        title: "Privacy Policy | Gabriel Mangabeira",
        description: "Read the Privacy Policy for mangabeira.net — learn how we collect, use, and protect your information.",
        canonical: `${BASE_URL}${paths[locale]}`, ogType: "website", ogImage: OG_IMAGE, locale, htmlLang,
        alternates: buildAlternates("/privacy-policy", "/br/politica-de-privacidade", "/es/politica-de-privacidad"),
      };
    },
    "publications-hub": () => {
      const titles: Record<Locale, string> = {
        en: "Publications | Gabriel Mangabeira",
        br: "Artigos | Gabriel Mangabeira",
        es: "Artículos | Gabriel Mangabeira",
      };
      const descs: Record<Locale, string> = {
        en: "Explore articles on Web3 growth, AI marketing, tokenomics, and digital strategy by Gabriel Mangabeira.",
        br: "Explore artigos sobre crescimento Web3, marketing com IA, tokenomics e estratégia digital por Gabriel Mangabeira.",
        es: "Explora artículos sobre crecimiento Web3, marketing con IA, tokenomics y estrategia digital por Gabriel Mangabeira.",
      };
      const paths: Record<Locale, string> = { en: "/publications", br: "/br/artigos", es: "/es/articulos" };
      return {
        title: titles[locale], description: descs[locale], canonical: `${BASE_URL}${paths[locale]}`,
        ogType: "website", ogImage: OG_IMAGE, locale, htmlLang,
        alternates: buildAlternates("/publications", "/br/artigos", "/es/articulos"),
      };
    },
    "tools-hub": () => {
      const titles: Record<Locale, string> = {
        en: "Free Growth Tools | Gabriel Mangabeira",
        br: "Ferramentas Gratuitas de Growth | Gabriel Mangabeira",
        es: "Herramientas Gratuitas de Growth | Gabriel Mangabeira",
      };
      const descs: Record<Locale, string> = {
        en: "Free interactive tools for Web3 founders — tokenomics simulator, growth calculators, and more.",
        br: "Ferramentas interativas gratuitas para fundadores Web3 — simulador de tokenomics, calculadoras de crescimento e mais.",
        es: "Herramientas interactivas gratuitas para fundadores Web3 — simulador de tokenomics, calculadoras de crecimiento y más.",
      };
      const paths: Record<Locale, string> = { en: "/tools", br: "/br/ferramentas", es: "/es/herramientas" };
      return {
        title: titles[locale], description: descs[locale], canonical: `${BASE_URL}${paths[locale]}`,
        ogType: "website", ogImage: OG_IMAGE, locale, htmlLang,
        alternates: buildAlternates("/tools", "/br/ferramentas", "/es/herramientas"),
      };
    },
    tokenomics: () => {
      const titles: Record<Locale, string> = {
        en: "DeFi Tokenomics Simulator | Free Tool by Gabriel Mangabeira",
        br: "Simulador de Tokenomics DeFi | Ferramenta Gratuita por Gabriel Mangabeira",
        es: "Simulador de Tokenomics DeFi | Herramienta Gratuita por Gabriel Mangabeira",
      };
      const descs: Record<Locale, string> = {
        en: "Model token supply, emissions, staking, and price scenarios with this free DeFi tokenomics simulator.",
        br: "Modele oferta de tokens, emissões, staking e cenários de preço com este simulador gratuito de tokenomics DeFi.",
        es: "Modela la oferta de tokens, emisiones, staking y escenarios de precio con este simulador gratuito de tokenomics DeFi.",
      };
      const paths: Record<Locale, string> = { en: "/tools/tokenomics-simulator", br: "/br/ferramentas/simulador-tokenomics", es: "/es/herramientas/simulador-tokenomics" };
      return {
        title: titles[locale], description: descs[locale], canonical: `${BASE_URL}${paths[locale]}`,
        ogType: "website", ogImage: OG_IMAGE, locale, htmlLang,
        alternates: buildAlternates("/tools/tokenomics-simulator", "/br/ferramentas/simulador-tokenomics", "/es/herramientas/simulador-tokenomics"),
      };
    },
    audit: () => {
      const titles: Record<Locale, string> = {
        en: "Web3 Growth Audit | Find Your Growth Leaks in 72 Hours | Mangabeira.net",
        br: "Auditoria de Growth Web3 | Encontre Seus Vazamentos de Crescimento em 72 Horas | Mangabeira.net",
        es: "Auditoría de Growth Web3 | Encuentra Tus Fugas de Crecimiento en 72 Horas | Mangabeira.net",
      };
      const descs: Record<Locale, string> = {
        en: "AI + Human Web3 Growth Audit — Find your top growth leaks in 72 hours. On-chain, Reddit, Discord, and funnel insights delivered via Notion + Loom. Data-backed. Actionable.",
        br: "Auditoria de Growth Web3 com IA + Humano — Encontre seus principais vazamentos de crescimento em 72 horas.",
        es: "Auditoría de Growth Web3 con IA + Humano — Encuentra tus principales fugas de crecimiento en 72 horas.",
      };
      const paths: Record<Locale, string> = { en: "/services/web3-growth-audit", br: "/br/servicos/web3-auditoria-de-growth", es: "/es/servicios/web3-auditoria-de-growth" };
      return {
        title: titles[locale], description: descs[locale], canonical: `${BASE_URL}${paths[locale]}`,
        ogType: "website", ogImage: OG_IMAGE, locale, htmlLang,
        alternates: buildAlternates("/services/web3-growth-audit", "/br/servicos/web3-auditoria-de-growth", "/es/servicios/web3-auditoria-de-growth"),
      };
    },
    "audit-success": () => ({
      title: "Payment Successful | Web3 Growth Audit | Mangabeira.net",
      description: "Your Web3 Growth Audit payment was successful. Complete the intake form to get started.",
      canonical: `${BASE_URL}/services/web3-growth-audit/payment-success`,
      ogType: "website", ogImage: OG_IMAGE, locale: "en", htmlLang: "en",
      alternates: [],
    }),
  };

  const factory = metaMap[route.type];
  return factory ? factory() : null;
}

// ─── Dynamic page fetch from Supabase ────────────────────────────────────
async function fetchPublicationMeta(slug: string, locale: Locale): Promise<PageMeta | null> {
  const cacheKey = `pub:${locale}:${slug}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  try {
    const lang = locale === "en" ? "en" : locale === "br" ? "br" : "es";

    let pageData: any = null;

    const transUrl = `${SUPABASE_URL}/rest/v1/page_translations?slug=eq.${encodeURIComponent(slug)}&language=eq.${lang}&select=page_id,title,meta_description,slug,page:pages!inner(slug,featured_image,status,author_name,created_at,updated_at,tags)`;
    const transRes = await fetch(transUrl, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    const transData = await transRes.json();

    if (transData && transData.length > 0 && transData[0].page?.status === "published") {
      pageData = transData[0];
    } else {
      const pageUrl = `${SUPABASE_URL}/rest/v1/pages?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=id,slug,featured_image,author_name,created_at,updated_at,tags`;
      const pageRes = await fetch(pageUrl, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      });
      const pages = await pageRes.json();

      if (!pages || pages.length === 0) {
        cache.set(cacheKey, { data: null, ts: Date.now() });
        return null;
      }

      const page = pages[0];
      const tUrl = `${SUPABASE_URL}/rest/v1/page_translations?page_id=eq.${page.id}&language=eq.${lang}&select=title,meta_description,slug`;
      const tRes = await fetch(tUrl, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      });
      const translations = await tRes.json();

      if (translations && translations.length > 0) {
        pageData = { ...translations[0], page };
      } else {
        const enUrl = `${SUPABASE_URL}/rest/v1/page_translations?page_id=eq.${page.id}&language=eq.en&select=title,meta_description,slug`;
        const enRes = await fetch(enUrl, {
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        });
        const enTrans = await enRes.json();
        if (enTrans && enTrans.length > 0) {
          pageData = { ...enTrans[0], page };
        }
      }
    }

    if (!pageData) {
      cache.set(cacheKey, { data: null, ts: Date.now() });
      return null;
    }

    const page = pageData.page || pageData;
    const title = pageData.title || "Gabriel Mangabeira";
    const description = pageData.meta_description || "";
    const featuredImage = page.featured_image
      ? (page.featured_image.startsWith("http") ? page.featured_image : `${BASE_URL}${page.featured_image}`)
      : OG_IMAGE;

    const pubPaths: Record<Locale, string> = {
      en: `/publications/${slug}`,
      br: `/br/artigos/${slug}`,
      es: `/es/articulos/${slug}`,
    };

    const canonical = `${BASE_URL}${pubPaths[locale]}`;
    const htmlLang = getHtmlLang(locale);

    const schema = [{
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description,
      image: featuredImage,
      datePublished: page.created_at,
      dateModified: page.updated_at,
      author: { "@type": "Person", name: page.author_name || "Gabriel Mangabeira" },
      publisher: { "@type": "Person", name: "Gabriel Mangabeira" },
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      inLanguage: htmlLang,
    }];

    const meta: PageMeta = {
      title, description, canonical, ogType: "article", ogImage: featuredImage,
      locale, htmlLang, schema,
      alternates: buildAlternates(pubPaths.en, pubPaths.br, pubPaths.es),
    };

    cache.set(cacheKey, { data: meta, ts: Date.now() });
    return meta;
  } catch (err) {
    console.error("SEO edge function: DB fetch error", err);
    cache.set(cacheKey, { data: null, ts: Date.now() });
    return null;
  }
}

// ─── HTML injection via string replacement ───────────────────────────────
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getOgLocale(htmlLang: string): string {
  if (htmlLang === "pt-BR") return "pt_BR";
  if (htmlLang === "es") return "es_ES";
  return "en_US";
}

function buildMetaTags(meta: PageMeta): string {
  const tags: string[] = [];

  tags.push(`<meta name="description" content="${esc(meta.description)}">`);
  tags.push(`<link rel="canonical" href="${esc(meta.canonical)}">`);

  for (const alt of meta.alternates) {
    tags.push(`<link rel="alternate" hreflang="${alt.lang}" href="${esc(alt.href)}">`);
  }

  tags.push(`<meta property="og:type" content="${meta.ogType}">`);
  tags.push(`<meta property="og:url" content="${esc(meta.canonical)}">`);
  tags.push(`<meta property="og:title" content="${esc(meta.title)}">`);
  tags.push(`<meta property="og:description" content="${esc(meta.description)}">`);
  tags.push(`<meta property="og:locale" content="${getOgLocale(meta.htmlLang)}">`);
  tags.push(`<meta property="og:site_name" content="Gabriel Mangabeira">`);
  if (meta.ogImage) {
    tags.push(`<meta property="og:image" content="${esc(meta.ogImage)}">`);
    tags.push(`<meta property="og:image:width" content="1200">`);
    tags.push(`<meta property="og:image:height" content="630">`);
    tags.push(`<meta property="og:image:type" content="image/png">`);
  }

  tags.push(`<meta name="twitter:card" content="summary_large_image">`);
  tags.push(`<meta name="twitter:site" content="@gabmangabeira">`);
  tags.push(`<meta name="twitter:title" content="${esc(meta.title)}">`);
  tags.push(`<meta name="twitter:description" content="${esc(meta.description)}">`);
  if (meta.ogImage) {
    tags.push(`<meta name="twitter:image" content="${esc(meta.ogImage)}">`);
  }

  if (meta.schema) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(meta.schema)}</script>`);
  }

  return tags.join("\n");
}

function stripExistingMeta(html: string): string {
  // Remove existing SEO-related meta tags to prevent duplicates with Helmet
  html = html.replace(/<meta\s+name="description"[^>]*>/gi, "");
  html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, "");
  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "");
  html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "");
  html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>/gi, "");
  return html;
}

function buildNoscriptBlock(meta: PageMeta): string {
  return `<noscript><div><h1>${esc(meta.title)}</h1><p>${esc(meta.description)}</p><a href="${esc(meta.canonical)}">${esc(meta.canonical)}</a></div></noscript>`;
}

function injectMeta(html: string, meta: PageMeta): string {
  // Strip existing SEO tags first to prevent duplicates after prerender
  html = stripExistingMeta(html);

  // Replace <html lang="..."> with correct lang
  html = html.replace(/<html([^>]*)lang="[^"]*"/, `<html$1lang="${meta.htmlLang}"`);
  // If no lang attribute exists, add it
  if (!html.includes(`lang="${meta.htmlLang}"`)) {
    html = html.replace(/<html/, `<html lang="${meta.htmlLang}"`);
  }

  // Replace <title>...</title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);

  // Inject meta tags before </head>
  const metaTags = buildMetaTags(meta);
  html = html.replace(/<\/head>/, `${metaTags}\n</head>`);

  // Inject noscript content block after <div id="root"> for non-JS crawlers
  const noscript = buildNoscriptBlock(meta);
  html = html.replace(/<div id="root">/, `<div id="root">${noscript}`);

  return html;
}

// ─── Main handler ────────────────────────────────────────────────────────
export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip static assets, API calls, admin, auth routes
  if (
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/_netlify/") ||
    pathname.startsWith("/.netlify/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|map|xml|txt|json|csv|pdf)$/)
  ) {
    return context.next();
  }

  // Get the response from the origin (index.html SPA)
  let response: Response;
  try {
    response = await context.next();
  } catch {
    return context.next();
  }

  // Only process HTML responses
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  // Parse route and get metadata
  const route = parseRoute(pathname);
  let meta: PageMeta | null = null;

  if (route.type === "publication" && route.slug) {
    meta = await fetchPublicationMeta(route.slug, route.locale);
  }

  if (!meta) {
    meta = getStaticMeta(route);
  }

  if (!meta) {
    return response;
  }

  // Read HTML, inject meta, return modified response
  try {
    let html = await response.text();
    html = injectMeta(html, meta);

    return new Response(html, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        "content-type": "text/html; charset=utf-8",
      },
    });
  } catch {
    return response;
  }
}

export const config = {
  path: "/*",
  excludedPath: ["/assets/*", "/.netlify/*", "/_netlify/*"],
};
