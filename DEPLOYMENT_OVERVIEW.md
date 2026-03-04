# DEPLOYMENT OVERVIEW
## MF-Intel CMS for Gaming IQ - Quick Reference

---

## 📋 Your Complete Setup At A Glance

### **Hardware Inventory**

#### Computers & Tablets
- ✅ **2x Cage PCs** (Windows, LAN-connected) → Cashier operations
- ✅ **2x Admin PCs** (Windows, LAN-connected) → Management & reports  
- ✅ **Multiple Windows Tablets/Laptops** → Player ratings & table operations
- ✅ **Multiple Android Tablets** → Comps tracking & POS sales
- ✅ **iOS/Android Phones** → Remote viewing (external internet access)
- ✅ **1x Host Laptop** → Player management & QR card printing

#### Printers
- ✅ **4x Epson TM-T20III** (Thermal receipt printers)
  - 2x at Cage PCs
  - 1x at Pit Boss station
  - 1x at Host laptop
- ✅ **1x Card Printer** (Host laptop) → QR code player/employee cards
- ✅ **1x Premax PM-RP 80** (Portable thermal) → Sales receipts on Android tablet

---

## 🏗️ Recommended Architecture

```
┌─────────────────────────────────────────────────┐
│                   INTERNET                      │
│                                                 │
│  ┌──────────────┐         ┌─────────────────┐  │
│  │  SUPABASE    │ ◄─────► │     VERCEL      │  │
│  │  (Database)  │         │  (Web Hosting)  │  │
│  └──────────────┘         └─────────────────┘  │
└────────────────────┬────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    HTTPS (WiFi)            HTTPS (4G/5G)
         │                       │
    ┌────▼─────┐            ┌───▼────┐
    │  CASINO  │            │ PHONES │
    │  ROUTER  │            │ (iOS/  │
    │          │            │Android)│
    └────┬─────┘            └────────┘
         │
    LAN Network
    192.168.1.x
         │
    ┌────┴────┬─────────┬─────────┬─────────┐
    │         │         │         │         │
┌───▼──┐  ┌──▼──┐  ┌───▼───┐ ┌───▼───┐ ┌──▼───┐
│Cage  │  │Admin│  │Tablets│ │Android│ │Print-│
│ PCs  │  │ PCs │  │Windows│ │Tablets│ │ ers  │
│(2x)  │  │(2x) │  │(Multi)│ │(Multi)│ │(6x)  │
└──────┘  └─────┘  └───────┘ └───────┘ └──────┘
```

**Why This Setup?**
- ✅ **Supabase Cloud**: Database with automatic backups
- ✅ **Vercel**: Free web hosting with automatic HTTPS
- ✅ **No VPN needed**: External phones access automatically
- ✅ **Real-time sync**: All devices update instantly
- ✅ **Scalable**: Add devices anytime

---

## 🚀 Deployment Steps (Simple Version)

### 1️⃣ **Activate Supabase** (2 minutes)
Edit 2 files to switch from localStorage to Supabase database:
- `/src/app/utils/api.ts` → Change line 6 to `false`
- `/src/app/components/Root.tsx` → Change line 14 to `false`

### 2️⃣ **Deploy to Vercel** (3 minutes)
```bash
npm install -g vercel
vercel login
vercel --prod
```
**Result**: Get your production URL (e.g., `https://casino-cms.vercel.app`)

### 3️⃣ **Configure Devices** (30 minutes)
Open browser on each device → Go to your URL → Login → Bookmark

### 4️⃣ **Setup Printers** (15 min per printer)
Install drivers → Connect USB/Bluetooth → Test print

### 5️⃣ **Create User Accounts** (10 minutes)
Setup → Users → Add all staff members

### 6️⃣ **Go Live!** 🎉
Start processing real transactions

**Total Time**: ~1.5-2 hours

---

## 👥 User Accounts Plan

| User Type | Quantity | Devices | Key Features |
|-----------|----------|---------|--------------|
| **Super Manager** | 1 | Admin PC | Full access, all features |
| **Manager** | 2-3 | Admin PCs, laptops | Most features, reports |
| **Cashier** | 2+ | Cage PCs | Float management, vault ops |
| **Pit Boss** | 1-2 | Tablets | All table operations |
| **Inspector** | 3-5 | Tablets | Assigned table ratings |
| **Host** | 2-3 | Host laptop, tablets | Player management, comps |
| **Waiter** | 3-5 | Android tablets | Comps recording, POS sales |

---

## 📱 Device Assignments

### **CAGE OPERATIONS**
**Device**: 2x Windows PCs (LAN-connected)  
**Login**: Cashier  
**Main Tab**: `/cage`  
**Printer**: Epson TM-T20III (USB)

**Functions**:
- Open/close floats
- Process fills & credits
- Vault transfers (requires manager approval)
- Print receipts
- Holding chips management

---

### **ADMINISTRATIVE WORK**
**Device**: 2x Windows PCs (LAN-connected)  
**Login**: Manager / Super Manager  
**Main Tab**: `/` (Dashboard)  
**Printer**: None (can export Excel)

**Functions**:
- View Dashboard analytics
- Generate reports
- User management
- System setup
- Audit log review
- Data export/import

---

### **TABLE OPERATIONS**
**Device**: Multiple Windows tablets/laptops (WiFi)  
**Login**: Pit Boss / Inspector  
**Main Tab**: `/ratings`  
**Printer**: Shared Epson TM-T20III (optional)

**Functions**:
- QR code player scanning
- Start/end player ratings
- Pause/resume sessions
- Calculate win/loss
- Track average bets
- Full-screen table view
- Real-time player status

---

### **COMPS & SALES**
**Device**: Multiple Android tablets (WiFi)  
**Login**: Waiter  
**Main Tab**: `/comps`  
**Printer**: Premax PM-RP 80 (Bluetooth)

**Functions**:
- QR code player scanning
- Record comps (drinks, cigarettes, food)
- Free comp redemption
- POS cash sales
- Staff purchases (50% discount via employee QR)
- VIP discount requests (requires manager approval)
- Print receipts

---

### **PLAYER MANAGEMENT**
**Device**: 1x Host laptop (WiFi/LAN)  
**Login**: Host  
**Main Tab**: `/players`  
**Printers**: 
- Epson TM-T20III (tickets)
- Card Printer (QR cards)

**Functions**:
- Player CRUD operations
- Print individual QR cards
- Bulk print QR cards
- Tier management
- Player profiles
- Comps balance tracking
- Excel import/export

---

### **REMOTE VIEWING**
**Device**: iOS/Android phones (4G/5G internet)  
**Login**: Manager / Pit Boss  
**Main Tab**: `/` (Dashboard)  
**Printer**: None

**Functions**:
- View Dashboard remotely
- Check player statistics
- Review reports
- Monitor operations
- Access audit log

**Perfect for**: Managers checking operations while away from casino

---

## 🖨️ Printer Assignments

| Printer | Location | Connection | Purpose |
|---------|----------|------------|---------|
| Epson TM-T20III #1 | Cage PC 1 | USB | Cashier receipts |
| Epson TM-T20III #2 | Cage PC 2 | USB | Cashier receipts |
| Epson TM-T20III #3 | Pit Boss Station | USB/Network | Rating tickets |
| Epson TM-T20III #4 | Host Laptop | USB | Player tickets |
| Card Printer | Host Laptop | USB | QR code cards |
| Premax PM-RP 80 | Android Tablet | Bluetooth | POS receipts |

**Paper Specifications**:
- Thermal printers: 80mm width thermal paper (no ink needed)
- Card printer: CR80 plastic cards (credit card size)

---

## 🌐 Network Configuration

### **Your Local Network**
- **Router IP**: 192.168.1.1
- **Network Range**: 192.168.1.x
- **WiFi Name (Staff)**: `Casino-Staff` 
- **WiFi Name (Guest)**: `Casino-Guest` (separate, isolated)

### **Recommended Static IPs**
- **Cage PC 1**: 192.168.1.10
- **Cage PC 2**: 192.168.1.11
- **Admin PC 1**: 192.168.1.20
- **Admin PC 2**: 192.168.1.21
- **Host Laptop**: 192.168.1.25
- **Printer 1**: 192.168.1.201
- **Printer 2**: 192.168.1.202
- **Tablets**: 192.168.1.30-49 (DHCP)

### **Internet Access**
- **LAN devices**: Via router to internet
- **External phones**: Direct 4G/5G to Vercel (HTTPS)
- **No VPN needed**: Automatic external access via Supabase Cloud

---

## 🔐 Security Features

### **Built-In Security**
- ✅ **Role-based access control**: 7 user types with specific permissions
- ✅ **Password authentication**: Required for login
- ✅ **Management approval**: Vault transfers, VIP discounts require credentials
- ✅ **User signatures**: Password verification for critical approvals
- ✅ **Audit logging**: All actions tracked with timestamp & user
- ✅ **HTTPS encryption**: All data encrypted in transit
- ✅ **Property isolation**: Multi-property data separation

### **Recommended Additional Security**
- Use strong passwords (16+ characters)
- Change WiFi passwords quarterly
- Separate guest WiFi network
- Enable router firewall
- Regular security audits
- Backup data weekly

---

## 💾 Data & Backup

### **Where Your Data Lives**
- **Database**: Supabase Cloud (PostgreSQL)
- **Automatic Backups**: Daily by Supabase (7-day retention)
- **Manual Exports**: Excel export from Setup tab

### **Backup Recommendations**
1. **Daily**: Automatic (Supabase handles this)
2. **Weekly**: Manual Excel export → Save to secure location
3. **Monthly**: Full database snapshot (contact support)

### **Data Sync**
- **Real-time**: All devices see updates instantly
- **Requires Internet**: Must be connected for sync
- **Backup Plan**: If internet down, document manually → enter later

---

## 📊 Key Features Overview

### **Player Management**
- Complete CRUD operations
- QR code player identification
- Individual & bulk QR card printing
- Tier system (VIP, Regular, etc.)
- Excel import/export

### **Float Management**
- Open/close table floats
- Fills and credits
- Real-time balance tracking
- Dealer & inspector shift tracking
- Holding chips feature

### **Player Ratings**
- Buy-in tracking (Cash/Chips)
- Live session monitoring
- Pause/resume functionality
- Win/loss calculation
- Average bet tracking
- Theoretical win calculation
- Automatic comps calculation (0.1% of Theo)
- Full-screen table view

### **Comps System (3 Modes)**
1. **Free Comps**: Redeem against player balance
2. **Cash Sales**: POS system with VIP discounts
3. **Staff Purchases**: 50% discount via employee QR cards

### **Vault Operations**
- Transfer requests
- Management approval workflow
- Dual-signature system
- Thermal receipt printing

### **Cage Operations**
- Cashier float management
- Player cashout (even exchange)
- Transaction tracking
- Receipt printing

### **Reports & Analytics**
- Dashboard with live metrics
- Daily/weekly/monthly reports
- Player performance analytics
- Table performance tracking
- Comps reporting
- Excel export

### **Employee Management**
- CRUD operations with profile pictures
- Starting date & birthday tracking
- Performance reviews (every 3 months)
- QR employee cards
- User group assignment
- Staff discount toggle
- Excel import/export

### **Audit System**
- Comprehensive logging
- User tracking
- Timestamp tracking
- Action tracking
- Property tracking
- Searchable history

### **Help System**
- In-app help for all features
- Keyboard shortcuts guide
- PDF generation
- Context-sensitive help

---

## ⌨️ Universal Keyboard Shortcuts

Available on all devices (desktop/tablet):

- `Ctrl+1` → Dashboard
- `Ctrl+2` → Players
- `Ctrl+3` → Floats
- `Ctrl+4` → Ratings
- `Ctrl+5` → Drop
- `Ctrl+6` → Reports
- `Ctrl+7` → Cage
- `Ctrl+8` → Comps
- `Ctrl+9` → Setup
- `Ctrl+L` → Logout
- `Ctrl+H` → Help

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ **All devices can access the application via URL**
2. ✅ **Cage staff can open floats and print receipts**
3. ✅ **Pit Boss can start/end player ratings**
4. ✅ **Waiters can scan QR codes and record comps**
5. ✅ **Managers can view reports from admin PCs**
6. ✅ **Remote phones can access dashboard from outside**
7. ✅ **All printers working correctly**
8. ✅ **Data syncs across all devices in real-time**
9. ✅ **Staff trained and comfortable with system**
10. ✅ **Backup procedures in place**

---

## 📞 Support Resources

### **Documentation Included**
1. **DEPLOYMENT_GUIDE.md** - Complete deployment guide (detailed)
2. **QUICK_DEPLOY.md** - 5-step quick start (fast track)
3. **NETWORK_GUIDE.md** - Network setup & configuration
4. **PRINTER_SETUP.md** - Printer installation & troubleshooting
5. **GO_LIVE_CHECKLIST.md** - Pre-launch checklist & timeline
6. **DEPLOYMENT_OVERVIEW.md** - This file (quick reference)

### **Online Resources**
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Epson Support**: https://epson.com/support

### **Getting Help**
1. Check documentation first
2. Review browser console (F12) for errors
3. Check Audit Log for system events
4. Contact technical support (see GO_LIVE_CHECKLIST.md)

---

## 🎓 Training Recommendations

### **Phase 1: Cashiers** (Day 1)
- Focus on Cage operations
- Float management
- Receipt printing
- Vault procedures

### **Phase 2: Floor Staff** (Day 2)
- Pit Boss & Inspectors
- Player rating workflow
- QR code scanning
- Session management

### **Phase 3: Service Staff** (Day 3)
- Hosts & Waiters
- Comps tracking
- POS sales
- Player identification

### **Phase 4: Management** (Day 4)
- Dashboard review
- Reports generation
- User management
- System administration

### **Phase 5: Live Test** (Day 5)
- All staff together
- Simulate full shift
- Iron out issues
- Final Q&A

---

## ⏱️ Timeline Summary

### **Pre-Deployment** (1-2 days)
- Order hardware (if not already owned)
- Install printers
- Configure network
- Train IT staff

### **Deployment Day** (2-4 hours)
- Activate Supabase
- Deploy to Vercel
- Configure devices
- Create user accounts
- Test end-to-end

### **Training Week** (5 days)
- Day-by-day staff training
- Department by department
- Hands-on practice
- Resolve issues

### **Go Live** (Week 2)
- Soft launch (1-2 tables)
- Monitor closely
- Gather feedback
- Expand gradually

### **Post-Launch** (Ongoing)
- Daily monitoring
- Weekly reviews
- Monthly optimization
- Continuous improvement

---

## 💡 Pro Tips

### **For Smooth Deployment**
1. **Start Small**: Test with 1-2 tables before full rollout
2. **Backup Internet**: Keep mobile hotspot as backup
3. **Print Reference Cards**: Put quick guides at each station
4. **Designate Super User**: One tech-savvy staff member as first contact
5. **Document Everything**: Note any changes or customizations
6. **Regular Backups**: Export data weekly via Excel
7. **Monitor Daily**: Check Dashboard and Audit Log daily
8. **Staff Feedback**: Weekly feedback sessions first month
9. **Be Patient**: Learning curve is normal, allow 1-2 weeks for full adoption
10. **Celebrate Wins**: Recognize staff who adopt system quickly

### **Common Pitfalls to Avoid**
- ❌ Don't skip testing phase
- ❌ Don't rush staff training
- ❌ Don't forget to change development mode settings
- ❌ Don't ignore printer maintenance
- ❌ Don't forget backup procedures
- ❌ Don't deploy during peak hours

---

## ✅ Quick Checklist

**Before Deployment:**
- [ ] Read all documentation
- [ ] Hardware inventory complete
- [ ] Network configured
- [ ] Printers tested
- [ ] Training plan ready

**Deployment:**
- [ ] Code changes made (Supabase active)
- [ ] Deployed to Vercel
- [ ] URL confirmed working
- [ ] All devices configured
- [ ] User accounts created

**Post-Deployment:**
- [ ] End-to-end test successful
- [ ] Staff trained
- [ ] Backup procedures in place
- [ ] Support contacts documented
- [ ] Go-live date confirmed

---

## 🎉 You're Ready!

With this setup, you'll have:
- ✅ **Reliable**: Cloud-based with automatic backups
- ✅ **Scalable**: Add devices anytime
- ✅ **Accessible**: Work from anywhere
- ✅ **Secure**: Role-based access control
- ✅ **Comprehensive**: All casino operations covered
- ✅ **Modern**: Latest web technologies
- ✅ **Professional**: Thermal printing & QR codes

**Next Step**: Read QUICK_DEPLOY.md for detailed deployment instructions

---

**Good luck with your deployment!** 🚀🎰

---

**End of Deployment Overview**
