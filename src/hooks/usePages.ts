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

// Fetch published page by slug and language (public route)
export function usePublicPage(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ['public-page', slug, locale],
    queryFn: async () => {
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
          return { 
            page: Array.isArray(translation.page) ? translation.page[0] : translation.page, 
            translation 
          };
        }
      }
      
      // Fall back to base slug lookup
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
      
      // If no translation for requested language, try English fallback
      if (!translation && locale !== 'en') {
        const { data: fallback } = await supabase
          .from('page_translations')
          .select('*')
          .eq('page_id', page.id)
          .eq('language', 'en')
          .maybeSingle();
        
        return { page, translation: fallback };
      }
      
      return { page, translation };
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
      translations: Array<{
        language: Locale;
        title: string;
        meta_description: string | null;
        content: string | null;
        slug?: string | null;
      }>;
    }) => {
      // Create page
      const { data: page, error: pageError } = await supabase
        .from('pages')
        .insert({
          slug: data.slug,
          category: data.category,
          featured_image: data.featured_image,
          read_time: data.read_time,
          status: 'draft',
        })
        .select()
        .single();
      
      if (pageError) throw pageError;
      
      // Create translations
      const translationsToInsert = data.translations.map(t => ({
        page_id: page.id,
        ...t,
      }));
      
      const { error: translationsError } = await supabase
        .from('page_translations')
        .insert(translationsToInsert);
      
      if (translationsError) throw translationsError;
      
      return page;
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
      const { slug, category, status, featured_image, read_time, translations } = data;
      
      if (slug !== undefined || category !== undefined || status !== undefined || featured_image !== undefined || read_time !== undefined) {
        const updateData: any = {};
        if (slug !== undefined) updateData.slug = slug;
        if (category !== undefined) updateData.category = category;
        if (status !== undefined) updateData.status = status;
        if (featured_image !== undefined) updateData.featured_image = featured_image;
        if (read_time !== undefined) updateData.read_time = read_time;
        
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', variables.id] });
    },
  });
}

// Delete page
export function useDeletePage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
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
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', id] });
    },
  });
}
