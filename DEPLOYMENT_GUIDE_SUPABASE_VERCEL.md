# 🚀 DEPLOYMENT GUIDE: Supabase Cloud + Vercel
## MF-Intel CMS for Gaming IQ v2.3.0

---

# 🎯 OVERVIEW

This guide will help you deploy your Casino Management System to production using:
- **Supabase Cloud** (Backend + Database + Edge Functions)
- **Vercel** (Frontend hosting with CDN)

**Total Setup Time:** 60-90 minutes  
**Cost:** Free tier available for both platforms  
**Difficulty:** Medium

---

# 📋 PREREQUISITES

Before starting, have these ready:

✅ **Accounts:**
- [ ] GitHub account (free)
- [ ] Supabase account (free) - https://supabase.com/dashboard
- [ ] Vercel account (free) - https://vercel.com/signup

✅ **Tools:**
- [ ] Git installed
- [ ] Node.js 18+ installed
- [ ] Supabase CLI installed (optional but recommended)

✅ **Project:**
- [ ] Your code in a Git repository
- [ ] All features tested locally

---

# PART 1: SUPABASE CLOUD SETUP (30-40 minutes)

## Step 1: Create Supabase Project

### 1.1 Sign Up / Login
```
1. Go to: https://supabase.com/dashboard
2. Click "Sign in" or "Start your project"
3. Login with GitHub (recommended)
```

### 1.2 Create New Project
```
Dashboard → [+ New Project]

Organization: [Select or create]
Name: mf-intel-cms
Database Password: [Generate strong password] ⚠️ SAVE THIS!
Region: Choose closest to your users
  • US East (Ohio) - for USA
  • Europe (Frankfurt) - for Europe
  • Asia Pacific (Singapore) - for Asia

Pricing Plan: Free (upgrade later if needed)

[Create new project]
```

⏳ **Wait 2-3 minutes** for project to provision...

### 1.3 Save Project Credentials

Once created, go to **Settings → API**:

```
Project URL: https://xxxxx.supabase.co
Copy this! ⬇️
┌─────────────────────────────────────────┐
│ Project URL:                            │
│ https://abcdefgh.supabase.co            │
└─────────────────────────────────────────┘

API Keys:
┌─────────────────────────────────────────┐
│ anon / public key:                      │
│ eyJhbGc... [COPY THIS]                  │
│                                         │
│ service_role key: (secret!)             │
│ eyJhbGc... [COPY THIS]                  │
└─────────────────────────────────────────┘
```

⚠️ **IMPORTANT:** Save these in a secure password manager!

---

## Step 2: Setup Database

### 2.1 Create KV Store Table

Go to **SQL Editor** in Supabase Dashboard:

```sql
-- Create the key-value store table
CREATE TABLE IF NOT EXISTS kv_store_68939c29 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_68939c29(key);

-- Enable Row Level Security (RLS)
ALTER TABLE kv_store_68939c29 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role access
CREATE POLICY "Allow service role full access" ON kv_store_68939c29
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_kv_store_updated_at 
  BEFORE UPDATE ON kv_store_68939c29 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

Click **[RUN]** ✅

### 2.2 Verify Table Created

```sql
-- Check if table exists
SELECT * FROM kv_store_68939c29 LIMIT 5;
```

Should return empty table (0 rows) ✅

---

## Step 3: Deploy Edge Function

### 3.1 Install Supabase CLI (if not installed)

**Mac/Linux:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
```powershell
scoop install supabase
```

Or download from: https://github.com/supabase/cli/releases

### 3.2 Login to Supabase CLI

```bash
supabase login
```

Opens browser → Authorize CLI ✅

### 3.3 Link Your Project

```bash
# Navigate to your project directory
cd /path/to/your/project

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Find YOUR_PROJECT_REF:
# Settings → General → Reference ID
# Example: abcdefghijklmnop
```

### 3.4 Deploy Edge Function

```bash
# Deploy the server function
supabase functions deploy server

# You should see:
# Deploying Function (Version: ...)
# Function URL: https://xxxxx.supabase.co/functions/v1/server
# ✅ Completed
```

### 3.5 Set Environment Variables (Edge Function)

```bash
# Set Supabase secrets for the edge function
supabase secrets set SUPABASE_URL="https://xxxxx.supabase.co"
supabase secrets set SUPABASE_ANON_KEY="eyJhbGc..."
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."
supabase secrets set SUPABASE_DB_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Note: Get DB URL from Settings → Database → Connection String
```

### 3.6 Test Edge Function

```bash
curl https://xxxxx.supabase.co/functions/v1/server/make-server-68939c29/health
```

Should return: `{"status":"ok"}` ✅

---

## Step 4: Setup Authentication (Optional)

If using auth features:

### 4.1 Enable Email Provider

```
Authentication → Providers → Email
☑️ Enable Email provider
☑️ Confirm email (toggle OFF for development)
[Save]
```

### 4.2 Configure Email Templates (Optional)

```
Authentication → Email Templates
Customize:
- Confirmation email
- Password reset
- Magic link
```

### 4.3 Setup Social Auth (If needed)

For Google/Facebook/GitHub login:
```
Authentication → Providers → [Provider]
Follow provider-specific setup instructions
Add OAuth credentials
[Save]
```

---

## Step 5: Configure Storage (If needed)

For file uploads (player photos, etc.):

### 5.1 Create Storage Bucket

```
Storage → [Create bucket]

Name: player-photos
Public: No (private)
File size limit: 5 MB
Allowed MIME types: image/jpeg,image/png,image/webp

[Create bucket]
```

### 5.2 Set Storage Policies

```sql
-- Allow authenticated users to upload their photos
CREATE POLICY "Allow users to upload photos" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'player-photos' AND auth.role() = 'authenticated');

-- Allow users to view photos
CREATE POLICY "Allow users to view photos" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'player-photos');
```

---

## Step 6: Configure Database Connection Pooler

For better performance:

```
Settings → Database → Connection Pooling
Mode: Transaction
Pool size: 15

Copy pooler connection string:
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@pooler.supabase.co:6543/postgres
```

---

# PART 2: VERCEL DEPLOYMENT (20-30 minutes)

## Step 1: Prepare Your Code

### 1.1 Update API Configuration

Edit `/src/app/utils/api.ts`:

```typescript
// Change this from true to false
const USE_LOCAL_STORAGE = false; // PRODUCTION MODE

// Ensure these are using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### 1.2 Create Environment Variables Template

Create `.env.example`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 1.3 Update .gitignore

Ensure `.gitignore` contains:

```
node_modules/
dist/
.env
.env.local
.vercel
```

### 1.4 Commit Changes

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

---

## Step 2: Deploy to Vercel

### 2.1 Import Project

```
1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"
```

### 2.2 Configure Build Settings

Vercel should auto-detect Vite. Verify:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install

✅ These should be automatically detected
```

### 2.3 Set Environment Variables

Click **"Environment Variables"**:

```
Name: VITE_SUPABASE_URL
Value: https://xxxxx.supabase.co
[Add]

Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGc...
[Add]
```

⚠️ Make sure variable names start with `VITE_` for Vite to expose them!

### 2.4 Deploy

```
[Deploy]

⏳ Wait 2-5 minutes...

✅ Deployment successful!
Your app is live at: https://your-app.vercel.app
```

---

## Step 3: Configure Custom Domain (Optional)

### 3.1 Add Domain

```
Project Settings → Domains
[Add Domain]

Enter your domain: casino.yourdomain.com
[Add]
```

### 3.2 Configure DNS

Add these DNS records at your domain provider:

```
Type: CNAME
Name: casino (or @ for root domain)
Value: cname.vercel-dns.com
TTL: 3600
```

### 3.3 Enable SSL

Vercel automatically provisions SSL certificate ✅  
Wait 1-2 minutes for DNS propagation.

---

# PART 3: CONNECT FRONTEND TO BACKEND (10 minutes)

## Step 1: Update Frontend Configuration

Your frontend is already configured if you set the environment variables correctly.

Verify `/src/utils/supabase/info.tsx` exports are available:

```typescript
export const projectId = import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || '';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
```

## Step 2: Test Connection

Visit your deployed app:

```
https://your-app.vercel.app

1. Try logging in
2. Check browser console for errors
3. Verify API calls work
```

## Step 3: Update Edge Function CORS (If needed)

If you get CORS errors, update `/supabase/functions/server/index.tsx`:

```typescript
app.use(
  "/*",
  cors({
    origin: [
      "https://your-app.vercel.app",
      "http://localhost:5173" // Keep for local dev
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
```

Redeploy:
```bash
supabase functions deploy server
```

---

# PART 4: POST-DEPLOYMENT CHECKLIST

## Step 1: Verify All Features

Test each feature:
- [ ] Login/Logout
- [ ] User management
- [ ] Player management
- [ ] Float operations
- [ ] Rating sessions
- [ ] Comps system
- [ ] Reports generation
- [ ] QR code scanning
- [ ] Receipt printing (if applicable)

## Step 2: Setup Monitoring

### Supabase Monitoring
```
Dashboard → Logs → Explorer
Monitor:
- Database queries
- Edge function invocations
- Authentication attempts
- Storage operations
```

### Vercel Analytics
```
Project → Analytics
Enable:
☑️ Web Analytics
☑️ Speed Insights
```

## Step 3: Configure Alerts

### Database Alerts
```
Settings → Database → Alerts
Create alert:
- High CPU usage (> 80%)
- Disk space (> 80%)
- Connection pool (> 90%)
```

### Edge Function Alerts
```
Settings → Edge Functions → Alerts
Monitor:
- Error rate
- Response time
- Invocation count
```

---

# PART 5: BACKUP & MAINTENANCE

## Daily Backups

Supabase automatically backs up your database daily. To download:

```
Settings → Database → Backups
[Download] latest backup
```

## Manual Backup

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or using pg_dump
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

## Update Edge Function

When you make changes:

```bash
# 1. Make changes to /supabase/functions/server/index.tsx
# 2. Deploy update
supabase functions deploy server

# 3. Verify deployment
curl https://xxxxx.supabase.co/functions/v1/server/make-server-68939c29/health
```

## Update Frontend

Changes auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Update feature X"
git push origin main

# Vercel automatically deploys! ✅
```

---

# 🚨 TROUBLESHOOTING

## Issue: Database Connection Fails

**Solution:**
```
1. Check database password is correct
2. Verify connection string in edge function secrets
3. Check database is not paused (Settings → Database)
4. Try connection pooler instead of direct connection
```

## Issue: Edge Function Times Out

**Solution:**
```
1. Increase timeouts in function code
2. Optimize database queries
3. Add caching
4. Check function logs for errors
```

## Issue: CORS Errors

**Solution:**
```
1. Update CORS origin in edge function
2. Redeploy edge function
3. Clear browser cache
4. Check Vercel domain is correct
```

## Issue: Environment Variables Not Working

**Solution:**
```
1. Ensure they start with VITE_
2. Redeploy in Vercel after adding
3. Check they're set in Vercel dashboard
4. Don't commit .env to git!
```

## Issue: Build Fails on Vercel

**Solution:**
```
1. Check build logs in Vercel
2. Ensure all dependencies in package.json
3. Try building locally first: npm run build
4. Check Node.js version compatibility
```

---

# 📊 COST ESTIMATION

## Free Tier Limits (Both Platforms)

**Supabase Free:**
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users
- 500,000 edge function invocations
- 2 GB bandwidth

**Vercel Free:**
- 100 GB bandwidth
- Unlimited deployments
- Automatic SSL
- Preview deployments

**Total Cost:** $0/month for small casinos! 🎉

## When to Upgrade

Upgrade if you exceed:
- 50+ concurrent users
- 10,000+ players in database
- 100,000+ transactions/month
- Need 99.9% uptime SLA

**Paid Plans:**
- Supabase Pro: $25/month
- Vercel Pro: $20/month

---

# 📞 SUPPORT & RESOURCES

**Supabase:**
- Docs: https://supabase.com/docs
- Community: https://discord.supabase.com
- Status: https://status.supabase.com

**Vercel:**
- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Status: https://www.vercel-status.com

**Your App:**
- GitHub Issues: [Your repo]/issues
- Email: support@your-casino.com

---

# ✅ DEPLOYMENT COMPLETE!

## Your Production URLs

**Frontend:** https://your-app.vercel.app  
**Backend:** https://xxxxx.supabase.co/functions/v1/server  
**Database:** Managed by Supabase ✅

## Next Steps

1. Share URLs with your team
2. Train staff on the system
3. Import production data
4. Setup monitoring dashboard
5. Create user accounts
6. Go live! 🚀

---

**Congratulations! Your Casino Management System is now live in production!** 🎰🎉

*Last Updated: March 2026*
*Version: 2.3.0*
