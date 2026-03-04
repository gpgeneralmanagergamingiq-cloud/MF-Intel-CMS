#!/bin/bash

# ====================================
# Push MF-Intel CMS to GitHub
# ====================================

echo ""
echo "========================================"
echo "  MF-Intel CMS - GitHub Upload Script"
echo "  Version: v2.3.2"
echo "========================================"
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "[ERROR] Git is not installed!"
    echo ""
    echo "Install Git:"
    echo "  Ubuntu/Debian: sudo apt-get install git"
    echo "  macOS: brew install git"
    echo ""
    exit 1
fi

echo "[1/7] Checking Git..."
echo "✓ Git installed"

echo ""
echo "[2/7] Initializing repository..."
git init
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to initialize Git"
    exit 1
fi
echo "✓ Repository initialized"

echo ""
echo "[3/7] Adding remote origin..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS.git
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to add remote"
    exit 1
fi
echo "✓ Remote added"

echo ""
echo "[4/7] Adding files..."
git add .
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to add files"
    exit 1
fi
echo "✓ Files added"

echo ""
echo "[5/7] Creating commit..."
git commit -m "Initial commit - MF-Intel CMS v2.3.2 - Full Casino Management System"
if [ $? -ne 0 ]; then
    echo "[WARNING] No files to commit or already committed"
fi
echo "✓ Commit created"

echo ""
echo "[6/7] Setting main branch..."
git branch -M main
echo "✓ Branch set to 'main'"

echo ""
echo "[7/7] Pushing to GitHub..."
echo ""
echo "IMPORTANT: You will be asked for GitHub credentials"
echo "For password, use a Personal Access Token (not account password)"
echo ""
echo "Create token: https://github.com/settings/tokens/new"
echo "Required permissions: repo (all)"
echo ""
read -p "Press Enter to continue..."

git push -u origin main
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to push to GitHub"
    echo ""
    echo "Possible causes:"
    echo "- Authentication failed"
    echo "- No permissions on repository"
    echo "- Repository doesn't exist"
    echo ""
    echo "Try authenticating manually:"
    echo "git config --global user.name \"Your Name\""
    echo "git config --global user.email \"your@email.com\""
    echo ""
    exit 1
fi

echo ""
echo "========================================"
echo "  ✓ SUCCESS! Code uploaded!"
echo "========================================"
echo ""
echo "Repository: https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS"
echo "Actions:    https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS/actions"
echo ""
echo "Check GitHub Actions for automatic deployment!"
echo ""
