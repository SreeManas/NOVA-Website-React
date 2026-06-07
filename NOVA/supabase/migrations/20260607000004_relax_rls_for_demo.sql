-- Relax RLS Policies for the Demo Environment
-- This allows any authenticated user to test the moderation dashboard functionality

-- 1. Relax discussion_reports policies
DROP POLICY IF EXISTS "Core and Admins can view reports." ON discussion_reports;
CREATE POLICY "Everyone can view reports." ON discussion_reports
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Core and Admins can delete reports." ON discussion_reports;
CREATE POLICY "Everyone can delete reports." ON discussion_reports
FOR DELETE
USING (true);

-- 2. Relax discussions policies
DROP POLICY IF EXISTS "Admins and Core can delete discussions." ON discussions;
CREATE POLICY "Everyone can delete discussions." ON discussions
FOR DELETE
USING (true);

-- 3. Re-create the view to ensure it works correctly with the new policies
DROP VIEW IF EXISTS reported_discussions_view;
CREATE VIEW reported_discussions_view WITH (security_invoker = true) AS
SELECT 
  d.id as discussion_id,
  d.title,
  p.full_name as author_name,
  COUNT(dr.id) as report_count,
  MAX(dr.reason) as reason
FROM discussions d
JOIN profiles p ON d.author_id = p.id
JOIN discussion_reports dr ON dr.discussion_id = d.id
GROUP BY d.id, d.title, p.full_name;
