-- Update blog-images bucket to allow XML files for sitemap and RSS feeds
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'text/plain', 'application/xml', 'text/xml', 'application/rss+xml']
WHERE id = 'blog-images';