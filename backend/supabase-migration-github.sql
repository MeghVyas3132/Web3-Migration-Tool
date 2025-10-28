-- Migration script to add GitHub fields to deployments table
-- Run this if you already have the deployments table

-- Add github_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'deployments' 
        AND column_name = 'github_url'
    ) THEN
        ALTER TABLE deployments ADD COLUMN github_url TEXT DEFAULT '';
    END IF;
END $$;

-- Add branch column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'deployments' 
        AND column_name = 'branch'
    ) THEN
        ALTER TABLE deployments ADD COLUMN branch VARCHAR(100) DEFAULT 'main';
    END IF;
END $$;

-- Add index for github_url for faster lookups
CREATE INDEX IF NOT EXISTS idx_deployments_github_url ON deployments(github_url);

SELECT 'GitHub columns added successfully!' as message;
