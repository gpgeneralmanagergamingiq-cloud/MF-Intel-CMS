# 🚀 DEPLOYMENT INSTRUCTIONS - FCFA Currency Update (v2.1.0)

## ⚠️ IMPORTANT: Browser Caching Issue

Your code changes ARE correct in the source files, but browsers are loading OLD cached JavaScript files. This is why you still see "PHP" instead of "FCFA".

---

## 📋 STEP-BY-STEP DEPLOYMENT PROCESS

### **Step 1: Clean Build**

```bash
# Navigate to project directory
cd C:\Users\conta\OneDrive\Desktop\CMS

# Delete old build folder completely
rmdir /s /q dist

# Rebuild with latest changes
npm run build

# Verify build completed
dir dist
```

**✅ You should see:** `dist` folder with `index.html`, `assets` folder, and `.htaccess` file

---

### **Step 2: Verify Build Files Locally**

```bash
# Check .htaccess exists
dir dist /a

# Open dist/index.html in browser to verify
```

**✅ You should see:** `.htaccess` file listed

---

### **Step 3: Upload to cPanel**

#### Option A: Upload via cPanel File Manager (Recommended)

1. **Login to cPanel**
2. **Open File Manager**
3. **Navigate to:** `/public_html/Casino/`
4. **⚠️ CRITICAL: Delete ALL old files first:**
   - Select all files in Casino folder
   - Click "Delete"
   - Confirm deletion
5. **Upload new files:**
   - Click "Upload"
   - Drag the ENTIRE `dist` folder contents (not the dist folder itself)
   - OR create a ZIP of dist folder contents, upload, and extract
6. **Verify .htaccess is present:**
   - Click "Settings" (top right)
   - Check "Show Hidden Files"
   - Verify `.htaccess` exists in Casino folder

#### Option B: Upload via FTP

1. Connect to FTP server
2. Navigate to `/public_html/Casino/`
3. Delete all files
4. Upload all files from local `dist` folder
5. Ensure `.htaccess` is uploaded (might be hidden)

---

### **Step 4: Verify on Server**

1. Visit: `https://gamingiq.net/Casino/version-check.html`
2. You should see the version check page
3. Note the timestamp - should be TODAY

---

### **Step 5: Clear Browser Cache (MOST IMPORTANT!)**

Your browser has aggressively cached the old JavaScript files. You MUST clear it:

#### **Windows - Chrome/Edge:**

1. Press `Ctrl + Shift + Delete`
2. Time range: **All time**
3. Check: ✅ **Cached images and files**
4. Click: **Clear data**

#### **Windows - Firefox:**

1. Press `Ctrl + Shift + Delete`
2. Time range: **Everything**
3. Check: ✅ **Cache**
4. Click: **Clear Now**

#### **Mac - Chrome/Edge:**

1. Press `Cmd + Shift + Delete`
2. Time range: **All time**
3. Check: ✅ **Cached images and files**
4. Click: **Clear data**

#### **Mac - Safari:**

1. Press `Cmd + Option + E` (Clear cache)
2. OR: Safari menu → Preferences → Advanced → Show Develop menu
3. Develop menu → Empty Caches

---

### **Step 6: Hard Refresh**

After clearing cache, do a hard refresh:

- **Windows:** `Ctrl + F5` or `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

---

### **Step 7: Test in Incognito/Private Mode**

1. Open new **Incognito** window (Chrome/Edge) or **Private** window (Firefox/Safari)
2. Visit: `https://gamingiq.net/Casino`
3. Check if currency shows **"FCFA"**

**If it works in Incognito but not in regular browser = Cache issue confirmed**

---

## ✅ EXPECTED RESULTS AFTER FIX

### **Summary Cards Should Show:**
- ✅ **Opening Float: FCFA 0** (not "PHP 0")
- ✅ **Total Fills: +FCFA 0** (not "+PHP 0")
- ✅ **Total Credits: -FCFA 0** (not "-PHP 0")
- ✅ **Current Float: FCFA 0** (not "PHP 0")

### **Console Log Should Show:**
- Open browser DevTools (F12)
- Check Console tab
- Should see: `🎰 Casino CMS v2.1.0 - FCFA Currency - Build: [timestamp]`

### **No JavaScript Errors:**
- No errors in Console
- FloatForm opens without errors
- All functionality works

---

## 🔍 TROUBLESHOOTING

### **Issue: Still seeing "PHP" after all steps**

**Solution 1:** Try different browser
- If Chrome shows PHP but Firefox shows FCFA → Chrome cache issue
- Clear Chrome cache again OR use Chrome's DevTools method:
  1. Open DevTools (F12)
  2. Right-click the refresh button
  3. Select "Empty Cache and Hard Reload"

**Solution 2:** Check server files
- Login to cPanel File Manager
- Navigate to `/public_html/Casino/assets/`
- Check JavaScript files timestamp
- Should be TODAY's date
- If old dates → Files didn't upload correctly

**Solution 3:** Rename Casino folder temporarily
- In cPanel, rename `Casino` to `Casino_old`
- Create new `Casino` folder
- Upload fresh build files
- Test
- If it works, delete `Casino_old`

### **Issue: Getting 404 errors**

- Check if `.htaccess` file exists
- Check if files are in correct location (`/public_html/Casino/`)
- Verify file permissions (should be 644)

### **Issue: Blank white screen**

- Open DevTools Console (F12)
- Check for JavaScript errors
- Usually means files in wrong location or .htaccess missing

---

## 📊 BUILD CHANGELOG

### **v2.1.0 - FCFA Currency Update**
- ✅ Changed default currency from "PHP" to "FCFA"
- ✅ Fixed formatCurrency function safety checks
- ✅ Fixed FloatForm props (onClose → onCancel)
- ✅ Updated .htaccess to disable JS/CSS caching during development
- ✅ Added version logging for debugging
- ✅ Added cache-control meta tags

---

## 🎯 QUICK REFERENCE COMMANDS

```bash
# Clean and rebuild
rmdir /s /q dist && npm run build

# Check build output
dir dist /a

# Verify .htaccess
type dist\.htaccess
```

---

## 📞 SUPPORT

If issues persist after following ALL steps above:

1. Check browser console for errors (F12 → Console tab)
2. Verify server file timestamps in cPanel
3. Try accessing from different device/network
4. Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

---

**Last Updated:** February 28, 2026  
**Build Version:** 2.1.0  
**Changes:** FCFA Currency Implementation
