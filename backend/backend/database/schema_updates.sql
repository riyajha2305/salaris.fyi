-- =====================================================
-- Schema Updates for Salary Upvotes/Downvotes
-- =====================================================

-- Add upvote and downvote columns to salaries table
ALTER TABLE salaries 
  ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- Create salary_votes table to track individual user votes on salary entries
CREATE TABLE IF NOT EXISTS salary_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salary_id UUID NOT NULL REFERENCES salaries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(salary_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_salary_votes_salary_id ON salary_votes(salary_id);
CREATE INDEX IF NOT EXISTS idx_salary_votes_user_id ON salary_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_salary_votes_type ON salary_votes(vote_type);

-- Create a function to update upvotes/downvotes when a vote is added/changed
CREATE OR REPLACE FUNCTION update_salary_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE salaries SET upvotes = upvotes + 1 WHERE id = NEW.salary_id;
    ELSE
      UPDATE salaries SET downvotes = downvotes + 1 WHERE id = NEW.salary_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Remove old vote
    IF OLD.vote_type = 'up' THEN
      UPDATE salaries SET upvotes = upvotes - 1 WHERE id = OLD.salary_id;
    ELSE
      UPDATE salaries SET downvotes = downvotes - 1 WHERE id = OLD.salary_id;
    END IF;
    -- Add new vote
    IF NEW.vote_type = 'up' THEN
      UPDATE salaries SET upvotes = upvotes + 1 WHERE id = NEW.salary_id;
    ELSE
      UPDATE salaries SET downvotes = downvotes + 1 WHERE id = NEW.salary_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE salaries SET upvotes = upvotes - 1 WHERE id = OLD.salary_id;
    ELSE
      UPDATE salaries SET downvotes = downvotes - 1 WHERE id = OLD.salary_id;
    END IF;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update vote counts
DROP TRIGGER IF EXISTS update_salary_vote_counts_trigger ON salary_votes;
CREATE TRIGGER update_salary_vote_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON salary_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_salary_vote_counts();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_salary_votes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at on salary_votes
DROP TRIGGER IF EXISTS update_salary_votes_updated_at_trigger ON salary_votes;
CREATE TRIGGER update_salary_votes_updated_at_trigger
  BEFORE UPDATE ON salary_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_salary_votes_updated_at();

-- Enable Row Level Security
ALTER TABLE salary_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for salary_votes
CREATE POLICY "Anyone can read salary votes" ON salary_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert votes" ON salary_votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own votes" ON salary_votes
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own votes" ON salary_votes
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for service role
CREATE POLICY "Service role full access salary_votes" ON salary_votes
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- Update existing salaries to have default vote counts
-- =====================================================

UPDATE salaries 
SET upvotes = 0, downvotes = 0 
WHERE upvotes IS NULL OR downvotes IS NULL;


