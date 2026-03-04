# cPanel Deployment Guide for MF-Intel CMS

## Complete Step-by-Step Deployment Instructions

---

## Prerequisites

✅ cPanel hosting account with file manager access  
✅ Node.js installed on your local computer  
✅ Access to your domain (e.g., GamingIq.net)  
✅ Supabase backend already deployed (Edge Functions)

---

## Step 1: Build the Application Locally

### 1.1 Open Terminal/Command Prompt
Navigate to your project folder:
```bash
cd /path/to/mf-intel-cms
```

### 1.2 Install Dependencies (if not already installed)
```bash
npm install
```

### 1.3 Build for Production
```bash
npm run build
```

**What happens:** This creates a `dist/` folder with optimized production files. The `.htaccess` file is automatically included from the `public/` folder.

**Expected output:**
```
✓ built in 15s
dist/index.html                   X.XX kB
dist/.htaccess                    X.XX kB  ← Automatically included!
dist/assets/index-XXXXX.js       XXX.XX kB
dist/assets/index-XXXXX.css       XX.XX kB
```

---

## Step 2: Verify Build Output

### 2.1 Check dist/ Folder Contents
Your `dist/` folder should automatically contain:
```
dist/
├── .htaccess          ✅ (automatically copied from public/ folder)
├── index.html
└── assets/
    ├── index-[hash].js
    ├── index-[hash].css
    └── (other asset files)
```

**Note:** You don't need to manually create .htaccess anymore - it's automatically included in the build! 🎉

---

## Step 3: Upload to cPanel

### Option A: Using cPanel File Manager (Recommended for beginners)

#### 3.1 Login to cPanel
- Go to your hosting provider's cPanel login page
- Enter your username and password

#### 3.2 Open File Manager
- Find and click **"File Manager"** in cPanel
- Navigate to `public_html/` (or your domain's root directory)

#### 3.3 Create Casino Directory
- Click **"+ Folder"** button
- Name it: `Casino`
- Click **"Create New Folder"**

#### 3.4 Upload Files
1. **Enter the Casino folder** by double-clicking it
2. Click **"Upload"** button at the top
3. Click **"Select File"** or drag files from your `dist/` folder
4. **Upload ALL files from dist/**:
   - index.html
   - .htaccess
   - assets/ folder (all contents)

**Alternative - Upload as ZIP:**
1. On your computer, ZIP the entire `dist/` folder contents
2. Upload the ZIP file to `/public_html/Casino/`
3. Right-click the ZIP file in File Manager
4. Select **"Extract"**
5. Delete the ZIP file after extraction

#### 3.5 Set Permissions
- Right-click on the `Casino` folder
- Click **"Change Permissions"**
- Set to **755** (Read, Write, Execute for owner; Read, Execute for others)
- Check **"Recurse into subdirectories"**
- Click **"Change Permissions"**

---

### Option B: Using FTP/SFTP (For advanced users)

#### 3.1 Connect with FTP Client
Use FileZilla, Cyberduck, or any FTP client:
- **Host:** ftp.yourdomain.com (or IP address)
- **Username:** Your cPanel username
- **Password:** Your cPanel password
- **Port:** 21 (FTP) or 22 (SFTP)

#### 3.2 Navigate to Directory
- Go to `/public_html/`
- Create folder named `Casino`

#### 3.3 Upload Files
- Select ALL files in your local `dist/` folder
- Drag and drop to `/public_html/Casino/`
- Wait for upload to complete

---

## Step 4: Verify .htaccess is Working

### 4.1 Check File Visibility
**Important:** By default, `.htaccess` files are hidden in cPanel.

To view hidden files:
1. In File Manager, click **"Settings"** (top right)
2. Check ✅ **"Show Hidden Files (dotfiles)"**
3. Click **"Save"**
4. Verify `.htaccess` is now visible in `/public_html/Casino/`

### 4.2 Verify .htaccess Content
- Click on `.htaccess` file
- Click **"Edit"**
- Verify the content matches what you created in Step 2.1
- If it's missing, create it using **"+ File"** button

---

## Step 5: Test Your Deployment

### 5.1 Access Your Application
Open your browser and go to:
```
https://gamingiq.net/Casino
```
or
```
http://gamingiq.net/Casino
```

### 5.2 Test Navigation
1. **Login** with default credentials (admin/admin123)
2. Click through different tabs (Players, Ratings, Reports, etc.)
3. **Refresh the page** on any tab - it should stay on that page (not 404)
4. Check browser console (F12) for errors

### 5.3 Test Property Management
1. Go to **Setup** tab
2. Scroll to **Property Management** section
3. Try adding a new property
4. Logout and verify property selector appears

---

## Step 6: Configure SSL (HTTPS) - Recommended

### 6.1 Install SSL Certificate
1. In cPanel, find **"SSL/TLS Status"** or **"Let's Encrypt"**
2. Select your domain
3. Click **"Install SSL Certificate"**
4. Wait for installation to complete

### 6.2 Force HTTPS (Optional)
Add this to the TOP of your `.htaccess` file:
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## Troubleshooting Common Issues

### Issue 1: 404 Error on Page Refresh
**Cause:** `.htaccess` file is missing or incorrect  
**Fix:**
1. Verify `.htaccess` exists in `/public_html/Casino/`
2. Check "Show Hidden Files" is enabled
3. Verify RewriteBase matches your path: `/Casino/`
4. Contact hosting support to ensure `mod_rewrite` is enabled

### Issue 2: "500 Internal Server Error"
**Cause:** Syntax error in `.htaccess`  
**Fix:**
1. Delete `.htaccess` temporarily to see if site loads
2. Re-create `.htaccess` with correct syntax (copy from Step 2.1)
3. Check hosting error logs in cPanel → **"Errors"**

### Issue 3: Blank White Screen
**Cause:** JavaScript not loading or wrong base path  
**Fix:**
1. Press F12 → Console tab - check for errors
2. Check Network tab - verify files are loading from correct path
3. Verify `basename` in `/src/app/routes.ts` is set correctly
4. Rebuild with correct path and re-upload

### Issue 4: Assets Not Loading (CSS/JS)
**Cause:** Incorrect file paths  
**Fix:**
1. Check Network tab (F12) - look for 404 errors
2. Verify `assets/` folder uploaded correctly
3. Check file permissions (should be 644 for files, 755 for folders)

### Issue 5: API Calls Failing
**Cause:** Supabase backend not responding  
**Fix:**
1. Check browser console for CORS errors
2. Verify Supabase Edge Function is deployed
3. Test API endpoint manually: Open diagnostic-test.html
4. Check Supabase Dashboard → Edge Functions → Logs

### Issue 6: Property Management Not Visible
**Cause:** Old cached version loaded  
**Fix:**
1. Hard refresh: **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
2. Clear browser cache completely
3. Try incognito/private browsing mode
4. Verify new files were uploaded (check timestamp in File Manager)

---

## Updating Your Application (Future Updates)

When you make changes and need to redeploy:

### Quick Update Process:
1. **Build locally:**
   ```bash
   npm run build
   ```

2. **In cPanel File Manager:**
   - Go to `/public_html/Casino/`
   - Delete old files (EXCEPT .htaccess if it exists)
   - Upload new files from `dist/`

3. **Force refresh on browser:**
   - Press **Ctrl + Shift + R**

### Alternative - Backup First:
1. In cPanel, select `/Casino/` folder
2. Click **"Compress"** → Create `Casino_backup_YYYY-MM-DD.zip`
3. Download backup
4. Then proceed with update

---

## Backend (Supabase) - Already Deployed

Your Supabase Edge Functions are automatically deployed and don't need manual updates via cPanel.

**Backend URL:**
```
https://wyfqvbzdawpimomfvlmh.supabase.co/functions/v1/make-server-68939c29/
```

To update backend:
1. Make changes to files in `/supabase/functions/server/`
2. Supabase auto-deploys Edge Functions
3. No manual action needed

---

## File Structure on Server

Your final cPanel directory structure should look like:
```
public_html/
└── Casino/
    ├── .htaccess
    ├── index.html
    └── assets/
        ├── index-[hash].js
        ├── index-[hash].css
        └── [other-assets]
```

---

## Performance Optimization Tips

### 1. Enable Gzip Compression (Already in .htaccess)
✅ Reduces file sizes by 70-80%

### 2. Enable Browser Caching (Already in .htaccess)
✅ Faster load times for returning visitors

### 3. Use CloudFlare (Optional)
- Free CDN service
- Add your domain to CloudFlare
- Point DNS to CloudFlare nameservers
- Enable caching and optimization

### 4. Monitor Performance
- Use Google PageSpeed Insights: https://pagespeed.web.dev/
- Test your site: `https://gamingiq.net/Casino`

---

## Security Checklist

✅ SSL/HTTPS enabled  
✅ Default admin password changed  
✅ .htaccess file protecting routes  
✅ Supabase environment variables secure (never exposed to frontend)  
✅ Only production build deployed (not source code)

---

## Getting Help

### Check Logs
1. **cPanel Error Logs:**
   - cPanel → **"Errors"** icon
   - Look for recent errors

2. **Browser Console:**
   - Press **F12** → Console tab
   - Look for red error messages

3. **Supabase Logs:**
   - Supabase Dashboard → Edge Functions → Logs
   - Check for API errors

### Contact Support
If issues persist, contact your hosting provider's support with:
- Your domain name
- Error message (screenshot)
- Steps you've already tried
- Ask them to verify `mod_rewrite` is enabled

---

## Quick Reference Commands

```bash
# Build application
npm run build

# Test locally before deploying
npm run preview
```

---

## Success Checklist

After deployment, verify:
- ✅ Site loads at https://gamingiq.net/Casino
- ✅ Can login successfully
- ✅ All tabs accessible (Dashboard, Players, Ratings, etc.)
- ✅ Page refresh doesn't cause 404 errors
- ✅ Property Management visible in Setup tab
- ✅ Can add/edit properties
- ✅ No console errors (F12 → Console)
- ✅ SSL certificate working (https://)

---

## Additional Resources

- **cPanel Documentation:** https://docs.cpanel.net/
- **React Router Deployment:** https://reactrouter.com/en/main/start/tutorial#deploying
- **Supabase Docs:** https://supabase.com/docs

---

**Need more help?** Share:
1. Your exact domain URL
2. Screenshot of File Manager showing your Casino folder
3. Any error messages from browser console (F12)
4. Your cPanel hosting provider name

Good luck with your deployment! 🚀