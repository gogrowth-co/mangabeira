import Papa from 'papaparse';
import { getSystemPageSlug } from './systemPageRoutes';

export type Locale = 'en' | 'br' | 'es';

interface TranslationRow {
  section: string;
  key: string;
  text: string;
  context?: string;
}

interface SlugMapping {
  [baseSlug: string]: {
    en: string;
    br: string;
    es: string;
  };
}

const translationCache: Record<Locale, Record<string, Record<string, string>>> = {
  en: {},
  br: {},
  es: {},
};

let loadingPromises: Record<Locale, Promise<void> | null> = {
  en: null,
  br: null,
  es: null,
};

// Cache for slug mappings
let slugMappingCache: SlugMapping | null = null;
let slugMappingPromise: Promise<SlugMapping> | null = null;

// Reverse mapping: localized slug -> base slug
let reverseSlugCache: Record<string, string> = {};

async function loadTranslations(locale: Locale): Promise<void> {
  if (loadingPromises[locale]) {
    return loadingPromises[locale]!;
  }

  // Always (re)load to ensure newly added keys are picked up
  loadingPromises[locale] = (async () => {
    try {
      console.log(`[TRANSLATIONS] Loading translations for ${locale}...`);
      const response = await fetch(`/translations/${locale}.csv`, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const csvText = await response.text();
      console.log(`[TRANSLATIONS] Fetched CSV for ${locale}, length: ${csvText.length}`);

      const result = Papa.parse<TranslationRow>(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      if (result.errors.length > 0) {
        console.error(`[TRANSLATIONS] CSV parsing errors for ${locale}:`, result.errors);
      }

      const cache: Record<string, Record<string, string>> = {};

      result.data.forEach((row) => {
        const section = row.section?.trim();
        const key = row.key?.trim();
        const text = row.text?.trim() ?? '';

        if (section && key) {
          if (!cache[section]) {
            cache[section] = {};
          }
          cache[section][key] = text;
        }
      });

      translationCache[locale] = cache;

      // Log publications_hub specifically
      const pubHubKeys = cache.publications_hub ? Object.keys(cache.publications_hub) : [];
      console.log(`[TRANSLATIONS] Loaded ${locale}: ${Object.keys(cache).length} sections, publications_hub has ${pubHubKeys.length} keys`);
      console.log(`[TRANSLATIONS] publications_hub keys:`, pubHubKeys.slice(0, 10));
    } catch (error) {
      console.error(`[TRANSLATIONS] Failed to load translations for ${locale}:`, error);
      translationCache[locale] = {};
    }
  })();

  return loadingPromises[locale]!;
}

export async function initTranslations(locale: Locale): Promise<void> {
  await Promise.all([
    loadTranslations(locale),
    fetchSlugMappings() // Pre-load slug mappings
  ]);
}

export function t(section: string, key: string, locale: Locale): string {
  const sectionCache = translationCache[locale]?.[section];

  if (!sectionCache) {
    // Return empty string to prevent raw "section.key" from leaking into
    // pre-hydration HTML / crawler snapshots while translations are loading.
    if (typeof console !== 'undefined' && translationCache[locale] && Object.keys(translationCache[locale]).length > 0) {
      console.warn(`[TRANSLATIONS] Section not found: ${section} for locale ${locale}`);
    }
    return '';
  }

  const translation = sectionCache[key];

  if (!translation) {
    console.warn(`[TRANSLATIONS] Key not found: ${section}.${key} for locale ${locale}`);
    return '';
  }

  return translation;
}

// Fetch slug mappings from the static build artifact
// (public/content-index/slug-map.json, emitted by scripts/emit-static-content.mjs).
async function fetchSlugMappings(): Promise<SlugMapping> {
  if (slugMappingPromise) {
    return slugMappingPromise;
  }

  if (slugMappingCache) {
    return slugMappingCache;
  }

  slugMappingPromise = (async () => {
    try {
      const response = await fetch('/content-index/slug-map.json');
      if (!response.ok) {
        console.error('[SLUG MAPPING] Failed to load slug map: HTTP', response.status);
        return {};
      }
      const mapping = (await response.json()) as SlugMapping;

      const reverseMapping: Record<string, string> = {};
      for (const [baseSlug, locales] of Object.entries(mapping)) {
        for (const localizedSlug of Object.values(locales)) {
          if (localizedSlug && localizedSlug !== baseSlug) {
            reverseMapping[localizedSlug] = baseSlug;
          }
        }
      }

      slugMappingCache = mapping;
      reverseSlugCache = reverseMapping;

      console.log('[SLUG MAPPING] Cache updated:', Object.keys(mapping).length, 'pages');
      return mapping;
    } catch (error) {
      console.error('[SLUG MAPPING] Failed to fetch slug mappings:', error);
      return {};
    } finally {
      slugMappingPromise = null;
    }
  })();

  return slugMappingPromise;
}

// Get base slug from a localized slug
function getBaseSlug(localizedSlug: string): string {
  return reverseSlugCache[localizedSlug] || localizedSlug;
}

export function getLocaleFromPath(pathname: string): Locale {
  // Check for BR paths (including /br/artigos and /br/servicos)
  if (pathname.startsWith('/br')) return 'br';
  // Check for ES paths (including /es/articulos and /es/servicios)
  if (pathname.startsWith('/es')) return 'es';
  // Check for specific BR/ES audit paths without prefix (edge case)
  if (pathname.includes('servicos/web3-auditoria-de-growth')) return 'br';
  if (pathname.includes('servicios/web3-auditoria-de-growth')) return 'es';
  return 'en';
}

export async function getPathForLocale(locale: Locale, currentPath: string = '/'): Promise<string> {
  // Strip query string and hash from the path
  const [pathOnly] = currentPath.split('?');
  const [cleanPathname] = pathOnly.split('#');
  
  // Extract slug from path
  const pathParts = cleanPathname.split('/').filter(Boolean);
  const currentSlug = pathParts[pathParts.length - 1]; // Last part is the slug
  
  // Remove existing locale prefix and handle special paths
  let cleanPath = cleanPathname
    .replace(/^\/(br|es)/, '') // Remove locale prefix
    .replace(/^\/(artigos|articulos)/, '/publications') // Normalize publications path
    .replace(/^\/(servicos|servicios)/, '/services') // Normalize services path
    .replace(/^\/(ferramentas|herramientas)/, '/tools') // Normalize tools path
    || '/';
  
  // Handle tokenomics simulator
  if (cleanPath === '/tools/tokenomics-simulator' || cleanPath.includes('simulador-tokenomics')) {
    if (locale === 'br') return '/br/ferramentas/simulador-tokenomics';
    if (locale === 'es') return '/es/herramientas/simulador-tokenomics';
    return '/tools/tokenomics-simulator';
  }
  
  // Handle Web3 Growth Audit page
  if (cleanPath === '/services/web3-growth-audit' || cleanPath.includes('web3-auditoria-de-growth')) {
    if (locale === 'br') return '/br/servicos/web3-auditoria-de-growth';
    if (locale === 'es') return '/es/servicios/web3-auditoria-de-growth';
    return '/services/web3-growth-audit';
  }
  
  // Handle special localized paths for publications hub
  if (cleanPath === '/publications') {
    if (locale === 'br') return '/br/artigos';
    if (locale === 'es') return '/es/articulos';
    return '/publications';
  }
  
  // For publication pages, use dynamic slug mappings from database
  if (cleanPath.startsWith('/publications/')) {
    const slugMappings = await fetchSlugMappings();
    
    // Get the base slug (in case we're currently on a localized slug)
    const baseSlug = getBaseSlug(currentSlug);
    
    // Get the mapping for this publication
    const slugMapping = slugMappings[baseSlug];
    const targetSlug = slugMapping ? slugMapping[locale] : currentSlug;
    
    console.log(`[PATH LOCALE] Current: ${currentSlug}, Base: ${baseSlug}, Target (${locale}): ${targetSlug}`);
    
    if (locale === 'br') return `/br/artigos/${targetSlug}`;
    if (locale === 'es') return `/es/articulos/${targetSlug}`;
    return `/publications/${targetSlug}`;
  }
  
  // Add new locale prefix if not English
  if (locale === 'en') return cleanPath;
  return `/${locale}${cleanPath}`;
}

// Synchronous version for backwards compatibility (uses cached data)
export function getPathForLocaleSync(locale: Locale, currentPath: string = '/'): string {
  // Strip query string and hash from the path
  const [pathOnly] = currentPath.split('?');
  const [cleanPathname] = pathOnly.split('#');
  
  const pathParts = cleanPathname.split('/').filter(Boolean);
  const currentSlug = pathParts[pathParts.length - 1];
  
  let cleanPath = cleanPathname
    .replace(/^\/(br|es)/, '')
    .replace(/^\/(artigos|articulos)/, '/publications')
    .replace(/^\/(servicos|servicios)/, '/services')
    .replace(/^\/(ferramentas|herramientas)/, '/tools')
    || '/';
  
  // Handle tokenomics simulator
  if (cleanPath === '/tools/tokenomics-simulator' || cleanPath.includes('simulador-tokenomics')) {
    if (locale === 'br') return '/br/ferramentas/simulador-tokenomics';
    if (locale === 'es') return '/es/herramientas/simulador-tokenomics';
    return '/tools/tokenomics-simulator';
  }
  
  // Handle Web3 Growth Audit page
  if (cleanPath === '/services/web3-growth-audit' || cleanPath.includes('web3-auditoria-de-growth')) {
    if (locale === 'br') return '/br/servicos/web3-auditoria-de-growth';
    if (locale === 'es') return '/es/servicios/web3-auditoria-de-growth';
    return '/services/web3-growth-audit';
  }
  
  if (cleanPath === '/publications') {
    if (locale === 'br') return '/br/artigos';
    if (locale === 'es') return '/es/articulos';
    return '/publications';
  }
  
  if (cleanPath.startsWith('/publications/')) {
    // Use cached mappings if available
    if (slugMappingCache) {
      const baseSlug = getBaseSlug(currentSlug);
      const slugMapping = slugMappingCache[baseSlug];
      const targetSlug = slugMapping ? slugMapping[locale] : currentSlug;
      
      if (locale === 'br') return `/br/artigos/${targetSlug}`;
      if (locale === 'es') return `/es/articulos/${targetSlug}`;
      return `/publications/${targetSlug}`;
    }
    
    // Fallback to current slug if cache not ready
    if (locale === 'br') return `/br/artigos/${currentSlug}`;
    if (locale === 'es') return `/es/articulos/${currentSlug}`;
    return `/publications/${currentSlug}`;
  }
  
  if (cleanPath === '/tools') {
    if (locale === 'br') return '/br/ferramentas';
    if (locale === 'es') return '/es/herramientas';
    return '/tools';
  }
  
  if (locale === 'en') return cleanPath;
  return `/${locale}${cleanPath}`;
}
