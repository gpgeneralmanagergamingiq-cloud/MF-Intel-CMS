@echo off
REM ====================================
REM Push MF-Intel CMS to GitHub
REM ====================================

echo.
echo ========================================
echo   MF-Intel CMS - GitHub Upload Script
echo   Version: v2.3.2
echo ========================================
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git nu este instalat!
    echo.
    echo Descarca Git de la: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [1/7] Verificare Git...
echo ✓ Git instalat

echo.
echo [2/7] Initializare repository...
git init
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Eroare la initializare Git
    pause
    exit /b 1
)
echo ✓ Repository initializat

echo.
echo [3/7] Adaugare remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS.git
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Eroare la adaugare remote
    pause
    exit /b 1
)
echo ✓ Remote adaugat

echo.
echo [4/7] Adaugare fisiere...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Eroare la adaugare fisiere
    pause
    exit /b 1
)
echo ✓ Fisiere adaugate

echo.
echo [5/7] Creare commit...
git commit -m "Initial commit - MF-Intel CMS v2.3.2 - Full Casino Management System"
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Niciun fisier de commit sau deja commited
)
echo ✓ Commit creat

echo.
echo [6/7] Setare branch principal...
git branch -M main
echo ✓ Branch setat la 'main'

echo.
echo [7/7] Push pe GitHub...
echo.
echo IMPORTANT: Vei fi intrebat de username si parola GitHub
echo Pentru parola, foloseste un Personal Access Token (nu parola contului)
echo.
echo Cum sa creezi token: https://github.com/settings/tokens/new
echo Permisiuni necesare: repo (all)
echo.
pause

git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Eroare la push pe GitHub
    echo.
    echo Posibile cauze:
    echo - Nu ai autentificat corect
    echo - Nu ai permisiuni pe repository
    echo - Repository-ul nu exista
    echo.
    echo Incearca sa te autentifici manual:
    echo git config --global user.name "Numele Tau"
    echo git config --global user.email "email@tau.com"
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✓ SUCCESS! Codul a fost uploadat!
echo ========================================
echo.
echo Repository: https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS
echo Actions:    https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS/actions
echo.
echo Verifica GitHub Actions pentru deployment automat!
echo.
pause
