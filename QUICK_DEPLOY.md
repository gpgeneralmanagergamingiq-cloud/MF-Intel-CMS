# Quick Start Deployment Guide
## MF-Intel CMS for Gaming IQ - v2.3.0

---

## 🚀 5-Step Quick Deployment

### Step 1: Activate Supabase Backend (2 minutes)

**File 1: `/src/app/utils/api.ts`**
- Change line 6 from `const USE_LOCAL_STORAGE = true;` to `const USE_LOCAL_STORAGE = false;`

**File 2: `/src/app/components/Root.tsx`**
- Change line 14 from `const isDevelopmentMode = true;` to `const isDevelopmentMode = false;`

**Test:**
- Refresh the app
- Yellow "DEVELOPMENT MODE" banner should disappear
- Test creating a player to verify database works

---

### Step 2: Deploy to Vercel (3 minutes)

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Your URL will be: `https://your-app-name.vercel.app`

**Option B: Using Vercel Dashboard (No CLI)**

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New" → "Project"
4. Import your project
5. Click "Deploy"

Done! Your URL will be provided.

---

### Step 3: Configure Devices (10 minutes)

**All Devices:**
1. Open Chrome browser
2. Navigate to your Vercel URL
3. Bookmark the page
4. Login with appropriate account

**Device-Specific Setup:**

| Device | Login As | Default Tab | Special Setup |
|--------|----------|-------------|---------------|
| Cage PC 1 | Cashier | `/cage` | Connect Epson printer |
| Cage PC 2 | Cashier | `/cage` | Connect Epson printer |
| Admin PC 1 | Manager | `/` | - |
| Admin PC 2 | Super Manager | `/` | - |
| Tablets (Pit) | Inspector/Pit Boss | `/ratings` | Enable QR scanner |
| Android (Comps) | Waiter | `/comps` | Connect Premax printer |
| Host Laptop | Host | `/players` | Connect card printer |
| Phones (External) | Any | `/` | Works immediately! |

---

### Step 4: Setup Printers (15 minutes per printer)

**Epson TM-T20III (Cage PCs, Host, Pit Boss):**
1. Connect via USB
2. Install driver: https://epson.com/Support/Printers/Receipt-Printers/TM-T20III-Series/s/SPT_C31CH51001
3. Set as default printer (optional)
4. Test: Open Cage → Make test transaction → Print receipt

**Card Printer (Host Laptop):**
1. Connect via USB
2. Install manufacturer driver
3. Test: Players → Select player → Print QR Card

**Premax PM-RP 80 (Android Tablet):**
1. Turn on printer
2. Enable Bluetooth on tablet
3. Pair devices
4. Test: Comps → Make test sale → Print receipt

---

### Step 5: Create User Accounts (5 minutes)

1. Login as Super Manager
2. Go to Setup → Users
3. Create accounts:

| Username | User Type | Device |
|----------|-----------|--------|
| cashier1 | Cashier | Cage PC 1 |
| cashier2 | Cashier | Cage PC 2 |
| manager1 | Manager | Admin PC 1 |
| admin | Super Manager | Admin PC 2 |
| pitboss1 | Pit Boss | Tablets |
| inspector1 | Inspector | Tablets |
| inspector2 | Inspector | Tablets |
| host1 | Host | Host Laptop |
| waiter1 | Waiter | Android Tablets |
| waiter2 | Waiter | Android Tablets |

---

## ✅ Post-Deployment Checklist

- [ ] All devices can access the URL
- [ ] Yellow dev banner is gone
- [ ] Cage printers printing receipts
- [ ] Card printer working
- [ ] QR scanning works on tablets
- [ ] External phones can access
- [ ] All users can login
- [ ] Test transaction end-to-end
- [ ] Backup exported (Setup tab)

---

## 📱 Device Access URLs

**Bookmark these for quick access:**

- Dashboard: `https://your-app.vercel.app/`
- Players: `https://your-app.vercel.app/players`
- Floats: `https://your-app.vercel.app/floats`
- Ratings: `https://your-app.vercel.app/ratings`
- Cage: `https://your-app.vercel.app/cage`
- Comps: `https://your-app.vercel.app/comps`
- Reports: `https://your-app.vercel.app/reports`
- Setup: `https://your-app.vercel.app/setup`

---

## 🔧 Common Issues

**Issue: Devices can't connect**
- Solution: Verify internet connection, try different WiFi

**Issue: Printer not working**
- Solution: Check USB cable, reinstall drivers, check paper

**Issue: QR scanner not opening**
- Solution: Allow camera permissions in browser

**Issue: External phones can't access**
- Solution: Verify using HTTPS URL, not localhost

**Issue: Data not saving**
- Solution: Check console (F12) for errors, verify Supabase active

---

## 📞 Support

**Browser Console:**
- Press `F12` to open Developer Tools
- Check "Console" tab for errors
- Send screenshots for troubleshooting

**Network Info:**
- Local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Printer IP: Check printer settings menu

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ Cage staff can process transactions and print receipts
2. ✅ Pit Boss can start/end player ratings
3. ✅ Waiters can scan player QR codes and record comps
4. ✅ Admin can view reports from their PC
5. ✅ Managers can access from phones while away from casino
6. ✅ All printers working correctly
7. ✅ Data syncs across all devices in real-time

---

## 🌐 Your Production URL

After deployment, write your URL here:

```
https://_________________________.vercel.app
```

Share this URL with all staff members.

---

**Deployment Time Estimate: 30-45 minutes total**

**Next Steps After Deployment:**
1. Train staff on their devices
2. Import existing player data (Setup → Excel Import)
3. Set up regular backups (weekly)
4. Monitor Audit Log daily

---

**End of Quick Start Guide**
