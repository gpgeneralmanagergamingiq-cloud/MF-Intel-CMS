# 🎯 FIGMA MAKE TO CPANEL - QUICK START GUIDE

## Your Goal: Deploy to **https://gamingiq.net/Casino/**

---

## ✅ DONE - Configuration Updated!

Your app is now configured to work at `/Casino/` (capital C):
- ✅ `vite.config.ts` → base: `/Casino/`
- ✅ `.htaccess` file created in `/public/` folder
- ✅ Deployment guide updated

---

## 📦 STEP 1: Download/Export from Figma Make

You're currently viewing your project in Figma Make (web browser). You need to get the files to upload to cPanel.

### Look for one of these options in Figma Make:

**Option A: "Publish" Button** (Top-right corner)
1. Click **"Publish"** button
2. Look for:
   - **"Download build"** 
   - **"Export production files"**
   - **"Download dist folder"**
3. This will download a ZIP file with your compiled app

**Option B: "Export" or "Download" Button**
1. Check top-right menu for export options
2. Look for **"Export project"** or **"Download"**
3. Select to download the **production build** (not source code)

**Option C: Settings Menu (⚙️)**
1. Click the gear icon
2. Look for **"Download"** or **"Export"** options
3. Choose production/build version

---

## 🎯 What You Need to Download:

You need TWO things:

### 1. **The `dist` folder** (compiled app files)
   - This contains: `index.html`, `assets/` folder, etc.
   - This is what goes on your server

### 2. **The `.htaccess` file** (routing configuration)
   - Location: `/public/.htaccess` in your Figma Make project
   - Download this separately if needed
   - Content is shown below if you need to create it manually

---

## 📂 .htaccess File Contents

If you can't find or download the `.htaccess` file, create it manually in a text editor with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Set the base directory for the rewrite rules
  RewriteBase /Casino/
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html to allow React Router to handle routing
  RewriteRule ^ index.html [L]
</IfModule>

# Prevent directory browsing
Options -Indexes

# Set UTF-8 encoding
AddDefaultCharset UTF-8

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Set cache headers for static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>
```

Save this as: `.htaccess` (note the dot at the start!)

---

## 🚀 STEP 2: Upload to cPanel

Once you have the files on your computer:

1. **Log into cPanel** at: `https://gamingiq.net:2083`
2. **Open File Manager**
3. **Navigate to** `public_html/`
4. **Create folder called** `Casino` (capital C!)
5. **Enter the Casino folder**
6. **Upload `.htaccess` file FIRST**
7. **Upload all files from `dist/` folder**

**Detailed step-by-step instructions:** See `CPANEL_DEPLOYMENT_GUIDE.md`

---

## 🎯 Your Live URLs (After Upload)

- **Login**: https://gamingiq.net/Casino/
- **Dashboard**: https://gamingiq.net/Casino/dashboard
- **Floats**: https://gamingiq.net/Casino/floats
- **Ratings**: https://gamingiq.net/Casino/ratings
- **Players**: https://gamingiq.net/Casino/players
- **Reports**: https://gamingiq.net/Casino/reports

---

## ⚠️ IMPORTANT: Folder Name MUST BE "Casino" (Capital C)

The app is configured for `/Casino/` (capital C). If you use lowercase `/casino/`, it won't work!

---

## 🆘 CAN'T FIND DOWNLOAD BUTTON IN FIGMA MAKE?

### Try these locations:

1. **Top-right corner** → Publish / Export / Download buttons
2. **File menu** → Export / Download options  
3. **Settings icon (⚙️)** → Look for export options
4. **Share button** → Sometimes has download options
5. **Project menu (three dots)** → Export options

### Alternative: Copy Files Manually

If Figma Make doesn't have a download option:

1. You may need to **copy the entire project** to your local computer first
2. Then build it locally using:
   ```bash
   npm install
   npm run build
   ```
3. The `dist` folder will be created with all files

---

## 📞 Next Steps

1. **Download the files** from Figma Make (see options above)
2. **Follow the complete guide:** Open `CPANEL_DEPLOYMENT_GUIDE.md`
3. **Upload to cPanel** following the step-by-step instructions
4. **Test at:** https://gamingiq.net/Casino/

---

## ✅ Configuration Summary

Your app is **READY** for deployment with:

- ✅ Base path: `/Casino/`
- ✅ .htaccess configured
- ✅ React Router setup
- ✅ All features tested
- ✅ Multi-property support
- ✅ Role-based access control
- ✅ Complete float management
- ✅ Player rating system
- ✅ Analytics dashboard
- ✅ Game statistics calculator

**Just download and upload! 🚀**

---

## 🎰 Need Help?

1. Check Figma Make documentation for export options
2. Look at `CPANEL_DEPLOYMENT_GUIDE.md` for detailed upload instructions
3. Contact your hosting provider if you have cPanel access issues

**Your casino app is configured and ready to go live!** 🎯
