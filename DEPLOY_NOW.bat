@echo off
setlocal enabledelayedexpansion

REM 🚀 Quick Deploy Script
REM MF-Intel CMS v2.3.2

cls

echo ================================================
echo 🚀 MF-Intel CMS v2.3.2 - Quick Deploy
echo ================================================
echo.

REM Check if git is available
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo Please install git first.
    pause
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not a git repository!
    echo Please initialize git first: git init
    pause
    exit /b 1
)

echo 📋 Current Status:
echo.

REM Show current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo Branch: %CURRENT_BRANCH%

REM Show git status
echo.
git status --short

echo.
echo ================================================
echo.

echo ⚠️  This will:
echo 1. Add all changes
echo 2. Commit with message: 'v2.3.2 - Grand Palace Casino Edition'
echo 3. Push to origin %CURRENT_BRANCH%
echo 4. Trigger auto-deployment to Cloudflare Pages
echo.

set /p CONTINUE="Continue? (y/n): "
if /i not "%CONTINUE%"=="y" (
    echo.
    echo ❌ Deployment cancelled
    pause
    exit /b 1
)

echo.
echo ================================================
echo 🔄 Starting deployment process...
echo ================================================
echo.

REM Step 1: Add all changes
echo 📦 Step 1/3: Adding all changes...
git add .

if %errorlevel% neq 0 (
    echo ❌ Failed to add changes
    pause
    exit /b 1
)

echo ✅ Changes added successfully
echo.

REM Step 2: Commit
echo 💾 Step 2/3: Committing changes...
git commit -m "v2.3.2 - Grand Palace Casino Edition - Auto-deploy ready"

if %errorlevel% neq 0 (
    echo ⚠️  Nothing to commit or commit failed
    set /p CONTINUE_PUSH="Continue with push? (y/n): "
    if /i not "!CONTINUE_PUSH!"=="y" (
        pause
        exit /b 1
    )
) else (
    echo ✅ Changes committed successfully
)

echo.

REM Step 3: Push
echo 🚀 Step 3/3: Pushing to GitHub...
git push origin %CURRENT_BRANCH%

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo 🎉 DEPLOYMENT INITIATED SUCCESSFULLY!
    echo ================================================
    echo.
    echo ✅ Code pushed to GitHub
    echo ✅ Auto-deploy workflow triggered
    echo.
    echo 📊 Next Steps:
    echo.
    echo 1. Monitor deployment at:
    echo    https://github.com/YOUR_USERNAME/YOUR_REPO/actions
    echo.
    echo 2. Check Cloudflare deployment:
    echo    https://dash.cloudflare.com -^> Workers ^& Pages -^> mfintelcms
    echo.
    echo 3. Once deployed, verify at:
    echo    https://app.mfintelcms.com/GrandPalace
    echo.
    echo 4. Check console for version:
    echo    Should show: [VersionChecker] Current: 2.3.2
    echo.
    echo ⏱️  Deployment usually takes 2-3 minutes
    echo.
    echo ================================================
) else (
    echo.
    echo ❌ Push failed!
    echo.
    echo Possible reasons:
    echo 1. No remote repository configured
    echo 2. Authentication required
    echo 3. Network issues
    echo.
    echo To fix:
    echo 1. Configure remote: git remote add origin YOUR_REPO_URL
    echo 2. Or push manually: git push origin %CURRENT_BRANCH%
)

echo.
pause
