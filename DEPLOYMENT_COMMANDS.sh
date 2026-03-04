# 🚀 QUICK DEPLOYMENT COMMANDS
# Copy and paste these commands to deploy your app

# ============================================
# PART 1: SUPABASE CLI SETUP
# ============================================

# Install Supabase CLI (Mac/Linux)
brew install supabase/tap/supabase

# Or Windows (with Scoop)
# scoop install supabase

# Login to Supabase
supabase login

# Link your project (replace YOUR_PROJECT_REF with your actual project reference)
supabase link --project-ref YOUR_PROJECT_REF

# ============================================
# PART 2: DEPLOY EDGE FUNCTION
# ============================================

# Deploy the server function
supabase functions deploy server

# Set environment secrets (replace with your actual values)
supabase secrets set SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
supabase secrets set SUPABASE_ANON_KEY="YOUR_ANON_KEY_HERE"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY_HERE"
supabase secrets set SUPABASE_DB_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"

# Test the deployment
curl https://YOUR_PROJECT_REF.supabase.co/functions/v1/server/make-server-68939c29/health

# ============================================
# PART 3: PUSH TO GITHUB (if not already pushed)
# ============================================

# Initialize git (if needed)
# git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for production deployment"

# Add remote (replace with your repo URL)
# git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push origin main

# ============================================
# PART 4: VERCEL DEPLOYMENT
# ============================================

# Install Vercel CLI (optional - can also deploy via website)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Set production environment variables (via Vercel dashboard)
# 1. Go to: https://vercel.com/your-project/settings/environment-variables
# 2. Add: VITE_SUPABASE_URL = https://YOUR_PROJECT_REF.supabase.co
# 3. Add: VITE_SUPABASE_ANON_KEY = YOUR_ANON_KEY_HERE

# Or deploy via website:
# 1. Go to https://vercel.com/new
# 2. Import your GitHub repository
# 3. Add environment variables
# 4. Click Deploy

# ============================================
# PART 5: VERIFY DEPLOYMENT
# ============================================

# Test your deployed app
# Visit: https://your-app.vercel.app

# Check if backend is responding
curl https://YOUR_PROJECT_REF.supabase.co/functions/v1/server/make-server-68939c29/health

# ============================================
# TROUBLESHOOTING COMMANDS
# ============================================

# View Supabase function logs
supabase functions logs server

# View Vercel deployment logs
vercel logs

# Redeploy Vercel (if needed)
vercel --prod

# Check Supabase project status
supabase projects list

# ============================================
# MAINTENANCE COMMANDS
# ============================================

# Backup database
supabase db dump -f backup.sql

# View database via CLI
supabase db shell

# Check function status
supabase functions list

# Update edge function (after making changes)
supabase functions deploy server

# ============================================
# USEFUL ALIASES (Add to ~/.zshrc or ~/.bashrc)
# ============================================

# alias sb-deploy="supabase functions deploy server"
# alias sb-logs="supabase functions logs server"
# alias sb-backup="supabase db dump -f backup-$(date +%Y%m%d).sql"
# alias vdeploy="vercel --prod"
# alias vlogs="vercel logs"

# ============================================
# NOTES
# ============================================

# Replace these placeholders with your actual values:
# - YOUR_PROJECT_REF: Found in Supabase Settings → General → Reference ID
# - YOUR_ANON_KEY: Found in Supabase Settings → API → anon/public key
# - YOUR_SERVICE_ROLE_KEY: Found in Supabase Settings → API → service_role key  
# - YOUR_PASSWORD: Your Supabase database password from project creation
# - YOUR_USERNAME: Your GitHub username
# - YOUR_REPO: Your GitHub repository name

# ============================================
# DEPLOYMENT COMPLETE! 🎉
# ============================================
