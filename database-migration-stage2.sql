-- Migration Script: Add missing columns to modules and lessons tables
-- Run this script to update your existing database schema to match the TypeScript types

-- First, add the missing columns to the modules table
DO $$ 
BEGIN
    -- Add level column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'modules' AND column_name = 'level') THEN
        ALTER TABLE modules ADD COLUMN level learning_level DEFAULT 'beginner';
    END IF;
    
    -- Add total_lessons column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'modules' AND column_name = 'total_lessons') THEN
        ALTER TABLE modules ADD COLUMN total_lessons INTEGER DEFAULT 0;
    END IF;
    
    -- Add estimated_duration_minutes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'modules' AND column_name = 'estimated_duration_minutes') THEN
        ALTER TABLE modules ADD COLUMN estimated_duration_minutes INTEGER DEFAULT 60;
    END IF;
    
    -- Add is_premium column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'modules' AND column_name = 'is_premium') THEN
        ALTER TABLE modules ADD COLUMN is_premium BOOLEAN DEFAULT false;
    END IF;
    
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'modules' AND column_name = 'image_url') THEN
        ALTER TABLE modules ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Now, add the missing columns to the lessons table
DO $$ 
BEGIN
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'description') THEN
        ALTER TABLE lessons ADD COLUMN description TEXT;
    END IF;
    
    -- Add estimated_duration_minutes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'estimated_duration_minutes') THEN
        ALTER TABLE lessons ADD COLUMN estimated_duration_minutes INTEGER DEFAULT 15;
    END IF;
    
    -- Add audio_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'audio_url') THEN
        ALTER TABLE lessons ADD COLUMN audio_url TEXT;
    END IF;
    
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'image_url') THEN
        ALTER TABLE lessons ADD COLUMN image_url TEXT;
    END IF;
    
    -- Add key_phrases column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'key_phrases') THEN
        ALTER TABLE lessons ADD COLUMN key_phrases TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
    
    -- Change content column from JSONB to TEXT if needed
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'content' AND data_type = 'jsonb') THEN
        ALTER TABLE lessons ALTER COLUMN content TYPE TEXT USING content::TEXT;
    END IF;
END $$;

-- Update existing modules with calculated total_lessons based on actual lessons
UPDATE modules 
SET total_lessons = (
    SELECT COUNT(*) 
    FROM lessons 
    WHERE lessons.module_id = modules.id AND lessons.is_published = true
)
WHERE total_lessons = 0;

-- Update existing modules with estimated duration based on lessons
UPDATE modules 
SET estimated_duration_minutes = (
    SELECT COALESCE(SUM(estimated_duration_minutes), 60) 
    FROM lessons 
    WHERE lessons.module_id = modules.id AND lessons.is_published = true
)
WHERE estimated_duration_minutes = 60 OR estimated_duration_minutes IS NULL;

COMMIT;
