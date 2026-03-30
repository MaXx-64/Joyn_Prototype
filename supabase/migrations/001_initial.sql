-- Enable RLS
-- Users profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  age INTEGER,
  city TEXT,
  bio TEXT,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'moderate', 'active')),
  health_goals TEXT[],
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'America/Phoenix',
  connection_preference TEXT CHECK (connection_preference IN ('same_age', 'younger', 'both')),
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  streak_count INTEGER DEFAULT 0,
  is_young_volunteer BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interests
CREATE TABLE IF NOT EXISTS interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- User interests junction
CREATE TABLE IF NOT EXISTS user_interests (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);

-- Matches
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id_1 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  match_score FLOAT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  activity_type TEXT DEFAULT 'chair_yoga',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  video_call_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Allow reading other profiles for matching (authenticated users only)
CREATE POLICY "Authenticated users can view other profiles" ON profiles FOR SELECT USING (auth.role() = 'authenticated');

-- Matches: users can see their own matches
CREATE POLICY "Users can view own matches" ON matches FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Sessions: users can see sessions they're part of
CREATE POLICY "Users can view own sessions" ON sessions FOR SELECT USING (auth.uid() = created_by OR auth.uid() = partner_id);
CREATE POLICY "Users can create sessions" ON sessions FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own sessions" ON sessions FOR UPDATE USING (auth.uid() = created_by);

-- Reports
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- User interests
CREATE POLICY "Users can view all interests" ON user_interests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage own interests" ON user_interests FOR ALL USING (auth.uid() = user_id);

-- Seed interests
INSERT INTO interests (name) VALUES
  ('Chair Yoga'), ('Walking'), ('Stretching'), ('Light Resistance'),
  ('Gardening'), ('Cooking'), ('Reading'), ('Music'), ('Painting'),
  ('Birdwatching'), ('Photography'), ('Dancing'), ('Swimming'), ('Cycling')
ON CONFLICT DO NOTHING;
