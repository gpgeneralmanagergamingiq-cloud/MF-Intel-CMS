@echo off
setlocal enabledelayedexpansion

REM ============================================
REM Casino CMS - Automated cPanel Deployment
REM ============================================

echo.
echo ====================================
echo   Casino CMS Deployment Script
echo ====================================
echo.

REM Check if config exists
if not exist "deploy-config.bat" (
    echo [ERROR] deploy-config.bat not found!
    echo.
    echo Please create deploy-config.bat with your FTP credentials:
    echo.
    echo set FTP_HOST=ftp.gamingiq.net
    echo set FTP_USER=your-username
    echo set FTP_PASS=your-password
    echo set FTP_REMOTE_DIR=/public_html/Casino
    echo.
    pause
    exit /b 1
)

REM Load configuration
call deploy-config.bat

echo [1/5] Loading configuration...
echo      Host: %FTP_HOST%
echo      User: %FTP_USER%
echo      Remote: %FTP_REMOTE_DIR%
echo.

REM Step 1: Clean old build
echo [2/5] Cleaning old build...
if exist "dist" (
    rmdir /s /q dist
    echo      Old build deleted
) else (
    echo      No old build found
)
echo.

REM Step 2: Build project
echo [3/5] Building project...
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo      Build completed successfully
echo.

REM Step 3: Check if dist folder exists
if not exist "dist" (
    echo [ERROR] dist folder not found after build!
    pause
    exit /b 1
)

REM Step 4: Upload via PowerShell FTP
echo [4/5] Uploading to cPanel via FTP...
echo      This may take a few minutes...
echo.

powershell -ExecutionPolicy Bypass -File deploy-ftp-upload.ps1 "%FTP_HOST%" "%FTP_USER%" "%FTP_PASS%" "%FTP_REMOTE_DIR%"

if errorlevel 1 (
    echo [ERROR] Upload failed!
    echo.
    echo Troubleshooting:
    echo 1. Check your FTP credentials in deploy-config.bat
    echo 2. Verify FTP host is correct (ftp.gamingiq.net or gamingiq.net)
    echo 3. Check if FTP port 21 is open
    echo 4. Try using deploy-winscp.bat if you have WinSCP installed
    echo.
    pause
    exit /b 1
)

echo.
echo [5/5] Deployment completed successfully!
echo.
echo ====================================
echo   Deployment Summary
echo ====================================
echo  Status: SUCCESS
echo  Build: dist folder
echo  Uploaded to: %FTP_HOST%%FTP_REMOTE_DIR%
echo  Live URL: https://gamingiq.net/Casino
echo ====================================
echo.
echo Next steps:
echo 1. Visit https://gamingiq.net/Casino
echo 2. Press Ctrl+Shift+R to hard refresh
echo 3. Test the application
echo.
pause
