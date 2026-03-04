@echo off
echo ================================================================
echo    MF-INTEL CMS - BUILD AND LAUNCH
echo    for Gaming IQ
echo ================================================================
echo.

echo [1/4] Checking Node.js installation...
node --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo      Node.js: OK
echo.

echo [2/4] Installing dependencies...
if not exist "node_modules" (
    echo      Running: npm install
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
) else (
    echo      Already installed
)
echo.

echo [3/4] Building production application...
echo      Running: npm run build
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo      Build: SUCCESS
echo.

echo [4/4] Starting system...
echo.

REM Launch the application
call launch-casino.bat