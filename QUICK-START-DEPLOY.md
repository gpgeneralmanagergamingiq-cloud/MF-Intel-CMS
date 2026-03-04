# 🚀 QUICK START - Automated Deployment

## ⚡ 3 Steps to Automated Deployment

### **Step 1: Create Config File (One-Time Setup)**

```bash
# Copy the example
copy deploy-config.bat.example deploy-config.bat

# Edit it with your real FTP credentials
notepad deploy-config.bat
```

**What to put in `deploy-config.bat`:**
```batch
set FTP_HOST=ftp.gamingiq.net
set FTP_USER=your-ftp-username-here
set FTP_PASS=your-ftp-password-here
set FTP_REMOTE_DIR=/public_html/Casino
```

---

### **Step 2: (Optional) Install WinSCP for Faster Uploads**

Download from: https://winscp.net/eng/download.php

**Skip this if you want to use PowerShell FTP** (works without installation)

---

### **Step 3: Deploy!**

```bash
cd C:\Users\conta\OneDrive\Desktop\CMS
deploy.bat
```

**Done!** 🎉

---

## 📋 Where to Get FTP Credentials

1. Login to **cPanel**: https://gamingiq.net:2083
2. Go to **"FTP Accounts"**
3. Either:
   - Use your main cPanel account credentials
   - OR create a new FTP account for deployments

**Typical values:**
- **Host:** `ftp.gamingiq.net` or `gamingiq.net`
- **User:** Your cPanel username or FTP account
- **Pass:** Your cPanel password or FTP password
- **Directory:** `/public_html/Casino`

---

## ✅ Test Your Config

Before running deploy.bat, test your FTP credentials:

1. Download **FileZilla** (free FTP client)
2. Connect with your credentials
3. Navigate to `/public_html/Casino`
4. If it works, your config is correct!

---

## 🎯 Deploy Command

After setup, every time you want to deploy:

```bash
deploy.bat
```

That's literally it! The script does everything else.

---

## 🆘 Quick Troubleshooting

**"deploy-config.bat not found"**
```bash
copy deploy-config.bat.example deploy-config.bat
```

**"Connection failed"**
- Check FTP host: try `ftp.gamingiq.net` or just `gamingiq.net`
- Verify username and password are correct
- Test in FileZilla first

**"WinSCP not found"**
- Install WinSCP from https://winscp.net
- OR just ignore it - PowerShell FTP will work

---

## 📊 What Happens When You Run deploy.bat

```
[1/5] Loading configuration...
[2/5] Cleaning old build...
[3/5] Building project...
[4/5] Uploading to cPanel via FTP...
[5/5] Deployment completed successfully!

Live URL: https://gamingiq.net/Casino
```

---

## 🎉 That's It!

You now have **one-command deployment**:

```bash
deploy.bat
```

No more:
- ❌ Manual cPanel login
- ❌ Deleting files one by one
- ❌ Dragging and dropping
- ❌ Waiting 10 minutes

Just:
- ✅ One command
- ✅ Automatic build
- ✅ Automatic upload
- ✅ 2 minutes total

---

**Ready to deploy? Run:**
```bash
deploy.bat
```
