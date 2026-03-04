# How to Add .htaccess File - MANUAL STEPS

## The Issue:
Hidden files (starting with a dot like `.htaccess`) can't be created directly through the Figma Make interface.

## Solution - Follow These Steps:

### Step 1: Locate the htaccess.txt file
I've created a file called `htaccess.txt` in your `/public/` folder.

### Step 2A: **Rename it on your computer** (Easiest Method)

If you're working with the project on your computer:

1. **Open your project folder** in File Explorer (Windows) or Finder (Mac)
2. **Navigate to the `public/` folder**
3. **Find the file named:** `htaccess.txt`
4. **Rename it to:** `.htaccess`
   - Windows: Right-click → Rename → Type `.htaccess`
   - Mac: Right-click → Rename → Type `.htaccess`
5. **You might see a warning** about changing the file extension - click "Yes" or "Use ."

### Step 2B: **Alternative - Do it via Command Line** (Advanced)

If you're comfortable with terminal/command prompt:

**On Windows:**
```bash
cd /path/to/your/project/public
ren htaccess.txt .htaccess
```

**On Mac/Linux:**
```bash
cd /path/to/your/project/public
mv htaccess.txt .htaccess
```

### Step 3: Verify it worked

**On Windows:**
1. Open File Explorer
2. Click "View" tab → Check "Hidden items"
3. Go to your project's `public/` folder
4. You should see `.htaccess` file

**On Mac:**
1. Open Finder
2. Press `Cmd + Shift + .` (dot) to show hidden files
3. Go to your project's `public/` folder
4. You should see `.htaccess` file

### Step 4: Build your project
```bash
npm run build
```

### Step 5: Check the dist/ folder

**Show hidden files first:**
- Windows: View → Hidden items ✅
- Mac: Cmd + Shift + . (dot)

**Then check:** Your `dist/` folder should now contain:
```
dist/
├── .htaccess          ✅ Now it's here!
├── index.html
└── assets/
```

---

## Can't See .htaccess Even After Renaming?

### On Windows:
1. Open File Explorer
2. Click **View** tab at the top
3. Check the box: **☑ Hidden items**
4. Check the box: **☑ File name extensions**

### On Mac:
1. Open Finder
2. Press: **Cmd + Shift + . (period)**
3. Hidden files will now be visible (greyed out)

---

## Alternative Method: Create Directly in Dist Folder After Build

If the above doesn't work, you can create it directly in the `dist/` folder after building:

1. **Build your project:**
   ```bash
   npm run build
   ```

2. **Copy the content from `htaccess.txt`** (in the public folder)

3. **Create new file in `dist/` folder:**
   - Right-click in the `dist/` folder
   - New → Text Document (Windows) or New File (Mac)
   - Name it: `.htaccess` (with the dot at the beginning)
   - Paste the content you copied
   - Save

---

## Upload to cPanel

Once you have `.htaccess` in your `dist/` folder:

1. **ZIP the entire `dist/` folder contents** (not the folder itself, just the contents)
2. **Upload to cPanel** → `/public_html/Casino/`
3. **Extract the ZIP**
4. **Enable "Show Hidden Files"** in cPanel File Manager (Settings icon)
5. **Verify** `.htaccess` is there

---

## The Content of .htaccess File

If you need to manually create it, here's the complete content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /Casino/
  
  # Handle React Router - redirect all requests to index.html
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /Casino/index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching for better performance
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  # Prevent clickjacking
  Header always set X-Frame-Options "SAMEORIGIN"
  
  # Prevent MIME type sniffing
  Header always set X-Content-Type-Options "nosniff"
  
  # Enable XSS protection
  Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

## Quick Test

After you've renamed the file and built:

```bash
# Build
npm run build

# Check if .htaccess exists in dist (Windows)
dir dist /a

# Check if .htaccess exists in dist (Mac/Linux)
ls -la dist
```

You should see `.htaccess` in the list!

---

**Still having issues?** Let me know and I'll help you troubleshoot further!
