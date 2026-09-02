import { useQuery } from '@tanstack/react-query';
import { Locale } from '@/lib/translations';

// Static divorce (Phase 1): this hook now reads pre-baked article documents
// from /content/<locale>/<slug>.json (emitted by scripts/emit-static-content.mjs
// from the in-repo content/ store). The admin CRUD hooks that used to live here
// (create/update/delete/publish) were removed along with the Supabase backend.

export interface Page {
  id: string;
  slug: string;
  category: string | null;
  status: 'draft' | 'published';
  featured_image: string | null;
  read_time: string | null;
  preserve_styles: boolean | null;
  is_system_page: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageTranslation {
  id: string;
  page_id: string;
  language: Locale;
  title: string;
  meta_description: string | null;
  content: string | null;
  slug: string | null;
  featured_image_alt: string | null;
  schema?: unknown;
  created_at: string;
  updated_at: string;
}

interface ArticleDoc {
  page: Page;
  translation: PageTranslation;
  alternates: Partial<Record<Locale, string>>;
}

// Map of known localized slugs to their English equivalents
const localizedToEnglish: Record<string, string> = {
  'construindo-comunidade-web3-atletas': 'web3-for-athletes',
  'web3-para-atletas': 'web3-for-athletes',
};

/**
 * Fetch one static article document. Returns null on 404 or when the host
 * serves the SPA shell instead of JSON (soft-404 on some static hosts).
 */
async function fetchArticleDoc(locale: Locale, slug: string): Promise<ArticleDoc | null> {
  if (!slug) return null;
  try {
    const res = await fetch(`/content/${locale}/${encodeURIComponent(slug)}.json`);
    if (!res.ok) return null;
    const text = await res.text();
    const doc = JSON.parse(text) as ArticleDoc;
    if (!doc || !doc.page || !doc.translation) return null;
    return doc;
  } catch {
    return null;
  }
}

// Result type for usePublicPage with canonical info
export interface PublicPageResult {
  page: Page;
  translation: PageTranslation;
  matchedViaFallback: boolean;  // True if URL slug didn't match localized slug
  canonicalSlug: string | null; // The correct localized slug for this locale
  alternates: Partial<Record<Locale, string>>; // localized slug per language
}

// Fetch published page by slug and language (public route)
export function usePublicPage(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ['public-page', slug, locale],
    queryFn: async (): Promise<PublicPageResult | null> => {
      const mappedSlug = localizedToEnglish[slug] || slug;

      // 1. Document in the requested locale — the emitter writes each article
      //    under BOTH its localized slug and the base (English) page slug, so
      //    a single fetch covers canonical and fallback URLs.
      let doc = await fetchArticleDoc(locale, slug);
      if (!doc && mappedSlug !== slug) {
        doc = await fetchArticleDoc(locale, mappedSlug);
      }

      if (doc) {
        const canonicalSlug = doc.translation.slug || null;
        const matchedViaFallback =
          locale !== 'en' && !!canonicalSlug && canonicalSlug !== slug;
        return {
          page: doc.page,
          translation: doc.translation,
          matchedViaFallback,
          canonicalSlug,
          alternates: doc.alternates || {},
        };
      }

      // 2. English fallback when no localized translation exists.
      if (locale !== 'en') {
        const enDoc =
          (await fetchArticleDoc('en', slug)) ||
          (mappedSlug !== slug ? await fetchArticleDoc('en', mappedSlug) : null);
        if (enDoc) {
          return {
            page: enDoc.page,
            translation: enDoc.translation,
            matchedViaFallback: true,
            canonicalSlug: null, // No localized translation exists
            alternates: enDoc.alternates || {},
          };
        }
      }

      return null;
    },
  });
}
