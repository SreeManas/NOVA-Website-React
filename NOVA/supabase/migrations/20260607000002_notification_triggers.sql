-- Automatically create notifications for all users when a new event, discussion, or opportunity is created.

-- 1. Trigger for New Discussions
CREATE OR REPLACE FUNCTION notify_new_discussion()
RETURNS trigger AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, action_url)
  SELECT id, 'discussion-reply', 'New Discussion Started', NEW.title, '/community?tab=discussions'
  FROM profiles
  WHERE id != NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_discussion_created ON discussions;
CREATE TRIGGER on_discussion_created
  AFTER INSERT ON discussions
  FOR EACH ROW EXECUTE FUNCTION notify_new_discussion();

-- 2. Trigger for New Events
CREATE OR REPLACE FUNCTION notify_new_event()
RETURNS trigger AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, action_url)
  SELECT id, 'event-reminder', 'New Event Created', NEW.title, '/community?tab=events'
  FROM profiles
  WHERE id != NEW.host_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_event_created ON events;
CREATE TRIGGER on_event_created
  AFTER INSERT ON events
  FOR EACH ROW EXECUTE FUNCTION notify_new_event();

-- 3. Trigger for New Opportunities
CREATE OR REPLACE FUNCTION notify_new_opportunity()
RETURNS trigger AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, action_url)
  SELECT id, 'new-opportunity', 'New Opportunity Available', NEW.title, '/launchpad'
  FROM profiles
  WHERE id != NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_opportunity_created ON opportunities;
CREATE TRIGGER on_opportunity_created
  AFTER INSERT ON opportunities
  FOR EACH ROW EXECUTE FUNCTION notify_new_opportunity();
