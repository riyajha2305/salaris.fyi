-- Quick check to see if the required tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('salary_votes', 'comments', 'replies')
ORDER BY table_name;

-- Check if salaries table has upvotes/downvotes columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'salaries' 
AND column_name IN ('upvotes', 'downvotes');

-- Check if triggers exist
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table IN ('salary_votes')
ORDER BY trigger_name;


