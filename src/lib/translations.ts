import Papa from 'papaparse';
import { getSystemPageSlug } from './systemPageRoutes';

export type Locale = 'en' | 'br' | 'es';

interface TranslationRow {
  section: string;
  key: string;
  text: string;
  context?: string;
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

async function loadTranslations(locale: Locale): Promise<void> {
  if (Object.keys(translationCache[locale]).length > 0) {
    console.log(`[Translations] Cache hit for ${locale}`);
    return; // Already loaded
  }

  if (loadingPromises[locale]) {
    console.log(`[Translations] Waiting for existing load promise for ${locale}`);
    return loadingPromises[locale]!;
  }

  console.log(`[Translations] Loading ${locale}.csv...`);
  loadingPromises[locale] = (async () => {
    try {
      const response = await fetch(`/translations/${locale}.csv`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const csvText = await response.text();
      console.log(`[Translations] Fetched ${csvText.length} bytes for ${locale}`);

      const result = Papa.parse<TranslationRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });

      if (result.errors.length > 0) {
        console.error(`[Translations] Parse errors for ${locale}:`, result.errors);
      }

      const cache: Record<string, Record<string, string>> = {};
      let rowCount = 0;

      result.data.forEach((row) => {
        if (row.section && row.key && row.text) {
          if (!cache[row.section]) {
            cache[row.section] = {};
          }
          cache[row.section][row.key] = row.text.trim();
          rowCount++;
        }
      });

      translationCache[locale] = cache;
      console.log(`[Translations] Loaded ${rowCount} translations for ${locale} into ${Object.keys(cache).length} sections`);

      // Log publications_hub section for debugging
      if (cache.publications_hub) {
        console.log(`[Translations] publications_hub keys:`, Object.keys(cache.publications_hub).slice(0, 5));
      } else {
        console.warn(`[Translations] publications_hub section not found in ${locale}`);
      }
    } catch (error) {
      console.error(`[Translations] Failed to load ${locale}:`, error);
      translationCache[locale] = {};
    }
  })();

  return loadingPromises[locale]!;
}

export async function initTranslations(locale: Locale): Promise<void> {
  await loadTranslations(locale);
}

export function t(section: string, key: string, locale: Locale): string {
  const localeCache = translationCache[locale];

  // Check if translations are loaded at all
  if (!localeCache || Object.keys(localeCache).length === 0) {
    console.error(`[t] Translations not loaded for locale '${locale}'. Cache is empty. Call initTranslations() first.`);
    return `${section}.${key}`;
  }

  const sectionCache = localeCache[section];

  if (!sectionCache) {
    console.warn(`[t] Section '${section}' not found for locale '${locale}'. Available sections:`, Object.keys(localeCache).slice(0, 5));
    return `${section}.${key}`;
  }

  const translation = sectionCache[key];

  if (!translation) {
    console.warn(`[t] Key '${key}' not found in section '${section}' for locale '${locale}'. Available keys:`, Object.keys(sectionCache).slice(0, 5));
    return `${section}.${key}`;
  }

  return translation;
}

export function getLocaleFromPath(pathname: string): Locale {
  // Check for BR paths (including /br/artigos)
  if (pathname.startsWith('/br')) return 'br';
  // Check for ES paths (including /es/articulos)
  if (pathname.startsWith('/es')) return 'es';
  return 'en';
}

export function getPathForLocale(locale: Locale, currentPath: string = '/'): string {
  // Localized slug mappings for publications
  const localizedSlugs: Record<string, Record<Locale, string>> = {
    'web3-for-athletes': {
      en: 'web3-for-athletes',
      br: 'web3-para-atletas',
      es: 'web3-for-athletes'
    },
    'web3-para-atletas': {
      en: 'web3-for-athletes',
      br: 'web3-para-atletas',
      es: 'web3-for-athletes'
    },
    'web2-vs-web3-marketing': {
      en: 'web2-vs-web3-marketing',
      br: 'web2-vs-web3-marketing',
      es: 'web2-vs-web3-marketing'
    },
    'definitive-guide-web3-seo': {
      en: 'definitive-guide-web3-seo',
      br: 'definitive-guide-web3-seo',
      es: 'definitive-guide-web3-seo'
    },
    'vibe-coded-token-health-scan': {
      en: 'vibe-coded-token-health-scan',
      br: 'vibe-coded-token-health-scan',
      es: 'vibe-coded-token-health-scan'
    }
  };
  
  // Extract slug from path
  const pathParts = currentPath.split('/').filter(Boolean);
  const currentSlug = pathParts[pathParts.length - 1]; // Last part is the slug
  
  // Remove existing locale prefix and handle special paths
  let cleanPath = currentPath
    .replace(/^\/(br|es)/, '') // Remove locale prefix
    .replace(/^\/(artigos|articulos)/, '/publications') // Normalize publications path
    || '/';
  
  // Handle special localized paths for publications hub
  if (cleanPath === '/publications') {
    if (locale === 'br') return '/br/artigos';
    if (locale === 'es') return '/es/articulos';
    return '/publications';
  }
  
  // For publication pages, use localized slug mappings
  if (cleanPath.startsWith('/publications/')) {
    const slugMapping = localizedSlugs[currentSlug];
    const targetSlug = slugMapping ? slugMapping[locale] : currentSlug;
    
    if (locale === 'br') return `/br/artigos/${targetSlug}`;
    if (locale === 'es') return `/es/articulos/${targetSlug}`;
    return `/publications/${targetSlug}`;
  }
  
  // Add new locale prefix if not English
  if (locale === 'en') return cleanPath;
  return `/${locale}${cleanPath}`;
}
