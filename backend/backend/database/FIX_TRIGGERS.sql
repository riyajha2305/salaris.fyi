-- Fix salary vote triggers and functions
-- Run this in your Supabase SQL Editor

-- First, drop the existing trigger if it exists
DROP TRIGGER IF EXISTS update_salary_vote_counts_trigger ON salary_votes;

-- Recreate the function to be more robust
CREATE OR REPLACE FUNCTION update_salary_vote_counts()
RETURNS TRIGGER AS $$
DECLARE
  salary_uuid UUID;
BEGIN
  -- Get the salary_id
  IF TG_OP = 'DELETE' THEN
    salary_uuid := OLD.salary_id;
  ELSE
    salary_uuid := NEW.salary_id;
  END IF;

  -- Recalculate counts from the salary_votes table
  UPDATE salaries 
  SET 
    upvotes = (
      SELECT COUNT(*) 
      FROM salary_votes 
      WHERE salary_id = salary_uuid AND vote_type = 'up'
    ),
    downvotes = (
      SELECT COUNT(*) 
      FROM salary_votes 
      WHERE salary_id = salary_uuid AND vote_type = 'down'
    )
  WHERE id = salary_uuid;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER update_salary_vote_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON salary_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_salary_vote_counts();

-- Now manually update all existing salaries with their current vote counts
UPDATE salaries s
SET 
  upvotes = COALESCE((SELECT COUNT(*) FROM salary_votes sv WHERE sv.salary_id = s.id AND sv.vote_type = 'up'), 0),
  downvotes = COALESCE((SELECT COUNT(*) FROM salary_votes sv WHERE sv.salary_id = s.id AND sv.vote_type = 'down'), 0);

-- Verify it's working
SELECT 
  s.id,
  s.company_name,
  s.upvotes,
  s.downvotes,
  (SELECT COUNT(*) FROM salary_votes sv WHERE sv.salary_id = s.id) as total_votes
FROM salaries s
LIMIT 5;


