-- Fix circular RLS issue for page creation
-- Create security definer function to check page existence
CREATE OR REPLACE FUNCTION public.page_exists(_page_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.pages WHERE id = _page_id
  );
$$;

-- Drop existing page_translations policies that cause circular dependency
DROP POLICY IF EXISTS "Allow insert translations" ON public.page_translations;
DROP POLICY IF EXISTS "Allow update translations" ON public.page_translations;
DROP POLICY IF EXISTS "Allow delete translations" ON public.page_translations;

-- Recreate policies using the security definer function
CREATE POLICY "Allow insert translations"
ON public.page_translations
FOR INSERT
WITH CHECK (public.page_exists(page_id));

CREATE POLICY "Allow update translations"
ON public.page_translations
FOR UPDATE
USING (public.page_exists(page_id))
WITH CHECK (public.page_exists(page_id));

CREATE POLICY "Allow delete translations"
ON public.page_translations
FOR DELETE
USING (public.page_exists(page_id));

-- Temporary fix for image uploads (DEVELOPMENT ONLY - INSECURE)
-- Drop existing storage policy that requires authentication
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view blog images" ON storage.objects;

-- Allow anyone to upload, update, and delete blog images (TEMPORARY)
CREATE POLICY "Anyone can upload blog images (DEV ONLY)"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anyone can update blog images (DEV ONLY)"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anyone can delete blog images (DEV ONLY)"
ON storage.objects
FOR DELETE
USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can view blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');