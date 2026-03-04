# 🚀 Deployment Instructions - Auto-Deploy Setup

## 📋 Overview

Aplicația **MF-Intel CMS for Gaming IQ v2.3.2** este configurată pentru **deployment automat** pe Cloudflare Pages folosind GitHub Actions.

---

## ✅ Configurare Completă

### 1. GitHub Actions Workflow

Fișierul `/.github/workflows/deploy.yml` este acum configurat corect și va rula automat la fiecare push pe branch-ul `main` sau `master`.

### 2. Ce se întâmplă automat:

Când faci **push pe GitHub**, workflow-ul va:
1. ✅ Checkout code
2. ✅ Install dependencies (`npm ci`)
3. ✅ Build aplicația (`npm run build`)
4. ✅ Deploy automat pe Cloudflare Pages
5. ✅ Aplicația va fi live la `https://app.mfintelcms.com`

---

## 🔧 Setup Necesar pe GitHub (One-Time Setup)

Pentru ca deployment-ul automat să funcționeze, trebuie să configurezi **secrets** în repository-ul tău GitHub:

### Pasul 1: Obține Cloudflare API Token

1. Mergi la [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click pe **profilul tău** (dreapta sus) → **My Profile**
3. Click pe **API Tokens** → **Create Token**
4. Folosește template-ul **"Edit Cloudflare Workers"** sau creează un custom token cu:
   - Permissions: `Account - Cloudflare Pages - Edit`
   - Account Resources: Include → `Your Account`
5. Click **Continue to Summary** → **Create Token**
6. **Copiază token-ul** (îl vei vedea o singură dată!)

### Pasul 2: Obține Cloudflare Account ID

1. În [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click pe **Workers & Pages** (meniul din stânga)
3. Account ID este afișat în dreapta (sub numele contului)
4. **Copiază Account ID**

### Pasul 3: Adaugă Secrets în GitHub

1. Mergi la repository-ul tău pe GitHub
2. Click pe **Settings** (tab)
3. Click pe **Secrets and variables** → **Actions** (din meniul stâng)
4. Click pe **New repository secret**
5. Adaugă următoarele secrets:

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: [Token-ul copiat la Pasul 1]
   
   **Secret 2:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: [Account ID copiat la Pasul 2]

---

## 🎯 Cum să Deploiezi

### Metoda 1: Push automat (Recomandat)

```bash
# 1. Fă modificările tale în cod
# 2. Commit & push
git add .
git commit -m "Updated to v2.3.2 - Removed multi-property system"
git push origin main
```

✨ **Asta e tot!** GitHub Actions va detecta push-ul și va face deploy automat.

### Metoda 2: Manual Trigger

1. Mergi pe GitHub la repository
2. Click pe **Actions** tab
3. Click pe workflow-ul **"🚀 Auto-Deploy to Cloudflare Pages"**
4. Click pe **"Run workflow"** (buton în dreapta)
5. Select branch: `main`
6. Click pe **"Run workflow"** (buton verde)

---

## 📊 Monitorizare Deployment

### Pe GitHub:
1. Mergi la **Actions** tab în repository
2. Vei vedea toate deployment-urile și status-ul lor
3. Click pe un deployment pentru a vedea logs

### Pe Cloudflare:
1. Mergi la [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click pe **Workers & Pages**
3. Click pe proiectul **mfintelcms**
4. Vei vedea toate deployment-urile și status-ul lor

---

## 🔍 Verificare Deployment

După deployment, verifică:

1. **Versiunea:** Deschide https://app.mfintelcms.com/GrandPalace
2. **Check Console:** Ar trebui să vezi în console:
   ```
   [VersionChecker] Current: 2.3.2
   ```
3. **Property Name:** În Dashboard ar trebui să vezi "Grand Palace Casino" hardcodat
4. **No Dropdowns:** Nu mai există dropdown-uri pentru "All Properties"

---

## ⚠️ Troubleshooting

### Problema: Deployment nu se activează automat

**Soluție:**
- Verifică că secrets sunt configurate corect în GitHub
- Verifică că push-ul este pe branch-ul `main` sau `master`
- Verifică logs în **Actions** tab pentru erori

### Problema: Aplicația online arată versiunea veche

**Soluții:**
1. **Clear Browser Cache:**
   - Chrome: `Ctrl + Shift + Delete` → Clear cached images and files
   - Sau deschide în **Incognito Mode**

2. **Force Refresh:**
   - `Ctrl + F5` (Windows)
   - `Cmd + Shift + R` (Mac)

3. **Verifică că deployment-ul a fost successful:**
   - Check GitHub Actions logs
   - Check Cloudflare deployment status

### Problema: Build Error în GitHub Actions

**Verifică:**
- Node.js version (trebuie 18+)
- Dependencies în package.json
- Logs din GitHub Actions pentru eroarea exactă

---

## 🎉 Success!

Odată ce ai configurat secrets-urile, deployment-ul va fi **100% automat**! 

Orice schimbare pe care o faci și o push-uiești pe `main` va fi **live în câteva minute**!

---

## 📝 Environment Variables (Optional)

Dacă aplicația ta are nevoie de environment variables (ex: Supabase keys), adaugă-le în:

1. **Cloudflare Dashboard:**
   - Workers & Pages → mfintelcms → Settings → Environment variables
   - Adaugă variabilele necesare

2. **Sau în vercel.json** (dacă folosești Vercel):
   - Deja configurate pentru SUPABASE_URL și SUPABASE_ANON_KEY

---

**Version:** 2.3.2
**Last Updated:** March 4, 2026
**Status:** ✅ Auto-Deploy Configured & Ready
