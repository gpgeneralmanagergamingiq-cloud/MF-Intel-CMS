#!/bin/bash

# 🚀 Quick Deploy Script
# MF-Intel CMS v2.3.2

clear

echo "================================================"
echo "🚀 MF-Intel CMS v2.3.2 - Quick Deploy"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is available
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed!${NC}"
    echo "Please install git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not a git repository!${NC}"
    echo "Please initialize git first: git init"
    exit 1
fi

echo -e "${BLUE}📋 Current Status:${NC}"
echo ""

# Show current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Branch: $CURRENT_BRANCH"

# Show git status
echo ""
git status --short

echo ""
echo "================================================"
echo ""

# Ask for confirmation
echo -e "${YELLOW}⚠️  This will:${NC}"
echo "1. Add all changes"
echo "2. Commit with message: 'v2.3.2 - Grand Palace Casino Edition'"
echo "3. Push to origin $CURRENT_BRANCH"
echo "4. Trigger auto-deployment to Cloudflare Pages"
echo ""

read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 1
fi

echo ""
echo "================================================"
echo -e "${BLUE}🔄 Starting deployment process...${NC}"
echo "================================================"
echo ""

# Step 1: Add all changes
echo -e "${BLUE}📦 Step 1/3: Adding all changes...${NC}"
git add .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Changes added successfully${NC}"
else
    echo -e "${RED}❌ Failed to add changes${NC}"
    exit 1
fi

echo ""

# Step 2: Commit
echo -e "${BLUE}💾 Step 2/3: Committing changes...${NC}"
git commit -m "v2.3.2 - Grand Palace Casino Edition - Auto-deploy ready"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Changes committed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Nothing to commit or commit failed${NC}"
    # Ask if we should continue with push anyway
    read -p "Continue with push? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""

# Step 3: Push
echo -e "${BLUE}🚀 Step 3/3: Pushing to GitHub...${NC}"
git push origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo -e "${GREEN}🎉 DEPLOYMENT INITIATED SUCCESSFULLY!${NC}"
    echo "================================================"
    echo ""
    echo "✅ Code pushed to GitHub"
    echo "✅ Auto-deploy workflow triggered"
    echo ""
    echo -e "${BLUE}📊 Next Steps:${NC}"
    echo ""
    echo "1. Monitor deployment at:"
    echo "   https://github.com/YOUR_USERNAME/YOUR_REPO/actions"
    echo ""
    echo "2. Check Cloudflare deployment:"
    echo "   https://dash.cloudflare.com → Workers & Pages → mfintelcms"
    echo ""
    echo "3. Once deployed, verify at:"
    echo "   https://app.mfintelcms.com/GrandPalace"
    echo ""
    echo "4. Check console for version:"
    echo "   Should show: [VersionChecker] Current: 2.3.2"
    echo ""
    echo "⏱️  Deployment usually takes 2-3 minutes"
    echo ""
    echo "================================================"
else
    echo ""
    echo -e "${RED}❌ Push failed!${NC}"
    echo ""
    echo "Possible reasons:"
    echo "1. No remote repository configured"
    echo "2. Authentication required"
    echo "3. Network issues"
    echo ""
    echo "To fix:"
    echo "1. Configure remote: git remote add origin YOUR_REPO_URL"
    echo "2. Or push manually: git push origin $CURRENT_BRANCH"
    exit 1
fi
