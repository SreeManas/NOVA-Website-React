-- Add INSERT policy for notifications so admins can send notifications

CREATE POLICY "Core and Admins can insert notifications." 
ON notifications 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('core', 'admin'))
);
