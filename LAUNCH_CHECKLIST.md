# 🎯 Casino System Launch Checklist

Use this checklist to ensure your casino management system is ready for production use.

---

## ✅ PRE-LAUNCH CHECKLIST

### 1. System Setup

- [ ] **Node.js installed** (v16 or higher)
  ```bash
  node --version  # Should show v16.0.0 or higher
  ```

- [ ] **Dependencies installed**
  ```bash
  npm install
  ```

- [ ] **Application built successfully**
  ```bash
  npm run build
  # Check that dist/ folder was created
  ```

- [ ] **Launch scripts tested**
  - [ ] Windows: `build-and-launch.bat` works
  - [ ] Mac/Linux: `./launch-full-system.sh` works
  - [ ] Browser opens automatically to http://localhost:8080

---

### 2. NFC Hardware (If Using ACR122U)

- [ ] **ACR122U reader connected** via USB

- [ ] **Driver installed**
  - Windows: Check Device Manager → Smart card readers
  - Should show: "ACS ACR122 0" or similar

- [ ] **NFC Bridge dependencies installed**
  ```bash
  cd nfc-bridge
  npm install
  ```

- [ ] **NFC Bridge starts successfully**
  ```bash
  npm start
  # Should show: "✅ NFC Reader Detected"
  ```

- [ ] **Test card scanning**
  - [ ] Open Players → Add New Player
  - [ ] Click "Connect to NFC Bridge"
  - [ ] Place card on reader
  - [ ] Card number auto-fills

---

### 3. Security Configuration

- [ ] **Change default passwords**
  - [ ] Admin password changed from `admin123`
  - [ ] Manager password changed from `manager123`
  - [ ] Pit Boss password changed from `pitboss123`
  - [ ] Dealer password changed from `dealer123`

- [ ] **Test all user logins**
  - [ ] Admin can login
  - [ ] Manager can login
  - [ ] Pit Boss can login
  - [ ] Dealer can login

- [ ] **Verify role permissions**
  - [ ] Admin sees all tabs
  - [ ] Manager can approve rebates
  - [ ] Pit Boss can approve rebates
  - [ ] Dealer has appropriate access

---

### 4. Data Configuration

- [ ] **Table names configured**
  - Match your physical tables
  - Documented in a list for reference

- [ ] **Currency set correctly**
  - Default: FCFA
  - Change if needed

- [ ] **VIP tiers configured**
  - Bronze
  - Silver
  - Gold
  - Platinum

- [ ] **Game types match your casino**
  - Baccarat
  - Blackjack
  - Roulette
  - Poker
  - Texas Hold'em
  - Ultimate Texas Holdem
  - NIUNIU
  - Others as needed

---

### 5. Functional Testing

#### Players Module
- [ ] **Add new player** works
  - [ ] All fields save correctly
  - [ ] Search finds players
  - [ ] Edit player works
  - [ ] View player details works

#### Ratings Module
- [ ] **Start rating** works
  - [ ] Player selection works
  - [ ] Table selection works
  - [ ] Buy-in (Cash) records correctly
  - [ ] Buy-in (Chips) records correctly
  - [ ] Rating appears in Active list

- [ ] **Break functionality** works
  - [ ] Start Break works
  - [ ] End Break works
  - [ ] Break time calculated correctly

- [ ] **End rating** works
  - [ ] Cash-out amount saves
  - [ ] Win/Loss calculated correctly
  - [ ] Rebate calculated correctly
  - [ ] Rating moves to Completed
  - [ ] Drop recorded (if cash buy-in)

#### Float Module
- [ ] **Open float** works
  - [ ] Table selection
  - [ ] Dealer assignment
  - [ ] Chip amounts save
  - [ ] Total calculates correctly
  - [ ] Credit transaction created

- [ ] **Close float** works
  - [ ] Closing chips entered
  - [ ] Variance calculated
  - [ ] Float closed properly
  - [ ] Fill transaction created

#### Drop Module
- [ ] **Manual drop entry** works
  - [ ] Amount saves
  - [ ] Table/player tracked
  - [ ] Timestamp recorded

- [ ] **Automatic drop** from ratings
  - [ ] Cash buy-ins create drop entries

#### Reports Module
- [ ] **Player Activity Report** works
  - [ ] Shows completed ratings
  - [ ] Calculations correct (theoretical win, points, tickets)
  - [ ] Filters work (player, table, date, game)
  - [ ] Export to CSV works
  - [ ] Refresh button works

- [ ] **Tables & Games Activity Report** works
  - [ ] Shows aggregated data
  - [ ] By Game / By Table toggle works
  - [ ] Day / Month / Year toggle works
  - [ ] Filters work
  - [ ] Export to CSV works

- [ ] **Rebate Summary Report** works
  - [ ] Shows pending rebates
  - [ ] Approve/Reject works (Manager/Pit Boss only)
  - [ ] Expiry dates correct (14 days)
  - [ ] Filters work
  - [ ] Export to CSV works

---

### 6. Backup & Recovery

- [ ] **Backup procedure documented**
  - [ ] Staff knows how to backup
  - [ ] Backup location established
  - [ ] Backup schedule set (daily/weekly)

- [ ] **Test backup process**
  ```javascript
  // In browser console (F12)
  const backup = {
    users: localStorage.getItem('casino_users'),
    players: localStorage.getItem('casino_players'),
    ratings: localStorage.getItem('casino_ratings'),
    floats: localStorage.getItem('casino_floats'),
    drops: localStorage.getItem('casino_drops'),
    rebates: localStorage.getItem('casino_rebates'),
    date: new Date().toISOString()
  };
  console.log(JSON.stringify(backup, null, 2));
  ```

- [ ] **Test restore process**
  - [ ] Can restore from backup file
  - [ ] Data appears correctly after restore

---

### 7. Staff Training

#### All Staff
- [ ] **Login procedure** trained
  - [ ] Username/password
  - [ ] What to do if login fails

- [ ] **Basic navigation** trained
  - [ ] How to switch between tabs
  - [ ] How to use search
  - [ ] How to filter data

#### Dealers
- [ ] **Open/Close floats** trained
  - [ ] How to open a float
  - [ ] How to close a float
  - [ ] How to count chips
  - [ ] What to do with variance

- [ ] **Player ratings** trained
  - [ ] Start a rating
  - [ ] Manage breaks
  - [ ] End a rating
  - [ ] Enter cash-out accurately

- [ ] **Player management** trained
  - [ ] Register new players
  - [ ] Search for players
  - [ ] Use NFC scanner (if available)

#### Managers & Pit Boss
- [ ] **Approve rebates** trained
  - [ ] Review pending rebates
  - [ ] Approve appropriate rebates
  - [ ] Reject suspicious rebates

- [ ] **Review reports** trained
  - [ ] Daily activity review
  - [ ] Table performance analysis
  - [ ] Export reports for records

#### Admin
- [ ] **User management** trained
  - [ ] Create new users
  - [ ] Change passwords
  - [ ] Assign roles

- [ ] **Data backup** trained
  - [ ] How to backup
  - [ ] How to restore
  - [ ] Backup schedule

- [ ] **System maintenance** trained
  - [ ] Start/stop services
  - [ ] Basic troubleshooting
  - [ ] Who to contact for issues

---

### 8. Documentation

- [ ] **Quick reference cards** created
  - [ ] Login credentials (secure location)
  - [ ] Common procedures
  - [ ] Troubleshooting tips

- [ ] **Table configuration** documented
  - [ ] Table numbers/names
  - [ ] Game types
  - [ ] Table limits

- [ ] **Contact information** documented
  - [ ] IT support contact
  - [ ] System administrator
  - [ ] Emergency procedures

- [ ] **Staff have access to:**
  - [ ] QUICK_START.md
  - [ ] DEPLOYMENT_GUIDE.md
  - [ ] This checklist

---

### 9. Performance Testing

- [ ] **Test with realistic data volume**
  - [ ] 50+ players
  - [ ] 20+ active ratings
  - [ ] 100+ completed ratings
  - [ ] Multiple reports run simultaneously

- [ ] **Test on all target devices**
  - [ ] Desktop computers
  - [ ] Tablets (if used)
  - [ ] Phones (if used)

- [ ] **Network performance** (if network deployed)
  - [ ] Multiple users can access simultaneously
  - [ ] Response time acceptable
  - [ ] No connection issues

---

### 10. Go-Live Preparation

- [ ] **Soft launch date** set
  - [ ] 1-2 weeks of testing with limited staff

- [ ] **Full launch date** set
  - [ ] All staff trained
  - [ ] All issues resolved from soft launch

- [ ] **Rollback plan** prepared
  - [ ] Old system still accessible
  - [ ] Can switch back if needed

- [ ] **Support plan** prepared
  - [ ] On-site support for first week
  - [ ] Remote support contact established

---

## 🚀 LAUNCH DAY CHECKLIST

### Morning of Launch

- [ ] **System startup** (1 hour before opening)
  - [ ] NFC bridge started (if using)
  - [ ] Web application started
  - [ ] All services running normally

- [ ] **Verify connectivity**
  - [ ] All workstations can access
  - [ ] Login works on all devices
  - [ ] NFC scanners working (if using)

- [ ] **Open initial floats**
  - [ ] All tables opened with correct dealers
  - [ ] Chip counts verified
  - [ ] Floats recorded in system

- [ ] **Staff check-in**
  - [ ] All staff can login
  - [ ] Quick refresher on key procedures
  - [ ] Support contact info shared

### During First Day

- [ ] **Monitor for issues**
  - [ ] Staff comfortable with system
  - [ ] No technical problems
  - [ ] Performance acceptable

- [ ] **Track feedback**
  - [ ] What's working well
  - [ ] What's confusing
  - [ ] What needs improvement

- [ ] **Support available**
  - [ ] On-site or phone support
  - [ ] Quick response to questions
  - [ ] Document any issues

### End of First Day

- [ ] **Close all floats**
  - [ ] All dealers close properly
  - [ ] Variances reviewed
  - [ ] Issues documented

- [ ] **Review reports**
  - [ ] All data captured correctly
  - [ ] Reports generate properly
  - [ ] Numbers make sense

- [ ] **Backup data**
  - [ ] Full backup of day 1 data
  - [ ] Stored securely

- [ ] **Debrief meeting**
  - [ ] What went well
  - [ ] What needs attention
  - [ ] Plan for day 2

---

## 📋 FIRST WEEK MONITORING

### Daily Tasks

- [ ] **Morning startup check**
  - [ ] All services start normally
  - [ ] Previous day's data intact

- [ ] **Mid-day check**
  - [ ] System running smoothly
  - [ ] No performance issues
  - [ ] Staff comfortable

- [ ] **End-of-day backup**
  - [ ] Data backed up
  - [ ] Reports reviewed
  - [ ] Issues documented

### Weekly Review

- [ ] **Performance review**
  - [ ] System stability
  - [ ] User satisfaction
  - [ ] Issue frequency

- [ ] **Process improvements**
  - [ ] Identify workflow bottlenecks
  - [ ] Optimize procedures
  - [ ] Update training materials

- [ ] **Data integrity check**
  - [ ] Spot-check records
  - [ ] Verify calculations
  - [ ] Compare to old system (if applicable)

---

## ✅ SUCCESS CRITERIA

Your launch is successful when:

- [ ] All staff can complete their daily tasks independently
- [ ] No critical bugs or issues
- [ ] Reports match expected data
- [ ] Backup/restore process works
- [ ] Staff prefer new system over old system
- [ ] Management has confidence in data accuracy
- [ ] Customer service not impacted

---

## 🎉 POST-LAUNCH

After successful launch:

- [ ] **Document lessons learned**
- [ ] **Update training materials** based on feedback
- [ ] **Establish regular backup schedule**
- [ ] **Set up periodic data review**
- [ ] **Plan for future enhancements**
- [ ] **Celebrate success with team!** 🎊

---

## 📞 EMERGENCY CONTACTS

Document your emergency contacts:

**System Administrator:**
- Name: ___________________
- Phone: ___________________
- Email: ___________________

**IT Support:**
- Name: ___________________
- Phone: ___________________
- Email: ___________________

**Backup Admin (if primary unavailable):**
- Name: ___________________
- Phone: ___________________
- Email: ___________________

---

## 🔧 QUICK TROUBLESHOOTING

| Problem | Quick Fix |
|---------|-----------|
| App won't load | Restart server, clear browser cache |
| Can't login | Check caps lock, verify credentials |
| Reports empty | Complete a rating end-to-end |
| NFC not working | Restart bridge service |
| Data seems wrong | Check for duplicate entries |
| Slow performance | Clear browser cache, restart browser |

**For detailed troubleshooting, see:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

**Good luck with your launch! 🚀**

Print this checklist and check off items as you complete them. Keep it handy during your launch week for reference.
