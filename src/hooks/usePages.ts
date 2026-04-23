import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Locale } from '@/lib/translations';

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
  created_at: string;
  updated_at: string;
}

export interface PageWithTranslations extends Page {
  translations: PageTranslation[];
}

// Fetch all pages with their translations
export function usePages(filter?: 'all' | 'published' | 'draft') {
  return useQuery({
    queryKey: ['pages', filter],
    queryFn: async () => {
      let query = supabase
        .from('pages')
        .select(`
          *,
          translations:page_translations(*)
        `)
        .order('updated_at', { ascending: false });
      
      if (filter === 'published') {
        query = query.eq('status', 'published');
      } else if (filter === 'draft') {
        query = query.eq('status', 'draft');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as PageWithTranslations[];
    },
  });
}

// Fetch single page with all translations
export function usePage(id: string | undefined) {
  return useQuery({
    queryKey: ['page', id],
    queryFn: async () => {
      if (!id) throw new Error('Page ID required');
      
      const { data, error } = await supabase
        .from('pages')
        .select(`
          *,
          translations:page_translations(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as PageWithTranslations;
    },
    enabled: !!id,
  });
}

// Map of known localized slugs to their English equivalents
const localizedToEnglish: Record<string, string> = {
  // Brazilian Portuguese versions
  'construindo-comunidade-web3-atletas': 'web3-for-athletes',
  'web3-para-atletas': 'web3-for-athletes',
  // Spanish versions can be added here as needed
  // Add more mappings as you create localized content
};

// Result type for usePublicPage with canonical info
export interface PublicPageResult {
  page: Page;
  translation: PageTranslation;
  matchedViaFallback: boolean;  // True if URL slug didn't match localized slug
  canonicalSlug: string | null; // The correct localized slug for this locale
}

// Fetch published page by slug and language (public route)
export function usePublicPage(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ['public-page', slug, locale],
    queryFn: async (): Promise<PublicPageResult | null> => {
      console.log('[usePublicPage] Fetching slug:', slug, 'locale:', locale);
      
      // For non-English locales, first try to find by localized slug
      if (locale !== 'en') {
        const { data: translation } = await supabase
          .from('page_translations')
          .select(`
            *,
            page:pages(*)
          `)
          .eq('slug', slug)
          .eq('language', locale)
          .maybeSingle();
        
        if (translation && translation.page) {
          console.log('[usePublicPage] Found by localized slug - canonical match');
          const pageData = Array.isArray(translation.page) ? translation.page[0] : translation.page;
          return { 
            page: pageData as Page, 
            translation: translation as unknown as PageTranslation,
            matchedViaFallback: false,
            canonicalSlug: translation.slug
          };
        }
        
        // If no localized slug found, try mapping to English slug
        const englishSlug = localizedToEnglish[slug] || slug;
        if (englishSlug !== slug) {
          console.log('[usePublicPage] Using English slug fallback:', englishSlug);
          const { data: page } = await supabase
            .from('pages')
            .select('*')
            .eq('slug', englishSlug)
            .eq('status', 'published')
            .maybeSingle();
          
          if (page) {
            // Prefer localized translation
            const { data: localizedTranslation } = await supabase
              .from('page_translations')
              .select('*')
              .eq('page_id', page.id)
              .eq('language', locale)
              .maybeSingle();
            
            if (localizedTranslation) {
              return { 
                page: page as Page, 
                translation: localizedTranslation as PageTranslation,
                matchedViaFallback: true,
                canonicalSlug: localizedTranslation.slug
              };
            }

            // Fallback to English translation if localized is missing
            const { data: englishTranslation } = await supabase
              .from('page_translations')
              .select('*')
              .eq('page_id', page.id)
              .eq('language', 'en')
              .maybeSingle();

            if (englishTranslation) {
              return { 
                page: page as Page, 
                translation: englishTranslation as PageTranslation,
                matchedViaFallback: true,
                canonicalSlug: null // No localized slug exists
              };
            }
          }
        }
      }
      
      // Fall back to base slug lookup (this is the problematic path for non-English)
      const { data: page, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      
      if (pageError) throw pageError;
      if (!page) return null;
      
      // Then get translation for requested language
      const { data: translation } = await supabase
        .from('page_translations')
        .select('*')
        .eq('page_id', page.id)
        .eq('language', locale)
        .maybeSingle();
      
      // Determine if this was a fallback match (base slug used for non-English locale)
      const matchedViaFallback = locale !== 'en' && slug === page.slug;
      
      // If no translation for requested language, try English fallback
      if (!translation && locale !== 'en') {
        console.log('[usePublicPage] No translation found for', locale, '- falling back to English');
        const { data: fallback } = await supabase
          .from('page_translations')
          .select('*')
          .eq('page_id', page.id)
          .eq('language', 'en')
          .maybeSingle();
        
        return { 
          page: page as Page, 
          translation: fallback as PageTranslation,
          matchedViaFallback: true,
          canonicalSlug: null // No localized translation exists
        };
      }
      
      console.log('[usePublicPage] Returning translation:', translation?.language, 'matchedViaFallback:', matchedViaFallback);
      return { 
        page: page as Page, 
        translation: translation as PageTranslation,
        matchedViaFallback,
        canonicalSlug: translation?.slug || null
      };
    },
  });
}

// Create new page
export function useCreatePage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      slug: string;
      category: string | null;
      featured_image?: string | null;
      read_time?: string | null;
      preserve_styles?: boolean;
      translations: Array<{
        language: Locale;
        title: string;
        meta_description: string | null;
        content: string | null;
        slug?: string | null;
      }>;
    }) => {
      // Generate ID client-side to avoid RLS issues with draft pages
      const newId = crypto.randomUUID();
      
      // Create page with generated ID
      const { error: pageError } = await supabase
        .from('pages')
        .insert({
          id: newId,
          slug: data.slug,
          category: data.category,
          featured_image: data.featured_image,
          read_time: data.read_time,
          preserve_styles: data.preserve_styles || false,
          status: 'draft',
        });
      
      if (pageError) throw pageError;
      
      // Create translations
      const translationsToInsert = data.translations.map(t => ({
        page_id: newId,
        ...t,
      }));
      
      const { error: translationsError } = await supabase
        .from('page_translations')
        .insert(translationsToInsert);
      
      if (translationsError) throw translationsError;
      
      return { id: newId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}

// Update page
export function useUpdatePage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      id: string;
      slug?: string;
      category?: string | null;
      status?: 'draft' | 'published';
      featured_image?: string | null;
      read_time?: string | null;
      preserve_styles?: boolean;
      translations?: Array<{
        language: Locale;
        title: string;
        meta_description: string | null;
        content: string | null;
        slug?: string | null;
        featured_image_alt?: string | null;
      }>;
    }) => {
      // Update page
      const { slug, category, status, featured_image, read_time, preserve_styles, translations } = data;
      
      if (slug !== undefined || category !== undefined || status !== undefined || featured_image !== undefined || read_time !== undefined || preserve_styles !== undefined) {
        const updateData: any = {};
        if (slug !== undefined) updateData.slug = slug;
        if (category !== undefined) updateData.category = category;
        if (status !== undefined) updateData.status = status;
        if (featured_image !== undefined) updateData.featured_image = featured_image;
        if (read_time !== undefined) updateData.read_time = read_time;
        if (preserve_styles !== undefined) updateData.preserve_styles = preserve_styles;
        
        const { error: pageError } = await supabase
          .from('pages')
          .update(updateData)
          .eq('id', data.id);
        
        if (pageError) throw pageError;
      }
      
      // Update or create translations
      if (translations) {
        for (const translation of translations) {
          const { error } = await supabase
            .from('page_translations')
            .upsert({
              page_id: data.id,
              ...translation,
            }, {
              onConflict: 'page_id,language'
            });
          
          if (error) throw error;
        }
      }
    },
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', variables.id] });
      
      // Regenerate sitemap, RSS feeds, and submit to IndexNow if published
      if (variables.status === 'published') {
        try {
          await supabase.functions.invoke('generate-sitemap');
          console.log('[useUpdatePage] Sitemap regenerated');
        } catch (error) {
          console.error('[useUpdatePage] Failed to regenerate sitemap:', error);
        }
        
        try {
          await supabase.functions.invoke('generate-rss');
          console.log('[useUpdatePage] RSS feeds regenerated');
        } catch (error) {
          console.error('[useUpdatePage] Failed to regenerate RSS feeds:', error);
        }
        
        // Regenerate per-route SEO snapshot + submit to IndexNow
        try {
          const slug = variables.slug || (await supabase
            .from('pages')
            .select('slug')
            .eq('id', variables.id)
            .single()
          ).data?.slug;

          if (slug) {
            try {
              await supabase.functions.invoke('regenerate-snapshot', { body: { slug } });
              console.log('[useUpdatePage] SEO snapshot regenerated');
            } catch (error) {
              console.error('[useUpdatePage] Failed to regenerate snapshot:', error);
            }
            await supabase.functions.invoke('submit-indexnow', {
              body: { slug }
            });
            console.log('[useUpdatePage] URLs submitted to IndexNow');
          }
        } catch (error) {
          console.error('[useUpdatePage] Failed to submit to IndexNow:', error);
        }
      }
    },
  });
}

// Delete page
export function useDeletePage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: page } = await supabase
        .from('pages')
        .select('is_system_page, slug, page_translations(language, slug)')
        .eq('id', id)
        .single();

      if (page?.is_system_page) {
        throw new Error('Cannot delete system pages');
      }

      // Purge snapshots BEFORE deletion (need translation slugs)
      if (page?.slug) {
        const localeToHub: Record<string, string> = { en: 'publications', br: 'br/artigos', es: 'es/articulos' };
        const langToLocale: Record<string, string> = { en: 'en', 'pt-BR': 'br', br: 'br', 'es-ES': 'es', es: 'es' };
        const removals = ((page as any).page_translations || [])
          .map((tr: any) => {
            const locale = langToLocale[tr.language];
            if (!locale) return null;
            return `${localeToHub[locale]}/${tr.slug || page.slug}/index.html`;
          })
          .filter(Boolean) as string[];
        if (removals.length > 0) {
          try { await supabase.storage.from('seo-snapshots').remove(removals); } catch (_) {}
        }
      }

      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });

      // Regenerate sitemap and RSS feeds after deletion
      try {
        await supabase.functions.invoke('generate-sitemap');
        console.log('[useDeletePage] Sitemap regenerated');
      } catch (error) {
        console.error('[useDeletePage] Failed to regenerate sitemap:', error);
      }

      try {
        await supabase.functions.invoke('generate-rss');
        console.log('[useDeletePage] RSS feeds regenerated');
      } catch (error) {
        console.error('[useDeletePage] Failed to regenerate RSS feeds:', error);
      }
    },
  });
}

// Unpublish page (revert to draft)
export function useUnpublishPage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pages')
        .update({ status: 'draft' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: async (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', id] });
      
      // Regenerate sitemap and RSS feeds after unpublishing
      try {
        await supabase.functions.invoke('generate-sitemap');
        console.log('[useUnpublishPage] Sitemap regenerated');
      } catch (error) {
        console.error('[useUnpublishPage] Failed to regenerate sitemap:', error);
      }
      
      try {
        await supabase.functions.invoke('generate-rss');
        console.log('[useUnpublishPage] RSS feeds regenerated');
      } catch (error) {
        console.error('[useUnpublishPage] Failed to regenerate RSS feeds:', error);
      }

      // Regenerate snapshot — purges stale published snapshot since status is now 'draft'
      try {
        const { data: page } = await supabase.from('pages').select('slug').eq('id', id).single();
        if (page?.slug) {
          await supabase.functions.invoke('regenerate-snapshot', { body: { slug: page.slug } });
          console.log('[useUnpublishPage] SEO snapshot purged');
        }
      } catch (error) {
        console.error('[useUnpublishPage] Failed to purge snapshot:', error);
      }
    },
  });
}

// Publish page
export function usePublishPage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pages')
        .update({ status: 'published' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: async (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', id] });
      
      // Regenerate sitemap and RSS feeds after publishing
      try {
        await supabase.functions.invoke('generate-sitemap');
        console.log('[usePublishPage] Sitemap regenerated');
      } catch (error) {
        console.error('[usePublishPage] Failed to regenerate sitemap:', error);
      }
      
      try {
        await supabase.functions.invoke('generate-rss');
        console.log('[usePublishPage] RSS feeds regenerated');
      } catch (error) {
        console.error('[usePublishPage] Failed to regenerate RSS feeds:', error);
      }
      
      // Regenerate per-route SEO snapshot + submit to IndexNow
      try {
        const { data: page } = await supabase
          .from('pages')
          .select('slug')
          .eq('id', id)
          .single();

        if (page?.slug) {
          try {
            await supabase.functions.invoke('regenerate-snapshot', { body: { slug: page.slug } });
            console.log('[usePublishPage] SEO snapshot regenerated');
          } catch (error) {
            console.error('[usePublishPage] Failed to regenerate snapshot:', error);
          }
          await supabase.functions.invoke('submit-indexnow', {
            body: { slug: page.slug }
          });
          console.log('[usePublishPage] URLs submitted to IndexNow');
        }
      } catch (error) {
        console.error('[usePublishPage] Failed to submit to IndexNow:', error);
      }
    },
  });
}
