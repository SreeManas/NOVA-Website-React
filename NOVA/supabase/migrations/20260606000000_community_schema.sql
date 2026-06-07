-- ==========================================
-- NOVA COMMUNITY PLATFORM SCHEMA & MIGRATION
-- ==========================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('guest', 'verified', 'core', 'admin');
CREATE TYPE department AS ENUM ('CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIDS', 'AIML');
CREATE TYPE year_of_study AS ENUM ('1st', '2nd', '3rd', '4th');
CREATE TYPE application_status AS ENUM ('idle', 'submitting', 'pending', 'approved', 'rejected');
CREATE TYPE discussion_category AS ENUM ('general', 'hackathons', 'placements', 'ai-ml', 'web-development', 'cybersecurity', 'projects', 'open-source');
CREATE TYPE event_type AS ENUM ('study-circle', 'tech-meetup', 'resume-review', 'mock-interview', 'hackathon-prep', 'open-source-sprint');
CREATE TYPE event_status AS ENUM ('upcoming', 'live', 'completed');

-- 2. TABLES

-- Profiles (Extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  department department,
  year_of_study year_of_study,
  college_email TEXT UNIQUE,
  role user_role DEFAULT 'guest',
  level TEXT DEFAULT 'explorer',
  points_total INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOVA ID Applications
CREATE TABLE nova_id_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  full_name TEXT NOT NULL,
  roll_number TEXT UNIQUE NOT NULL,
  department department NOT NULL,
  year_of_study year_of_study NOT NULL,
  college_email TEXT NOT NULL,
  id_card_url TEXT NOT NULL,
  motivation TEXT,
  status application_status DEFAULT 'pending',
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discussions
CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category discussion_category NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discussion Replies
CREATE TABLE discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type event_type NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  host_id UUID REFERENCES profiles(id) NOT NULL,
  max_participants INTEGER NOT NULL,
  status event_status DEFAULT 'upcoming',
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Participants (Many-to-Many)
CREATE TABLE event_participants (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEXES
CREATE INDEX idx_discussions_category ON discussions(category);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_applications_status ON nova_id_applications(status);

-- 4. ROW LEVEL SECURITY (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nova_id_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read profiles. Users can update their own profile.
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Discussions: Guests can read. Verified/Core/Admin can insert. Admin/Core can delete.
CREATE POLICY "Discussions are viewable by everyone." ON discussions FOR SELECT USING (true);
CREATE POLICY "Verified users can insert discussions." ON discussions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('verified', 'core', 'admin'))
);
CREATE POLICY "Admins and Core can delete discussions." ON discussions FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('core', 'admin'))
);

-- Discussion Replies: Guests can read. Verified/Core/Admin can insert.
CREATE POLICY "Replies are viewable by everyone." ON discussion_replies FOR SELECT USING (true);
CREATE POLICY "Verified users can reply." ON discussion_replies FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('verified', 'core', 'admin'))
);

-- Events: Guests can read. Admin/Core can insert/update/delete.
CREATE POLICY "Events are viewable by everyone." ON events FOR SELECT USING (true);
CREATE POLICY "Core and Admins can manage events." ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('core', 'admin'))
);

-- Event Participants: Verified users can join (insert) and view.
CREATE POLICY "Anyone can view event participants." ON event_participants FOR SELECT USING (true);
CREATE POLICY "Verified users can join events." ON event_participants FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('verified', 'core', 'admin'))
);

-- NOVA ID Applications: Users can insert and read their own. Core/Admin can read all and update (approve/reject).
CREATE POLICY "Users can read own application." ON nova_id_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Core and Admins can read all applications." ON nova_id_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('core', 'admin'))
);
CREATE POLICY "Users can insert own application." ON nova_id_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Core and Admins can update applications (approve/reject)." ON nova_id_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('core', 'admin'))
);

-- Notifications: Users can only read and update their own.
CREATE POLICY "Users can read own notifications." ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications." ON notifications FOR UPDATE USING (auth.uid() = user_id);
