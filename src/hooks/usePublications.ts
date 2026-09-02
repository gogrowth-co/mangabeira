import { useQuery } from '@tanstack/react-query';
import { Locale } from '@/lib/translations';

export interface Publication {
  id: string;
  slug: string;
  category: string;
  status: string;
  featured_image: string | null;
  author_name: string | null;
  reading_time: number | null;
  tags: string[];
  view_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  translations: {
    language: string;
    title: string;
    meta_description: string | null;
    content: string | null;
    featured_image_alt: string | null;
    slug: string | null;
  }[];
}

export interface PublicationsResult {
  publications: Publication[];
  source: 'live';
}

function isNetworkError(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : '';
  return (
    name === 'TypeError' ||
    /failed to fetch|networkerror|load failed|network request failed|fetch failed/i.test(msg)
  );
}

// Static divorce (Phase 1): the article index is baked into
// /content-index/<locale>.json at build time (scripts/emit-static-content.mjs)
// and served same-origin — no Supabase, no third-party request to block.
async function fetchAllPublications(locale: Locale): Promise<PublicationsResult> {
  const res = await fetch(`/content-index/${locale}.json`);
  if (!res.ok) {
    throw new Error(`Failed to load publication index (HTTP ${res.status})`);
  }
  const data = (await res.json()) as Publication[];
  return { publications: data || [], source: 'live' };
}

function applyFilters(
  publications: Publication[],
  locale: Locale,
  categoryFilter?: string,
  searchQuery?: string
): Publication[] {
  let result = publications;

  if (categoryFilter && categoryFilter !== 'all') {
    result = result.filter(p => p.category === categoryFilter);
  }

  if (locale !== 'en') {
    result = result.filter(pub =>
      (pub.translations || []).some(t => t.language === locale)
    );
  }

  if (searchQuery && searchQuery.trim()) {
    const searchLower = searchQuery.toLowerCase();
    result = result.filter(pub => {
      const translation = (pub.translations || []).find(t => t.language === locale);
      const fallbackTranslation = (pub.translations || []).find(t => t.language === 'en');
      const currentTranslation = translation || fallbackTranslation;
      if (!currentTranslation) return false;
      return (
        currentTranslation.title.toLowerCase().includes(searchLower) ||
        currentTranslation.meta_description?.toLowerCase().includes(searchLower) ||
        (pub.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
      );
    });
  }

  return result;
}

export function usePublications(locale: Locale, categoryFilter?: string, searchQuery?: string) {
  return useQuery({
    retry: (failureCount, error) => {
      if (isNetworkError(error)) return failureCount < 2;
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
    queryKey: ['publications', locale, categoryFilter, searchQuery],
    queryFn: async () => {
      const { publications, source } = await fetchAllPublications(locale);
      const filtered = applyFilters(publications, locale, categoryFilter, searchQuery);
      return { publications: filtered, source };
    },
  });
}

export function useFeaturedPublications(locale: Locale) {
  return useQuery({
    retry: (failureCount, error) => {
      if (isNetworkError(error)) return failureCount < 2;
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
    queryKey: ['featured-publications', locale],
    queryFn: async () => {
      try {
        const { publications } = await fetchAllPublications(locale);
        let featured = publications
          .filter(p => p.is_featured)
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 3);
        if (locale !== 'en') {
          featured = featured.filter(pub =>
            (pub.translations || []).some(t => t.language === locale)
          );
        }
        return featured;
      } catch {
        return [];
      }
    },
  });
}
