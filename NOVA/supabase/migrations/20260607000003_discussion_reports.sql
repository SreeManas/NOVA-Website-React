-- Migration for discussion reports
CREATE TABLE IF NOT EXISTS discussion_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(discussion_id, user_id)
);

ALTER TABLE discussion_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert reports." ON discussion_reports
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Core and Admins can view reports." ON discussion_reports
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('core', 'admin'))
);

CREATE POLICY "Core and Admins can delete reports." ON discussion_reports
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('core', 'admin'))
);

-- Create a view for easy access in the moderation dashboard
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
