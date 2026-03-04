# GO LIVE CHECKLIST
## MF-Intel CMS for Gaming IQ - v2.3.0

---

## 🚨 CRITICAL: Make These Changes Before Deployment

---

## Step 1: Activate Supabase Backend

### File 1: `/src/app/utils/api.ts`

**Current (Line 6):**
```javascript
const USE_LOCAL_STORAGE = true;
```

**Change to:**
```javascript
const USE_LOCAL_STORAGE = false;
```

---

### File 2: `/src/app/components/Root.tsx`

**Current (Line 14):**
```javascript
const isDevelopmentMode = true;
```

**Change to:**
```javascript
const isDevelopmentMode = false;
```

---

## Step 2: Verify Supabase Connection

After making changes above:

1. **Save both files**
2. **Refresh the application**
3. **Verify changes:**
   - Yellow "DEVELOPMENT MODE" banner should be GONE
   - Top-right should NOT show "Using localStorage"

4. **Test database connection:**
   - Go to Players tab
   - Try to create a test player
   - If successful → Supabase is working! ✅
   - If error → Check console (F12) for errors

---

## Step 3: Build for Production

### Option A: Using Terminal

```bash
# Build the application
npm run build

# This creates /dist folder with optimized files
```

### Option B: Using Vercel CLI (Recommended)

```bash
# Install Vercel globally (one-time)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**Your production URL will be displayed:**
```
https://your-app-name.vercel.app
```

**✅ Copy this URL - you'll need it for all devices!**

---

## Step 4: Initial Data Setup

### Create Default Users

Once deployed, access the app and create these accounts:

| Username | User Type | Password | Purpose |
|----------|-----------|----------|---------|
| admin | Super Manager | [Strong password] | Full access |
| manager1 | Manager | [Strong password] | Admin PC |
| cashier1 | Cashier | [Strong password] | Cage PC 1 |
| cashier2 | Cashier | [Strong password] | Cage PC 2 |
| pitboss1 | Pit Boss | [Strong password] | Floor operations |
| inspector1 | Inspector | [Strong password] | Table ratings |
| host1 | Host | [Strong password] | Player services |
| waiter1 | Waiter | [Strong password] | Comps/Sales |

**Steps:**
1. Login with Supabase credentials initially
2. Go to Setup → Users
3. Create each user account
4. Note passwords securely
5. Share credentials with staff

---

### Configure Properties (Multi-Property Setup)

If you have multiple casino locations:

1. Go to Setup → Properties (if available)
2. Add each property:
   - Property Name
   - Location
   - Settings

3. Assign users to properties

**Note:** If single property, skip this step.

---

### Configure Tables

1. Go to Setup → Tables
2. Add all your tables:
   - **Blackjack**: BJ-01, BJ-02, BJ-03, etc.
   - **Roulette**: RO-01, RO-02, etc.
   - **Poker**: PK-01, PK-02, etc.
   - **Baccarat**: BC-01, BC-02, etc.

**Recommendation:** Add 10-15 tables initially, more later as needed.

---

### Configure Menu Items (for Comps/Sales)

1. Go to Setup → Menu
2. Add items:

**Drinks:**
- Beer - CFA 5,000
- Wine - CFA 10,000
- Spirits - CFA 15,000
- Soft Drinks - CFA 2,000

**Cigarettes:**
- Pack - CFA 3,000
- Carton - CFA 30,000

**Food:**
- Appetizers - CFA 10,000
- Main Course - CFA 25,000
- Dessert - CFA 8,000

Adjust prices to your actual menu.

---

### Import Existing Players (Optional)

If you have existing player data:

1. Prepare Excel file with columns:
   - Member ID
   - Name
   - Email
   - Phone
   - Tier
   - Join Date

2. Go to Players → Import from Excel
3. Upload file
4. Verify import successful

---

## Step 5: Device Distribution

### Print Device Assignment Sheet

**Create labels for each device:**

---

**CAGE PC 1**
- URL: https://your-app.vercel.app/cage
- Username: cashier1
- Password: [Given separately]
- Printer: CagePrinter1 (Epson TM-T20III)

---

**CAGE PC 2**
- URL: https://your-app.vercel.app/cage
- Username: cashier2
- Password: [Given separately]
- Printer: CagePrinter2 (Epson TM-T20III)

---

**ADMIN PC 1**
- URL: https://your-app.vercel.app/
- Username: manager1
- Password: [Given separately]

---

**ADMIN PC 2**
- URL: https://your-app.vercel.app/
- Username: admin
- Password: [Given separately]

---

**TABLETS (Pit Boss/Inspector)**
- URL: https://your-app.vercel.app/ratings
- Username: pitboss1 / inspector1
- Password: [Given separately]
- Enable: Camera for QR scanning

---

**ANDROID TABLETS (Comps/Sales)**
- URL: https://your-app.vercel.app/comps
- Username: waiter1
- Password: [Given separately]
- Printer: Premax PM-RP 80 (Bluetooth)

---

**HOST LAPTOP**
- URL: https://your-app.vercel.app/players
- Username: host1
- Password: [Given separately]
- Printers: 
  - Epson TM-T20III (receipts)
  - Card Printer (QR cards)

---

**MOBILE PHONES (External)**
- URL: https://your-app.vercel.app/
- Username: [Individual accounts]
- Password: [Given separately]
- Access: View-only recommended

---

## Step 6: Training & Testing

### Phase 1: Cage Operations (Day 1)

**Test with Cashiers:**
1. Open/close floats
2. Process fills and credits
3. Print receipts
4. Verify vault transfers require approval

**Success Criteria:**
- [ ] Can open float
- [ ] Receipt prints correctly
- [ ] Vault transfer requires manager signature
- [ ] Data appears in Dashboard

---

### Phase 2: Player Ratings (Day 2)

**Test with Pit Boss/Inspectors:**
1. Scan player QR code or manual entry
2. Start rating session
3. Pause/resume session
4. End session and calculate win/loss
5. Print rating ticket

**Success Criteria:**
- [ ] QR scanner opens camera
- [ ] Can start/end ratings
- [ ] Data syncs to Dashboard
- [ ] Comps calculated automatically

---

### Phase 3: Comps & Sales (Day 3)

**Test with Waiters:**
1. Scan player QR code
2. Add comp items (drinks, cigarettes)
3. Process cash sales
4. Request VIP discounts
5. Print receipts

**Success Criteria:**
- [ ] QR scanner works
- [ ] Can add items
- [ ] Receipt prints on Premax
- [ ] Manager approval works for discounts

---

### Phase 4: Reports & Analytics (Day 4)

**Test with Managers:**
1. View Dashboard metrics
2. Generate daily reports
3. Export to Excel
4. Review Comps Report
5. Check Audit Log

**Success Criteria:**
- [ ] Dashboard shows accurate data
- [ ] Reports generate correctly
- [ ] Excel export works
- [ ] Audit log captures all actions

---

### Phase 5: Full Operations (Day 5)

**Live operation with all systems:**
- All devices active simultaneously
- Real transactions
- Multiple users logged in
- Print all receipt types
- Monitor for issues

**Success Criteria:**
- [ ] All devices online
- [ ] No data sync issues
- [ ] All printers working
- [ ] Staff comfortable with system

---

## Step 7: Go-Live Day

### Morning (Before Opening)

**8:00 AM - System Check:**
- [ ] All PCs powered on
- [ ] All tablets charged and connected
- [ ] All printers online with paper
- [ ] Internet connection stable
- [ ] All staff have login credentials

**8:30 AM - Staff Briefing:**
- [ ] Review system features
- [ ] Explain backup procedures
- [ ] Assign support contact
- [ ] Answer questions

**9:00 AM - Open Casino:**
- [ ] Cashiers open floats
- [ ] Tables marked as open
- [ ] System ready for players

---

### During Operations

**Continuous Monitoring:**
- [ ] Watch Dashboard for anomalies
- [ ] Check device connectivity
- [ ] Monitor printer status
- [ ] Be ready for tech support

**Backup Plan:**
- [ ] Paper forms ready if system down
- [ ] Phone numbers for tech support
- [ ] Backup internet (mobile hotspot)

---

### Evening (After Closing)

**End of Day:**
- [ ] Close all floats
- [ ] End all player sessions
- [ ] Generate daily report
- [ ] Export data backup
- [ ] Review Audit Log
- [ ] Document any issues

---

## Step 8: Post-Launch (Week 1)

### Daily Tasks

**Morning:**
- [ ] Verify all devices online
- [ ] Check for any error logs
- [ ] Ensure printers have paper
- [ ] Test QR scanner functionality

**Evening:**
- [ ] Export daily backup
- [ ] Review day's transactions
- [ ] Check for anomalies
- [ ] Staff feedback collection

---

### Weekly Review (End of Week 1)

**Metrics to Check:**
- [ ] System uptime percentage
- [ ] Number of transactions processed
- [ ] Printing success rate
- [ ] User adoption rate
- [ ] Issues reported and resolved

**Staff Feedback:**
- What's working well?
- What needs improvement?
- Are there any missing features?
- Training gaps?

---

## 🆘 Emergency Contacts

### Technical Support

**Application Issues:**
- Name: ___________________
- Phone: ___________________
- Email: ___________________

**Network Issues:**
- Name: ___________________
- Phone: ___________________
- Email: ___________________

**Printer Issues:**
- Vendor: ___________________
- Phone: ___________________
- Email: ___________________

**Supabase Support:**
- Website: support.supabase.com
- Email: support@supabase.com

**Vercel Support:**
- Website: vercel.com/support
- Email: support@vercel.com

---

## 🔄 Rollback Plan

### If Critical Issues Arise

**Option 1: Quick Fix**
1. Identify the issue
2. Fix in code
3. Redeploy to Vercel (`vercel --prod`)
4. Test immediately

**Option 2: Temporary Rollback**
1. Log into Vercel dashboard
2. Go to Deployments
3. Find previous working deployment
4. Click "Promote to Production"
5. System reverts to previous version

**Option 3: Paper Backup**
1. Print blank transaction forms
2. Record manually
3. Enter into system later when fixed

**Keep these forms ready:**
- Float open/close form
- Player rating form
- Comps tracking form
- Vault transfer form

---

## ✅ Final Pre-Launch Checklist

### Code Changes
- [ ] `USE_LOCAL_STORAGE = false` in api.ts
- [ ] `isDevelopmentMode = false` in Root.tsx
- [ ] Application built successfully
- [ ] Deployed to Vercel
- [ ] Production URL confirmed

### Database
- [ ] Supabase connection tested
- [ ] All tables verified
- [ ] Default users created
- [ ] Test data created
- [ ] Backup procedure tested

### Devices
- [ ] All PCs configured
- [ ] All tablets set up
- [ ] All phones tested
- [ ] WiFi passwords distributed
- [ ] Bookmarks created
- [ ] Login credentials distributed

### Printers
- [ ] All Epson printers installed
- [ ] Card printer configured
- [ ] Premax paired via Bluetooth
- [ ] Test receipts printed
- [ ] Paper stocked
- [ ] Spare rolls available

### Network
- [ ] Router configured
- [ ] Static IPs assigned
- [ ] WiFi networks created
- [ ] External access tested
- [ ] Speed test completed
- [ ] Backup internet ready

### Training
- [ ] Cashiers trained
- [ ] Pit Boss trained
- [ ] Inspectors trained
- [ ] Waiters trained
- [ ] Host trained
- [ ] Managers trained

### Documentation
- [ ] User manuals distributed
- [ ] Quick reference guides posted
- [ ] Support contacts visible
- [ ] Network info documented
- [ ] Passwords secured

### Testing
- [ ] End-to-end transaction tested
- [ ] Multi-device sync verified
- [ ] Printers tested from each device
- [ ] QR scanning tested
- [ ] Reports generated successfully
- [ ] External access confirmed

---

## 📊 Success Metrics

### Week 1 Goals

- **System Uptime**: >95%
- **Transaction Volume**: [Your target]
- **User Adoption**: All staff using system
- **Data Accuracy**: 100%
- **Print Success**: >98%
- **Staff Satisfaction**: >80% positive feedback

---

## 🎯 You're Ready to Go Live!

Once all checkboxes above are complete, you're ready for production deployment.

**Remember:**
- Start small (test with 1-2 tables first)
- Monitor closely in first week
- Gather staff feedback daily
- Be ready to adjust
- Have backup plans ready

**Good luck with your launch!** 🚀

---

**End of Go Live Checklist**
