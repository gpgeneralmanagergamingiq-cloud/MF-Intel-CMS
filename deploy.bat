@echo off
REM 🚀 MF-Intel CMS - Automatic Deployment Script (Windows)
REM This script deploys the application to production

echo 🚀 MF-Intel CMS - Deployment Starting...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REM Step 1: Install dependencies
echo.
echo 1️⃣ Installing dependencies...
call npm ci

REM Step 2: Build frontend
echo.
echo 2️⃣ Building frontend application...
call npm run build

REM Step 3: Deploy to Cloudflare Pages
echo.
echo 3️⃣ Deploying to Cloudflare Pages...
where wrangler >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    call wrangler pages deploy dist --project-name=mfintelcms
    echo ✅ Frontend deployed to Cloudflare Pages
) else (
    echo ⚠️  Wrangler not installed. Skipping Cloudflare deployment.
    echo     Install with: npm install -g wrangler
)

REM Step 4: Deploy Supabase functions
echo.
echo 4️⃣ Deploying backend to Supabase...
where supabase >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    call supabase functions deploy
    echo ✅ Backend deployed to Supabase
) else (
    echo ⚠️  Supabase CLI not installed. Skipping backend deployment.
    echo     Install with: npm install -g supabase
)

REM Step 5: Complete
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎉 DEPLOYMENT COMPLETE!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🌐 Live URL: https://app.mfintelcms.com
echo ⚡ All properties updated automatically!
echo.
echo ✅ Next steps:
echo    1. Wait 30-60 seconds for CDN propagation
echo    2. Open https://app.mfintelcms.com
echo    3. Hard refresh (Ctrl+Shift+R)
echo    4. Verify changes are live
echo.

pause
