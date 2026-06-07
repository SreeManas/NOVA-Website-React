-- Create 'id-cards' public bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('id-cards', 'id-cards', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) for the storage bucket
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload ID cards"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'id-cards' 
  AND auth.role() = 'authenticated'
);

-- Allow anyone to read files from this public bucket (needed so Admins can view them easily via the public URL)
CREATE POLICY "Public read access for ID cards"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'id-cards'
);

-- Note: Depending on your exact Supabase storage configuration, you may need to enable RLS on the storage.objects table itself:
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- (Usually this is enabled by default in new Supabase projects)
