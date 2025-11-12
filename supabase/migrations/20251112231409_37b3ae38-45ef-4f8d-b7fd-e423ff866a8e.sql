-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles: users can read their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS policy for user_roles: only admins can insert/update/delete roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update pages RLS policies to allow admins to see drafts
DROP POLICY IF EXISTS "Public read published pages" ON public.pages;

CREATE POLICY "Public can view published pages"
ON public.pages
FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can view all pages"
ON public.pages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update pages mutations policies for admins
DROP POLICY IF EXISTS "Allow insert pages" ON public.pages;
DROP POLICY IF EXISTS "Allow update pages" ON public.pages;
DROP POLICY IF EXISTS "Allow delete pages" ON public.pages;

CREATE POLICY "Admins can insert pages"
ON public.pages
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pages"
ON public.pages
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pages"
ON public.pages
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') AND NOT is_system_page);

-- Update page_translations RLS policies
DROP POLICY IF EXISTS "Public read published translations" ON public.page_translations;
DROP POLICY IF EXISTS "Allow insert translations" ON public.page_translations;
DROP POLICY IF EXISTS "Allow update translations" ON public.page_translations;
DROP POLICY IF EXISTS "Allow delete translations" ON public.page_translations;

CREATE POLICY "Public can view published translations"
ON public.page_translations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM pages 
  WHERE pages.id = page_translations.page_id 
  AND pages.status = 'published'
));

CREATE POLICY "Admins can view all translations"
ON public.page_translations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert translations"
ON public.page_translations
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update translations"
ON public.page_translations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete translations"
ON public.page_translations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));