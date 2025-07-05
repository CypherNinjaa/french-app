-- French Learning App - Sample Data
-- Run this after running the main schema to populate with sample content

-- Insert sample modules (handle both id and order_index conflicts)
-- First, delete any existing modules with conflicting order_index values but different IDs
DELETE FROM modules WHERE order_index IN (1, 2, 3, 4, 5, 6) 
  AND id NOT IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002', 
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440006'
  );

-- Now insert/update our sample modules
INSERT INTO modules (id, title, description, level, order_index, total_lessons, estimated_duration_minutes, is_premium, is_published, pass_threshold) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'French Basics', 'Start your French journey with essential greetings, introductions, and basic vocabulary.', 'beginner', 1, 8, 120, false, true, 65),
  ('550e8400-e29b-41d4-a716-446655440002', 'Numbers and Time', 'Learn to count, tell time, and express dates in French.', 'beginner', 2, 6, 90, false, true, 65),
  ('550e8400-e29b-41d4-a716-446655440003', 'Family and Relationships', 'Describe family members and talk about relationships.', 'beginner', 3, 7, 105, false, true, 70),
  ('550e8400-e29b-41d4-a716-446655440004', 'Food and Dining', 'Order food, discuss meals, and learn restaurant vocabulary.', 'intermediate', 4, 10, 150, false, true, 70),
  ('550e8400-e29b-41d4-a716-446655440005', 'Travel and Directions', 'Navigate cities, ask for directions, and travel confidently.', 'intermediate', 5, 9, 135, true, true, 75),
  ('550e8400-e29b-41d4-a716-446655440006', 'Business French', 'Professional vocabulary and workplace communication.', 'advanced', 6, 12, 180, true, true, 80)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  total_lessons = EXCLUDED.total_lessons,
  estimated_duration_minutes = EXCLUDED.estimated_duration_minutes,
  is_premium = EXCLUDED.is_premium,
  is_published = EXCLUDED.is_published,
  pass_threshold = EXCLUDED.pass_threshold,
  updated_at = NOW();

-- Insert sample lessons for the first module
-- Clean up any existing lessons that might conflict
DELETE FROM lessons WHERE module_id = '550e8400-e29b-41d4-a716-446655440001' 
  AND id NOT IN (
    '660e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440003'
  );

INSERT INTO lessons (id, module_id, title, description, content, lesson_type, order_index, estimated_duration_minutes, key_phrases, is_published) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Greetings and Introductions', 'Learn basic French greetings and how to introduce yourself.', 
   '# Greetings and Introductions\n\n## Basic Greetings\n\n**Bonjour** - Hello (formal/daytime)\n**Bonsoir** - Good evening\n**Salut** - Hi/Bye (informal)\n\n## Introductions\n\n**Je m''appelle...** - My name is...\n**Je suis...** - I am...\n**Enchanté(e)** - Nice to meet you\n\n## Practice\nTry introducing yourself using these phrases!', 
   'conversation', 1, 15, ARRAY['Bonjour', 'Je m''appelle', 'Enchanté'], true),
  
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Common Phrases', 'Essential everyday French phrases for beginners.', 
   '# Common Phrases\n\n## Politeness\n\n**S''il vous plaît** - Please (formal)\n**Merci** - Thank you\n**De rien** - You''re welcome\n**Excusez-moi** - Excuse me\n\n## Questions\n\n**Comment allez-vous?** - How are you? (formal)\n**Ça va?** - How are you? (informal)\n**Où est...?** - Where is...?', 
   'conversation', 2, 15, ARRAY['S''il vous plaît', 'Merci', 'Comment allez-vous'], true),
   
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Basic Vocabulary', 'Learn essential French words for daily use.', 
   '# Basic Vocabulary\n\n## Colors\n- Rouge (red)\n- Bleu (blue)\n- Vert (green)\n- Jaune (yellow)\n- Noir (black)\n- Blanc (white)\n\n## Days of the Week\n- Lundi (Monday)\n- Mardi (Tuesday)\n- Mercredi (Wednesday)\n- Jeudi (Thursday)\n- Vendredi (Friday)\n- Samedi (Saturday)\n- Dimanche (Sunday)', 
   'vocabulary', 3, 20, ARRAY['Rouge', 'Bleu', 'Lundi', 'Mardi'], true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  lesson_type = EXCLUDED.lesson_type,
  order_index = EXCLUDED.order_index,
  estimated_duration_minutes = EXCLUDED.estimated_duration_minutes,
  key_phrases = EXCLUDED.key_phrases,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- Insert sample vocabulary for the first module
-- Clean up any existing vocabulary that might conflict
DELETE FROM vocabulary WHERE module_id = '550e8400-e29b-41d4-a716-446655440001'
  AND id NOT IN (
    '770e8400-e29b-41d4-a716-446655440001',
    '770e8400-e29b-41d4-a716-446655440002',
    '770e8400-e29b-41d4-a716-446655440003',
    '770e8400-e29b-41d4-a716-446655440004',
    '770e8400-e29b-41d4-a716-446655440005'
  );

INSERT INTO vocabulary (id, module_id, french_word, english_translation, word_type, gender, usage_example) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Bonjour', 'Hello', 'interjection', NULL, 'Bonjour, comment allez-vous?'),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Merci', 'Thank you', 'interjection', NULL, 'Merci beaucoup!'),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Rouge', 'Red', 'adjective', NULL, 'La pomme est rouge.'),
  ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Chien', 'Dog', 'noun', 'masculine', 'Le chien est mignon.'),
  ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Manger', 'To eat', 'verb', NULL, 'Je veux manger.')
ON CONFLICT (id) DO UPDATE SET
  english_translation = EXCLUDED.english_translation,
  word_type = EXCLUDED.word_type,
  gender = EXCLUDED.gender,
  usage_example = EXCLUDED.usage_example;

-- Insert sample tests for the first module
-- Clean up any existing tests that might conflict
DELETE FROM tests WHERE module_id = '550e8400-e29b-41d4-a716-446655440001'
  AND id != '880e8400-e29b-41d4-a716-446655440001';

INSERT INTO tests (id, module_id, title, questions, pass_threshold, time_limit_minutes) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'French Basics Assessment', 
   '[
     {
       "id": "q1",
       "question": "How do you say \"Hello\" in French?",
       "type": "multiple_choice",
       "options": ["Bonjour", "Bonsoir", "Salut", "Au revoir"],
       "correct_answer": "Bonjour",
       "explanation": "Bonjour is the standard formal greeting in French.",
       "points": 10
     },
     {
       "id": "q2", 
       "question": "What does \"Merci\" mean?",
       "type": "multiple_choice",
       "options": ["Please", "Thank you", "Excuse me", "You''re welcome"],
       "correct_answer": "Thank you",
       "explanation": "Merci means thank you in French.",
       "points": 10
     },
     {
       "id": "q3",
       "question": "Complete: \"Je m''_____ Marie\"",
       "type": "fill_in_blank",
       "correct_answer": "appelle",
       "explanation": "Je m''appelle means \"My name is\" in French.",
       "points": 15
     },
     {
       "id": "q4",
       "question": "What color is \"rouge\"?",
       "type": "multiple_choice", 
       "options": ["Blue", "Green", "Red", "Yellow"],
       "correct_answer": "Red",
       "explanation": "Rouge means red in French.",
       "points": 10
     }
   ]'::jsonb, 65, 15)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  questions = EXCLUDED.questions,
  pass_threshold = EXCLUDED.pass_threshold,
  time_limit_minutes = EXCLUDED.time_limit_minutes,
  updated_at = NOW();

-- Note: You'll need to manually create some user_progress entries for testing
-- after users sign up, or you can create them programmatically in your app.
