import Papa from 'papaparse';

type Locale = 'en' | 'br' | 'es';

interface TranslationRow {
  key: string;
  en: string;
  'pt-br': string;
  es: string;
}

const translationCache: Record<string, Record<string, string>> = {};

export const loadAuditTranslations = async (locale: Locale): Promise<void> => {
  if (translationCache[locale]) return;

  const response = await fetch('/translations/audit.csv');
  const csvText = await response.text();
  
  const result = Papa.parse<TranslationRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const translations: Record<string, string> = {};
  const columnKey = locale === 'br' ? 'pt-br' : locale;
  
  result.data.forEach((row) => {
    if (row.key && row[columnKey]) {
      translations[row.key] = row[columnKey];
    }
  });

  translationCache[locale] = translations;
};

export const ta = (key: string, locale: Locale): string => {
  const translations = translationCache[locale];
  if (!translations) {
    console.warn(`Translations not loaded for locale: ${locale}`);
    return key;
  }
  
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation not found for key: ${key} in locale: ${locale}`);
    return key;
  }
  
  return translation;
};
