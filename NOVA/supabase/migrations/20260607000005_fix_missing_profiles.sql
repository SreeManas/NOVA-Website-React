-- Fix missing profiles
-- If you created your account before the profile trigger was set up, 
-- your account exists in auth.users but not in the public.profiles table.
-- This script ensures all users have a corresponding profile.

INSERT INTO public.profiles (id, full_name, college_email, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1), 'Unknown User'),
  email,
  'guest'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
