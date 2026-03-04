@echo off
REM ============================================
REM MF-Intel CMS v2.3.2 - Quick Deployment Script
REM ============================================

echo ==========================================
echo   MF-Intel CMS v2.3.2 Deployment
echo   Grand Palace Casino Dedicated Edition
echo ==========================================
echo.

REM Step 1: Clean previous build
echo Cleaning previous build...
if exist dist\ rmdir /s /q dist\
echo Clean complete
echo.

REM Step 2: Check dependencies
echo Checking dependencies...
if not exist node_modules\ (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed
)
echo.

REM Step 3: Build the application
echo Building application...
call npm run build

if errorlevel 1 (
    echo Build failed! Please check errors above.
    pause
    exit /b 1
)

echo Build successful
echo.

REM Step 4: Display build information
echo ==========================================
echo   Build Complete!
echo ==========================================
echo.
echo Build output location: ./dist
echo.
echo Next steps for deployment:
echo.
echo   Option 1: Deploy to Vercel
echo   - npm run deploy:cloudflare
echo.
echo   Option 2: Upload via FTP/SFTP
echo   - Upload contents of 'dist' folder to your web root
echo.
echo   Option 3: Use cPanel File Manager
echo   - Compress 'dist' folder and upload via cPanel
echo.
echo ==========================================
echo.
echo Application URL: https://app.mfintelcms.com/GrandPalace
echo Full deployment guide: DEPLOYMENT_V2.3.2.md
echo.
echo ==========================================
echo.
pause
