-- Drop the development policies
DROP POLICY IF EXISTS "Allow all in development" ON public.pages;
DROP POLICY IF EXISTS "Allow all in development" ON public.page_translations;

-- Public can only read published pages
CREATE POLICY "Public read published pages"
ON public.pages FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Public can only read translations of published pages
CREATE POLICY "Public read published translations"
ON public.page_translations FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pages 
    WHERE pages.id = page_translations.page_id 
    AND pages.status = 'published'
  )
);