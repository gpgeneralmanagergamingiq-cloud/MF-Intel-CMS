-- ⚡ QUICK SETUP - COPY AND PASTE THIS ENTIRE SCRIPT
-- This will clean up any existing table and create a fresh one

-- Clean up existing objects
DROP TRIGGER IF EXISTS update_kv_store_updated_at ON kv_store_68939c29 CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP TABLE IF EXISTS kv_store_68939c29 CASCADE;

-- Create table
CREATE TABLE kv_store_68939c29 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_kv_store_key ON kv_store_68939c29(key);
CREATE INDEX idx_kv_store_created_at ON kv_store_68939c29(created_at DESC);
CREATE INDEX idx_kv_store_updated_at ON kv_store_68939c29(updated_at DESC);

-- Enable RLS
ALTER TABLE kv_store_68939c29 ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow service role full access" ON kv_store_68939c29
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access" ON kv_store_68939c29
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create update function
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_kv_store_updated_at 
BEFORE UPDATE ON kv_store_68939c29 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Verify setup
SELECT 'Setup complete! ✅' as status, COUNT(*) as record_count FROM kv_store_68939c29;
