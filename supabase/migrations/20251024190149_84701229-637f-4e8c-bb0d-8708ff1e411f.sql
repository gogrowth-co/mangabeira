-- Add is_system_page column to pages table
ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS is_system_page BOOLEAN DEFAULT false;

-- Insert About system page
INSERT INTO public.pages (slug, category, status, is_system_page, featured_image, read_time)
VALUES ('about', 'About', 'published', true, NULL, '5 min')
ON CONFLICT (slug) DO NOTHING;

-- Insert Privacy Policy system page
INSERT INTO public.pages (slug, category, status, is_system_page, featured_image, read_time)
VALUES ('privacy-policy', 'Legal', 'published', true, NULL, '3 min')
ON CONFLICT (slug) DO NOTHING;

-- Insert English translation for About
INSERT INTO public.page_translations (page_id, language, title, meta_description, content, slug)
SELECT 
  id,
  'en',
  'About Gabriel Mangabeira',
  'Learn about Gabriel Mangabeira - Olympic swimmer, growth marketer, and Web3 strategist with experience at major brands and blockchain projects.',
  '<h2>About Gabriel Mangabeira</h2><p>Olympic swimmer turned growth marketer and Web3 strategist.</p><p>This content should be edited through the admin panel.</p>',
  'about'
FROM public.pages 
WHERE slug = 'about' AND is_system_page = true
ON CONFLICT DO NOTHING;

-- Insert Portuguese (BR) draft translation for About
INSERT INTO public.page_translations (page_id, language, title, meta_description, content, slug)
SELECT 
  id,
  'br',
  'Sobre Gabriel Mangabeira',
  '',
  '',
  'sobre'
FROM public.pages 
WHERE slug = 'about' AND is_system_page = true
ON CONFLICT DO NOTHING;

-- Insert Spanish (ES) draft translation for About
INSERT INTO public.page_translations (page_id, language, title, meta_description, content, slug)
SELECT 
  id,
  'es',
  'Acerca de Gabriel Mangabeira',
  '',
  '',
  'acerca-de'
FROM public.pages 
WHERE slug = 'about' AND is_system_page = true
ON CONFLICT DO NOTHING;

-- Insert English translation for Privacy Policy
INSERT INTO public.page_translations (page_id, language, title, meta_description, content, slug)
SELECT 
  id,
  'en',
  'Privacy Policy',
  'Privacy policy for mangabeira.net - Learn how we collect, use, and protect your personal information.',
  '<h2>Privacy Policy</h2><p>Last Updated: October 24, 2025</p><p>This content should be edited through the admin panel.</p>',
  'privacy-policy'
FROM public.pages 
WHERE slug = 'privacy-policy' AND is_system_page = true
ON CONFLICT DO NOTHING;

-- Insert Portuguese (BR) draft translation for Privacy Policy
INSERT INTO public.page_translations (page_id, language, title, meta_description, content, slug)
SELECT 
  id,
  'br',
  'Política de Privacidade',
  '',
  '',
  'politica-de-privacidade'
FROM public.pages 
WHERE slug = 'privacy-policy' AND is_system_page = true
ON CONFLICT DO NOTHING;

-- Insert Spanish (ES) draft translation for Privacy Policy
INSERT INTO public.page_translations (page_id, language, title, meta_description, content, slug)
SELECT 
  id,
  'es',
  'Política de Privacidad',
  '',
  '',
  'politica-de-privacidad'
FROM public.pages 
WHERE slug = 'privacy-policy' AND is_system_page = true
ON CONFLICT DO NOTHING;