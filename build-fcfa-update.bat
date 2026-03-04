@echo off
echo ============================================
echo   Casino CMS - FCFA Update Build Script
echo   Version 2.1.0
echo ============================================
echo.

echo [1/5] Cleaning old build...
if exist dist (
    rmdir /s /q dist
    echo     - Old build deleted
) else (
    echo     - No old build found
)
echo.

echo [2/5] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo     - Build completed successfully
echo.

echo [3/5] Verifying build output...
if exist dist\index.html (
    echo     - index.html: FOUND
) else (
    echo     - index.html: MISSING!
)

if exist dist\.htaccess (
    echo     - .htaccess: FOUND
) else (
    echo     - .htaccess: MISSING!
    echo     WARNING: .htaccess not found. React Router may not work.
)

if exist dist\assets (
    echo     - assets folder: FOUND
) else (
    echo     - assets folder: MISSING!
)
echo.

echo [4/5] Creating deployment package...
echo     - Compressing files for upload...

:: Check if 7-Zip is available
where 7z >nul 2>nul
if %errorlevel% equ 0 (
    cd dist
    7z a -tzip ..\casino-cms-v2.1.0.zip * -r
    cd ..
    echo     - ZIP created: casino-cms-v2.1.0.zip
) else (
    echo     - 7-Zip not found. Please manually ZIP the dist folder.
    echo     - You can download 7-Zip from: https://www.7-zip.org/
)
echo.

echo [5/5] Next Steps:
echo ============================================
echo.
echo 1. Upload to cPanel:
echo    - Login to cPanel File Manager
echo    - Go to /public_html/Casino/
echo    - DELETE all old files
echo    - Upload casino-cms-v2.1.0.zip
echo    - Extract the ZIP file
echo.
echo 2. Verify .htaccess:
echo    - Enable "Show Hidden Files" in cPanel
echo    - Confirm .htaccess is present
echo.
echo 3. Clear browser cache:
echo    - Press Ctrl+Shift+Delete
echo    - Select "All time"
echo    - Clear "Cached images and files"
echo.
echo 4. Hard refresh:
echo    - Press Ctrl+Shift+R
echo    - OR open Incognito mode
echo.
echo 5. Verify FCFA currency:
echo    - Check summary cards show "FCFA 0"
echo    - Open console (F12) and verify version log
echo.
echo ============================================
echo.
echo Build completed! Package ready for upload.
echo.

pause
