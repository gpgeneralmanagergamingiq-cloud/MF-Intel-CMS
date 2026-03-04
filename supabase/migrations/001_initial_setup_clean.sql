-- ============================================
-- MF-Intel CMS Database Setup - CLEAN INSTALL
-- Version: 2.3.0
-- Purpose: Initialize key-value store for casino management
-- ============================================

-- ============================================
-- STEP 1: CLEAN UP (Remove existing objects)
-- ============================================

-- Drop existing trigger
DROP TRIGGER IF EXISTS update_kv_store_updated_at ON kv_store_68939c29;

-- Drop existing function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop existing policies
DROP POLICY IF EXISTS "Allow service role full access" ON kv_store_68939c29;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON kv_store_68939c29;

-- Drop existing indexes
DROP INDEX IF EXISTS idx_kv_store_key;
DROP INDEX IF EXISTS idx_kv_store_created_at;
DROP INDEX IF EXISTS idx_kv_store_updated_at;

-- Drop existing table (CAUTION: This deletes all data!)
DROP TABLE IF EXISTS kv_store_68939c29;

-- ============================================
-- STEP 2: CREATE TABLE
-- ============================================

CREATE TABLE kv_store_68939c29 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 3: ADD COMMENTS
-- ============================================

COMMENT ON TABLE kv_store_68939c29 IS 'Key-value store for casino management system data';
COMMENT ON COLUMN kv_store_68939c29.key IS 'Unique identifier for the data record';
COMMENT ON COLUMN kv_store_68939c29.value IS 'JSON data stored for this key';
COMMENT ON COLUMN kv_store_68939c29.created_at IS 'Timestamp when record was created';
COMMENT ON COLUMN kv_store_68939c29.updated_at IS 'Timestamp when record was last updated';

-- ============================================
-- STEP 4: CREATE INDEXES
-- ============================================

CREATE INDEX idx_kv_store_key ON kv_store_68939c29(key);
CREATE INDEX idx_kv_store_created_at ON kv_store_68939c29(created_at DESC);
CREATE INDEX idx_kv_store_updated_at ON kv_store_68939c29(updated_at DESC);

-- ============================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE kv_store_68939c29 ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 6: CREATE POLICIES
-- ============================================

-- Allow service role full access (for edge functions)
CREATE POLICY "Allow service role full access" 
ON kv_store_68939c29
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated users full access" 
ON kv_store_68939c29
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- STEP 7: CREATE FUNCTION AND TRIGGER
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on every UPDATE
CREATE TRIGGER update_kv_store_updated_at 
BEFORE UPDATE ON kv_store_68939c29 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 8: VERIFICATION
-- ============================================

-- Verify table created
SELECT 'Database setup complete! ✅' as status;

-- Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'kv_store_68939c29'
ORDER BY ordinal_position;

-- Check indexes
SELECT 
  indexname, 
  indexdef
FROM pg_indexes
WHERE tablename = 'kv_store_68939c29'
ORDER BY indexname;

-- Check RLS is enabled
SELECT 
  relname, 
  relrowsecurity as "RLS Enabled"
FROM pg_class
WHERE relname = 'kv_store_68939c29';

-- Check policies
SELECT 
  policyname as "Policy Name",
  permissive as "Permissive",
  roles as "Roles",
  cmd as "Command"
FROM pg_policies
WHERE tablename = 'kv_store_68939c29';

-- Check record count (should be 0)
SELECT COUNT(*) as "Record Count" FROM kv_store_68939c29;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

SELECT '🎉 Database setup complete! Ready for deployment.' as message;
