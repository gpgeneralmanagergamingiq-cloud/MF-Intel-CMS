#!/bin/bash

# 🚀 Deployment Readiness Check Script
# Version 2.3.2

echo "================================================"
echo "🔍 MF-Intel CMS v2.3.2 - Deployment Check"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
PASSED=0
FAILED=0

# Function to check
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((FAILED++))
    fi
}

echo "📋 Checking files..."
echo ""

# Check if package.json has correct version
if grep -q '"version": "2.3.2"' package.json; then
    check 0 "package.json version is 2.3.2"
else
    check 1 "package.json version is NOT 2.3.2"
fi

# Check if GitHub workflow exists
if [ -f ".github/workflows/deploy.yml" ]; then
    check 0 "GitHub Actions workflow exists"
else
    check 1 "GitHub Actions workflow NOT found"
fi

# Check if .gitignore exists
if [ -f ".gitignore" ]; then
    check 0 ".gitignore exists"
else
    check 1 ".gitignore NOT found"
fi

# Check if VersionChecker has correct version
if grep -q "const CURRENT_VERSION = '2.3.2'" src/app/components/VersionChecker.tsx; then
    check 0 "VersionChecker.tsx has version 2.3.2"
else
    check 1 "VersionChecker.tsx does NOT have version 2.3.2"
fi

# Check if vite.config.ts has correct version
if grep -q "'2.3.2'" vite.config.ts; then
    check 0 "vite.config.ts has version 2.3.2"
else
    check 1 "vite.config.ts does NOT have version 2.3.2"
fi

# Check if index.html has correct version
if grep -q "2.3.2" index.html; then
    check 0 "index.html has version 2.3.2"
else
    check 1 "index.html does NOT have version 2.3.2"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    check 0 "node_modules directory exists"
else
    check 1 "node_modules NOT found - run 'npm install'"
fi

# Check if dist directory can be created (build test)
echo ""
echo "🔨 Testing build process..."
echo ""

npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    check 0 "Build successful - dist directory created"
else
    check 1 "Build FAILED - check npm run build output"
fi

# Summary
echo ""
echo "================================================"
echo "📊 SUMMARY"
echo "================================================"
echo -e "Passed: ${GREEN}${PASSED}${NC}"
echo -e "Failed: ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED!${NC}"
    echo ""
    echo "✅ Ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Make sure GitHub secrets are configured:"
    echo "   - CLOUDFLARE_API_TOKEN"
    echo "   - CLOUDFLARE_ACCOUNT_ID"
    echo ""
    echo "2. Commit and push to trigger auto-deploy:"
    echo "   git add ."
    echo "   git commit -m 'v2.3.2 - Ready for deployment'"
    echo "   git push origin main"
    echo ""
    echo "3. Monitor deployment at:"
    echo "   https://github.com/YOUR_USERNAME/YOUR_REPO/actions"
    echo ""
else
    echo -e "${RED}⚠️  SOME CHECKS FAILED!${NC}"
    echo ""
    echo "Please fix the issues above before deploying."
    echo ""
fi

echo "================================================"
