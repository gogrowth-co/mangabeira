import Papa from 'papaparse';

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
    return; // Already loaded
  }

  if (loadingPromises[locale]) {
    return loadingPromises[locale]!;
  }

  loadingPromises[locale] = (async () => {
    try {
      const response = await fetch(`/translations/${locale}.csv`);
      const csvText = await response.text();
      
      const result = Papa.parse<TranslationRow>(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      const cache: Record<string, Record<string, string>> = {};

      result.data.forEach((row) => {
        if (row.section && row.key && row.text) {
          if (!cache[row.section]) {
            cache[row.section] = {};
          }
          cache[row.section][row.key] = row.text;
        }
      });

      translationCache[locale] = cache;
    } catch (error) {
      console.error(`Failed to load translations for ${locale}:`, error);
      translationCache[locale] = {};
    }
  })();

  return loadingPromises[locale]!;
}

export async function initTranslations(locale: Locale): Promise<void> {
  await loadTranslations(locale);
}

export function t(section: string, key: string, locale: Locale): string {
  const sectionCache = translationCache[locale]?.[section];
  
  if (!sectionCache) {
    console.warn(`Translation section not found: ${section} for locale ${locale}`);
    return `${section}.${key}`;
  }

  const translation = sectionCache[key];
  
  if (!translation) {
    console.warn(`Translation key not found: ${section}.${key} for locale ${locale}`);
    return `${section}.${key}`;
  }

  return translation;
}

export function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith('/br')) return 'br';
  if (pathname.startsWith('/es')) return 'es';
  return 'en';
}

export function getPathForLocale(locale: Locale, currentPath: string = '/'): string {
  // Remove existing locale prefix
  let cleanPath = currentPath.replace(/^\/(br|es)/, '') || '/';
  
  // Add new locale prefix if not English
  if (locale === 'en') return cleanPath;
  return `/${locale}${cleanPath}`;
}
