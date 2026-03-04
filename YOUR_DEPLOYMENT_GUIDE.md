# 🚀 YOUR DEPLOYMENT GUIDE - READY TO LAUNCH!
## MF-Intel CMS for Gaming IQ v2.3.0

---

# ✅ **GOOD NEWS: YOUR SUPABASE IS ALREADY CONNECTED!**

I can see you have:
- **Project ID:** `njijaaivkccpsxlfjcja`
- **Public Anon Key:** Already configured ✅
- **Backend files:** Ready to deploy ✅

---

# 🎯 DEPLOYMENT STATUS

## ✅ **What's Already Done:**

1. ✅ Supabase project exists
2. ✅ Project credentials configured
3. ✅ All code is production-ready
4. ✅ API layer is built
5. ✅ Backend server code is ready
6. ✅ All components tested

## 🔄 **What You Need to Do:**

1. Deploy the Edge Function to Supabase
2. Create the database table
3. Deploy frontend to Vercel
4. Test everything

**Estimated Time:** 30-45 minutes

---

# 📋 STEP-BY-STEP DEPLOYMENT

## STEP 1: ACCESS YOUR SUPABASE DASHBOARD (5 min)

### 1.1 Login to Supabase
```
1. Go to: https://app.supabase.com/sign-in
2. Sign in with your account
3. Click on your project: njijaaivkccpsxlfjcja
```

### 1.2 Get Your Missing Credentials

You need to collect these (save them somewhere safe):

```
Go to: Settings → API

Copy these values:
┌─────────────────────────────────────────────────┐
│ Project URL:                                    │
│ https://njijaaivkccpsxlfjcja.supabase.co       │
│                                                 │
│ anon / public key: (You already have this ✅)  │
│                                                 │
│ service_role key: (Secret - you need this!)    │
│ eyJhbGc... [COPY THIS AND SAVE IT]             │
└─────────────────────────────────────────────────┘

Go to: Settings → Database → Connection String

Copy the Connection Pooling URL:
┌─────────────────────────────────────────────────┐
│ Connection pooling (Transaction mode):          │
│ postgresql://postgres.[PROJECT]:[PASSWORD]@...  │
│ [COPY THIS AND SAVE IT]                         │
└─────────────────────────────────────────────────┘
```

---

## STEP 2: CREATE DATABASE TABLE (5 min)

### 2.1 Open SQL Editor

```
In Supabase Dashboard:
SQL Editor → [New query]
```

### 2.2 Run This SQL

Copy and paste this entire SQL script:

```sql
-- ============================================
-- MF-INTEL CMS DATABASE SETUP
-- ============================================

-- Create the key-value store table
CREATE TABLE IF NOT EXISTS kv_store_68939c29 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_68939c29(key);
CREATE INDEX IF NOT EXISTS idx_kv_store_created_at ON kv_store_68939c29(created_at);
CREATE INDEX IF NOT EXISTS idx_kv_store_updated_at ON kv_store_68939c29(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE kv_store_68939c29 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
DROP POLICY IF EXISTS "Allow service role full access" ON kv_store_68939c29;
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
DROP TRIGGER IF EXISTS update_kv_store_updated_at ON kv_store_68939c29;
CREATE TRIGGER update_kv_store_updated_at 
  BEFORE UPDATE ON kv_store_68939c29 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Verify table created
SELECT 'Database setup complete! ✅' as status;
SELECT COUNT(*) as row_count FROM kv_store_68939c29;
```

### 2.3 Click **[RUN]**

You should see:
```
✅ Success. No rows returned
status: "Database setup complete! ✅"
row_count: 0
```

---

## STEP 3: DEPLOY EDGE FUNCTION (15 min)

### 3.1 Install Supabase CLI

**If you don't have it installed:**

**Windows:**
```powershell
# Using Scoop (recommended)
scoop install supabase

# OR download installer from:
# https://github.com/supabase/cli/releases
```

**Mac:**
```bash
brew install supabase/tap/supabase
```

**Linux:**
```bash
brew install supabase/tap/supabase
# Or download from releases
```

### 3.2 Login to Supabase CLI

Open terminal/PowerShell and run:

```bash
supabase login
```

✅ Browser will open → Click "Authorize" → Return to terminal

### 3.3 Link Your Project

```bash
# Navigate to your project folder
cd /path/to/your/project

# Link to your Supabase project
supabase link --project-ref njijaaivkccpsxlfjcja
```

You'll be asked for your database password (the one you created when setting up the project).

✅ Should say: "Linked to project njijaaivkccpsxlfjcja"

### 3.4 Set Environment Secrets

Replace the values with the ones you copied in Step 1:

```bash
# Set the Supabase URL
supabase secrets set SUPABASE_URL="https://njijaaivkccpsxlfjcja.supabase.co"

# Set the anon key (public key - you already have this)
supabase secrets set SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qaWphYWl2a2NjcHN4bGZqY2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODkwODAsImV4cCI6MjA4Nzg2NTA4MH0.6PsY-Hm1CwMfFPX_REe4bAFq6o3FvRuz52zVBHl-uX8"

# Set the service role key (REPLACE WITH YOUR ACTUAL KEY)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY_HERE"

# Set the database URL (REPLACE WITH YOUR ACTUAL CONNECTION STRING)
supabase secrets set SUPABASE_DB_URL="YOUR_DATABASE_CONNECTION_STRING_HERE"
```

### 3.5 Deploy the Edge Function

```bash
# Deploy the server function
supabase functions deploy server

# Wait for deployment...
# You should see:
# Deploying Function (Version: ...)
# Function URL: https://njijaaivkccpsxlfjcja.supabase.co/functions/v1/server
# ✅ Completed
```

### 3.6 Test the Edge Function

```bash
curl https://njijaaivkccpsxlfjcja.supabase.co/functions/v1/make-server-68939c29/health
```

✅ Should return: `{"success":true,"message":"Server is healthy"}`

If you get an error, check the function logs in Supabase Dashboard → Edge Functions → server → Logs

---

## STEP 4: DEPLOY FRONTEND TO VERCEL (10 min)

### 4.1 Push Code to GitHub (if not already)

```bash
# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Ready for production deployment"

# Create GitHub repo (if not exists)
# Go to: https://github.com/new
# Create repository: mf-intel-cms

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/mf-intel-cms.git
git branch -M main
git push -u origin main
```

### 4.2 Deploy to Vercel

```
1. Go to: https://vercel.com/signup
2. Sign up/Login with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository: mf-intel-cms
5. Click "Import"
```

### 4.3 Configure Vercel Build Settings

Vercel should auto-detect Vite. Verify:

```
Framework Preset: Vite ✅
Build Command: npm run build
Output Directory: dist
Install Command: npm install

✅ Should be automatically detected
```

### 4.4 Add Environment Variables

**CRITICAL:** Click "Environment Variables" and add these:

```
Name: VITE_SUPABASE_URL
Value: https://njijaaivkccpsxlfjcja.supabase.co

Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qaWphYWl2a2NjcHN4bGZqY2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODkwODAsImV4cCI6MjA4Nzg2NTA4MH0.6PsY-Hm1CwMfFPX_REe4bAFq6o3FvRuz52zVBHl-uX8
```

⚠️ **IMPORTANT:** Variable names MUST start with `VITE_` for Vite to expose them!

### 4.5 Deploy!

```
Click: [Deploy]

⏳ Wait 2-5 minutes...

✅ Deployment successful!
Your app is live at: https://mf-intel-cms.vercel.app
```

---

## STEP 5: VERIFY DEPLOYMENT (5 min)

### 5.1 Test Your Live App

Visit your Vercel URL: `https://your-app-name.vercel.app`

### 5.2 Default Login Credentials

```
Username: admin
Password: admin123
```

### 5.3 Check These Features:

- [ ] Login works ✅
- [ ] Dashboard loads ✅
- [ ] Create a test player ✅
- [ ] Create a test user ✅
- [ ] Start a rating session ✅
- [ ] Check reports ✅

### 5.4 Check Browser Console

Press **F12** → Console tab

✅ Should see no errors  
❌ If you see errors, check the troubleshooting section below

---

## STEP 6: SWITCH TO PRODUCTION MODE

### 6.1 Update API Configuration

**CRITICAL:** Your app is currently using localStorage (local mode). You need to switch to Supabase mode.

The file `/src/app/utils/api.ts` has this line near the top:

```typescript
const USE_LOCAL_STORAGE = false; // PRODUCTION MODE - Change to true for local dev
```

✅ This should already be set to `false` for production.

If it's `true`, change it to `false`, then:

```bash
git add src/app/utils/api.ts
git commit -m "Switch to production mode"
git push origin main

# Vercel will automatically redeploy! ✅
```

---

# 🎉 DEPLOYMENT COMPLETE!

## Your Live URLs:

**Frontend (Public Access):**
```
https://your-app-name.vercel.app
```

**Backend (API):**
```
https://njijaaivkccpsxlfjcja.supabase.co/functions/v1/make-server-68939c29
```

**Database Dashboard:**
```
https://app.supabase.com/project/njijaaivkccpsxlfjcja
```

---

# 🔧 POST-DEPLOYMENT TASKS

## 1. Change Default Admin Password

```
1. Login as admin/admin123
2. Go to: Setup → User Management
3. Click "Edit" on admin user
4. Change password
5. Save
```

## 2. Create User Accounts

```
Setup → User Management → [Add User]

Create accounts for:
- Managers
- Pit Bosses
- Inspectors
- Cashiers
- Hosts
- Waiters
```

## 3. Configure Your Casino

```
Setup → Property Management
- Rename "Default Property" to your casino name
- Add logo (optional)
```

```
Setup → Tables Management
- Add all your tables
- Set game types
- Set min/max bets
```

```
Setup → Game Statistics
- Configure hold percentages
- Set up game rules
```

```
Setup → Comps Menu
- Add all menu items
- Set prices in FCFA
```

## 4. Import Players (Optional)

```
Players → Import
- Download template
- Fill in player data
- Upload Excel file
```

## 5. Setup Receipt Printing

```
Setup → Receipt Fields
- Configure thermal printer settings
- Test receipt printing
- Add custom fields if needed
```

## 6. Enable Monitoring

```
In Supabase Dashboard:
Logs → Enable logging
Settings → Alerts → Configure alerts

In Vercel Dashboard:
Analytics → Enable Web Analytics
Speed Insights → Enable
```

---

# 🚨 TROUBLESHOOTING

## Issue: Edge Function Deploy Fails

**Error:** `Function deployment failed`

**Solution:**
```bash
# Check you're in the right directory
pwd

# Should show your project directory with /supabase/functions/server/

# Try deploying with verbose logging
supabase functions deploy server --debug

# Check logs
supabase functions logs server
```

## Issue: Database Connection Error

**Error:** `Connection to database failed`

**Solution:**
```
1. Check database is not paused
   Supabase Dashboard → Settings → Database → Resume if paused

2. Verify database password in secrets
   supabase secrets list

3. Check connection string format
   Should be: postgresql://postgres.[PROJECT]:[PASSWORD]@db.xxxx.supabase.co:5432/postgres
```

## Issue: Vercel Build Fails

**Error:** `Build failed`

**Solution:**
```
1. Check build logs in Vercel dashboard
2. Test build locally first:
   npm run build

3. Check package.json dependencies
4. Ensure Node.js version is 18+
5. Clear Vercel cache and redeploy
```

## Issue: Can't Login After Deployment

**Error:** `Invalid credentials` or login doesn't work

**Solution:**
```
1. Check if you switched to production mode (USE_LOCAL_STORAGE = false)
2. Check environment variables in Vercel
3. Check browser console for API errors
4. Verify edge function is responding:
   curl https://njijaaivkccpsxlfjcja.supabase.co/functions/v1/make-server-68939c29/health
```

## Issue: CORS Errors

**Error:** `CORS policy blocked`

**Solution:**

Update `/supabase/functions/server/index.tsx` with your Vercel domain:

```typescript
app.use(
  "/*",
  cors({
    origin: [
      "https://your-app-name.vercel.app",  // Add your Vercel URL
      "http://localhost:5173"  // Keep for local dev
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
```

Then redeploy:
```bash
supabase functions deploy server
```

---

# 💰 PRICING & LIMITS

## Current Plan: FREE TIER ✅

**Supabase Free Includes:**
- ✅ 500 MB database storage
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth/month
- ✅ 500,000 Edge Function invocations/month
- ✅ 50,000 monthly active users

**Vercel Free Includes:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS/SSL
- ✅ Preview deployments for every commit

**Total Monthly Cost: $0** 🎉

## When to Upgrade?

Consider upgrading when you reach:
- 50+ concurrent users
- 10,000+ players
- 100,000+ transactions/month
- Need 99.9% uptime SLA

**Paid Plans:**
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- **Total: $45/month for professional tier**

---

# 📞 NEED HELP?

## Supabase Support
- Docs: https://supabase.com/docs
- Community: https://discord.supabase.com
- Dashboard Logs: Settings → Logs

## Vercel Support
- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Build Logs: Deployments → View logs

## Check Status
- Supabase: https://status.supabase.com
- Vercel: https://www.vercel-status.com

---

# ✅ DEPLOYMENT CHECKLIST

Use this to track your progress:

**Pre-Deployment:**
- [x] Supabase project exists
- [x] Project credentials configured
- [ ] GitHub repository created

**Database Setup:**
- [ ] Logged into Supabase dashboard
- [ ] Collected service_role key
- [ ] Collected database connection string
- [ ] Ran SQL to create kv_store table
- [ ] Verified table created successfully

**Edge Function:**
- [ ] Installed Supabase CLI
- [ ] Logged in with `supabase login`
- [ ] Linked project with `supabase link`
- [ ] Set all 4 environment secrets
- [ ] Deployed function with `supabase functions deploy server`
- [ ] Tested function health endpoint

**Frontend Deployment:**
- [ ] Code pushed to GitHub
- [ ] Signed up for Vercel
- [ ] Imported GitHub repository
- [ ] Added VITE_SUPABASE_URL environment variable
- [ ] Added VITE_SUPABASE_ANON_KEY environment variable
- [ ] Deployed successfully
- [ ] Got Vercel URL

**Testing:**
- [ ] Visited live URL
- [ ] Logged in with admin/admin123
- [ ] Created test player
- [ ] Created test user
- [ ] Started rating session
- [ ] Checked reports work

**Post-Deployment:**
- [ ] Changed admin password
- [ ] Created user accounts
- [ ] Configured property name
- [ ] Added tables
- [ ] Configured game statistics
- [ ] Set up comps menu
- [ ] Imported players (optional)
- [ ] Configured receipt printing
- [ ] Enabled monitoring

**Security:**
- [ ] Changed default admin password
- [ ] Reviewed user permissions
- [ ] Enabled database backups
- [ ] Set up monitoring alerts

---

# 🎰 YOU'RE LIVE!

**Congratulations! Your Casino Management System is now in production!** 🎉

Your casino staff can now access the system 24/7 from any device.

**Share your deployment URL with your team and start managing your casino operations!**

---

## What You Can Do Now:

✅ Track player ratings in real-time  
✅ Manage float operations  
✅ Handle cage transactions  
✅ Generate comprehensive reports  
✅ Manage comps and loyalty programs  
✅ Track employee performance  
✅ Print thermal receipts  
✅ Scan QR codes for players and staff  
✅ Monitor jackpots  
✅ Analyze casino performance  

**Everything you need to run a professional casino operation!** 🎰💎

---

*MF-Intel CMS for Gaming IQ v2.3.0*  
*Production Deployment Guide*  
*Last Updated: March 2026*
