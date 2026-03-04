#!/bin/bash

echo "========================================"
echo "  MF-INTEL CMS LAUNCHER"
echo "  for Gaming IQ"
echo "========================================"
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "[ERROR] dist folder not found!"
    echo ""
    echo "Please build the application first:"
    echo "  npm run build"
    echo ""
    exit 1
fi

echo "[1/3] Starting Casino Application..."
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Using Python3..."
    cd dist
    python3 -m http.server 8080 &
    SERVER_PID=$!
    cd ..
elif command -v python &> /dev/null; then
    echo "Using Python..."
    cd dist
    python -m http.server 8080 &
    SERVER_PID=$!
    cd ..
else
    # Fallback to npx serve
    echo "Python not found, using npx serve..."
    npx serve dist -p 8080 &
    SERVER_PID=$!
fi

sleep 3

echo "[2/3] Server started on http://localhost:8080"
echo ""

echo "[3/3] Opening browser..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:8080
elif command -v open &> /dev/null; then
    open http://localhost:8080
else
    echo "Please manually open: http://localhost:8080"
fi

echo ""
echo "========================================"
echo "   Casino App is now running!"
echo "========================================"
echo ""
echo " URL: http://localhost:8080"
echo ""
echo " Default Login:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "========================================"
echo ""
echo "To stop: Press Ctrl+C"
echo ""
echo "========================================"

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping server...'; kill $SERVER_PID 2>/dev/null; exit" INT
wait $SERVER_PID