-- Create pages table
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create page_translations table
CREATE TABLE public.page_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'br', 'es')),
  title TEXT NOT NULL,
  meta_description TEXT,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(page_id, language)
);

-- Create indexes for performance
CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_status ON public.pages(status);
CREATE INDEX idx_pages_category ON public.pages(category);
CREATE INDEX idx_page_translations_page_id ON public.page_translations(page_id);
CREATE INDEX idx_page_translations_language ON public.page_translations(language);
CREATE INDEX idx_page_translations_page_lang ON public.page_translations(page_id, language);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_pages_updated_at 
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_translations_updated_at 
  BEFORE UPDATE ON public.page_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_translations ENABLE ROW LEVEL SECURITY;

-- Simplified RLS policies - allow all in development
CREATE POLICY "Allow all in development" 
  ON public.pages 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all in development" 
  ON public.page_translations 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);