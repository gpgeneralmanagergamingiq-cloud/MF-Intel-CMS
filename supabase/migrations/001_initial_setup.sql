-- ============================================
-- MF-Intel CMS Database Setup
-- Version: 2.3.0
-- Purpose: Initialize key-value store for casino management
-- ============================================

-- Drop existing table if you want to start fresh (CAUTION: This deletes all data!)
-- DROP TABLE IF EXISTS kv_store_68939c29;

-- Create the key-value store table
CREATE TABLE IF NOT EXISTS kv_store_68939c29 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE kv_store_68939c29 IS 'Key-value store for casino management system data';
COMMENT ON COLUMN kv_store_68939c29.key IS 'Unique identifier for the data record';
COMMENT ON COLUMN kv_store_68939c29.value IS 'JSON data stored for this key';
COMMENT ON COLUMN kv_store_68939c29.created_at IS 'Timestamp when record was created';
COMMENT ON COLUMN kv_store_68939c29.updated_at IS 'Timestamp when record was last updated';

-- Create index for faster key lookups
CREATE INDEX IF NOT EXISTS idx_kv_store_key 
ON kv_store_68939c29(key);

-- Create index for timestamp queries (useful for auditing)
CREATE INDEX IF NOT EXISTS idx_kv_store_created_at 
ON kv_store_68939c29(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_kv_store_updated_at 
ON kv_store_68939c29(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE kv_store_68939c29 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
-- This allows your edge functions to read/write data
CREATE POLICY "Allow service role full access" 
ON kv_store_68939c29
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create policy to allow authenticated users full access
-- This allows your app users to read/write their data
CREATE POLICY "Allow authenticated users full access" 
ON kv_store_68939c29
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on every UPDATE
CREATE TRIGGER update_kv_store_updated_at 
BEFORE UPDATE ON kv_store_68939c29 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify setup is correct
-- ============================================

-- Check if table exists and is empty
-- Expected: 0 rows
SELECT COUNT(*) as record_count FROM kv_store_68939c29;

-- Check table structure
-- Expected: Shows columns key, value, created_at, updated_at
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'kv_store_68939c29'
ORDER BY ordinal_position;

-- Check indexes
-- Expected: Shows primary key + 3 indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'kv_store_68939c29'
ORDER BY indexname;

-- Check RLS is enabled
-- Expected: true
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'kv_store_68939c29';

-- Check policies
-- Expected: Shows 2 policies
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'kv_store_68939c29';

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert a test record
-- INSERT INTO kv_store_68939c29 (key, value) 
-- VALUES ('test_key', '{"message": "Hello from Casino CMS!"}');

-- Query test record
-- SELECT * FROM kv_store_68939c29 WHERE key = 'test_key';

-- Delete test record
-- DELETE FROM kv_store_68939c29 WHERE key = 'test_key';

-- ============================================
-- MAINTENANCE QUERIES
-- ============================================

-- Get table size
SELECT 
  pg_size_pretty(pg_total_relation_size('kv_store_68939c29')) AS total_size,
  pg_size_pretty(pg_relation_size('kv_store_68939c29')) AS table_size,
  pg_size_pretty(pg_indexes_size('kv_store_68939c29')) AS indexes_size;

-- Get row count by key prefix
SELECT 
  SUBSTRING(key FROM '^[^:]+') AS key_prefix,
  COUNT(*) AS count
FROM kv_store_68939c29
GROUP BY key_prefix
ORDER BY count DESC;

-- Find recently updated records
SELECT key, updated_at
FROM kv_store_68939c29
ORDER BY updated_at DESC
LIMIT 10;

-- ============================================
-- BACKUP QUERIES
-- ============================================

-- Export all data as JSON (for backup)
-- COPY (SELECT row_to_json(kv_store_68939c29) FROM kv_store_68939c29) 
-- TO '/tmp/kv_store_backup.json';

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- 
-- Your database is now ready for the Casino Management System.
-- 
-- Next steps:
-- 1. Deploy your edge function: supabase functions deploy server
-- 2. Set environment variables in edge function
-- 3. Deploy frontend to Vercel
-- 4. Test the connection
-- 
-- ============================================
