
INSERT INTO storage.buckets (id, name, public)
VALUES ('seo-snapshots', 'seo-snapshots', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read seo-snapshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'seo-snapshots');

CREATE POLICY "Service role write seo-snapshots"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'seo-snapshots');

CREATE POLICY "Service role update seo-snapshots"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'seo-snapshots');
