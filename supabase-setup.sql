-- SoloVault Database Schema for Supabase
-- Copie ce SQL dans l'éditeur SQL de Supabase : https://qwkieyypejlniuewavya.supabase.co/project/qwkieyypejlniuewavya/sql

-- 1. Table user_progress (Points, Badges, Niveaux)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  points INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  level INTEGER DEFAULT 1,
  actions JSONB DEFAULT '{
    "emailSubmitted": false,
    "quizCompleted": false,
    "projectsViewed": 0,
    "dataDownloaded": false,
    "referrals": 0
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table referrals (Système de parrainage)
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT,
  referred_users JSONB DEFAULT '[]'::jsonb,
  call_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table quiz_responses (Réponses au quiz)
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  answers JSONB NOT NULL,
  result_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Index pour performances
CREATE INDEX IF NOT EXISTS idx_user_progress_email ON user_progress(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_points ON user_progress(points DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_activity ON user_progress(last_activity DESC);

CREATE INDEX IF NOT EXISTS idx_referrals_email ON referrals(email);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_by ON referrals(referred_by);

CREATE INDEX IF NOT EXISTS idx_quiz_email ON quiz_responses(email);
CREATE INDEX IF NOT EXISTS idx_quiz_created_at ON quiz_responses(created_at DESC);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- 6. Policies pour permettre l'accès public (anonyme)
-- User Progress Policies
CREATE POLICY "Enable read access for all users" ON user_progress
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON user_progress
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON user_progress
  FOR UPDATE USING (true);

-- Referrals Policies
CREATE POLICY "Enable read access for all users" ON referrals
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON referrals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON referrals
  FOR UPDATE USING (true);

-- Quiz Responses Policies
CREATE POLICY "Enable read access for all users" ON quiz_responses
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON quiz_responses
  FOR INSERT WITH CHECK (true);

-- 7. Fonctions helper pour calculer le niveau
CREATE OR REPLACE FUNCTION calculate_level(points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  IF points >= 1000 THEN RETURN 10;
  ELSIF points >= 750 THEN RETURN 9;
  ELSIF points >= 500 THEN RETURN 8;
  ELSIF points >= 300 THEN RETURN 7;
  ELSIF points >= 200 THEN RETURN 6;
  ELSIF points >= 150 THEN RETURN 5;
  ELSIF points >= 100 THEN RETURN 4;
  ELSIF points >= 50 THEN RETURN 3;
  ELSIF points >= 20 THEN RETURN 2;
  ELSE RETURN 1;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger pour mettre à jour automatiquement le niveau
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := calculate_level(NEW.points);
  NEW.last_activity := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_level
  BEFORE INSERT OR UPDATE OF points ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- Terminé ! Les tables sont prêtes à être utilisées.
-- Tu peux vérifier dans l'interface Supabase : Table Editor
