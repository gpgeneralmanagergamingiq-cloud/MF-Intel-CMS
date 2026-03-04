# 🚀 Automated Deployment Setup Guide

## ✅ What Was Created

I've created **automated deployment scripts** that will:
- ✅ Build your project automatically
- ✅ Upload to cPanel via FTP automatically
- ✅ Clean up old files
- ✅ Show progress and status
- ✅ One command: `deploy.bat`

---

## 📁 Files Created

1. **`deploy.bat`** - Main script (auto-detects best method)
2. **`deploy-to-cpanel.bat`** - PowerShell FTP deployment
3. **`deploy-winscp.bat`** - WinSCP deployment (faster)
4. **`deploy-ftp-upload.ps1`** - PowerShell FTP upload script
5. **`deploy-config.bat.example`** - Configuration template
6. **`.gitignore`** - Protects your credentials

---

## 🔧 Setup Instructions

### **Step 1: Create Your Configuration File**

1. **Copy the example file:**
   ```bash
   copy deploy-config.bat.example deploy-config.bat
   ```

2. **Edit `deploy-config.bat`** with your actual credentials:
   ```batch
   set FTP_HOST=ftp.gamingiq.net
   set FTP_USER=your-actual-username
   set FTP_PASS=your-actual-password
   set FTP_REMOTE_DIR=/public_html/Casino
   ```

3. **Get your FTP credentials from cPanel:**
   - Login to cPanel
   - Go to **"FTP Accounts"** section
   - Use the main account OR create a new FTP account
   - Note the **Host**, **Username**, and **Password**

---

### **Step 2: Choose Your Deployment Method**

You have **3 options**:

#### **Option A: Automatic (Recommended) - `deploy.bat`**
- Automatically uses WinSCP if installed, otherwise PowerShell
- Best all-around choice

```bash
deploy.bat
```

#### **Option B: WinSCP (Fastest & Most Reliable)**
- Requires WinSCP installed
- Download from: https://winscp.net/eng/download.php

```bash
deploy-winscp.bat
```

#### **Option C: PowerShell FTP (No Extra Software)**
- Works with just Windows PowerShell
- Slower but requires no installation

```bash
deploy-to-cpanel.bat
```

---

## 🚀 How to Deploy

### **After setup, deploying is ONE command:**

```bash
cd C:\Users\conta\OneDrive\Desktop\CMS
deploy.bat
```

**That's it!** The script will:
1. ✅ Clean old build
2. ✅ Build new version
3. ✅ Upload to cPanel
4. ✅ Show success message

---

## 📋 What Each Script Does

### **`deploy.bat`** (Smart Auto-Deploy)
```
1. Checks if WinSCP is installed
2. If YES → Uses deploy-winscp.bat (fast)
3. If NO → Uses deploy-to-cpanel.bat (PowerShell)
```

### **`deploy-winscp.bat`** (WinSCP Method)
```
1. Loads config from deploy-config.bat
2. Deletes old dist folder
3. Runs npm run build
4. Uploads via WinSCP (synchronize)
5. Shows success message
```

### **`deploy-to-cpanel.bat`** (PowerShell Method)
```
1. Loads config from deploy-config.bat
2. Deletes old dist folder
3. Runs npm run build
4. Calls deploy-ftp-upload.ps1
5. Uploads via PowerShell FTP
6. Shows success message
```

---

## 🔐 Security Notes

### **Your `deploy-config.bat` file contains passwords!**

✅ **Protected by `.gitignore`**
- The file will NOT be committed to Git
- Your passwords stay on your local computer only

❌ **Never share or commit:**
- `deploy-config.bat`
- Any file with passwords

✅ **Safe to share:**
- `deploy-config.bat.example` (template only)
- All other deployment scripts

---

## 🛠️ Troubleshooting

### **Error: "deploy-config.bat not found"**
**Solution:**
```bash
copy deploy-config.bat.example deploy-config.bat
# Then edit with your credentials
```

---

### **Error: "Connection failed" or "Login failed"**
**Possible causes:**
1. Wrong FTP hostname
2. Wrong username/password
3. Firewall blocking port 21

**Solution:**
1. Check your cPanel FTP settings
2. Try different FTP host formats:
   - `ftp.gamingiq.net`
   - `gamingiq.net`
   - Your server IP address

3. Verify credentials by testing in FileZilla first

---

### **Error: "WinSCP not found"**
**Solutions:**

**Option 1:** Install WinSCP
- Download: https://winscp.net/eng/download.php
- Install to default location
- Run `deploy-winscp.bat` again

**Option 2:** Use PowerShell instead
```bash
deploy-to-cpanel.bat
```

---

### **Slow Upload with PowerShell**
**Solution:** Install WinSCP for 5-10x faster uploads

WinSCP uses more efficient protocols and parallel uploads.

---

## ✅ First-Time Setup Checklist

- [ ] Copy `deploy-config.bat.example` to `deploy-config.bat`
- [ ] Edit `deploy-config.bat` with real FTP credentials
- [ ] Test FTP connection in FileZilla (optional but recommended)
- [ ] Run `deploy.bat` for first deployment
- [ ] Visit https://gamingiq.net/Casino to verify
- [ ] Press `Ctrl+Shift+R` to clear cache
- [ ] Check console shows v2.1.2

---

## 🎯 Quick Reference

### **Deploy to Production:**
```bash
deploy.bat
```

### **Build Only (no upload):**
```bash
npm run build
```

### **Test FTP Connection:**
- Use FileZilla or WinSCP to test credentials first
- Host: `ftp.gamingiq.net`
- User: (your FTP username)
- Password: (your FTP password)
- Port: 21

---

## 📊 Comparison: Methods

| Method | Speed | Reliability | Requirements |
|--------|-------|-------------|--------------|
| **WinSCP** | ⚡⚡⚡ Fast | ✅✅✅ Best | WinSCP installed |
| **PowerShell** | ⚡ Slower | ✅✅ Good | Windows only |
| **Manual cPanel** | 🐌 Slowest | ✅ Manual | Web browser |

---

## 🔄 Typical Workflow

### **Before (Manual - 10 minutes):**
```
1. Open command prompt
2. cd to project
3. rmdir /s /q dist
4. npm run build
5. Login to cPanel
6. Navigate to /public_html/Casino
7. Delete old files manually
8. Upload new files (wait 5-10 min)
9. Clear browser cache
```

### **After (Automated - 2 minutes):**
```
1. deploy.bat
2. Wait for "SUCCESS!"
3. Press Ctrl+Shift+R
```

**Time saved: 8 minutes per deployment!** ⏱️

---

## 📞 Need Help?

### **Where to Get FTP Credentials:**

1. **Login to cPanel:** https://gamingiq.net:2083
2. **Find "FTP Accounts" section**
3. **Option A:** Use main account
   - Username: (your cPanel username)
   - Password: (your cPanel password)
   - Host: `ftp.gamingiq.net`

4. **Option B:** Create new FTP account
   - Click "Add FTP Account"
   - Username: `casino-deploy`
   - Directory: `/public_html/Casino`
   - Password: (create strong password)
   - Host: `ftp.gamingiq.net`

---

## 🎉 You're All Set!

Once configured, deployment is as simple as:

```bash
deploy.bat
```

**Sit back and watch it deploy automatically!** ☕

---

**Next Steps:**
1. Create `deploy-config.bat` with your credentials
2. Run `deploy.bat`
3. Enjoy automated deployments!

---

**Version:** 1.0  
**Created:** February 28, 2026  
**For:** Casino CMS v2.1.2
