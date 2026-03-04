@echo off
echo ========================================
echo    MF-INTEL CMS LAUNCHER
echo    for Gaming IQ
echo ========================================
echo.

REM Check if dist folder exists
if not exist "dist" (
    echo [ERROR] dist folder not found!
    echo.
    echo Please build the application first:
    echo   npm run build
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting Casino Application...
echo.

REM Start the web server in a new window
start "Casino App Server" cmd /k "cd dist && python -m http.server 8080 || npx serve -p 8080"

timeout /t 3 /nobreak > nul

echo [2/3] Waiting for server to start...
timeout /t 2 /nobreak > nul

echo [3/3] Opening browser...
echo.

REM Open the browser
start http://localhost:8080

echo ========================================
echo    Casino App is now running!
echo ========================================
echo.
echo  URL: http://localhost:8080
echo.
echo  Default Login:
echo    Username: admin
echo    Password: admin123
echo.
echo ========================================
echo.
echo To stop: Close the "Casino App Server" window
echo.
echo ========================================
pause