-- Add slug column to page_translations for localized URLs
ALTER TABLE page_translations ADD COLUMN slug text;

-- Add index for faster lookups by slug
CREATE INDEX idx_page_translations_slug ON page_translations(slug);

-- Add comment explaining the column
COMMENT ON COLUMN page_translations.slug IS 'Localized slug for this translation. If NULL, falls back to the page base slug.';