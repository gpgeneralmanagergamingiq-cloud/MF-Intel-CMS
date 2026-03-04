@echo off
setlocal enabledelayedexpansion
color 0A
title Casino CMS - Build Script

echo.
echo ========================================
echo    MF-Intel CMS - BUILD SCRIPT
echo ========================================
echo.

REM Step 1: Build
echo [1/2] Building project...
echo.
call npm run build

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo [ERROR] Build failed!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Your files are ready in the 'dist' folder:
echo %~dp0dist
echo.
echo ----------------------------------------
echo    NEXT STEPS - MANUAL UPLOAD:
echo ----------------------------------------
echo.
echo 1. Open cPanel File Manager
echo 2. Go to: public_html/Casino
echo 3. DELETE all old files in Casino folder
echo 4. Upload all files from the 'dist' folder
echo.
echo TIP: Use ZIP method for faster upload:
echo   - Right-click 'dist' folder ^> Send to ^> Compressed folder
echo   - Upload ZIP to cPanel
echo   - Extract ZIP in cPanel
echo   - Delete ZIP file
echo.
echo ========================================

REM Step 2: Open dist folder
echo.
echo Opening dist folder...
explorer "%~dp0dist"

echo.
echo Press any key to exit...
pause >nul
