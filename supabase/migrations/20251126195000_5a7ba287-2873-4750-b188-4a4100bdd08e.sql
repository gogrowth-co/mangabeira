-- Add preserve_styles field to pages table
ALTER TABLE public.pages 
ADD COLUMN preserve_styles boolean DEFAULT false;

COMMENT ON COLUMN public.pages.preserve_styles IS 'When true, renders content with original HTML/Tailwind classes instead of prose wrapper';