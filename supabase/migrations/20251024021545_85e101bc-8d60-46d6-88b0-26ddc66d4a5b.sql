-- Add policies to allow INSERT and UPDATE operations on page_translations
-- This allows upsert operations (INSERT with ON CONFLICT UPDATE) to work

-- Policy to allow inserting new translations
CREATE POLICY "Allow insert translations"
ON public.page_translations
FOR INSERT
WITH CHECK (
  -- Only allow translations for pages that exist
  EXISTS (
    SELECT 1 FROM public.pages 
    WHERE pages.id = page_translations.page_id
  )
);

-- Policy to allow updating existing translations
CREATE POLICY "Allow update translations"
ON public.page_translations
FOR UPDATE
USING (
  -- Only allow updating translations that belong to existing pages
  EXISTS (
    SELECT 1 FROM public.pages 
    WHERE pages.id = page_translations.page_id
  )
)
WITH CHECK (
  -- Ensure the translation still belongs to a valid page after update
  EXISTS (
    SELECT 1 FROM public.pages 
    WHERE pages.id = page_translations.page_id
  )
);

-- Policy to allow insert/update/delete operations on pages table
CREATE POLICY "Allow insert pages"
ON public.pages
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update pages"
ON public.pages
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete pages"
ON public.pages
FOR DELETE
USING (true);

CREATE POLICY "Allow delete translations"
ON public.page_translations
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.pages 
    WHERE pages.id = page_translations.page_id
  )
);