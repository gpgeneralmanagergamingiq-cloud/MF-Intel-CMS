@echo off
setlocal enabledelayedexpansion

REM 🚀 Deployment Readiness Check Script
REM Version 2.3.2

echo ================================================
echo 🔍 MF-Intel CMS v2.3.2 - Deployment Check
echo ================================================
echo.

set PASSED=0
set FAILED=0

echo 📋 Checking files...
echo.

REM Check package.json version
findstr /C:"\"version\": \"2.3.2\"" package.json >nul 2>&1
if %errorlevel%==0 (
    echo ✅ package.json version is 2.3.2
    set /a PASSED+=1
) else (
    echo ❌ package.json version is NOT 2.3.2
    set /a FAILED+=1
)

REM Check if GitHub workflow exists
if exist ".github\workflows\deploy.yml" (
    echo ✅ GitHub Actions workflow exists
    set /a PASSED+=1
) else (
    echo ❌ GitHub Actions workflow NOT found
    set /a FAILED+=1
)

REM Check if .gitignore exists
if exist ".gitignore" (
    echo ✅ .gitignore exists
    set /a PASSED+=1
) else (
    echo ❌ .gitignore NOT found
    set /a FAILED+=1
)

REM Check VersionChecker.tsx
findstr /C:"const CURRENT_VERSION = '2.3.2'" src\app\components\VersionChecker.tsx >nul 2>&1
if %errorlevel%==0 (
    echo ✅ VersionChecker.tsx has version 2.3.2
    set /a PASSED+=1
) else (
    echo ❌ VersionChecker.tsx does NOT have version 2.3.2
    set /a FAILED+=1
)

REM Check vite.config.ts
findstr /C:"'2.3.2'" vite.config.ts >nul 2>&1
if %errorlevel%==0 (
    echo ✅ vite.config.ts has version 2.3.2
    set /a PASSED+=1
) else (
    echo ❌ vite.config.ts does NOT have version 2.3.2
    set /a FAILED+=1
)

REM Check index.html
findstr /C:"2.3.2" index.html >nul 2>&1
if %errorlevel%==0 (
    echo ✅ index.html has version 2.3.2
    set /a PASSED+=1
) else (
    echo ❌ index.html does NOT have version 2.3.2
    set /a FAILED+=1
)

REM Check node_modules
if exist "node_modules\" (
    echo ✅ node_modules directory exists
    set /a PASSED+=1
) else (
    echo ❌ node_modules NOT found - run 'npm install'
    set /a FAILED+=1
)

echo.
echo 🔨 Testing build process...
echo.

REM Test build
npm run build >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Build successful - dist directory created
    set /a PASSED+=1
) else (
    echo ❌ Build FAILED - check npm run build output
    set /a FAILED+=1
)

echo.
echo ================================================
echo 📊 SUMMARY
echo ================================================
echo Passed: %PASSED%
echo Failed: %FAILED%
echo.

if %FAILED%==0 (
    echo 🎉 ALL CHECKS PASSED!
    echo.
    echo ✅ Ready for deployment!
    echo.
    echo Next steps:
    echo 1. Make sure GitHub secrets are configured:
    echo    - CLOUDFLARE_API_TOKEN
    echo    - CLOUDFLARE_ACCOUNT_ID
    echo.
    echo 2. Commit and push to trigger auto-deploy:
    echo    git add .
    echo    git commit -m "v2.3.2 - Ready for deployment"
    echo    git push origin main
    echo.
    echo 3. Monitor deployment at:
    echo    https://github.com/YOUR_USERNAME/YOUR_REPO/actions
    echo.
) else (
    echo ⚠️  SOME CHECKS FAILED!
    echo.
    echo Please fix the issues above before deploying.
    echo.
)

echo ================================================
pause
