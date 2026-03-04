#!/bin/bash

# ============================================
# MF-Intel CMS v2.3.2 - Quick Deployment Script
# ============================================

echo "=========================================="
echo "  MF-Intel CMS v2.3.2 Deployment"
echo "  Grand Palace Casino Dedicated Edition"
echo "=========================================="
echo ""

# Step 1: Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/
echo "✅ Clean complete"
echo ""

# Step 2: Install dependencies (if needed)
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi
echo ""

# Step 3: Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check errors above."
    exit 1
fi

echo "✅ Build successful"
echo ""

# Step 4: Display build information
echo "=========================================="
echo "  Build Complete!"
echo "=========================================="
echo ""
echo "📁 Build output location: ./dist"
echo "📊 Build size:"
du -sh dist/
echo ""
echo "📋 Next steps for deployment:"
echo ""
echo "  Option 1: Deploy to Vercel"
echo "    → npm run deploy:cloudflare"
echo ""
echo "  Option 2: Upload via FTP/SFTP"
echo "    → Upload contents of 'dist' folder to your web root"
echo ""
echo "  Option 3: Use cPanel File Manager"
echo "    → Compress 'dist' folder and upload via cPanel"
echo ""
echo "=========================================="
echo ""
echo "🌐 Application URL: https://app.mfintelcms.com/GrandPalace"
echo "📖 Full deployment guide: DEPLOYMENT_V2.3.2.md"
echo ""
echo "=========================================="
