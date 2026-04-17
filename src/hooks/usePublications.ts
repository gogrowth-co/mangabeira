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

export function usePublications(locale: Locale, categoryFilter?: string, searchQuery?: string) {
  return useQuery({
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
      
      const { data, error } = await query;

      if (error) throw error;

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
            pub.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        });
      }

      return publications;
    },
  });
}

export function useFeaturedPublications(locale: Locale) {
  return useQuery({
    queryKey: ['featured-publications', locale],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select(`
          *,
          translations:page_translations(*)
        `)
        .eq('status', 'published')
        .eq('is_system_page', false)
        .eq('is_featured', true)
        .order('updated_at', { ascending: false })
        .limit(3);

      if (error) throw error;

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
