@echo off
echo ============================================
echo Installing ACR122U Keyboard Mode Packages
echo ============================================
echo.

echo Step 1: Installing pyscard...
python -m pip install pyscard
echo.

echo Step 2: Installing pyautogui...
python -m pip install pyautogui
echo.

echo ============================================
echo Installation Complete!
echo ============================================
echo.
echo Press any key to close...
pause > nul
