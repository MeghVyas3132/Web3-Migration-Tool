-- ============================================================================
-- Web3 Migration Tool - Complete Supabase Database Schema
-- ============================================================================
-- This script creates all necessary tables, indexes, triggers, and policies
-- Copy and paste this entire file into Supabase SQL Editor and run it
-- ============================================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Deployments table: Stores all deployment information including GitHub integration
CREATE TABLE IF NOT EXISTS deployments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ipfs_cid VARCHAR(255) NOT NULL,
  framework VARCHAR(50) NOT NULL,
  build_command TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  branch VARCHAR(100) DEFAULT 'main',
  status VARCHAR(20) DEFAULT 'building',
  uptime DECIMAL(5,2) DEFAULT 100.00,
  last_pinged TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_visits INTEGER DEFAULT 0,
  build_logs TEXT DEFAULT '',
  error_message TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES (for better query performance)
-- ============================================================================

-- Deployments table indexes
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_github_url ON deployments(github_url);

-- ============================================================================
-- TRIGGERS (for automatic timestamp updates)
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to deployments table
CREATE TRIGGER update_deployments_updated_at BEFORE UPDATE ON deployments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on deployments table
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECURITY POLICIES
-- ============================================================================

-- Deployments table policies - Allow public read/write for development
-- (No authentication system, so anyone can access)
CREATE POLICY "Anyone can view deployments" ON deployments
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create deployments" ON deployments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Deployments can be updated by anyone" ON deployments
    FOR UPDATE USING (true);

CREATE POLICY "Deployments can be deleted by anyone" ON deployments
    FOR DELETE USING (true);

-- ============================================================================
-- PERMISSIONS
-- ============================================================================

-- Grant necessary permissions to Supabase roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$ 
BEGIN 
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '📊 Tables: deployments (no auth, public access)';
    RAISE NOTICE '🔐 Row Level Security: Enabled (public policies)';
    RAISE NOTICE '⚡ Indexes: Optimized for performance';
    RAISE NOTICE '🔄 Triggers: Auto-update timestamps';
END $$;
