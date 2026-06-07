-- Sync verified profile data from approved applications to the profiles table
UPDATE profiles p
SET 
  full_name = a.full_name,
  department = a.department,
  year_of_study = a.year_of_study
FROM nova_id_applications a
WHERE p.id = a.user_id AND a.status = 'approved';
