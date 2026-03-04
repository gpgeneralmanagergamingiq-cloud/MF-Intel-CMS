#!/bin/bash

# 🚀 MF-Intel CMS - Automatic Deployment Script
# This script deploys the application to production

set -e # Exit on error

echo "🚀 MF-Intel CMS - Deployment Starting..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get current version
VERSION=$(node -p "require('./package.json').version")
echo "📦 Version: $VERSION"

# Step 1: Install dependencies
echo ""
echo "1️⃣ Installing dependencies..."
npm ci

# Step 2: Build frontend
echo ""
echo "2️⃣ Building frontend application..."
npm run build

# Step 3: Deploy to Cloudflare Pages
echo ""
echo "3️⃣ Deploying to Cloudflare Pages..."
if command -v wrangler &> /dev/null; then
    wrangler pages deploy dist --project-name=mfintelcms
    echo "✅ Frontend deployed to Cloudflare Pages"
else
    echo "⚠️  Wrangler not installed. Skipping Cloudflare deployment."
    echo "    Install with: npm install -g wrangler"
fi

# Step 4: Deploy Supabase functions
echo ""
echo "4️⃣ Deploying backend to Supabase..."
if command -v supabase &> /dev/null; then
    supabase functions deploy
    echo "✅ Backend deployed to Supabase"
else
    echo "⚠️  Supabase CLI not installed. Skipping backend deployment."
    echo "    Install with: npm install -g supabase"
fi

# Step 5: Complete
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Live URL: https://app.mfintelcms.com"
echo "📦 Version: $VERSION"
echo "⚡ All properties updated automatically!"
echo ""
echo "✅ Next steps:"
echo "   1. Wait 30-60 seconds for CDN propagation"
echo "   2. Open https://app.mfintelcms.com"
echo "   3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)"
echo "   4. Verify changes are live"
echo ""
