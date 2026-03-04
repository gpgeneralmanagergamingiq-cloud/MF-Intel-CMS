# ⚠️ CRITICAL: BEFORE DEPLOYMENT

## MUST CHANGE BEFORE DEPLOYING TO PRODUCTION!

### Step 1: Switch to Production Mode

**File:** `/src/app/utils/api.ts`

**Line 8:** Change this:

```typescript
const USE_LOCAL_STORAGE = true; // LOCAL DEV MODE - Change to false after deployment
```

**To this:**

```typescript
const USE_LOCAL_STORAGE = false; // PRODUCTION MODE - Change to true for local dev
```

### Step 2: Commit and Push

```bash
git add src/app/utils/api.ts
git commit -m "Switch to production mode"
git push origin main
```

### Step 3: Deploy

Then follow the deployment steps in:
- `/START_HERE_DEPLOYMENT.md`
- `/DEPLOYMENT_CHECKLIST_START_HERE.md`

---

## ⚡ QUICK FIX IF YOU FORGET:

If you deploy with `USE_LOCAL_STORAGE = true`, your app will work but won't persist data!

To fix:
1. Change to `false`
2. Push to GitHub
3. Vercel will auto-redeploy

---

**CURRENT STATUS:** 🟡 **LOCAL DEV MODE** (localStorage)  
**AFTER DEPLOYMENT:** 🟢 **PRODUCTION MODE** (Supabase)
