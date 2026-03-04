@echo off
title ACR122U NFC Bridge Service
echo ============================================
echo   Starting ACR122U NFC Bridge Service
echo ============================================
echo.
echo Make sure ACR122U is plugged in via USB!
echo.
echo This window will show card scan events.
echo Keep it open while using the app.
echo.
echo Press Ctrl+C to stop the service.
echo.
echo ============================================
echo.

cd nfc-bridge
npm start
