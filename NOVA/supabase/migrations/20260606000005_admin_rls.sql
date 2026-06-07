-- Allow Core and Admins to update profiles (needed to upgrade user to 'verified' role upon approval)
CREATE POLICY "Core and Admins can update profiles." 
ON profiles 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('core', 'admin'))
);
