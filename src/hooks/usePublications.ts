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
  return /failed to fetch|networkerror|load failed|network request failed/i.test(msg);
}

function friendlyError(err: unknown): Error {
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

export function usePublications(locale: Locale, categoryFilter?: string, searchQuery?: string) {
  return useQuery({
    retry: (failureCount, error) => {
      // Retry network failures up to 3 times; don't retry real Supabase errors.
      if (isNetworkError(error)) return failureCount < 3;
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
    queryKey: ['publications', locale, categoryFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('pages')
        .select(`
          *,
          translations:page_translations(*)
        `)
        .eq('status', 'published')
        .eq('is_system_page', false)
        .order('created_at', { ascending: false });
      
      // Filter by category if provided
      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }
      
      let data, error;
      try {
        ({ data, error } = await query);
      } catch (fetchErr) {
        // supabase-js rethrows network failures as exceptions, not into `error`.
        throw friendlyError(fetchErr);
      }

      if (error) {
        throw friendlyError(error);
      }

      // Client-side filtering for locale and search
      let publications = data as Publication[];

      // Filter to only show publications that have translation in the requested locale
      // For non-English locales, only show publications with translations available
      if (locale !== 'en') {
        const beforeCount = publications.length;
        publications = publications.filter(pub =>
          pub.translations.some(t => t.language === locale)
        );
        if (beforeCount > 0 && publications.length === 0) {
          console.warn(`[usePublications] Locale filter '${locale}' stripped all ${beforeCount} publications. Translations may be missing.`);
        }
      }

      if (searchQuery && searchQuery.trim()) {
        publications = publications.filter(pub => {
          const translation = pub.translations.find(t => t.language === locale);
          const fallbackTranslation = pub.translations.find(t => t.language === 'en');
          const currentTranslation = translation || fallbackTranslation;

          if (!currentTranslation) return false;

          const searchLower = searchQuery.toLowerCase();
          return (
            currentTranslation.title.toLowerCase().includes(searchLower) ||
            currentTranslation.meta_description?.toLowerCase().includes(searchLower) ||
            (pub.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
          );
        });
      }

      return publications;
    },
  });
}

export function useFeaturedPublications(locale: Locale) {
  return useQuery({
    retry: (failureCount, error) => {
      if (isNetworkError(error)) return failureCount < 3;
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
    queryKey: ['featured-publications', locale],
    queryFn: async () => {
      let data, error;
      try {
        ({ data, error } = await supabase
          .from('pages')
          .select(`
            *,
            translations:page_translations(*)
          `)
          .eq('status', 'published')
          .eq('is_system_page', false)
          .eq('is_featured', true)
          .order('updated_at', { ascending: false })
          .limit(3));
      } catch (fetchErr) {
        throw friendlyError(fetchErr);
      }

      if (error) {
        throw friendlyError(error);
      }

      let publications = data as Publication[];

      // Filter to only show publications that have translation in the requested locale
      // For non-English locales, only show publications with translations available
      if (locale !== 'en') {
        publications = publications.filter(pub =>
          pub.translations.some(t => t.language === locale)
        );
      }

      return publications;
    },
  });
}
