-- Add schema column to page_translations for JSON-LD structured data
ALTER TABLE public.page_translations 
ADD COLUMN schema jsonb DEFAULT NULL;

COMMENT ON COLUMN public.page_translations.schema IS 'JSON-LD structured data for SEO and rich snippets';