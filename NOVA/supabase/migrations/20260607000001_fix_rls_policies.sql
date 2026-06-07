-- Fix: Allow users to DELETE their own event_participants rows (unjoin events)
-- The original schema only had SELECT + INSERT policies, so leaveEvent() silently failed.
DROP POLICY IF EXISTS "Users can leave events." ON event_participants;
CREATE POLICY "Users can leave events." ON event_participants 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix: Allow Core/Admin to INSERT notifications (needed for approve/reject notifications)
DROP POLICY IF EXISTS "Core and Admins can insert notifications." ON notifications;
CREATE POLICY "Core and Admins can insert notifications." ON notifications
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('core', 'admin'))
);

-- Fix: Allow users to UPDATE their own discussions (edit likes on own post etc.)
DROP POLICY IF EXISTS "Authors can update own discussions." ON discussions;
CREATE POLICY "Authors can update own discussions." ON discussions 
FOR UPDATE 
USING (auth.uid() = author_id);

-- Fix: Allow users to UPDATE their own replies
DROP POLICY IF EXISTS "Authors can update own replies." ON discussion_replies;
CREATE POLICY "Authors can update own replies." ON discussion_replies
FOR UPDATE 
USING (auth.uid() = author_id);
