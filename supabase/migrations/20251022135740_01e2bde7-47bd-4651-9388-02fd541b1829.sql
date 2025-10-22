-- Add new columns to pages table for publications hub
ALTER TABLE public.pages
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS author_name TEXT,
ADD COLUMN IF NOT EXISTS reading_time INTEGER,
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Add index for featured publications
CREATE INDEX IF NOT EXISTS idx_pages_featured ON public.pages(is_featured) WHERE is_featured = true;

-- Add index for tags (GIN index for JSONB)
CREATE INDEX IF NOT EXISTS idx_pages_tags ON public.pages USING gin(tags);

-- Add column to page_translations for featured image alt text
ALTER TABLE public.page_translations
ADD COLUMN IF NOT EXISTS featured_image_alt TEXT;

-- Insert sample publications (4 English publications matching homepage)
INSERT INTO public.pages (slug, category, status, featured_image, author_name, reading_time, tags, is_featured)
VALUES 
  ('web3-for-athletes', 'Web3', 'published', '/src/assets/web3-for-athletes.png', 'Gabriel Mangabeira', 8, '["Web3", "Athletes", "Technology"]'::jsonb, true),
  ('web2-vs-web3-marketing', 'Marketing', 'published', '/src/assets/web2-vs-web3-cover.png', 'Gabriel Mangabeira', 10, '["Web3", "Marketing", "Strategy"]'::jsonb, true),
  ('web3-seo-guide', 'SEO', 'published', '/src/assets/web3-seo-cover.png', 'Gabriel Mangabeira', 12, '["SEO", "Web3", "Growth"]'::jsonb, false),
  ('token-health-scan', 'Tools', 'published', '/src/assets/token-health-scan-build-cover.png', 'Gabriel Mangabeira', 6, '["Web3", "Tools", "Analytics"]'::jsonb, false)
ON CONFLICT (slug) DO NOTHING;

-- Insert English translations for sample publications
INSERT INTO public.page_translations (page_id, language, title, meta_description, content, featured_image_alt)
VALUES 
  (
    (SELECT id FROM pages WHERE slug = 'web3-for-athletes'),
    'en',
    'How Web3 is Elevating the Game for Athletes',
    'Discover how decentralized technology opens new revenue streams, enhances fan engagement, and provides direct access for athletes.',
    '<p>Web3 technology is revolutionizing how athletes connect with fans and monetize their brand. This comprehensive guide explores the opportunities and strategies for athletes entering the decentralized web.</p><h2>The Power of Direct Fan Relationships</h2><p>Traditional sports marketing relies on intermediaries. Web3 removes these barriers, allowing athletes to build direct relationships with their fanbase through NFTs, tokens, and decentralized platforms.</p>',
    'Athletes leveraging Web3 technology for fan engagement'
  ),
  (
    (SELECT id FROM pages WHERE slug = 'web2-vs-web3-marketing'),
    'en',
    'Web2 vs Web3 Marketing: The Complete Guide',
    'Understanding the fundamental differences between traditional digital marketing and Web3 marketing strategies for modern brands.',
    '<p>The shift from Web2 to Web3 represents a paradigm change in how brands connect with audiences. This guide breaks down the key differences and opportunities.</p><h2>Centralized vs Decentralized Engagement</h2><p>Web2 marketing relies on platforms you don''t control. Web3 gives you ownership of your community and data.</p>',
    'Comparison between Web2 and Web3 marketing approaches'
  ),
  (
    (SELECT id FROM pages WHERE slug = 'web3-seo-guide'),
    'en',
    'The Ultimate Web3 SEO Guide',
    'Master search engine optimization for Web3 projects, DApps, and decentralized platforms with this comprehensive guide.',
    '<p>SEO in Web3 requires a unique approach. This guide covers everything from technical optimization to content strategy for decentralized applications.</p><h2>Indexing Challenges in Web3</h2><p>Decentralized sites face unique crawling challenges. Learn how to make your Web3 project discoverable.</p>',
    'Web3 SEO optimization strategy diagram'
  ),
  (
    (SELECT id FROM pages WHERE slug = 'token-health-scan'),
    'en',
    'Token Health Scan: Analyze Your Web3 Project',
    'Free tool to audit your token project across marketing, community, technology, and growth metrics.',
    '<p>The Token Health Scan is a comprehensive diagnostic tool for Web3 projects. Get actionable insights across 50+ metrics in minutes.</p><h2>How It Works</h2><p>Simply enter your project details and receive a detailed report with specific recommendations for improvement.</p>',
    'Token Health Scan tool interface showing analytics dashboard'
  )
ON CONFLICT (page_id, language) DO NOTHING;