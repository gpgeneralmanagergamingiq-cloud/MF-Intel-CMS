# 🎰 MF-Intel CMS - Quick Start
## Casino Management System for Gaming IQ

Get your casino system running in **3 steps**!

---

## ⚡ Super Quick Launch (Windows)

### First Time Setup

1. **Build the application:**
   ```bash
   npm install
   npm run build
   ```

2. **Double-click to launch:**
   - `build-and-launch.bat` - Builds and launches automatically
   - OR `launch-casino.bat` - Launches if already built

3. **Open browser to:** `http://localhost:8080`

4. **Login:**
   - Username: `admin`
   - Password: `admin123`

**🎉 Done! You're ready to go!**

---

## 📋 What You Get

### Core Features
- ✅ **Player Management** - Register and track players
- ✅ **Player Ratings** - Track gaming sessions with automatic calculations
- ✅ **Float Management** - Open/close table floats with chip tracking
- ✅ **Drop Tracking** - Record cash drops throughout the day
- ✅ **Reports** - Player activity, table performance, rebate summaries
- ✅ **Rebate System** - Tiered rebate on player losses with approval workflow
- ✅ **Multi-User System** - Admin, Manager, Pit Boss, and Dealer roles

---

## 🖥️ Default User Accounts

| Username | Password | Role | Access Level |
|----------|----------|------|-------------|
| admin | admin123 | Admin | Full access to everything |
| manager | manager123 | Manager | Approve rebates, view all reports |
| pitboss | pitboss123 | Pit Boss | Approve rebates, view reports |
| dealer | dealer123 | Dealer | Manage floats, ratings, players |

**⚠️ IMPORTANT:** Change these passwords before production use!

---

## 🎯 Daily Workflow

### Morning Setup (5 minutes)

1. **Launch System**
   - Double-click `build-and-launch.bat` (first time)
   - OR double-click `launch-casino.bat` (subsequent launches)
   - Wait for browser to open
   - Login with your account

2. **Open Tables**
   - Go to **Float** tab
   - Click **"Open New Float"**
   - Select table, dealer, chip amounts
   - Click **"Open Float"**

### During Operations

**Starting a Player Session:**
1. **Ratings** tab → **"Start Rating"**
2. Select player and table
3. Enter buy-in (cash/chips)
4. Click **"Start Rating"**

**Ending a Player Session:**
1. Find active rating in **Ratings** tab
2. Click **"End Rating"**
3. Enter cash-out amount and chips
4. Click **"Complete Rating"**

**Recording Drops:**
- Automatically tracked when players buy-in with cash
- Manual entry available in **Drop** tab

### End of Day (10 minutes)

1. **Close All Floats**
   - Go to **Float** tab
   - For each open table, click **"Close Float"**
   - Enter closing chip amounts

2. **Review Reports**
   - Check **Player Activity Report**
   - Review **Tables & Games Activity Report**
   - Approve any pending **Rebates** (Manager/Pit Boss)

3. **Backup Data** (Recommended)
   - Press F12 → Console
   - Run backup script (see below)
   - Save to file

4. **Shutdown**
   - Close browser
   - Close server terminal window

---

## 🔧 Common Tasks

### Add New Player

1. **Players** tab → **"Add New Player"**
2. Fill in details:
   - First/Last Name (required)
   - Phone Number (recommended)
   - Email (optional)
   - VIP Tier (Bronze/Silver/Gold/Platinum)
   - Favorite Game
3. Click **"Save Player"**

### Track Player Session

1. **Ratings** tab → **"Start Rating"**
2. Select player from dropdown
3. Select table
4. Enter buy-in details:
   - Buy-in type (Cash or Chips)
   - Amount
   - Currency
5. Enter average bet estimate
6. Click **"Start Rating"**
7. When done, click **"End Rating"**
8. Enter final cash-out and chips
9. Win/Loss calculated automatically!

### View Reports

**Player Activity Report:**
- Individual session details
- Playing time, bets, theoretical win
- Points and tickets earned
- Filter by player, date, table, game

**Tables & Games Activity Report:**
- Aggregated by table or game type
- By day, month, or year
- Theoretical vs actual performance
- Export to CSV

**Rebate Summary Report:**
- Pending rebates needing approval
- Expired rebates
- Approved rebates
- Filter and export

### Approve Rebates (Manager/Pit Boss Only)

1. **Reports** tab → **"Rebate Summary Report"**
2. Find rebate in "Pending Approval" section
3. Click **"Approve"** or **"Reject"**
4. Once approved, appears in "Approved" section
5. Player can redeem within 14 days

---

## 📊 Understanding the Rebate System

### How It Works

Players earn rebates based on their **losses** (not total bets):

| Loss Amount | Rebate % | Example |
|-------------|----------|---------|
| Under 500K FCFA | 0% | Loss: 400K → Rebate: 0 |
| 500K - 1M FCFA | 5% | Loss: 800K → Rebate: 40K |
| 1M - 10M FCFA | 10% | Loss: 5M → Rebate: 500K |
| Over 10M FCFA | 15% | Loss: 15M → Rebate: 2.25M |

### Rebate Lifecycle

1. **Player loses money** → Rating completed with negative W/L
2. **Rebate calculated** → Based on loss amount and tier
3. **Requires approval** → Manager or Pit Boss reviews
4. **14-day expiry** → Must be redeemed within 2 weeks
5. **Redeemable** → Player can claim rebate

### Approval Workflow

- Only **Manager** or **Pit Boss** can approve
- Review in **Reports** → **Rebate Summary Report**
- Check player history before approval
- Approved rebates are tracked and redeemable

---

## 🚨 Troubleshooting

### "No data in reports"
**Solution:** You need to complete at least one rating (not just start it, but end it too)

### "Can't login"
**Solution:** 
- Check username/password (case-sensitive)
- Default: admin/admin123
- Reset if needed (see DEPLOYMENT_GUIDE.md)

### "Application won't load"
**Solution:**
1. Check server terminal is running
2. Try `http://localhost:8080` in browser
3. Clear browser cache (Ctrl+F5)
4. Rebuild: `npm run build` then relaunch

### "Data disappeared"
**Solution:**
- Check you're using the same browser
- Not in incognito mode?
- Restore from backup (if you have one)
- Otherwise, data is lost (set up backups!)

---

## 📱 Mobile Access

### Make it Work on Tablets/Phones

**Option 1: Same Network**
1. Find your computer's IP address:
   ```bash
   ipconfig
   ```
   Look for IPv4 Address (e.g., 192.168.1.100)

2. On tablet/phone, open browser to:
   ```
   http://192.168.1.100:8080
   ```

**Option 2: Cloud Deploy**
- Deploy to Netlify/Vercel (see DEPLOYMENT_GUIDE.md)
- Access from anywhere with the cloud URL

---

## 💾 Data Backup (CRITICAL!)

Your data is stored in browser Local Storage. **Back it up regularly!**

### Quick Backup

1. Open browser console (F12)
2. Go to **Console** tab
3. Paste this code:

```javascript
// Backup all data
const backup = {
  users: localStorage.getItem('casino_users'),
  players: localStorage.getItem('casino_players'),
  ratings: localStorage.getItem('casino_ratings'),
  floats: localStorage.getItem('casino_floats'),
  drops: localStorage.getItem('casino_drops'),
  rebates: localStorage.getItem('casino_rebates'),
  date: new Date().toISOString()
};

// Copy this output
console.log(JSON.stringify(backup, null, 2));
```

4. Copy the output and save to a file: `backup-2026-02-28.json`

### Restore from Backup

1. Open browser console (F12)
2. Paste the backup JSON:

```javascript
const backup = {
  /* paste your backup here */
};

// Restore
Object.entries(backup).forEach(([key, value]) => {
  if (value && key !== 'date') {
    localStorage.setItem(key, value);
  }
});

// Refresh
location.reload();
```

---

## 🎓 Training Checklist

Before letting staff use the system:

- [ ] Show how to login
- [ ] Demonstrate opening a float
- [ ] Practice starting a rating
- [ ] Practice ending a rating
- [ ] Show how to search for players
- [ ] Review reports together
- [ ] Explain rebate approval (for managers)
- [ ] Practice closing a float
- [ ] Review backup procedure (for admin)

---

## 📞 Need More Help?

- **Detailed Deployment:** See `DEPLOYMENT_GUIDE.md`
- **Technical Issues:** Check browser console (F12 → Console)

---

## ✅ Pre-Launch Checklist

Before going live with staff:

- [ ] Application built successfully (`npm run build`)
- [ ] Can launch with `build-and-launch.bat` or `launch-casino.bat`
- [ ] Tested login with all user types
- [ ] Added at least one test player
- [ ] Completed at least one full rating cycle
- [ ] Verified reports show data
- [ ] Changed default passwords
- [ ] Created backup procedure schedule
- [ ] Trained staff on basic operations
- [ ] Documented table numbers and dealer names

---

## 🎉 You're Ready to Launch!

**Simplest possible launch:**

1. Double-click `build-and-launch.bat`
2. Wait for browser to open
3. Login: admin/admin123
4. Start using the system!

**Questions?** Check the `DEPLOYMENT_GUIDE.md` for comprehensive help.

---

**Good luck with your casino operations! 🎰🎲🃏**