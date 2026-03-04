# 🚀 Deployment Steps - MF-Intel CMS

## Quick Reference Guide for Deployment

---

## 🎯 Pre-Deployment Checklist

Before deploying:

- [ ] All test data cleared (see CLEAR_DATA.md)
- [ ] Application tested and working
- [ ] Default passwords documented for changing
- [ ] Backup procedure established
- [ ] Staff training completed

---

## 📦 Deployment Options

We set up **THREE deployment methods** for your system:

---

## Option 1: Local Computer Deployment (Simplest)

**Best for:** Single computer, office use, no network access needed

### Windows:

```bash
# One-click build and launch:
build-and-launch.bat

# Or if already built:
launch-casino.bat
```

### Mac/Linux:

```bash
# Make executable (first time only):
chmod +x launch-casino.sh

# Build:
npm install
npm run build

# Launch:
./launch-casino.sh
```

### Access:
- URL: `http://localhost:8080`
- Only accessible on the computer running it

### When to Use:
✅ Quick setup
✅ Testing
✅ Single workstation
✅ No network needed

---

## Option 2: Local Network Deployment

**Best for:** Multiple devices, tablets, phones on same WiFi

### Steps:

1. **Build the application:**
   ```bash
   npm install
   npm run build
   ```

2. **Find your computer's IP address:**
   
   **Windows:**
   ```bash
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.100)
   ```
   
   **Mac:**
   ```bash
   ifconfig | grep "inet "
   # Look for 192.168.x.x address
   ```
   
   **Linux:**
   ```bash
   hostname -I
   # Or: ifconfig
   ```

3. **Start the server:**
   ```bash
   # Windows:
   launch-casino.bat
   
   # Mac/Linux:
   ./launch-casino.sh
   ```

4. **Access from other devices:**
   ```
   http://[YOUR_IP]:8080
   
   Example: http://192.168.1.100:8080
   ```

### Access From:
- ✅ Desktop computers on network
- ✅ Tablets on WiFi
- ✅ Phones on WiFi
- ✅ Any device on same network

### Requirements:
- Host computer must stay on and running
- All devices on same network/WiFi
- Firewall may need to allow port 8080

### When to Use:
✅ Casino floor with multiple tablets
✅ Multiple pit bosses accessing system
✅ Office network with several computers
✅ Don't want internet access

---

## Option 3: Cloud Deployment (Internet Access)

**Best for:** Access from anywhere, multiple properties, remote management

### Recommended Platforms:

#### A) Netlify (Easiest)

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Sign up:** https://netlify.com (free account)

3. **Deploy:**
   - Drag and drop `dist/` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

4. **Access:**
   - Get URL like: `https://mf-intel-cms.netlify.app`
   - Accessible from anywhere

**Pros:**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy updates
- ✅ Custom domain support

#### B) Vercel

1. **Build:**
   ```bash
   npm run build
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

**Pros:**
- ✅ Similar to Netlify
- ✅ Great performance
- ✅ Free tier

#### C) GitHub Pages

1. **Push to GitHub**
2. **Enable GitHub Pages** in repo settings
3. **Set build folder** to `dist/`

**Pros:**
- ✅ Free with GitHub account
- ✅ Version control included

### When to Use:
✅ Multiple casino properties
✅ Remote management
✅ Access from home
✅ Mobile access anywhere
✅ Cloud backup

---

## 🔧 Our Standard Deployment Setup

### What We Built:

1. **Simple Launch Scripts:**
   - `build-and-launch.bat` - Windows all-in-one
   - `launch-casino.bat` - Windows launcher
   - `launch-casino.sh` - Mac/Linux launcher

2. **Production Build:**
   ```bash
   npm run build
   # Creates optimized files in dist/ folder
   ```

3. **Built-in Web Server:**
   - Uses `serve` package
   - Serves on port 8080
   - Production-ready

---

## 📝 Step-by-Step Deployment Process

### For First-Time Deployment:

1. **Prepare Application:**
   ```bash
   # Install dependencies
   npm install
   
   # Build for production
   npm run build
   ```

2. **Clear Test Data:**
   - Follow instructions in `CLEAR_DATA.md`
   - Or keep test data for demonstration

3. **Test Build Locally:**
   ```bash
   # Windows
   launch-casino.bat
   
   # Mac/Linux
   ./launch-casino.sh
   ```

4. **Verify Everything Works:**
   - Open http://localhost:8080
   - Test login
   - Check all tabs load
   - Verify no errors in console (F12)

5. **Choose Deployment Method:**
   - **Local only?** → Stop here, use launch scripts
   - **Network access?** → Follow Option 2 above
   - **Internet access?** → Follow Option 3 above

6. **Change Default Passwords:**
   - CRITICAL: Do this before production!
   - Login as each default user
   - Go to Setup → Users
   - Change passwords

7. **Create User Accounts:**
   - Setup → Users tab
   - Add accounts for staff
   - Assign proper roles

8. **Configure Properties:**
   - Setup → Properties tab
   - Add your casino properties
   - Set default property

9. **Document & Train:**
   - Give staff their login credentials
   - Train on basic operations
   - Establish backup schedule

---

## 🔄 Updating/Redeploying

### After Making Changes:

1. **Rebuild:**
   ```bash
   npm run build
   ```

2. **Test Locally:**
   ```bash
   launch-casino.bat  # or launch-casino.sh
   ```

3. **Redeploy:**
   - **Local:** Nothing to do, just rebuild
   - **Network:** Restart server with new build
   - **Cloud:** Upload new `dist/` folder or run deploy command again

---

## 🌐 Network Security Tips

### For Network/Cloud Deployment:

1. **Change ALL Default Passwords**
2. **Use HTTPS** (automatic with Netlify/Vercel)
3. **Limit Access:**
   - Network: Use VPN or restrict to known IPs
   - Cloud: Implement authentication
4. **Regular Backups:**
   - Weekly minimum
   - Export important data
   - Store securely
5. **Monitor Access:**
   - Review user activity
   - Check for unusual logins

---

## 📊 Current System Architecture

```
MF-Intel CMS/
│
├── Frontend (React + Vite)
│   ├── Built to: dist/
│   ├── Served by: serve package
│   ├── Port: 8080
│   └── Storage: Browser localStorage
│
├── No Backend Required
│   └── All data stored client-side
│
└── Deployment Options
    ├── Local: launch-casino.bat/sh
    ├── Network: IP:8080 access
    └── Cloud: Netlify/Vercel/GitHub Pages
```

---

## ⚡ Quick Commands Reference

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Launch production (after build)
launch-casino.bat        # Windows
./launch-casino.sh       # Mac/Linux

# All-in-one (build + launch)
build-and-launch.bat     # Windows only
```

---

## 🆘 Troubleshooting Deployment

### "Port 8080 already in use"

**Solution:**
```bash
# Windows: Find and kill process
netstat -ano | findstr :8080
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:8080 | xargs kill -9
```

### "Cannot access from other devices"

**Check:**
1. Firewall allows port 8080
2. Using correct IP address (not localhost)
3. Both devices on same network
4. Server is actually running

### "Application won't load"

**Solutions:**
1. Clear browser cache (Ctrl+F5)
2. Check console for errors (F12)
3. Verify dist/ folder exists and has files
4. Rebuild: `npm run build`

### "Data not persisting"

**Issue:** Browser localStorage being cleared

**Solutions:**
- Don't use incognito/private mode
- Check browser settings allow localStorage
- Don't clear browser data

---

## 📞 Deployment Support

### Useful Resources:

- **Netlify Docs:** https://docs.netlify.com
- **Vercel Docs:** https://vercel.com/docs
- **Serve Package:** https://www.npmjs.com/package/serve

### Files to Reference:

- `README.md` - Complete system overview
- `QUICK_START.md` - Fast setup guide
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `CLEAR_DATA.md` - How to clear test data

---

## ✅ Post-Deployment Checklist

After deploying:

- [ ] Application accessible from intended devices
- [ ] All default passwords changed
- [ ] User accounts created for staff
- [ ] Properties configured
- [ ] Test player created
- [ ] Test rating completed
- [ ] Reports display correctly
- [ ] Backup procedure established
- [ ] Staff trained on system
- [ ] Login credentials distributed

---

## 🎉 You're Ready!

Your MF-Intel CMS is now deployed and ready for production use!

### What You Have:

✅ Production-ready build
✅ Simple launch scripts
✅ Multiple deployment options
✅ Clean system (no test data)
✅ Complete documentation

### Choose Your Path:

- **Quick & Local:** Just run `launch-casino.bat`
- **Network Access:** Use your IP address
- **Cloud/Internet:** Deploy to Netlify

---

**🎰 Good luck with your casino operations! 🎲**
