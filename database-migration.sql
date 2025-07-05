-- Database Migration Script - Run this to fix the trigger issues
-- This should be run in your Supabase SQL editor

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can manage user progress" ON user_progress;

-- Recreate the handle_new_user function with proper error handling
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

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Test the trigger by checking if sample data exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM modules WHERE order_index = 1) THEN
    INSERT INTO modules (title, description, order_index, is_published, pass_threshold) VALUES
      ('Basic Greetings', 'Learn essential French greetings and introductions', 1, true, 65);
  END IF;
END $$;
