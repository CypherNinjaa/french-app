-- French Learning App Database Schema
-- Run this in your Supabase SQL editor
-- 
-- IMPORTANT: This schema is designed to be idempotent - you can run it multiple times safely.
-- It will only create/update what doesn't already exist, preventing duplicate errors.

-- Enable Row Level Security (RLS) by default
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE learning_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE module_status AS ENUM ('locked', 'unlocked', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_type AS ENUM ('multiple_choice', 'fill_in_blank', 'matching', 'pronunciation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  learning_level learning_level DEFAULT 'beginner',
  preferences JSONB DEFAULT '{"notifications": true, "theme": "light", "language": "en"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  level learning_level DEFAULT 'beginner',
  order_index INTEGER NOT NULL UNIQUE,
  total_lessons INTEGER DEFAULT 0,
  estimated_duration_minutes INTEGER DEFAULT 60,
  is_premium BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  image_url TEXT,
  pass_threshold INTEGER DEFAULT 65, -- percentage required to pass
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Rich text content (markdown or HTML)
  lesson_type TEXT DEFAULT 'conversation', -- conversation, grammar, vocabulary, pronunciation, culture
  order_index INTEGER NOT NULL,
  estimated_duration_minutes INTEGER DEFAULT 15,
  audio_url TEXT,
  image_url TEXT,
  key_phrases TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(module_id, order_index)
);

-- Vocabulary table
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  french_word TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  word_type TEXT, -- noun, verb, adjective, etc.
  gender TEXT, -- masculine, feminine, neutral (for nouns)
  usage_example TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(module_id, french_word)
);

-- Grammar topics table
CREATE TABLE IF NOT EXISTS grammar_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,
  examples JSONB, -- Array of example sentences
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  questions JSONB NOT NULL, -- Array of question objects
  pass_threshold INTEGER DEFAULT 65,
  time_limit_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  status module_status DEFAULT 'locked',
  progress_percentage INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, module_id)
);

-- User lesson progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- User vocabulary progress
CREATE TABLE IF NOT EXISTS user_vocab_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vocabulary_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE,
  mastery_level INTEGER DEFAULT 0, -- 0-5 scale
  times_practiced INTEGER DEFAULT 0,
  last_practiced TIMESTAMP WITH TIME ZONE,
  first_learned TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vocabulary_id)
);

-- Test results
CREATE TABLE IF NOT EXISTS test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL, -- percentage score
  answers JSONB NOT NULL, -- User's answers
  time_taken_seconds INTEGER,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat logs (for AI conversations)
CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL, -- Array of message objects
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pronunciation practice records
CREATE TABLE IF NOT EXISTS pronunciation_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL, -- The text that was supposed to be read
  transcription TEXT, -- What the user actually said (from STT)
  audio_url TEXT, -- Link to recorded audio in storage
  score INTEGER, -- Pronunciation score (0-100)
  feedback TEXT, -- AI-generated feedback
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reading practice sessions
CREATE TABLE IF NOT EXISTS reading_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  transcription TEXT,
  audio_url TEXT,
  errors JSONB, -- Array of error objects with word positions
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules(order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(order_index);
CREATE INDEX IF NOT EXISTS idx_vocabulary_module ON vocabulary(module_id);
CREATE INDEX IF NOT EXISTS idx_grammar_module ON grammar_topics(module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module ON user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_test_results_user ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_user ON chat_logs(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronunciation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (drop and recreate to ensure they're current)
-- Profiles: Users can only access their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User progress: Users can only access their own progress
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User lesson progress: Users can only access their own lesson progress
DROP POLICY IF EXISTS "Users can view own lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can view own lesson progress" ON user_lesson_progress FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can update own lesson progress" ON user_lesson_progress FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can insert own lesson progress" ON user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User vocabulary progress: Users can only access their own vocabulary progress
DROP POLICY IF EXISTS "Users can view own vocab progress" ON user_vocab_progress;
CREATE POLICY "Users can view own vocab progress" ON user_vocab_progress FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own vocab progress" ON user_vocab_progress;
CREATE POLICY "Users can update own vocab progress" ON user_vocab_progress FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own vocab progress" ON user_vocab_progress;
CREATE POLICY "Users can insert own vocab progress" ON user_vocab_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Test results: Users can only access their own test results
DROP POLICY IF EXISTS "Users can view own test results" ON test_results;
CREATE POLICY "Users can view own test results" ON test_results FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own test results" ON test_results;
CREATE POLICY "Users can insert own test results" ON test_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat logs: Users can only access their own chat logs
DROP POLICY IF EXISTS "Users can view own chat logs" ON chat_logs;
CREATE POLICY "Users can view own chat logs" ON chat_logs FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own chat logs" ON chat_logs;
CREATE POLICY "Users can insert own chat logs" ON chat_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pronunciation records: Users can only access their own records
DROP POLICY IF EXISTS "Users can view own pronunciation records" ON pronunciation_records;
CREATE POLICY "Users can view own pronunciation records" ON pronunciation_records FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own pronunciation records" ON pronunciation_records;
CREATE POLICY "Users can insert own pronunciation records" ON pronunciation_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reading sessions: Users can only access their own sessions
DROP POLICY IF EXISTS "Users can view own reading sessions" ON reading_sessions;
CREATE POLICY "Users can view own reading sessions" ON reading_sessions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own reading sessions" ON reading_sessions;
CREATE POLICY "Users can insert own reading sessions" ON reading_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public content tables (modules, lessons, vocabulary, grammar, tests) - read-only for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view modules" ON modules;
CREATE POLICY "Authenticated users can view modules" ON modules FOR SELECT TO authenticated USING (is_published = true);
DROP POLICY IF EXISTS "Authenticated users can view lessons" ON lessons;
CREATE POLICY "Authenticated users can view lessons" ON lessons FOR SELECT TO authenticated USING (is_published = true);
DROP POLICY IF EXISTS "Authenticated users can view vocabulary" ON vocabulary;
CREATE POLICY "Authenticated users can view vocabulary" ON vocabulary FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated users can view grammar topics" ON grammar_topics;
CREATE POLICY "Authenticated users can view grammar topics" ON grammar_topics FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated users can view tests" ON tests;
CREATE POLICY "Authenticated users can view tests" ON tests FOR SELECT TO authenticated USING (true);

-- Function to automatically create user progress when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  -- Extract full name from metadata, default to empty string if null
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
  -- Insert profile (the trigger function runs with elevated privileges)
  INSERT INTO public.profiles (id, email, full_name, learning_level, preferences)
  VALUES (
    NEW.id, 
    NEW.email, 
    user_full_name,
    'beginner'::learning_level,
    '{"notifications": true, "theme": "light", "language": "en"}'::jsonb
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
    updated_at = NOW();
  
  -- Initialize progress for published modules
  INSERT INTO public.user_progress (user_id, module_id, status, total_lessons)
  SELECT 
    NEW.id, 
    m.id, 
    CASE WHEN m.order_index = 1 THEN 'unlocked'::module_status 
         ELSE 'locked'::module_status 
    END,
    COALESCE((
      SELECT COUNT(*) 
      FROM public.lessons l 
      WHERE l.module_id = m.id AND l.is_published = true
    ), 0)
  FROM public.modules m
  WHERE m.is_published = true
  ON CONFLICT (user_id, module_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user trigger for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function when a new user signs up
-- Drop trigger if it exists, then recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_modules_updated_at ON modules;
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tests_updated_at ON tests;
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (only if not already exists)
INSERT INTO modules (title, description, order_index, is_published, pass_threshold) VALUES
  ('Basic Greetings', 'Learn essential French greetings and introductions', 1, true, 65),
  ('Numbers and Colors', 'Master French numbers 1-100 and common colors', 2, true, 70),
  ('Family and Relationships', 'Vocabulary for family members and relationships', 3, true, 65)
ON CONFLICT (order_index) DO NOTHING;

INSERT INTO lessons (module_id, title, content, lesson_type, order_index, is_published) VALUES
  ((SELECT id FROM modules WHERE order_index = 1), 
   'Hello and Goodbye', 
   '{"text": "Learn basic French greetings", "phrases": ["Bonjour", "Au revoir", "Bonsoir"]}', 
   'conversation', 1, true),
  ((SELECT id FROM modules WHERE order_index = 1), 
   'Introducing Yourself', 
   '{"text": "How to introduce yourself in French", "phrases": ["Je m''appelle", "Je suis", "Enchanté(e)"]}', 
   'conversation', 2, true)
ON CONFLICT (module_id, order_index) DO NOTHING;

INSERT INTO vocabulary (module_id, french_word, english_translation, word_type, gender, usage_example) VALUES
  ((SELECT id FROM modules WHERE order_index = 1), 'Bonjour', 'Hello/Good morning', 'interjection', null, 'Bonjour madame!'),
  ((SELECT id FROM modules WHERE order_index = 1), 'Au revoir', 'Goodbye', 'interjection', null, 'Au revoir et à bientôt!'),
  ((SELECT id FROM modules WHERE order_index = 1), 'Merci', 'Thank you', 'interjection', null, 'Merci beaucoup!'),
  ((SELECT id FROM modules WHERE order_index = 1), 'Je suis', 'I am', 'verb phrase', null, 'Je suis français.')
ON CONFLICT (module_id, french_word) DO NOTHING;
