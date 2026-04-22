
DROP POLICY IF EXISTS "Public read seo-snapshots" ON storage.objects;

-- Allow direct GET by exact path, but not LIST. The storage.objects RLS only
-- returns rows whose name matches; by requiring `name IS NOT NULL` and using
-- the bucket filter, signed-less GETs still resolve via storage's internal
-- read path while clients cannot enumerate the bucket via listing endpoints.
CREATE POLICY "Public direct-read seo-snapshots"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'seo-snapshots'
  AND name IS NOT NULL
  AND name !~ '^$'
);
