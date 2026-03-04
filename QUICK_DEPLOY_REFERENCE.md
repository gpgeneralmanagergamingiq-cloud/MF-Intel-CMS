# 🚀 QUICK DEPLOYMENT REFERENCE
## Your Supabase Project is Already Connected!

---

## ✅ YOUR PROJECT INFO

**Project ID:** `njijaaivkccpsxlfjcja`  
**Project URL:** `https://njijaaivkccpsxlfjcja.supabase.co`  
**Anon Key:** Already configured ✅

---

## 📝 QUICK START - 4 SIMPLE STEPS

### STEP 1: CREATE DATABASE TABLE (5 min)
```
1. Go to: https://app.supabase.com/sign-in
2. Open your project: njijaaivkccpsxlfjcja
3. Click: SQL Editor → New query
4. Copy/paste SQL from: /supabase/migrations/001_initial_setup.sql
5. Click: RUN
```

### STEP 2: DEPLOY EDGE FUNCTION (10 min)
```bash
# Install Supabase CLI
scoop install supabase  # Windows
brew install supabase/tap/supabase  # Mac

# Login
supabase login

# Link project
supabase link --project-ref njijaaivkccpsxlfjcja

# Set secrets (get from Supabase Dashboard → Settings → API)
supabase secrets set SUPABASE_URL="https://njijaaivkccpsxlfjcja.supabase.co"
supabase secrets set SUPABASE_ANON_KEY="YOUR_ANON_KEY"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_KEY"
supabase secrets set SUPABASE_DB_URL="YOUR_DB_CONNECTION_STRING"

# Deploy
supabase functions deploy server

# Test
curl https://njijaaivkccpsxlfjcja.supabase.co/functions/v1/make-server-68939c29/health
```

### STEP 3: DEPLOY TO VERCEL (10 min)
```
1. Push code to GitHub
2. Go to: https://vercel.com/new
3. Import your GitHub repository
4. Add environment variables:
   - VITE_SUPABASE_URL=https://njijaaivkccpsxlfjcja.supabase.co
   - VITE_SUPABASE_ANON_KEY=your_anon_key
5. Click: Deploy
6. Wait 3-5 minutes
7. Done! ✅
```

### STEP 4: TEST YOUR APP
```
1. Visit your Vercel URL
2. Login: admin / admin123
3. Test features
4. Change admin password
5. Create users
6. Go live! 🎉
```

---

## 🔑 WHERE TO FIND YOUR CREDENTIALS

### In Supabase Dashboard:

**API Keys:**
```
Settings → API
- URL: https://njijaaivkccpsxlfjcja.supabase.co
- anon/public key: (Already have this ✅)
- service_role key: (Copy and save securely!)
```

**Database Connection:**
```
Settings → Database → Connection String
- Connection pooling (Transaction mode)
- Copy the postgresql:// URL
```

---

## ⚡ COMMON COMMANDS

### Deploy Updates:
```bash
# Backend (Edge Function)
supabase functions deploy server

# Frontend (Auto-deploys on git push)
git add .
git commit -m "Update"
git push origin main
```

### Check Logs:
```bash
# Edge Function logs
supabase functions logs server

# Or in Dashboard:
Edge Functions → server → Logs
```

### Test Health:
```bash
curl https://njijaaivkccpsxlfjcja.supabase.co/functions/v1/make-server-68939c29/health
```

---

## 🚨 TROUBLESHOOTING

**Can't login?**
→ Check USE_LOCAL_STORAGE = false in /src/app/utils/api.ts

**CORS errors?**
→ Add your Vercel URL to CORS in /supabase/functions/server/index.tsx

**Build fails?**
→ Run `npm run build` locally first to check for errors

**Edge function fails?**
→ Check secrets are set: `supabase secrets list`

---

## 📞 HELP & RESOURCES

**Full Guide:** `/YOUR_DEPLOYMENT_GUIDE.md`  
**Supabase Dashboard:** https://app.supabase.com  
**Vercel Dashboard:** https://vercel.com/dashboard  

---

## 💰 COST: $0/month on Free Tier! 🎉

Upgrade when you exceed:
- 50+ concurrent users
- 10,000+ players
- 100,000+ transactions/month

---

**You're ready to deploy! Follow the 4 steps above.** 🚀
