# 🚨 FIXING 404 ERROR ON gamingiq.net/Casino

## Problem
When you access `gamingiq.net/Casino/` in production, you get **404 - Page Not Found**.

## Root Cause
The `.htaccess` file is **missing** or **not in the correct location** on your production server. Without it, Apache doesn't know how to handle React Router routes.

---

## ✅ SOLUTION: Upload .htaccess File

### Step 1: Build the App

On your local machine:

```bash
npm run build
```

or

```bash
pnpm build
```

This creates a `dist` folder with all production files.

### Step 2: Upload Files to cPanel

1. **Log in to cPanel** at your hosting provider
2. **Open File Manager**
3. **Navigate to** `public_html/Casino/` folder
4. **Upload ALL files** from your local `dist` folder to `Casino` folder
5. **CRITICAL:** Also upload the `.htaccess` file from your project root

### Step 3: Verify File Structure

Your server should look like this:

```
public_html/
└── Casino/
    ├── .htaccess           ← MUST BE HERE! (Hidden file)
    ├── index.html
    ├── assets/
    │   ├── index-abc123.js
    │   └── index-def456.css
    └── figma-assets/
        └── (images)
```

### Step 4: Check Hidden Files

**IMPORTANT:** `.htaccess` is a **hidden file** (starts with a dot).

In cPanel File Manager:
1. Click **Settings** (top right)
2. Check ✅ **Show Hidden Files (dotfiles)**
3. Click **Save**

Now you should see `.htaccess` in the file list.

### Step 5: Verify .htaccess Content

The `.htaccess` file should contain:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /Casino/
  
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  
  RewriteRule ^ index.html [L]
</IfModule>
```

### Step 6: Set File Permissions

Right-click `.htaccess` → **Change Permissions** → Set to **644**

---

## 🧪 Testing

After uploading:

1. Visit `gamingiq.net/Casino/` - Should load the app
2. Try navigating: `gamingiq.net/Casino/players` - Should work
3. Refresh on any page - Should NOT get 404
4. Click navigation links - Should work

---

## 🚨 Common Issues

### Issue 1: Still Getting 404

**Solution:**
- Verify `.htaccess` is in the `Casino` folder (not `public_html`)
- Check if mod_rewrite is enabled on your server
- Contact hosting support to enable mod_rewrite

### Issue 2: .htaccess Not Showing

**Solution:**
- Enable "Show Hidden Files" in File Manager settings
- File must be named exactly `.htaccess` (with the dot)
- No file extension (not `.htaccess.txt`)

### Issue 3: 500 Internal Server Error

**Solution:**
- Check `.htaccess` syntax - upload the one from this project
- Remove the Cross-Origin headers if they cause issues:
  ```apache
  # Comment out or remove these lines if causing 500 error:
  # Header always set Cross-Origin-Opener-Policy "same-origin"
  # Header always set Cross-Origin-Embedder-Policy "require-corp"
  ```

### Issue 4: Assets Not Loading

**Solution:**
- Verify `vite.config.ts` has: `base: '/Casino/'`
- Rebuild: `npm run build`
- Re-upload the entire `dist` folder

---

## 📋 Quick Checklist

- [ ] Built app with `npm run build`
- [ ] Uploaded all files from `dist` folder to `public_html/Casino/`
- [ ] Uploaded `.htaccess` file to `public_html/Casino/`
- [ ] Verified `.htaccess` exists (enabled "Show Hidden Files")
- [ ] Set `.htaccess` permissions to 644
- [ ] Tested app at `gamingiq.net/Casino/`
- [ ] Tested navigation and page refreshes
- [ ] Cleared browser cache if needed

---

## 🔧 Alternative: FTP Upload

If using FTP client (FileZilla, Cyberduck):

1. Connect to your server
2. Navigate to `public_html/Casino/`
3. Upload `dist` folder contents
4. **IMPORTANT:** Enable "Show hidden files" in FTP client settings
5. Upload `.htaccess` file
6. Verify it appears on server

---

## 📞 Need Help?

If still not working:

1. **Check Apache error logs** in cPanel
2. **Contact hosting support** and ask:
   - "Is mod_rewrite enabled?"
   - "Are .htaccess files allowed?"
   - "Can I use RewriteEngine?"
3. **Verify file permissions** (should be 644 for .htaccess)

---

## 🎯 Expected Result

After fixing:
- ✅ `gamingiq.net/Casino/` loads the app
- ✅ All navigation works
- ✅ Page refreshes don't cause 404
- ✅ Direct URL access works (e.g., `/Casino/players`)
- ✅ ACR122U reader works (if configured in keyboard mode)

---

## 📚 Files to Upload

From your project, these files must be on the server:

```
dist/                    → Upload to public_html/Casino/
├── index.html           ✓ Required
├── assets/              ✓ Required (all files)
├── figma-assets/        ✓ Required (all image files)
└── .htaccess            ✓ CRITICAL - From project root
```

**Note:** The `.htaccess` file is in your **project root**, not in the `dist` folder. You must upload it separately!
