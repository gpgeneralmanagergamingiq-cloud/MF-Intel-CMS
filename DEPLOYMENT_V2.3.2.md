# 🚀 Deployment Instructions - v2.3.2 Update

## Overview
This guide provides instructions for deploying version 2.3.2 of the MF-Intel CMS application to the production server at https://app.mfintelcms.com/GrandPalace

## What's Changed in v2.3.2
- ✅ Removed all multi-property system components
- ✅ Hardcoded "Grand Palace Casino" throughout the application  
- ✅ Simplified URL structure to fixed /GrandPalace route
- ✅ Removed PropertyContext, PropertySelector, and PropertyManagement components
- ✅ Updated all 14 files that had dependencies on the old property system
- ✅ Improved performance by eliminating property switching overhead

## Pre-Deployment Checklist

### 1. Verify Local Build
Before deploying, ensure the application builds successfully:

```bash
npm run build
```

This should create a `dist` folder with the compiled application.

### 2. Test Locally
Run the application locally to verify all changes:

```bash
npm run preview
```

Then open http://localhost:4173/GrandPalace and verify:
- ✅ No "All Properties" dropdown appears anywhere
- ✅ Header shows "Grand Palace Casino" (not "All Properties")
- ✅ Dashboard displays correctly
- ✅ All navigation links work properly
- ✅ Version badge shows "v2.3.2 • Grand Palace Casino"

## Deployment Methods

### Option 1: FTP/SFTP Upload (Recommended for cPanel)

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Upload Files**
   - Connect to your hosting server via FTP/SFTP
   - Navigate to the web root directory (typically `public_html` or `www`)
   - Upload all contents from the `dist` folder to your web root
   - Ensure `.htaccess` file is uploaded if using Apache

3. **Verify .htaccess Configuration**
   
   Create or update `.htaccess` in your web root:
   
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     
     # Handle React Router routes
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   
   # Enable gzip compression
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
   </IfModule>
   
   # Browser caching
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType image/jpg "access plus 1 year"
     ExpiresByType image/jpeg "access plus 1 year"
     ExpiresByType image/gif "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
     ExpiresByType text/css "access plus 1 month"
     ExpiresByType application/javascript "access plus 1 month"
     ExpiresByType text/html "access plus 0 seconds"
   </IfModule>
   ```

4. **Clear Browser Cache**
   
   After deployment, users may need to clear their browser cache to see the new version:
   - Chrome/Edge: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E
   
   Or force refresh: Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)

### Option 2: Deploy via cPanel File Manager

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Compress the Build**
   - Compress the entire `dist` folder into a ZIP file
   - Name it something like `mf-intel-cms-v2.3.2.zip`

3. **Upload via cPanel**
   - Log into your cPanel account
   - Go to File Manager
   - Navigate to your web root directory (typically `public_html`)
   - Delete old files (except `.htaccess` if you have custom rules)
   - Upload the ZIP file
   - Extract the contents of the ZIP file
   - Move all files from the extracted `dist` folder to the web root
   - Delete the empty `dist` folder and ZIP file

4. **Verify Deployment**
   - Visit https://app.mfintelcms.com/GrandPalace
   - Check that the version badge shows "v2.3.2"
   - Verify no "All Properties" dropdown appears

### Option 3: Automated Deployment (Git + CI/CD)

If you have Git and CI/CD set up:

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "Update to v2.3.2 - Remove multi-property system"
   git push origin main
   ```

2. **Trigger Deployment**
   - Your CI/CD pipeline should automatically build and deploy
   - If using GitHub Actions, Vercel, or Netlify, the deployment will happen automatically

## Post-Deployment Verification

After deploying, perform these checks:

### 1. Visual Verification
- [ ] Visit https://app.mfintelcms.com/GrandPalace
- [ ] Login page appears correctly
- [ ] No "All Properties" dropdown in header
- [ ] Version badge shows "v2.3.2 • Grand Palace Casino"

### 2. Functional Testing
- [ ] Login with test credentials
- [ ] Navigate to Dashboard - should show "Grand Palace Casino"
- [ ] Check all navigation tabs (Players, Floats, Ratings, etc.)
- [ ] Verify data loads correctly
- [ ] Test creating a new player
- [ ] Test starting a rating session
- [ ] Verify float operations work

### 3. Browser Compatibility
Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers (Chrome mobile, Safari iOS)

## Troubleshooting

### Issue: "All Properties" still appears after deployment

**Solution:**
1. Clear browser cache completely (Ctrl+Shift+Delete)
2. Try in incognito/private browsing mode
3. Check that all files were uploaded correctly
4. Verify no old JavaScript files are cached on server

### Issue: Blank page or 404 errors

**Solution:**
1. Verify `.htaccess` file is present and configured correctly
2. Check that `index.html` is in the web root
3. Ensure all asset files (CSS, JS) are uploaded
4. Check browser console for errors (F12 → Console)

### Issue: Application loads but data is missing

**Solution:**
1. Check browser console for API errors
2. Verify Supabase connection is working
3. Ensure environment variables are set correctly
4. Check that users are logging in with correct property

### Issue: Routes not working (404 on refresh)

**Solution:**
1. Verify `.htaccess` mod_rewrite rules are active
2. Contact hosting provider to enable mod_rewrite
3. Ensure all React Router routes are properly configured

## Cache Busting

To force users' browsers to load the new version:

1. **Query String Method**
   Add version parameter to URL:
   ```
   https://app.mfintelcms.com/GrandPalace?v=2.3.2
   ```

2. **Clear Browser Cache Instructions**
   Send these instructions to all users:
   - Windows: Press Ctrl+Shift+Delete → Select "Cached images and files" → Clear
   - Mac: Press Cmd+Shift+Delete → Select "Cached images and files" → Clear
   - Quick refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

## Rollback Procedure

If issues occur after deployment:

1. **Keep a Backup**
   - Before deploying, download a backup of the current production files
   - Store them in a safe location

2. **Rollback Steps**
   - Delete new files from web root
   - Upload backed-up files
   - Clear server cache (if applicable)
   - Notify users to clear browser cache

## Notification to Users

After successful deployment, notify your users:

```
Subject: MF-Intel CMS Updated to v2.3.2

Dear Team,

We have successfully updated the MF-Intel CMS application to version 2.3.2.

What's New:
• Application is now dedicated exclusively to Grand Palace Casino
• Removed multi-property system for better performance
• Simplified user interface
• Faster loading times

Important:
Please clear your browser cache (Ctrl+Shift+Delete) or force refresh (Ctrl+F5) 
to ensure you're using the latest version.

Access the application at: https://app.mfintelcms.com/GrandPalace

If you experience any issues, please contact IT support immediately.

Best regards,
IT Team
```

## Support

For deployment assistance or issues:
- Check logs in browser console (F12 → Console)
- Review server error logs (if available)
- Contact hosting provider for server-specific issues
- Document any errors with screenshots

## Version Verification

After deployment, verify the version by:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for version information in console logs
4. Or check the version badge in the Dashboard

---

**Deployment Date:** March 3, 2026  
**Version:** 2.3.2  
**Status:** ✅ Ready for Production Deployment
