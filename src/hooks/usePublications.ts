import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

// Detects "TypeError: Failed to fetch" and similar network-layer aborts
// (adblockers, privacy extensions, VPN filters, offline, DNS failure).
function isNetworkError(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : '';
  return (
    name === 'TypeError' ||
    /failed to fetch|networkerror|load failed|network request failed|fetch failed/i.test(msg)
  );
}

function friendlyError(err: unknown): Error {
  // Always log raw error for debugging
  console.error('[usePublications] raw error:', err);
  if (isNetworkError(err)) {
    return new Error(
      "Couldn't reach the content server. This is usually caused by a browser extension (ad blocker, privacy extension), a VPN, or a corporate firewall blocking the request. Try disabling extensions for this site or switching networks."
    );
  }
  if (err instanceof Error) return err;
  const details = [(err as any)?.message, (err as any)?.code, (err as any)?.details]
    .filter(Boolean)
    .join(' | ');
  return new Error(details || 'Supabase query failed');
}

// Snapshot endpoints to try, in order. Same-origin first (works on mangabeira.net),
// then absolute Netlify URL (works on preview/lovable.app where the function isn't deployed).
const SNAPSHOT_URLS = [
  '/api/publications-snapshot',
  'https://mangabeira.net/api/publications-snapshot',
];

async function fetchFromSnapshot(): Promise<Publication[]> {
  let lastErr: unknown = null;
  for (const url of SNAPSHOT_URLS) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        lastErr = new Error(`Snapshot ${url} returned ${res.status}`);
        continue;
      }
      // Guard against SPA fallback returning index.html instead of JSON
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        lastErr = new Error(`Snapshot ${url} returned non-JSON (${ct})`);
        continue;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        lastErr = new Error(`Snapshot ${url} returned non-array payload`);
        continue;
      }
      console.info(`[usePublications] snapshot served from ${url} (${data.length} items)`);
      return data as Publication[];
    } catch (err) {
      console.warn(`[usePublications] snapshot ${url} failed:`, err);
      lastErr = err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('All snapshot URLs failed');
}

export interface PublicationsResult {
  publications: Publication[];
  source: 'live' | 'snapshot';
}

async function fetchAllPublications(): Promise<PublicationsResult> {
  // Try live Supabase first
  try {
    const { data, error } = await supabase
      .from('pages')
      .select(`*, translations:page_translations(*)`)
      .eq('status', 'published')
      .eq('is_system_page', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { publications: (data || []) as Publication[], source: 'live' };
  } catch (liveErr) {
    console.warn('[usePublications] live fetch failed, trying snapshot fallback', liveErr);
    // Always try the snapshot — it works around ad-blockers, CSP, network errors,
    // and any other reason the direct Supabase call may have failed.
    try {
      const publications = await fetchFromSnapshot();
      return { publications, source: 'snapshot' };
    } catch (snapErr) {
      console.error('[usePublications] snapshot fallback also failed', snapErr);
      throw friendlyError(liveErr);
    }
  }
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
      const { publications, source } = await fetchAllPublications();
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
        const { data, error } = await supabase
          .from('pages')
          .select(`*, translations:page_translations(*)`)
          .eq('status', 'published')
          .eq('is_system_page', false)
          .eq('is_featured', true)
          .order('updated_at', { ascending: false })
          .limit(3);
        if (error) throw error;
        let publications = (data || []) as Publication[];
        if (locale !== 'en') {
          publications = publications.filter(pub =>
            (pub.translations || []).some(t => t.language === locale)
          );
        }
        return publications;
      } catch (err) {
        // Featured is best-effort — always try snapshot, return empty on failure
        try {
          const all = await fetchFromSnapshot();
          let publications = all.filter(p => p.is_featured).slice(0, 3);
          if (locale !== 'en') {
            publications = publications.filter(pub =>
              (pub.translations || []).some(t => t.language === locale)
            );
          }
          return publications;
        } catch {
          return [];
        }
      }
    },
  });
}
