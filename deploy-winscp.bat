@echo off
setlocal enabledelayedexpansion

REM ============================================
REM Casino CMS - WinSCP Deployment Script
REM This is faster and more reliable than PowerShell FTP
REM ============================================

echo.
echo ====================================
echo   Casino CMS WinSCP Deployment
echo ====================================
echo.

REM Check if WinSCP is installed
set WINSCP_PATH=C:\Program Files (x86)\WinSCP\WinSCP.com
if not exist "%WINSCP_PATH%" (
    set WINSCP_PATH=C:\Program Files\WinSCP\WinSCP.com
)
if not exist "%WINSCP_PATH%" (
    echo [ERROR] WinSCP not found!
    echo.
    echo Please either:
    echo 1. Install WinSCP from https://winscp.net/eng/download.php
    echo 2. Use deploy-to-cpanel.bat instead (uses PowerShell FTP)
    echo.
    pause
    exit /b 1
)

REM Check if config exists
if not exist "deploy-config.bat" (
    echo [ERROR] deploy-config.bat not found!
    echo.
    echo Please create deploy-config.bat with your FTP credentials.
    echo See deploy-config.bat.example for template.
    echo.
    pause
    exit /b 1
)

REM Load configuration
call deploy-config.bat

echo [1/4] Configuration loaded
echo      Host: %FTP_HOST%
echo      User: %FTP_USER%
echo      Remote: %FTP_REMOTE_DIR%
echo.

REM Step 1: Clean old build
echo [2/4] Cleaning old build...
if exist "dist" (
    rmdir /s /q dist
    echo      Old build deleted
)
echo.

REM Step 2: Build project
echo [3/4] Building project...
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo      Build completed
echo.

REM Step 3: Upload via WinSCP
echo [4/4] Uploading via WinSCP...
echo      Please wait...
echo.

REM Create WinSCP script
echo option batch abort > winscp-upload.txt
echo option confirm off >> winscp-upload.txt
echo open ftp://%FTP_USER%:%FTP_PASS%@%FTP_HOST% >> winscp-upload.txt
echo lcd "%CD%\dist" >> winscp-upload.txt
echo cd %FTP_REMOTE_DIR% >> winscp-upload.txt
echo synchronize remote -delete >> winscp-upload.txt
echo close >> winscp-upload.txt
echo exit >> winscp-upload.txt

REM Execute WinSCP
"%WINSCP_PATH%" /script=winscp-upload.txt /log=winscp-upload.log

if errorlevel 1 (
    echo.
    echo [ERROR] Upload failed!
    echo Check winscp-upload.log for details
    echo.
    pause
    del winscp-upload.txt
    exit /b 1
)

REM Clean up
del winscp-upload.txt

echo.
echo ====================================
echo   Deployment SUCCESS!
echo ====================================
echo  Live URL: https://gamingiq.net/Casino
echo ====================================
echo.
echo Next steps:
echo 1. Visit https://gamingiq.net/Casino
echo 2. Press Ctrl+Shift+R to clear cache
echo 3. Check console for version 2.1.2
echo.
pause
