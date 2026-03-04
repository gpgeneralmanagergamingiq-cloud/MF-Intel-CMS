# MF-Intel CMS for Gaming IQ
## Complete Casino Management System
### Version 2.3.0

**Comprehensive Feature Presentation**

---

# Table of Contents

1. System Overview
2. User Types & Access Control
3. Dashboard & Analytics
4. Player Management
5. Float Management
6. Player Rating System
7. Drop Management
8. Cage Operations
9. Comps Management System
10. Reports & Analytics
11. Vault Transfer System
12. Employee Management
13. Credit Line Management
14. Marketing Campaigns
15. Jackpots System
16. Audit Logging
17. QR Code System
18. Thermal Printing
19. Help System
20. Technical Architecture
21. Multi-Property Support
22. Security Features
23. Mobile & Tablet Support
24. Deployment & Scalability

---

# 1. SYSTEM OVERVIEW

## What is MF-Intel CMS for Gaming IQ?

**A comprehensive, cloud-based casino management system designed for modern casino operations**

### Core Purpose
- Streamline all casino operations from a single platform
- Real-time tracking and analytics
- Multi-device support (PCs, tablets, phones)
- Role-based access control
- Complete audit trail

### Key Benefits
✅ **Efficiency**: Reduce manual paperwork by 90%  
✅ **Accuracy**: Eliminate calculation errors  
✅ **Visibility**: Real-time operational insights  
✅ **Compliance**: Complete audit trail  
✅ **Scalability**: Support unlimited tables and players  
✅ **Accessibility**: Work from anywhere, any device  

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Cloud-based (Vercel)
- **Printing**: Thermal receipt printers (Epson TM-T20III)
- **QR Codes**: Player and employee identification
- **Mobile**: Responsive design for all devices

---

# 2. USER TYPES & ACCESS CONTROL

## 7 Role-Based User Types

### 1. 👑 Super Manager
**Full System Access**

**Permissions**:
- All features and functions
- User management (create, edit, delete users)
- System configuration
- Multi-property management
- Financial reports
- Vault transfer approvals
- Setup and configuration

**Typical Use**: Casino owner, General Manager

---

### 2. 💼 Manager
**Administrative Access**

**Permissions**:
- Most operational features
- Reports and analytics
- Player management
- Float oversight
- Comps approval
- Vault transfer approvals
- Cannot manage other managers or super managers

**Typical Use**: Shift Manager, Floor Manager

---

### 3. 🎯 Pit Boss
**Floor Operations Management**

**Permissions**:
- All table operations
- Player ratings (all tables)
- Float monitoring
- Drop tracking
- Player profiles
- Real-time session management
- Table assignments

**Typical Use**: Pit Manager, Floor Supervisor

---

### 4. 👁️ Inspector
**Table-Specific Operations**

**Permissions**:
- Player ratings (assigned tables only)
- Session start/stop
- Buy-in/cash-out recording
- Average bet tracking
- Drop recording
- Table-level reporting

**Typical Use**: Table Inspector, Dealer Supervisor

---

### 5. 💰 Cashier
**Cage Operations**

**Permissions**:
- Float management (open/close)
- Fills and credits
- Vault transfer requests
- Holding chips management
- Player cashout transactions
- Receipt printing
- Limited to cage operations

**Typical Use**: Cage Cashier, Cash Handler

---

### 6. 🎩 Host
**Player Services**

**Permissions**:
- Complete player management
- Player CRUD operations
- Comps tracking and approval
- Player tier management
- QR card printing
- Player reports
- Marketing campaign access

**Typical Use**: Casino Host, VIP Services

---

### 7. 🍷 Waiter
**Comps & Service**

**Permissions**:
- Comps recording only
- QR code scanning
- Item tracking (drinks, cigarettes, food)
- POS sales
- Staff purchases
- Limited to comps operations

**Typical Use**: Floor Waiter, Beverage Server

---

# 3. DASHBOARD & ANALYTICS

## Real-Time Operations Overview

### Key Metrics Display

#### Today's Operations
```
┌─────────────────────────────────────────┐
│  Opened Tables: 12                      │
│  Active Tables: 8 (with players)        │
│  Active Players: 23 (currently playing) │
│  Total Players Today: 156               │
└─────────────────────────────────────────┘
```

#### Financial Overview
```
┌─────────────────────────────────────────┐
│  Total Drop: CFA 45,000,000             │
│  Total Win: +CFA 2,250,000              │
│  Hold %: 5.00%                          │
│                                         │
│  [View Drop by Table]                   │
└─────────────────────────────────────────┘
```

#### Performance Tables
```
┌─────────────────────────────────────────┐
│  TOP 5 TABLES BY DROP                   │
│  1. BJ-03    CFA 8,500,000             │
│  2. RO-01    CFA 6,200,000             │
│  3. BJ-01    CFA 5,800,000             │
│  4. BC-02    CFA 4,900,000             │
│  5. PK-01    CFA 3,200,000             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  TOP 5 BEST PLAYERS (Losses)            │
│  1. John Doe     -CFA 850,000          │
│  2. Jane Smith   -CFA 720,000          │
│  3. Mike Johnson -CFA 650,000          │
│  4. Sarah Lee    -CFA 520,000          │
│  5. Tom Brown    -CFA 480,000          │
└─────────────────────────────────────────┘
```

### Hourly Analytics

#### Drop per Hour Chart
- Bar chart showing cash transactions by hour
- Configurable time ranges: 3h, 6h, 9h, 12h, 18h, 24h
- Visual trend analysis
- Identify peak hours

#### Players per Hour Chart
- Line chart showing unique players starting sessions
- Same time range options
- Track player volume trends
- Optimize staffing

### Filters & Customization

**Property Filter**: View all properties or select specific location  
**Date Range Filter**: 
- Today / Yesterday
- This Week / Last Week
- This Month / Last Month
- This Year / Last Year
- Custom Date Range

**Real-Time Updates**: Dashboard refreshes automatically with new data

---

# 4. PLAYER MANAGEMENT

## Complete Player Lifecycle Management

### Player Database

#### Player Information Fields
```
┌─────────────────────────────────────────┐
│  PLAYER PROFILE                         │
├─────────────────────────────────────────┤
│  Member ID: P-2026-0123                 │
│  Name: John Doe                         │
│  Email: john.doe@example.com            │
│  Phone: +237 6XX XXX XXX                │
│  Date of Birth: 1980-05-15              │
│  Join Date: 2024-01-10                  │
│  Property: Main Casino                  │
│  Tier: VIP Gold                         │
│  Status: Active                         │
│                                         │
│  Profile Picture: [Upload]              │
│  QR Code: [Auto-generated]              │
└─────────────────────────────────────────┘
```

### Player Tiers
- **VIP Platinum**: Highest tier, maximum benefits
- **VIP Gold**: Premium tier
- **VIP Silver**: Mid-tier
- **Regular**: Standard membership
- **New**: First-time players

Each tier affects:
- Comps percentage
- Special offers
- Priority service
- Promotional eligibility

### CRUD Operations

#### Create Player
1. Click "Add New Player"
2. Fill in required information
3. Optional: Upload profile picture
4. System auto-generates:
   - Unique Member ID (P-YYYY-XXXX)
   - QR code for identification
5. Save → Player created ✅

#### View Players
- Searchable, sortable table
- Filter by:
  - Tier
  - Status (Active/Inactive)
  - Property
  - Join date
- Quick actions:
  - View profile
  - Edit details
  - Print QR card
  - View session history

#### Update Player
- Edit any field
- Update tier
- Change status
- Upload new photo
- QR code remains constant

#### Delete Player
- Soft delete (marked inactive)
- Preserves historical data
- Cannot delete players with active sessions

### QR Code Player Cards

#### Individual Card Printing
```
┌─────────────────────────────────────────┐
│        CASINO NAME                      │
│                                         │
│   ███████████████████                   │
│   ███████████████████  ← QR Code       │
│   ███████████████████                   │
│                                         │
│   John Doe                              │
│   Member ID: P-2026-0123                │
│   Tier: VIP Gold                        │
└─────────────────────────────────────────┘
```

**Features**:
- Print to card printer (CR80 plastic cards)
- Professional design
- Scannable QR code
- Player photo (optional)
- Casino branding

#### Bulk Card Printing
- Select multiple players
- Print all cards in batch
- Perfect for:
  - New member signup events
  - Card replacement programs
  - Tier upgrades

### Excel Import/Export

#### Import Players
1. Download Excel template
2. Fill in player data:
   - Name (required)
   - Email (optional)
   - Phone (optional)
   - Tier (optional, defaults to Regular)
   - Join Date (optional, defaults to today)
3. Upload file
4. System validates data
5. Bulk import complete ✅

**Validation**:
- Duplicate detection
- Required field checks
- Format validation
- Error reporting

#### Export Players
- Export all players to Excel
- Includes all fields
- Perfect for:
  - Backup
  - External analysis
  - Marketing campaigns
  - Regulatory reporting

### Player Statistics

**Per Player**:
- Total sessions
- Total drop
- Total win/loss
- Average bet
- Last visit
- Comps balance
- Tier points
- Lifetime value

**Dashboard Widget**:
- Total active players
- New players this month
- VIP count
- Inactive player count

---

# 5. FLOAT MANAGEMENT

## Table Bankroll Tracking

### What is a Float?

A **float** is the amount of chips/cash at a gaming table at any given time. Tracking floats is essential for:
- Security and accountability
- Detecting discrepancies
- Financial reconciliation
- Shift change verification

### Float Operations

#### 1. Open Float
**When**: Start of shift or table opening

```
┌─────────────────────────────────────────┐
│  OPEN FLOAT                             │
├─────────────────────────────────────────┤
│  Table Name: BJ-01 ▼                    │
│  Dealer Name: John Smith ▼              │
│  Inspector: Jane Doe ▼                  │
│  Amount: CFA 5,000,000                  │
│  Timestamp: 2026-03-03 08:00            │
│                                         │
│  [Submit]  [Cancel]                     │
└─────────────────────────────────────────┘
```

**Process**:
1. Cashier receives chip request
2. Prepares chips from vault
3. Records opening amount
4. Dealer/Inspector verifies
5. Receipt printed ✅
6. Table marked as "Active"

**Receipt Printed**:
```
================================
    CASINO NAME
================================
FLOAT OPEN
Table: BJ-01
Dealer: John Smith
Inspector: Jane Doe
Amount: CFA 5,000,000
--------------------------------
Date: 2026-03-03 08:00:25
Cashier: cashier1
Transaction ID: FLT-2026-0042
================================
  Authorized by Management
================================
```

---

#### 2. Close Float
**When**: End of shift or table closing

```
┌─────────────────────────────────────────┐
│  CLOSE FLOAT                            │
├─────────────────────────────────────────┤
│  Table: BJ-01                           │
│  Opening Amount: CFA 5,000,000          │
│  Closing Amount: CFA 6,200,000          │
│  Difference: +CFA 1,200,000             │
│                                         │
│  Dealer: John Smith                     │
│  Inspector: Jane Doe                    │
│                                         │
│  [Submit]  [Cancel]                     │
└─────────────────────────────────────────┘
```

**Process**:
1. Count chips at table
2. Record closing amount
3. System calculates difference
4. Verify count
5. Return chips to vault
6. Receipt printed ✅
7. Table marked as "Closed"

**Reconciliation**:
- Positive difference = Table win
- Negative difference = Table loss
- System tracks for shift report

---

#### 3. Fill
**When**: Table needs more chips mid-shift

```
┌─────────────────────────────────────────┐
│  FILL FLOAT                             │
├─────────────────────────────────────────┤
│  Table: BJ-01                           │
│  Current Float: CFA 2,500,000           │
│  Fill Amount: CFA 2,000,000             │
│  New Float: CFA 4,500,000               │
│                                         │
│  Reason: High player wins               │
│                                         │
│  [Submit]  [Cancel]                     │
└─────────────────────────────────────────┘
```

**Process**:
1. Table requests more chips
2. Cashier approves request
3. Prepares chips
4. Delivers to table
5. Inspector verifies
6. Receipt printed ✅
7. Float balance updated

---

#### 4. Credit
**When**: Table has excess chips

```
┌─────────────────────────────────────────┐
│  CREDIT FLOAT                           │
├─────────────────────────────────────────┤
│  Table: BJ-01                           │
│  Current Float: CFA 8,500,000           │
│  Credit Amount: CFA 3,000,000           │
│  New Float: CFA 5,500,000               │
│                                         │
│  Reason: Low player activity            │
│                                         │
│  [Submit]  [Cancel]                     │
└─────────────────────────────────────────┘
```

**Process**:
1. Table returns excess chips
2. Inspector counts chips
3. Cashier verifies
4. Chips returned to vault
5. Receipt printed ✅
6. Float balance updated

---

### Shift Tracking

#### Dealer Shift Management
```
┌─────────────────────────────────────────┐
│  DEALER SHIFT - BJ-01                   │
├─────────────────────────────────────────┤
│  Current: John Smith (08:00 - 16:00)    │
│  Next: Sarah Lee (16:00 - 00:00)        │
│                                         │
│  [Change Dealer]                        │
└─────────────────────────────────────────┘
```

**Track**:
- Dealer name
- Shift start time
- Shift end time
- Float balance at change
- Accountability per dealer

#### Inspector Shift Management
```
┌─────────────────────────────────────────┐
│  INSPECTOR SHIFT - BJ-01                │
├─────────────────────────────────────────┤
│  Current: Jane Doe (08:00 - 16:00)      │
│  Next: Mike Johnson (16:00 - 00:00)     │
│                                         │
│  [Change Inspector]                     │
└─────────────────────────────────────────┘
```

**Track**:
- Inspector name
- Tables supervised
- Shift timeline
- Session approvals

---

### Holding Chips Feature

#### What are Holding Chips?
Chips temporarily held by management for various reasons:
- Investigation
- Suspicious activity
- Dispute resolution
- Verification pending

```
┌─────────────────────────────────────────┐
│  HOLDING CHIPS                          │
├─────────────────────────────────────────┤
│  Table: BJ-01                           │
│  Amount: CFA 500,000                    │
│  Reason: Player dispute                 │
│  Held By: Manager John                  │
│  Timestamp: 2026-03-03 14:30            │
│                                         │
│  Status: Pending Resolution             │
│                                         │
│  [Release Chips]  [Add Note]            │
└─────────────────────────────────────────┘
```

**Features**:
- Tracked separately from active float
- Requires manager authorization
- Complete audit trail
- Resolution notes
- Release workflow

---

### Full-Screen Table View

#### Real-Time Table Status Display
```
╔═══════════════════════════════════════════╗
║           TABLE BJ-01 STATUS              ║
╠═══════════════════════════════════════════╣
║  Float: CFA 5,500,000                     ║
║  Active Players: 4                        ║
║  Drop Today: CFA 2,800,000                ║
║  Win/Loss: +CFA 450,000                   ║
║                                           ║
║  Dealer: John Smith (08:00 - 16:00)       ║
║  Inspector: Jane Doe                      ║
║                                           ║
║  ACTIVE SESSIONS:                         ║
║  • Mike Johnson  - CFA 500,000            ║
║  • Sarah Lee     - CFA 350,000            ║
║  • Tom Brown     - CFA 250,000            ║
║  • Lisa White    - CFA 150,000            ║
╚═══════════════════════════════════════════╝
```

**Features**:
- Large, easy-to-read display
- Real-time updates
- Perfect for pit monitors
- Keyboard shortcuts (F11 for full-screen)
- Touch-friendly for tablets

---

### Float History & Reporting

#### Float Transaction Log
```
┌─────────────────────────────────────────┐
│  Date/Time    │ Type   │ Amount         │
├─────────────────────────────────────────┤
│  08:00:25     │ OPEN   │ +5,000,000     │
│  10:15:32     │ FILL   │ +2,000,000     │
│  12:30:45     │ CREDIT │ -1,500,000     │
│  14:20:10     │ FILL   │ +1,000,000     │
│  20:00:55     │ CLOSE  │ -6,500,000     │
└─────────────────────────────────────────┘
Net Result: +CFA 1,500,000 (Table Win)
```

**Reports Available**:
- Float balance by table
- Float transactions by date range
- Dealer accountability
- Fill/credit frequency
- Discrepancy reports

---

# 6. PLAYER RATING SYSTEM

## Track Player Activity & Calculate Theoretical Win

### What is Player Rating?

**Player rating** is the process of tracking a player's gaming session to:
- Calculate theoretical win (Theo)
- Determine comp eligibility
- Track player value
- Analyze player behavior
- Reward loyalty

### Rating Workflow

#### 1. Start Rating Session

**Scan QR Code**:
```
┌─────────────────────────────────────────┐
│  START PLAYER RATING                    │
├─────────────────────────────────────────┤
│  [📷 Scan Player QR Code]               │
│                                         │
│  Or manually select:                    │
│  Player: John Doe ▼                     │
│  Member ID: P-2026-0123                 │
└─────────────────────────────────────────┘
```

**Enter Session Details**:
```
┌─────────────────────────────────────────┐
│  SESSION DETAILS                        │
├─────────────────────────────────────────┤
│  Table: BJ-01 ▼                         │
│  Game Type: Blackjack                   │
│  Buy-In Type: ◉ Cash  ○ Chips          │
│  Buy-In Amount: CFA 1,000,000           │
│  Average Bet: CFA 50,000                │
│  Start Time: 2026-03-03 14:30           │
│                                         │
│  Inspector: Jane Doe                    │
│                                         │
│  [Start Session]  [Cancel]              │
└─────────────────────────────────────────┘
```

**Session Started ✅**:
- Player marked as "Active"
- Timer starts
- Appears in Dashboard "Active Players"
- Visible in Full-Screen Table View

---

#### 2. During Session

**Active Session Display**:
```
┌─────────────────────────────────────────┐
│  🟢 ACTIVE SESSION                      │
├─────────────────────────────────────────┤
│  Player: John Doe (P-2026-0123)         │
│  Table: BJ-01                           │
│  Duration: 2h 15m                       │
│                                         │
│  Buy-In: CFA 1,000,000 (Cash)           │
│  Avg Bet: CFA 50,000                    │
│                                         │
│  [Pause Session]                        │
│  [Update Bet]                           │
│  [End Session]                          │
└─────────────────────────────────────────┘
```

**Actions During Session**:

**Pause Session**:
- Player takes break
- Timer pauses
- Session remains active
- Can resume anytime

**Resume Session**:
- Continue after break
- Timer resumes
- No data lost

**Update Average Bet**:
- Inspector observes bet changes
- Update in real-time
- Affects Theo calculation

---

#### 3. End Session

**Cash-Out Process**:
```
┌─────────────────────────────────────────┐
│  END SESSION                            │
├─────────────────────────────────────────┤
│  Player: John Doe                       │
│  Buy-In: CFA 1,000,000                  │
│  Cash-Out Type: ◉ Cash  ○ Chips        │
│  Cash-Out Amount: CFA 850,000           │
│                                         │
│  Duration: 2h 30m                       │
│  Avg Bet: CFA 50,000                    │
│                                         │
│  [Calculate & End]                      │
└─────────────────────────────────────────┘
```

**Automatic Calculations**:
```
┌─────────────────────────────────────────┐
│  SESSION SUMMARY                        │
├─────────────────────────────────────────┤
│  Buy-In: CFA 1,000,000                  │
│  Cash-Out: CFA 850,000                  │
│  Win/Loss: -CFA 150,000 (Player Loss)   │
│                                         │
│  Hands Played: 300 (est.)               │
│  Average Bet: CFA 50,000                │
│  Theoretical Win: CFA 75,000            │
│                                         │
│  Comps Earned: CFA 750 (0.1% of Theo)   │
│                                         │
│  [Print Ticket]  [Confirm]              │
└─────────────────────────────────────────┘
```

**Theoretical Win Calculation**:
```
Theo = Avg Bet × Hands Played × House Edge

Example (Blackjack, House Edge 0.5%):
Theo = 50,000 × 300 × 0.005
Theo = CFA 75,000
```

**Comps Calculation**:
```
Comps = Theo × 0.1%

Example:
Comps = 75,000 × 0.001
Comps = CFA 750
```

---

#### 4. Print Rating Ticket

**Thermal Receipt**:
```
================================
    PLAYER RATING SUMMARY
================================
Player: John Doe
Member ID: P-2026-0123
Tier: VIP Gold
--------------------------------
Table: BJ-01
Game: Blackjack
Session Duration: 2h 30m
--------------------------------
Buy-In: CFA 1,000,000 (Cash)
Cash-Out: CFA 850,000 (Cash)
Win/Loss: -CFA 150,000
--------------------------------
Hands Played: 300 (est.)
Average Bet: CFA 50,000
Theoretical Win: CFA 75,000
--------------------------------
Comps Earned: CFA 750
New Comps Balance: CFA 1,500
--------------------------------
Inspector: Jane Doe
Date: 2026-03-03 17:00:25
================================
   Thank you for playing!
================================
```

**Receipt Features**:
- Professional format
- All session details
- Auto-calculated metrics
- Comps balance updated
- Player copy

---

### Rating Management

#### Active Sessions Overview
```
┌─────────────────────────────────────────┐
│  ACTIVE SESSIONS (23)                   │
├─────────────────────────────────────────┤
│  Table  │ Player        │ Duration      │
├─────────────────────────────────────────┤
│  BJ-01  │ John Doe      │ 2h 15m        │
│  BJ-01  │ Jane Smith    │ 1h 45m        │
│  BJ-02  │ Mike Johnson  │ 0h 30m        │
│  RO-01  │ Sarah Lee     │ 3h 10m        │
│  ...    │ ...           │ ...           │
└─────────────────────────────────────────┘

[View All]  [Filter by Table]  [Export]
```

**Quick Actions**:
- View session details
- Update average bet
- Pause/resume
- End session
- Print interim ticket

#### Completed Sessions History
```
┌─────────────────────────────────────────┐
│  COMPLETED SESSIONS                     │
├─────────────────────────────────────────┤
│  Date       │ Player     │ Win/Loss     │
├─────────────────────────────────────────┤
│  03/03 17:00│ John Doe   │ -150,000     │
│  03/03 16:30│ Jane Smith │ +220,000     │
│  03/03 15:45│ Mike Brown │ -95,000      │
│  ...        │ ...        │ ...          │
└─────────────────────────────────────────┘

[View Details]  [Filter]  [Export]
```

**Available Filters**:
- Date range
- Player
- Table
- Win/loss range
- Duration
- Property

---

### Advanced Features

#### Multi-Table Sessions
**Scenario**: Player moves between tables

```
Session 1: BJ-01 (2h 30m)
  Buy-In: CFA 1,000,000
  Cash-Out: Chips (kept for next table)

Session 2: RO-01 (1h 15m)
  Buy-In: Chips from BJ-01
  Cash-Out: CFA 1,200,000

Combined:
  Total Buy-In: CFA 1,000,000
  Total Cash-Out: CFA 1,200,000
  Net Win/Loss: +CFA 200,000 (Player Win)
  Combined Theo: CFA 120,000
  Total Comps: CFA 1,200
```

**System Handles**:
- Linking sessions
- Combined calculations
- Cross-table tracking
- Unified player history

---

#### Buy-In Types

**Cash Buy-In**:
- Player gives cash
- Receives chips
- Recorded in Drop
- Contributes to table drop

**Chips Buy-In**:
- Player already has chips (from cage or previous table)
- No cash exchange
- NOT recorded in Drop
- Tracked separately

**Why This Matters**:
- Accurate drop calculation
- Financial reconciliation
- Regulatory compliance

---

#### Player Cashout System

**Even Exchange**:
```
┌─────────────────────────────────────────┐
│  PLAYER CASHOUT                         │
├─────────────────────────────────────────┤
│  Player: John Doe ▼                     │
│  Chips Presented: CFA 850,000           │
│  Cash Given: CFA 850,000                │
│                                         │
│  This is an EVEN EXCHANGE               │
│  (Not counted as fill/credit)           │
│                                         │
│  Cashier: cashier1                      │
│                                         │
│  [Process Cashout]                      │
└─────────────────────────────────────────┘
```

**Receipt Printed**:
```
================================
    PLAYER CASHOUT
================================
Player: John Doe
Member ID: P-2026-0123
--------------------------------
Chips: CFA 850,000
Cash Given: CFA 850,000
--------------------------------
Cashier: cashier1
Date: 2026-03-03 17:05:30
Transaction ID: CSH-2026-0158
================================
   Thank you for visiting!
================================
```

**Key Points**:
- Direct exchange (chips for cash)
- Does not affect table float
- Separate from fills/credits
- Tracked for accounting
- Receipt for player record

---

### Rating Reports

#### Player Performance Report
```
┌─────────────────────────────────────────┐
│  PLAYER: John Doe (P-2026-0123)         │
├─────────────────────────────────────────┤
│  Total Sessions: 45                     │
│  Total Hours: 112h 30m                  │
│  Total Drop: CFA 25,000,000             │
│  Net Win/Loss: -CFA 3,200,000 (Loss)    │
│  Average Bet: CFA 45,000                │
│  Lifetime Theo: CFA 2,800,000           │
│  Lifetime Comps: CFA 28,000             │
│  Comps Used: CFA 15,000                 │
│  Comps Balance: CFA 13,000              │
│                                         │
│  Last Visit: 2026-03-03                 │
│  Favorite Table: BJ-01 (28 sessions)    │
│  Win Rate: 35% of sessions              │
└─────────────────────────────────────────┘
```

#### Table Performance Report
```
┌─────────────────────────────────────────┐
│  TABLE: BJ-01 (Blackjack)               │
├─────────────────────────────────────────┤
│  Sessions Today: 23                     │
│  Total Drop: CFA 8,500,000              │
│  Table Win: CFA 425,000                 │
│  Hold %: 5.0%                           │
│                                         │
│  Average Session: 2h 15m                │
│  Average Buy-In: CFA 370,000            │
│  Average Bet: CFA 48,000                │
│                                         │
│  Most Profitable Shift: 20:00-04:00     │
│  Busiest Hour: 22:00-23:00              │
└─────────────────────────────────────────┘
```

---

# 7. DROP MANAGEMENT

## Cash Transaction Tracking

### What is "Drop"?

**Drop** = Total cash inserted into table drop boxes during play

**Purpose**:
- Track table revenue
- Calculate hold percentage
- Financial reconciliation
- Regulatory reporting

**When Drop Occurs**:
- Player buys chips with cash at table
- Cash goes into drop box
- Recorded by inspector

---

### Record Drop Transaction

```
┌─────────────────────────────────────────┐
│  RECORD DROP                            │
├─────────────────────────────────────────┤
│  Table: BJ-01 ▼                         │
│  Player: John Doe ▼ (optional)          │
│  Amount: CFA 500,000                    │
│  Timestamp: 2026-03-03 14:30 (auto)     │
│                                         │
│  Inspector: Jane Doe                    │
│                                         │
│  [Record Drop]  [Cancel]                │
└─────────────────────────────────────────┘
```

**Process**:
1. Player gives cash to dealer
2. Dealer drops cash in box
3. Inspector records amount in system
4. Drop added to table total
5. Contributes to drop report

---

### Drop Reports

#### Daily Drop Summary
```
┌─────────────────────────────────────────┐
│  DROP SUMMARY - 2026-03-03              │
├─────────────────────────────────────────┤
│  Total Drop: CFA 45,000,000             │
│  Total Tables: 12                       │
│  Average per Table: CFA 3,750,000       │
│                                         │
│  DROP BY TABLE:                         │
│  BJ-01:  CFA 8,500,000                  │
│  BJ-02:  CFA 6,200,000                  │
│  RO-01:  CFA 5,800,000                  │
│  BC-02:  CFA 4,900,000                  │
│  ...                                    │
│                                         │
│  [Export to Excel]  [Print]             │
└─────────────────────────────────────────┘
```

#### Drop by Shift
```
┌─────────────────────────────────────────┐
│  DROP BY SHIFT                          │
├─────────────────────────────────────────┤
│  Shift 1 (08:00-16:00): CFA 12,000,000  │
│  Shift 2 (16:00-00:00): CFA 22,000,000  │
│  Shift 3 (00:00-08:00): CFA 11,000,000  │
│                                         │
│  Peak Shift: Shift 2 (Evening)          │
└─────────────────────────────────────────┘
```

#### Drop vs Win Analysis
```
┌─────────────────────────────────────────┐
│  HOLD % ANALYSIS                        │
├─────────────────────────────────────────┤
│  Total Drop: CFA 45,000,000             │
│  Total Win:  CFA 2,250,000              │
│  Hold %:     5.0%                       │
│                                         │
│  Industry Standard: 4-8%                │
│  Status: ✅ Within Normal Range         │
│                                         │
│  BY TABLE:                              │
│  BJ-01: 5.2% ✅                         │
│  BJ-02: 4.8% ✅                         │
│  RO-01: 6.1% ✅                         │
│  BC-02: 3.2% ⚠️ Low                    │
└─────────────────────────────────────────┘
```

---

### Physical Drop Count

#### End-of-Day Drop Count
```
┌─────────────────────────────────────────┐
│  DROP COUNT - BJ-01                     │
├─────────────────────────────────────────┤
│  System Recorded: CFA 8,500,000         │
│  Physical Count:  CFA ___________       │
│                                         │
│  Counted By: ____________               │
│  Verified By: ____________              │
│  Timestamp: 2026-03-03 08:00            │
│                                         │
│  [Submit Count]                         │
└─────────────────────────────────────────┘
```

**Reconciliation**:
```
If Physical Count = System Recorded:
  ✅ Balanced

If Physical Count ≠ System Recorded:
  ⚠️ Discrepancy Investigation Required
  
  Variance: CFA +/- X
  Reasons to investigate:
  - Counting error
  - Recording error
  - Missing drops
  - Security concern
```

---

# 8. CAGE OPERATIONS

## Cashier Workstation

### Overview

The **Cage** is the central cash handling area where:
- Table floats are opened/closed
- Fills and credits are processed
- Vault transfers are managed
- Player cashouts are handled
- Holding chips are tracked

**Access**: Cashier user type only (plus Manager/Super Manager oversight)

---

### Cage Dashboard

```
┌─────────────────────────────────────────┐
│  CAGE OPERATIONS                        │
├─────────────────────────────────────────┤
│  Cashier: cashier1                      │
│  Shift: 08:00 - 16:00                   │
│  Current Vault Balance: CFA 150,000,000 │
│                                         │
│  TODAY'S ACTIVITY:                      │
│  • Floats Opened: 12                    │
│  • Floats Closed: 8                     │
│  • Fills Processed: 15                  │
│  • Credits Received: 7                  │
│  • Vault Transfers: 3                   │
│  • Player Cashouts: 45                  │
│                                         │
│  [New Transaction] ▼                    │
│    • Open Float                         │
│    • Close Float                        │
│    • Process Fill                       │
│    • Process Credit                     │
│    • Player Cashout                     │
│    • Vault Transfer                     │
│    • Holding Chips                      │
└─────────────────────────────────────────┘
```

---

### Vault Transfer System

#### Request Transfer

```
┌─────────────────────────────────────────┐
│  VAULT TRANSFER REQUEST                 │
├─────────────────────────────────────────┤
│  Transfer Type:                         │
│    ◉ Withdrawal (Vault → Cage)         │
│    ○ Deposit (Cage → Vault)            │
│                                         │
│  Amount: CFA 10,000,000                 │
│  Reason: Replenish cage float           │
│                                         │
│  Requested By: cashier1                 │
│  Timestamp: 2026-03-03 14:30            │
│                                         │
│  Status: ⏳ Pending Approval            │
│                                         │
│  [Submit Request]  [Cancel]             │
└─────────────────────────────────────────┘
```

**Status Flow**:
```
Cashier Request → Pending Approval → Manager Review
                                   ↓
                            Requires Signature
                                   ↓
                            Manager Password Entry
                                   ↓
                            ✅ Approved or ❌ Rejected
```

---

#### Manager Approval Process

**Approval Dialog**:
```
┌─────────────────────────────────────────┐
│  VAULT TRANSFER APPROVAL                │
├─────────────────────────────────────────┤
│  Request ID: VLT-2026-0042              │
│  Requested By: cashier1                 │
│  Amount: CFA 10,000,000                 │
│  Type: Withdrawal                       │
│  Reason: Replenish cage float           │
│                                         │
│  AUTHORIZATION REQUIRED                 │
│                                         │
│  Manager Username: manager1             │
│  Manager Password: ••••••••             │
│                                         │
│  Signature: [Digital signature pad]     │
│                                         │
│  [Approve]  [Reject]                    │
└─────────────────────────────────────────┘
```

**Dual-Signature System**:
- Cashier initiates (first signature)
- Manager approves (second signature)
- Both signatures with passwords
- Complete audit trail
- Printed receipt with both names

---

#### Approved Transfer Receipt

**Thermal Receipt (2 copies)**:
```
================================
    VAULT TRANSFER
================================
Type: Withdrawal
Amount: CFA 10,000,000
Direction: Vault → Cage
--------------------------------
Requested By: cashier1
Signature: [Digital sig]
Password Verified: ✅
--------------------------------
Approved By: manager1
Signature: [Digital sig]
Password Verified: ✅
--------------------------------
Date: 2026-03-03 14:35:25
Transaction ID: VLT-2026-0042
--------------------------------
Previous Vault: CFA 150,000,000
Transfer Amount: -CFA 10,000,000
New Vault: CFA 140,000,000
================================
  Authorized by Management
================================

Copy 1: Cashier
Copy 2: Management File
```

---

### Holding Chips Management

```
┌─────────────────────────────────────────┐
│  HOLDING CHIPS                          │
├─────────────────────────────────────────┤
│  Table: BJ-01 ▼                         │
│  Amount: CFA 500,000                    │
│                                         │
│  Reason: Player dispute                 │
│  Details: Chip authenticity verification│
│                                         │
│  Held By: manager1                      │
│  Timestamp: 2026-03-03 14:30            │
│                                         │
│  Status: 🔒 Held                        │
│                                         │
│  [Release Chips]  [Add Note]            │
└─────────────────────────────────────────┘
```

**Release Process**:
```
┌─────────────────────────────────────────┐
│  RELEASE HOLDING CHIPS                  │
├─────────────────────────────────────────┤
│  Holding ID: HLD-2026-0012              │
│  Amount: CFA 500,000                    │
│  Original Reason: Player dispute        │
│                                         │
│  RELEASE DETAILS:                       │
│  Resolution: Chips verified authentic   │
│  Return To: ◉ Table  ○ Player  ○ Vault │
│                                         │
│  Authorized By: manager1                │
│  Password: ••••••••                     │
│                                         │
│  [Release]  [Cancel]                    │
└─────────────────────────────────────────┘
```

**Holding Chips Report**:
```
┌─────────────────────────────────────────┐
│  HOLDING CHIPS SUMMARY                  │
├─────────────────────────────────────────┤
│  Currently Held: CFA 2,500,000          │
│  Number of Holdings: 5                  │
│                                         │
│  BY STATUS:                             │
│  • Pending: 3 (CFA 1,800,000)           │
│  • Resolved: 2 (CFA 700,000)            │
│                                         │
│  OLDEST HOLDING:                        │
│  • BJ-01, CFA 500,000, 3 days           │
│                                         │
│  [View Details]  [Generate Report]      │
└─────────────────────────────────────────┘
```

---

### Cashier Shift Report

**End-of-Shift Summary**:
```
┌─────────────────────────────────────────┐
│  CASHIER SHIFT REPORT                   │
├─────────────────────────────────────────┤
│  Cashier: cashier1                      │
│  Shift: 08:00 - 16:00 (8 hours)         │
│  Date: 2026-03-03                       │
│                                         │
│  TRANSACTIONS:                          │
│  • Floats Opened: 12 (CFA 60,000,000)   │
│  • Floats Closed: 8 (CFA 52,000,000)    │
│  • Fills: 15 (CFA 28,000,000)           │
│  • Credits: 7 (CFA 12,000,000)          │
│  • Player Cashouts: 45 (CFA 38,000,000) │
│  • Vault Transfers: 2 (CFA 15,000,000)  │
│                                         │
│  TOTALS:                                │
│  Cash Out: CFA 138,000,000              │
│  Cash In:  CFA 64,000,000               │
│  Net:      -CFA 74,000,000              │
│                                         │
│  VAULT BALANCE:                         │
│  Starting: CFA 150,000,000              │
│  Ending:   CFA 135,000,000              │
│  Change:   -CFA 15,000,000              │
│                                         │
│  [Export]  [Print]  [Email]             │
└─────────────────────────────────────────┘
```

---

# 9. COMPS MANAGEMENT SYSTEM

## Three-Mode Comps Tracking

### Overview

The **Comps System** manages complimentary services with three distinct modes:

1. **Free Comps** - Redeem against player comp balance
2. **Cash Sales (POS)** - Regular sales with VIP discounts
3. **Staff Purchases** - Employee purchases with 50% discount

**Access**: Waiter user type (primary), Host (full access), Manager (approval/oversight)

---

### Mode 1: Free Comps

#### Redeem Player Comps

**Scan Player QR Code**:
```
┌─────────────────────────────────────────┐
│  FREE COMP REDEMPTION                   │
├─────────────────────────────────────────┤
│  [📷 Scan Player QR Code]               │
│                                         │
│  Player: John Doe                       │
│  Member ID: P-2026-0123                 │
│  Tier: VIP Gold                         │
│  Comps Balance: CFA 13,000              │
└─────────────────────────────────────────┘
```

**Select Items**:
```
┌─────────────────────────────────────────┐
│  SELECT COMP ITEMS                      │
├─────────────────────────────────────────┤
│  🍺 Beer          x 2    CFA 10,000     │
│  🥃 Whisky        x 1    CFA 15,000     │
│  🚬 Cigarettes    x 1    CFA 3,000      │
│                                         │
│  Subtotal:               CFA 28,000     │
│  Available Comps:        CFA 13,000     │
│                                         │
│  ⚠️ Insufficient Comps!                 │
│  Overage: CFA 15,000                    │
│                                         │
│  Options:                               │
│  • Remove items                         │
│  • Host approval for overage            │
│  • Player pays difference               │
└─────────────────────────────────────────┘
```

**Within Balance**:
```
┌─────────────────────────────────────────┐
│  COMP REDEMPTION SUMMARY                │
├─────────────────────────────────────────┤
│  Player: John Doe                       │
│                                         │
│  Items:                                 │
│  • Beer x 2          CFA 10,000         │
│  • Soft Drink x 1    CFA 2,000          │
│                                         │
│  Total:              CFA 12,000         │
│                                         │
│  Previous Balance:   CFA 13,000         │
│  Redeemed:          -CFA 12,000         │
│  New Balance:        CFA 1,000          │
│                                         │
│  Waiter: waiter1                        │
│                                         │
│  [Confirm]  [Print Receipt]             │
└─────────────────────────────────────────┘
```

**Receipt Printed**:
```
================================
    COMPLIMENTARY SERVICE
================================
Player: John Doe
Member ID: P-2026-0123
Tier: VIP Gold
--------------------------------
ITEMS:
Beer x 2           CFA 10,000
Soft Drink x 1     CFA 2,000
--------------------------------
Subtotal:          CFA 12,000
Comp Discount:    -CFA 12,000
TOTAL DUE:         CFA 0
--------------------------------
Previous Balance:  CFA 13,000
Redeemed:         -CFA 12,000
New Balance:       CFA 1,000
--------------------------------
Waiter: waiter1
Date: 2026-03-03 15:30:25
================================
    Thank you for playing!
================================
```

---

### Mode 2: Cash Sales (POS)

#### Regular Sale

**Select Items**:
```
┌─────────────────────────────────────────┐
│  CASH SALE (POS)                        │
├─────────────────────────────────────────┤
│  Customer: Walk-in / Player             │
│                                         │
│  🍺 Beer          x 3    CFA 15,000     │
│  🍔 Burger        x 2    CFA 50,000     │
│  🥤 Soft Drink    x 2    CFA 4,000      │
│                                         │
│  Subtotal:               CFA 69,000     │
│  Tax (if applicable):    CFA 0          │
│  TOTAL:                  CFA 69,000     │
│                                         │
│  Payment: ◉ Cash  ○ Card               │
│  Amount Received: CFA 70,000            │
│  Change: CFA 1,000                      │
│                                         │
│  [Complete Sale]  [Cancel]              │
└─────────────────────────────────────────┘
```

**Receipt Printed**:
```
================================
    CASINO F&B SALE
================================
ITEMS:
Beer x 3           CFA 15,000
Burger x 2         CFA 50,000
Soft Drink x 2     CFA 4,000
--------------------------------
Subtotal:          CFA 69,000
Tax:               CFA 0
TOTAL:             CFA 69,000
--------------------------------
Payment Method: Cash
Amount Received: CFA 70,000
Change Given:    CFA 1,000
--------------------------------
Waiter: waiter1
Date: 2026-03-03 15:45:12
Transaction: POS-2026-0234
================================
    Thank you!
================================
```

---

#### VIP Discount Sale

**Scan Player for Discount**:
```
┌─────────────────────────────────────────┐
│  CASH SALE WITH VIP DISCOUNT            │
├─────────────────────────────────────────┤
│  [📷 Scan Player QR Code]               │
│                                         │
│  Player: Sarah Lee                      │
│  Tier: VIP Platinum                     │
│  Eligible for: 20% VIP Discount         │
└─────────────────────────────────────────┘
```

**Apply Discount**:
```
┌─────────────────────────────────────────┐
│  VIP DISCOUNTED SALE                    │
├─────────────────────────────────────────┤
│  Player: Sarah Lee (VIP Platinum)       │
│                                         │
│  🥃 Premium Whisky  x 2    CFA 60,000   │
│  🍔 Steak Dinner    x 1    CFA 80,000   │
│                                         │
│  Subtotal:                 CFA 140,000  │
│  VIP Discount (20%):      -CFA 28,000   │
│                                         │
│  🔐 MANAGER APPROVAL REQUIRED           │
│                                         │
│  Manager Username: manager1             │
│  Manager Password: ••••••••             │
│                                         │
│  TOTAL AFTER DISCOUNT:     CFA 112,000  │
│                                         │
│  [Apply Discount]  [Regular Price]      │
└─────────────────────────────────────────┘
```

**Why Manager Approval?**
- Prevents abuse
- Ensures proper authorization
- Complete audit trail
- Security for high-value discounts

**Receipt with Approval**:
```
================================
    VIP DISCOUNTED SALE
================================
Player: Sarah Lee
Member ID: P-2026-0456
Tier: VIP Platinum
--------------------------------
ITEMS:
Premium Whisky x 2  CFA 60,000
Steak Dinner x 1    CFA 80,000
--------------------------------
Subtotal:           CFA 140,000
VIP Discount (20%): -CFA 28,000
TOTAL:              CFA 112,000
--------------------------------
Payment Method: Cash
Amount Received: CFA 120,000
Change Given:    CFA 8,000
--------------------------------
Waiter: waiter1
Approved By: manager1
Date: 2026-03-03 16:15:42
Transaction: POS-2026-0235
================================
  VIP Discount Applied
    Thank you!
================================
```

---

### Mode 3: Staff Purchases

#### Employee Purchase with Discount

**Scan Employee QR Card**:
```
┌─────────────────────────────────────────┐
│  STAFF PURCHASE                         │
├─────────────────────────────────────────┤
│  [📷 Scan Employee QR Card]             │
│                                         │
│  Employee: Mike Johnson                 │
│  Employee ID: EMP-0042                  │
│  Department: Floor Operations           │
│                                         │
│  ✅ Staff Discount Enabled              │
│  Discount: 50% OFF                      │
└─────────────────────────────────────────┘
```

**Select Items**:
```
┌─────────────────────────────────────────┐
│  STAFF PURCHASE                         │
├─────────────────────────────────────────┤
│  Employee: Mike Johnson (EMP-0042)      │
│                                         │
│  🍔 Lunch Combo     x 1    CFA 25,000   │
│  🥤 Soft Drink      x 1    CFA 2,000    │
│                                         │
│  Subtotal:                 CFA 27,000   │
│  Staff Discount (50%):    -CFA 13,500   │
│                                         │
│  TOTAL DUE:                CFA 13,500   │
│                                         │
│  Payment: ◉ Cash  ○ Payroll Deduction  │
│                                         │
│  [Complete Purchase]  [Cancel]          │
└─────────────────────────────────────────┘
```

**Receipt Printed**:
```
================================
    STAFF PURCHASE
================================
Employee: Mike Johnson
Employee ID: EMP-0042
Department: Floor Operations
--------------------------------
ITEMS:
Lunch Combo x 1     CFA 25,000
Soft Drink x 1      CFA 2,000
--------------------------------
Subtotal:           CFA 27,000
Staff Discount (50%): -CFA 13,500
TOTAL:              CFA 13,500
--------------------------------
Payment Method: Cash
Amount Paid:     CFA 13,500
--------------------------------
Served By: waiter1
Date: 2026-03-03 12:30:15
Transaction: STF-2026-0087
================================
  Staff Discount Applied
    Enjoy your meal!
================================
```

**Staff Discount Management**:
- Enabled/disabled per employee in Employee Management
- Only active when enabled
- Automatically applied when employee QR scanned
- Tracked separately for payroll/accounting

---

### Menu Management

**Setup → Menu**:
```
┌─────────────────────────────────────────┐
│  MENU MANAGEMENT                        │
├─────────────────────────────────────────┤
│  DRINKS                                 │
│  • Beer             CFA 5,000   [Edit]  │
│  • Wine             CFA 10,000  [Edit]  │
│  • Whisky           CFA 15,000  [Edit]  │
│  • Premium Whisky   CFA 30,000  [Edit]  │
│  • Soft Drink       CFA 2,000   [Edit]  │
│                                         │
│  CIGARETTES                             │
│  • Pack             CFA 3,000   [Edit]  │
│  • Carton           CFA 30,000  [Edit]  │
│                                         │
│  FOOD                                   │
│  • Appetizer        CFA 10,000  [Edit]  │
│  • Burger           CFA 25,000  [Edit]  │
│  • Steak Dinner     CFA 80,000  [Edit]  │
│  • Dessert          CFA 8,000   [Edit]  │
│                                         │
│  [Add New Item]  [Import from Excel]    │
└─────────────────────────────────────────┘
```

**Add/Edit Item**:
```
┌─────────────────────────────────────────┐
│  ADD MENU ITEM                          │
├─────────────────────────────────────────┤
│  Category: Drinks ▼                     │
│  Item Name: Champagne                   │
│  Price: CFA 50,000                      │
│  Description: Premium champagne         │
│  Available: ☑ Yes                       │
│                                         │
│  [Save]  [Cancel]                       │
└─────────────────────────────────────────┘
```

---

### Comps Reports

#### Daily Comps Report
```
┌─────────────────────────────────────────┐
│  COMPS REPORT - 2026-03-03              │
├─────────────────────────────────────────┤
│  FREE COMPS REDEEMED:                   │
│  • Total Value: CFA 125,000             │
│  • Transactions: 45                     │
│  • Players: 32                          │
│  • Top Item: Beer (85 units)            │
│                                         │
│  CASH SALES:                            │
│  • Total Revenue: CFA 850,000           │
│  • Transactions: 123                    │
│  • VIP Discounts: CFA 45,000 (12 sales) │
│                                         │
│  STAFF PURCHASES:                       │
│  • Total Value: CFA 68,000              │
│  • Staff Discounts: CFA 68,000          │
│  • Transactions: 28                     │
│  • Employees: 18                        │
│                                         │
│  NET REVENUE:                           │
│  Cash Sales:      CFA 850,000           │
│  Less Discounts: -CFA 45,000            │
│  Net:             CFA 805,000           │
│                                         │
│  [Export]  [Print]  [Email]             │
└─────────────────────────────────────────┘
```

#### Player Comps History
```
┌─────────────────────────────────────────┐
│  COMPS HISTORY - John Doe               │
├─────────────────────────────────────────┤
│  Lifetime Comps Earned: CFA 28,000      │
│  Lifetime Comps Used:   CFA 15,000      │
│  Current Balance:       CFA 13,000      │
│                                         │
│  RECENT ACTIVITY:                       │
│  03/03 17:00  Earned     +CFA 750       │
│  03/03 15:30  Redeemed   -CFA 12,000    │
│  03/02 22:15  Earned     +CFA 1,200     │
│  03/02 19:45  Redeemed   -CFA 8,000     │
│  03/01 16:30  Earned     +CFA 950       │
│                                         │
│  MOST REDEEMED ITEMS:                   │
│  1. Beer (45 units)                     │
│  2. Soft Drinks (32 units)              │
│  3. Cigarettes (12 packs)               │
│                                         │
│  [View Full History]  [Export]          │
└─────────────────────────────────────────┘
```

#### Waiter Performance Report
```
┌─────────────────────────────────────────┐
│  WAITER PERFORMANCE - waiter1           │
├─────────────────────────────────────────┤
│  Shift: 08:00 - 16:00                   │
│  Date: 2026-03-03                       │
│                                         │
│  FREE COMPS:                            │
│  • Transactions: 15                     │
│  • Value: CFA 42,000                    │
│  • Players Served: 12                   │
│                                         │
│  CASH SALES:                            │
│  • Transactions: 38                     │
│  • Revenue: CFA 285,000                 │
│  • Average Sale: CFA 7,500              │
│                                         │
│  STAFF PURCHASES:                       │
│  • Transactions: 8                      │
│  • Value: CFA 22,000                    │
│                                         │
│  TOTAL SERVICE:                         │
│  • All Transactions: 61                 │
│  • Total Value: CFA 349,000             │
│                                         │
│  [View Details]  [Export]               │
└─────────────────────────────────────────┘
```

---

# 10. REPORTS & ANALYTICS

## Comprehensive Reporting System

### Report Categories

#### 1. Financial Reports
- Daily/Weekly/Monthly revenue
- Drop analysis
- Win/loss statements
- Hold percentage
- Table performance
- Profit & loss

#### 2. Player Reports
- Player statistics
- Tier distribution
- Player lifetime value
- Win/loss by player
- Session history
- Comps usage

#### 3. Operational Reports
- Float transactions
- Cage activity
- Vault transfers
- Table utilization
- Shift summaries
- Staff performance

#### 4. Comps Reports
- Comps redeemed
- POS sales
- Staff purchases
- Item popularity
- Revenue by category
- Waiter performance

#### 5. Audit Reports
- All system activity
- User actions
- Security events
- Data changes
- Login history

---

### Daily Report

```
┌─────────────────────────────────────────┐
│  DAILY CASINO REPORT                    │
│  Date: 2026-03-03                       │
├─────────────────────────────────────────┤
│                                         │
│  OPERATIONS SUMMARY                     │
│  • Tables Opened: 12                    │
│  • Active Players Peak: 45              │
│  • Total Players: 156                   │
│  • Sessions Completed: 234              │
│                                         │
│  FINANCIAL SUMMARY                      │
│  • Total Drop: CFA 45,000,000           │
│  • Total Win: CFA 2,250,000             │
│  • Hold %: 5.0%                         │
│  • Theo Win: CFA 3,200,000              │
│  • Comps Earned: CFA 32,000             │
│  • Comps Redeemed: CFA 28,000           │
│                                         │
│  TABLE PERFORMANCE                      │
│  Best Table: BJ-01 (CFA 425,000 win)    │
│  Most Active: RO-01 (45 sessions)       │
│  Highest Drop: BJ-03 (CFA 8,500,000)    │
│                                         │
│  PLAYER HIGHLIGHTS                      │
│  Biggest Winner: John Doe (+CFA 850,000)│
│  Biggest Loser: Jane Smith (-CFA 720,000)│
│  Most Sessions: Mike Brown (8)          │
│                                         │
│  CAGE ACTIVITY                          │
│  • Floats Opened: 12 (CFA 60M)          │
│  • Floats Closed: 12 (CFA 72M)          │
│  • Fills Processed: 28 (CFA 45M)        │
│  • Credits Received: 15 (CFA 22M)       │
│  • Player Cashouts: 156 (CFA 98M)       │
│  • Vault Transfers: 4 (CFA 25M)         │
│                                         │
│  [Export to Excel]  [Print]  [Email]    │
└─────────────────────────────────────────┘
```

---

### Custom Report Builder

```
┌─────────────────────────────────────────┐
│  CUSTOM REPORT BUILDER                  │
├─────────────────────────────────────────┤
│  Report Type: Player Performance ▼      │
│                                         │
│  DATE RANGE:                            │
│  From: 2026-03-01 ▼                     │
│  To:   2026-03-31 ▼                     │
│                                         │
│  FILTERS:                               │
│  ☑ Tier: VIP Gold                       │
│  ☐ Property: Main Casino                │
│  ☑ Minimum Sessions: 5                  │
│  ☐ Minimum Drop: CFA 1,000,000          │
│                                         │
│  INCLUDE:                               │
│  ☑ Total Drop                           │
│  ☑ Win/Loss                             │
│  ☑ Average Bet                          │
│  ☑ Session Count                        │
│  ☑ Comps Balance                        │
│  ☐ Last Visit Date                      │
│                                         │
│  SORT BY:                               │
│  Total Drop ▼  Descending ▼             │
│                                         │
│  [Generate Report]                      │
└─────────────────────────────────────────┘
```

---

### Export Options

**Excel Export**:
- All data in spreadsheet format
- Multiple sheets for complex reports
- Formulas included
- Ready for further analysis
- Compatible with Excel, Google Sheets, etc.

**PDF Export**:
- Professional formatted document
- Include charts and graphs
- Company branding
- Print-ready
- Email-friendly

**CSV Export**:
- Raw data format
- Import to other systems
- Database compatible
- Lightweight files

**Email Reports**:
- Schedule automatic delivery
- Daily, weekly, monthly
- Multiple recipients
- Attach as PDF or Excel

---

### Analytics Dashboard

#### Revenue Trends
```
┌─────────────────────────────────────────┐
│  REVENUE TRENDS (30 Days)               │
├─────────────────────────────────────────┤
│                                         │
│  [Line Chart: Daily Revenue]            │
│                                         │
│  Peak Day: Saturday (Avg CFA 52M)       │
│  Low Day: Tuesday (Avg CFA 38M)         │
│  Trend: ↗️ +15% vs last month           │
│                                         │
│  Best Week: Week 2 (CFA 285M)           │
│  Worst Week: Week 4 (CFA 245M)          │
└─────────────────────────────────────────┘
```

#### Player Behavior Analysis
```
┌─────────────────────────────────────────┐
│  PLAYER BEHAVIOR INSIGHTS               │
├─────────────────────────────────────────┤
│  Average Session: 2h 25m                │
│  Average Buy-In: CFA 385,000            │
│  Average Bet: CFA 42,000                │
│                                         │
│  Peak Hours:                            │
│  • 20:00-22:00 (45 avg players)         │
│  • 22:00-00:00 (52 avg players)         │
│                                         │
│  Popular Games:                         │
│  1. Blackjack (58% of sessions)         │
│  2. Roulette (25% of sessions)          │
│  3. Baccarat (12% of sessions)          │
│  4. Poker (5% of sessions)              │
│                                         │
│  Player Retention:                      │
│  • Return Rate (7 days): 68%            │
│  • Return Rate (30 days): 42%           │
└─────────────────────────────────────────┘
```

---

# 11. EMPLOYEE MANAGEMENT

## Comprehensive Staff Administration

### Employee Database

#### Employee Profile
```
┌─────────────────────────────────────────┐
│  EMPLOYEE PROFILE                       │
├─────────────────────────────────────────┤
│  Employee ID: EMP-0042                  │
│  Name: Mike Johnson                     │
│  Position: Floor Inspector              │
│  Department: Gaming Operations          │
│  User Group: Inspector ▼                │
│                                         │
│  Contact Information:                   │
│  Email: mike.johnson@casino.com         │
│  Phone: +237 6XX XXX XXX                │
│                                         │
│  Employment Details:                    │
│  Starting Date: 2024-01-15              │
│  Date of Birth: 1990-08-22              │
│  Next Birthday: 2026-08-22 (5 months)   │
│                                         │
│  Performance Reviews:                   │
│  Last Review: 2026-01-15                │
│  Next Review: 2026-04-15 (1 month) ⚠️   │
│  Review Frequency: Every 3 months       │
│                                         │
│  Benefits:                              │
│  ☑ Staff Discount Enabled (50%)        │
│  ☐ VIP Access                           │
│                                         │
│  Profile Picture: [Upload]              │
│  QR Code: [Auto-generated]              │
│                                         │
│  [Edit]  [Print QR Card]  [Delete]      │
└─────────────────────────────────────────┘
```

---

### Employee QR Cards

**Scan for Login (Optional)**:
```
┌─────────────────────────────────────────┐
│  EMPLOYEE QR LOGIN                      │
├─────────────────────────────────────────┤
│  [📷 Scan Employee QR Card]             │
│                                         │
│  ─── OR ───                             │
│                                         │
│  Username: _______________              │
│  Password: _______________              │
│                                         │
│  [Login]                                │
└─────────────────────────────────────────┘
```

**QR Card Design**:
```
┌─────────────────────────────────────────┐
│        CASINO NAME                      │
│        EMPLOYEE ID CARD                 │
│                                         │
│   [Profile Photo]    ███████████        │
│                      ███████████        │
│   Mike Johnson       ███████████        │
│   Floor Inspector    ███████████        │
│   EMP-0042           (QR Code)          │
│                                         │
│   Member Since: 2024                    │
└─────────────────────────────────────────┘
```

**QR Card Uses**:
- Optional app login
- Staff purchase identification
- Access control integration (future)
- Time clock integration (future)

---

### Performance Reviews

#### Review Tracking
```
┌─────────────────────────────────────────┐
│  PERFORMANCE REVIEW SCHEDULE            │
├─────────────────────────────────────────┤
│  UPCOMING REVIEWS (Next 30 Days):       │
│                                         │
│  • Mike Johnson   - Due: 03/15 (12 days)│
│  • Sarah Lee      - Due: 03/22 (19 days)│
│  • Tom Brown      - Due: 03/28 (25 days)│
│                                         │
│  OVERDUE REVIEWS:                       │
│  ⚠️ Jane Doe      - Overdue by 5 days   │
│                                         │
│  [Schedule Reviews]  [View All]         │
└─────────────────────────────────────────┘
```

#### Conduct Review
```
┌─────────────────────────────────────────┐
│  PERFORMANCE REVIEW                     │
├─────────────────────────────────────────┤
│  Employee: Mike Johnson (EMP-0042)      │
│  Review Period: 12/15/2025 - 03/15/2026 │
│  Reviewer: manager1                     │
│                                         │
│  PERFORMANCE RATINGS:                   │
│  Attendance:     ⭐⭐⭐⭐⭐ Excellent     │
│  Punctuality:    ⭐⭐⭐⭐⭐ Excellent     │
│  Work Quality:   ⭐⭐⭐⭐☆ Very Good     │
│  Teamwork:       ⭐⭐⭐⭐⭐ Excellent     │
│  Customer Service: ⭐⭐⭐⭐☆ Very Good   │
│                                         │
│  Overall Rating: 4.6/5.0                │
│                                         │
│  STRENGTHS:                             │
│  • Excellent with players               │
│  • Detail-oriented                      │
│  • Team player                          │
│                                         │
│  AREAS FOR IMPROVEMENT:                 │
│  • Work on report timeliness            │
│                                         │
│  GOALS FOR NEXT PERIOD:                 │
│  • Complete reports within 24 hours     │
│  • Cross-train on cage operations       │
│                                         │
│  COMPENSATION ADJUSTMENT:               │
│  ◉ Merit Increase: 5%                   │
│  ○ No Change                            │
│  ○ Performance Plan                     │
│                                         │
│  NEXT REVIEW DATE: 2026-06-15           │
│                                         │
│  Reviewer Signature: ________________   │
│  Employee Signature: ________________   │
│  Date: 2026-03-15                       │
│                                         │
│  [Save Review]  [Print]  [Email Copy]   │
└─────────────────────────────────────────┘
```

---

### Birthday & Anniversary Tracking

```
┌─────────────────────────────────────────┐
│  UPCOMING BIRTHDAYS & ANNIVERSARIES     │
├─────────────────────────────────────────┤
│  BIRTHDAYS (Next 30 Days):              │
│  🎂 03/08 - Sarah Lee (36th birthday)   │
│  🎂 03/15 - Tom Brown (42nd birthday)   │
│  🎂 03/22 - Lisa White (29th birthday)  │
│                                         │
│  WORK ANNIVERSARIES (Next 30 Days):     │
│  🎉 03/10 - Mike Johnson (2 years)      │
│  🎉 03/25 - Jane Doe (5 years)          │
│                                         │
│  [Send Greetings]  [View Calendar]      │
└─────────────────────────────────────────┘
```

---

### Dashboard Statistics

```
┌─────────────────────────────────────────┐
│  EMPLOYEE DASHBOARD                     │
├─────────────────────────────────────────┤
│  TOTALS:                                │
│  • Total Employees: 45                  │
│  • Active: 42                           │
│  • On Leave: 3                          │
│                                         │
│  BY DEPARTMENT:                         │
│  • Gaming Operations: 25                │
│  • Cage: 8                              │
│  • Food & Beverage: 7                   │
│  • Management: 5                        │
│                                         │
│  UPCOMING EVENTS:                       │
│  • Reviews Due (30 days): 8             │
│  • Birthdays (30 days): 5               │
│  • Anniversaries (30 days): 3           │
│                                         │
│  STAFF DISCOUNTS:                       │
│  • Enabled Employees: 38                │
│  • Month-to-Date Usage: CFA 285,000     │
│  • Average per Employee: CFA 7,500      │
└─────────────────────────────────────────┘
```

---

### Excel Import/Export

**Import Employees**:
1. Download template
2. Fill in employee data
3. Upload file
4. System creates accounts
5. QR codes auto-generated

**Export Employees**:
- Full employee roster
- Contact information
- Performance review dates
- Birthday/anniversary list
- Payroll data

---

# 12. AUDIT LOGGING

## Complete System Activity Tracking

### What is Logged?

**Every Critical Action**:
- User logins/logouts
- Player CRUD operations
- Float transactions
- Rating sessions
- Drop recordings
- Vault transfers
- Comps transactions
- User management
- System configuration
- Data exports
- Report generation

**Each Log Entry Contains**:
- Timestamp (exact date/time)
- User (who performed action)
- Action type (what was done)
- Details (specific data)
- Property (if multi-property)
- IP address (where from)
- Device type (PC/tablet/phone)

---

### Audit Log View

```
┌─────────────────────────────────────────────────────────────────┐
│  AUDIT LOG                                                      │
├─────────────────────────────────────────────────────────────────┤
│  Filters: [All Users ▼] [All Actions ▼] [Today ▼]              │
├─────────────────────────────────────────────────────────────────┤
│  Time      │ User      │ Action              │ Details          │
├─────────────────────────────────────────────────────────────────┤
│  17:05:30  │ cashier1  │ VAULT_TRANSFER_REQ  │ CFA 10,000,000   │
│  17:04:15  │ manager1  │ VAULT_TRANSFER_APP  │ Approved VLT-042 │
│  17:00:25  │ inspector1│ RATING_END          │ John Doe, BJ-01  │
│  16:55:12  │ waiter1   │ COMP_REDEMPTION     │ Jane Smith, CFA 12K│
│  16:50:45  │ host1     │ PLAYER_CREATE       │ New: P-2026-0234 │
│  16:45:22  │ pitboss1  │ RATING_START        │ Mike Brown, RO-01│
│  16:40:10  │ cashier1  │ FLOAT_FILL          │ BJ-02, CFA 2M    │
│  16:35:55  │ inspector1│ DROP_RECORD         │ BJ-01, CFA 500K  │
│  16:30:42  │ cashier2  │ PLAYER_CASHOUT      │ Sarah Lee, 850K  │
│  ...       │ ...       │ ...                 │ ...              │
├─────────────────────────────────────────────────────────────────┤
│  [Export]  [Advanced Search]  [View Details]                    │
└─────────────────────────────────────────────────────────────────┘
```

---

### Detailed Log Entry

```
┌─────────────────────────────────────────┐
│  AUDIT LOG ENTRY DETAILS                │
├─────────────────────────────────────────┤
│  Entry ID: AUD-2026-123456              │
│                                         │
│  TIMESTAMP:                             │
│  Date: 2026-03-03                       │
│  Time: 17:05:30.245                     │
│                                         │
│  USER INFORMATION:                      │
│  Username: cashier1                     │
│  Full Name: Alice Johnson               │
│  User Type: Cashier                     │
│  IP Address: 192.168.1.10               │
│  Device: Windows PC (Chrome 121)        │
│                                         │
│  ACTION:                                │
│  Type: VAULT_TRANSFER_REQUEST           │
│  Category: Financial                    │
│  Severity: High                         │
│                                         │
│  DETAILS:                               │
│  Amount: CFA 10,000,000                 │
│  Transfer Type: Withdrawal              │
│  Reason: Replenish cage float           │
│  Status: Pending Approval               │
│  Transaction ID: VLT-2026-0042          │
│                                         │
│  PROPERTY:                              │
│  Main Casino                            │
│                                         │
│  [Close]  [Export This Entry]           │
└─────────────────────────────────────────┘
```

---

### Advanced Search & Filtering

```
┌─────────────────────────────────────────┐
│  ADVANCED AUDIT SEARCH                  │
├─────────────────────────────────────────┤
│  DATE RANGE:                            │
│  From: 2026-03-01 ▼                     │
│  To:   2026-03-31 ▼                     │
│                                         │
│  USER:                                  │
│  ☐ All Users                            │
│  ☑ Specific: cashier1 ▼                 │
│                                         │
│  ACTION TYPES:                          │
│  ☑ Vault Transfers                      │
│  ☑ Float Operations                     │
│  ☐ Player Operations                    │
│  ☐ Rating Sessions                      │
│  ☐ Comps Transactions                   │
│  ☐ User Management                      │
│                                         │
│  AMOUNT RANGE:                          │
│  Min: CFA 1,000,000                     │
│  Max: CFA 50,000,000                    │
│                                         │
│  SEVERITY:                              │
│  ☑ High      ☑ Medium      ☐ Low       │
│                                         │
│  PROPERTY:                              │
│  ☑ Main Casino  ☐ Branch Location       │
│                                         │
│  [Search]  [Reset]  [Save Search]       │
└─────────────────────────────────────────┘
```

---

### Security Event Monitoring

```
┌─────────────────────────────────────────┐
│  SECURITY EVENTS (Last 24 Hours)        │
├─────────────────────────────────────────┤
│  ⚠️ ALERTS:                             │
│  • Failed login attempts: 3             │
│    User: unknown_user (192.168.1.50)    │
│    Time: 15:30, 15:32, 15:35            │
│                                         │
│  • Large vault transfer: 1              │
│    User: cashier1                       │
│    Amount: CFA 10,000,000               │
│    Status: Approved                     │
│                                         │
│  • After-hours access: 2                │
│    User: manager1 (03:25)               │
│    User: pitboss1 (02:15)               │
│                                         │
│  ✅ NO CRITICAL ALERTS                  │
│                                         │
│  [View All]  [Configure Alerts]         │
└─────────────────────────────────────────┘
```

---

### Compliance Reports

**Generate Audit Report**:
```
┌─────────────────────────────────────────┐
│  AUDIT REPORT GENERATOR                 │
├─────────────────────────────────────────┤
│  Report Type: Regulatory Compliance ▼   │
│  Period: March 2026 ▼                   │
│                                         │
│  Include:                               │
│  ☑ All financial transactions           │
│  ☑ User access logs                     │
│  ☑ System configuration changes         │
│  ☑ Data exports                         │
│  ☑ Security events                      │
│                                         │
│  Format:                                │
│  ◉ PDF (Detailed)                       │
│  ○ Excel (Data)                         │
│  ○ Both                                 │
│                                         │
│  [Generate Report]                      │
└─────────────────────────────────────────┘
```

---

# 13. QR CODE SYSTEM

## Universal Identification

### QR Code Uses

#### 1. Player Identification
- Player QR cards
- Instant player lookup
- Start rating sessions
- Redeem comps
- Check player profile

#### 2. Employee Identification
- Employee QR cards
- Optional app login
- Staff purchase identification
- Time tracking (future)
- Access control (future)

---

### QR Code Scanning

**Camera Scanner**:
```
┌─────────────────────────────────────────┐
│  SCAN QR CODE                           │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │    [Camera View]                  │  │
│  │                                   │  │
│  │    Position QR code in frame      │  │
│  │                                   │  │
│  │    ┌─────────────────┐            │  │
│  │    │  Scan Area      │            │  │
│  │    │                 │            │  │
│  │    └─────────────────┘            │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Scanning...                            │
│                                         │
│  [Cancel]                               │
└─────────────────────────────────────────┘
```

**Instant Recognition**:
```
✅ QR Code Scanned!

Player: John Doe
Member ID: P-2026-0123
Tier: VIP Gold

[Start Rating]
[Redeem Comps]
[View Profile]
```

---

### QR Card Printing

#### Individual Player Card
```
┌─────────────────────────────────────────┐
│  PRINT PLAYER QR CARD                   │
├─────────────────────────────────────────┤
│  Player: John Doe                       │
│  Member ID: P-2026-0123                 │
│  Tier: VIP Gold                         │
│                                         │
│  Card Design: Standard ▼                │
│  Include Photo: ☑ Yes                   │
│  Card Stock: PVC Plastic                │
│                                         │
│  Printer: Card Printer 1 ▼              │
│                                         │
│  [Print Card]  [Preview]                │
└─────────────────────────────────────────┘
```

#### Bulk Player Cards
```
┌─────────────────────────────────────────┐
│  BULK PRINT QR CARDS                    │
├─────────────────────────────────────────┤
│  Select Players:                        │
│  ☑ John Doe (P-2026-0123)               │
│  ☑ Jane Smith (P-2026-0124)             │
│  ☑ Mike Brown (P-2026-0125)             │
│  ☐ Sarah Lee (P-2026-0126)              │
│  ☑ Tom White (P-2026-0127)              │
│  ... (52 more)                          │
│                                         │
│  ☑ Select All VIP Gold (25 players)     │
│                                         │
│  Total Selected: 28 cards               │
│                                         │
│  [Print All Cards]  [Preview Batch]     │
└─────────────────────────────────────────┘
```

**Print Queue**:
```
┌─────────────────────────────────────────┐
│  PRINT QUEUE - 28 Cards                 │
├─────────────────────────────────────────┤
│  ⏳ Printing: John Doe (1 of 28)        │
│  ✅ Complete: 0                         │
│  ⏸️ Pending: 27                         │
│                                         │
│  Estimated Time: 14 minutes             │
│                                         │
│  [Pause]  [Cancel]                      │
└─────────────────────────────────────────┘
```

---

### Employee QR Cards

**Print Employee Card**:
```
┌─────────────────────────────────────────┐
│  PRINT EMPLOYEE QR CARD                 │
├─────────────────────────────────────────┤
│  Employee: Mike Johnson                 │
│  Employee ID: EMP-0042                  │
│  Position: Floor Inspector              │
│                                         │
│  Card Design: Employee Badge ▼          │
│  Include Photo: ☑ Yes                   │
│  Include QR: ☑ Yes                      │
│  Staff Discount: ☑ Enabled              │
│                                         │
│  [Print Card]  [Preview]                │
└─────────────────────────────────────────┘
```

---

### QR Code Security

**Features**:
- Unique identifier per card
- Encrypted data
- Cannot be duplicated
- Linked to database record
- Instant verification

**Lost Card Procedure**:
1. Mark card as lost in system
2. QR code becomes invalid
3. Print replacement card
4. New QR code generated
5. Old card cannot be used

---

# 14. THERMAL PRINTING

## Automatic Receipt Generation

### Supported Printers

**Epson TM-T20III** (Primary)
- USB/Ethernet/Serial connection
- 80mm thermal paper
- Auto-cutter
- 200mm/sec printing
- Professional receipts

**Premax PM-RP 80** (Portable)
- Bluetooth/USB connection
- 80mm thermal paper
- Battery powered
- Mobile operations
- POS sales

---

### Receipt Types

#### 1. Float Receipts
- Float open
- Float close
- Fill
- Credit

#### 2. Rating Receipts
- Session summary
- Player stats
- Comps earned

#### 3. Cage Receipts
- Vault transfers
- Player cashout
- Holding chips

#### 4. Comps Receipts
- Free comp redemption
- Cash sales (POS)
- Staff purchases
- VIP discounted sales

#### 5. System Receipts
- Audit reports
- Shift summaries
- Daily reports

---

### Print Configuration

```
┌─────────────────────────────────────────┐
│  PRINTER SETTINGS                       │
├─────────────────────────────────────────┤
│  Default Printer: Epson TM-T20III ▼     │
│  Paper Size: 80mm                       │
│  Print Quality: Standard ▼              │
│  Auto-cut: ☑ Enabled                    │
│                                         │
│  RECEIPT OPTIONS:                       │
│  Font Size: Medium ▼                    │
│  Include Logo: ☑ Yes                    │
│  Include QR Code: ☑ For player receipts │
│  Copies: 1 ▼                            │
│                                         │
│  [Test Print]  [Save Settings]          │
└─────────────────────────────────────────┘
```

---

### Paper Specifications

**80mm Thermal Paper**:
- Width: 80mm (3.15 inches)
- Length: 80mm roll (varies)
- Type: Thermal (no ink required)
- Quality: High-grade for longevity
- Storage: Cool, dry location

**Order Information**:
- Rolls per box: 50-100
- Lifespan: 1-2 months (depending on volume)
- Cost: ~$1-2 per roll

---

# 15. HELP SYSTEM

## In-App Guidance

### Help Features

**Context-Sensitive Help**:
- Help button on every page
- Relevant documentation
- Step-by-step guides
- Video tutorials (future)

**Keyboard Shortcuts**:
- Press `Ctrl+H` anywhere
- Quick reference guide
- Printable cheat sheet

**PDF Generation**:
- Generate help docs as PDF
- Print for training
- Offline reference

---

### Help Topics

```
┌─────────────────────────────────────────┐
│  HELP CENTER                            │
├─────────────────────────────────────────┤
│  Search: _______________  [🔍]          │
│                                         │
│  POPULAR TOPICS:                        │
│  📚 Getting Started                     │
│  👤 Managing Players                    │
│  💰 Float Operations                    │
│  ⭐ Player Ratings                      │
│  🍷 Comps System                        │
│  📊 Reports & Analytics                 │
│  🖨️ Printer Setup                       │
│  📱 QR Code Scanning                    │
│                                         │
│  BY USER TYPE:                          │
│  • Cashier Guide                        │
│  • Inspector Guide                      │
│  • Pit Boss Guide                       │
│  • Manager Guide                        │
│  • Waiter Guide                         │
│  • Host Guide                           │
│                                         │
│  TROUBLESHOOTING:                       │
│  • Common Issues                        │
│  • Error Messages                       │
│  • Printer Problems                     │
│  • Login Issues                         │
│                                         │
│  [Download PDF Manual]                  │
│  [Contact Support]                      │
└─────────────────────────────────────────┘
```

---

### Quick Start Guides

**For Cashiers**:
1. Open a float
2. Process fills/credits
3. Close a float
4. Request vault transfer

**For Inspectors**:
1. Start player rating
2. Record drop
3. Update average bet
4. End rating session

**For Waiters**:
1. Scan player QR
2. Record comps
3. Process sales
4. Print receipt

---

# 16. TECHNICAL ARCHITECTURE

## Modern Cloud-Based System

### Technology Stack

**Frontend**:
- React 18 (latest)
- TypeScript (type safety)
- Tailwind CSS v4 (modern styling)
- React Router v7 (navigation)
- Recharts (analytics charts)
- Lucide Icons (UI icons)

**Backend**:
- Supabase (PostgreSQL database)
- RESTful API
- Real-time subscriptions
- Row-level security
- Automatic backups

**Hosting**:
- Vercel (web hosting)
- Global CDN
- Automatic HTTPS
- Zero-downtime deploys
- 99.9% uptime SLA

**Printing**:
- Browser Print API
- ESC/POS commands
- Direct USB/Network
- Bluetooth (mobile)

---

### System Architecture

```
┌────────────────────────────────────────────┐
│          USER DEVICES                      │
│  (PCs, Tablets, Phones)                    │
└──────────────┬─────────────────────────────┘
               │ HTTPS
┌──────────────▼─────────────────────────────┐
│          VERCEL (CDN)                      │
│  - React Application                       │
│  - Static Assets                           │
│  - Global Distribution                     │
└──────────────┬─────────────────────────────┘
               │ API Calls
┌──────────────▼─────────────────────────────┐
│          SUPABASE                          │
│  - PostgreSQL Database                     │
│  - Authentication                          │
│  - Real-time Sync                          │
│  - Row-Level Security                      │
└────────────────────────────────────────────┘
```

---

### Data Flow

**Create Player Example**:
```
1. User enters player info in UI
   ↓
2. React component validates input
   ↓
3. API call to Supabase
   ↓
4. Database inserts record
   ↓
5. Auto-generate Member ID and QR code
   ↓
6. Return success to UI
   ↓
7. UI updates player list
   ↓
8. Audit log entry created
```

**Real-Time Updates**:
```
1. User A starts player rating on Table 1
   ↓
2. Database updated
   ↓
3. Supabase broadcasts change
   ↓
4. User B's dashboard auto-updates
   ↓
5. User C's full-screen display updates
   ↓
All users see update within 1 second
```

---

### Security Features

**Authentication**:
- Username/password login
- Session management
- Auto-logout (configurable)
- Password requirements

**Authorization**:
- Role-based access control (7 user types)
- Feature-level permissions
- Row-level security (multi-property)
- Action-based restrictions

**Data Protection**:
- HTTPS encryption (in transit)
- Database encryption (at rest)
- Automatic backups (daily)
- Point-in-time recovery

**Audit Trail**:
- Every action logged
- Immutable log records
- Regulatory compliance
- Security monitoring

---

### Performance

**Response Times**:
- Page load: <2 seconds
- Data operations: <500ms
- Report generation: <5 seconds
- Real-time updates: <1 second

**Scalability**:
- Handles 100+ concurrent users
- Unlimited players
- Unlimited transactions
- Unlimited historical data

**Reliability**:
- 99.9% uptime (Supabase + Vercel SLA)
- Automatic failover
- Data redundancy
- Disaster recovery

---

# 17. MULTI-PROPERTY SUPPORT

## Manage Multiple Casino Locations

### Property Management

```
┌─────────────────────────────────────────┐
│  PROPERTY MANAGEMENT                    │
├─────────────────────────────────────────┤
│  PROPERTIES:                            │
│  • Main Casino                          │
│    Players: 1,250                       │
│    Tables: 25                           │
│    Status: Active                       │
│                                         │
│  • Branch Location                      │
│    Players: 450                         │
│    Tables: 10                           │
│    Status: Active                       │
│                                         │
│  • VIP Room                             │
│    Players: 85                          │
│    Tables: 5                            │
│    Status: Active                       │
│                                         │
│  [Add Property]  [Edit]  [Reports]      │
└─────────────────────────────────────────┘
```

---

### Property Filtering

**Dashboard with Property Filter**:
```
┌─────────────────────────────────────────┐
│  DASHBOARD                              │
├─────────────────────────────────────────┤
│  Property: [All Properties ▼]           │
│           ├─ Main Casino                │
│           ├─ Branch Location            │
│           └─ VIP Room                   │
│                                         │
│  [Metrics update based on selection]    │
└─────────────────────────────────────────┘
```

**Data Isolation**:
- Each property's data separated
- Cross-property reports available
- Users can be property-specific
- Or access multiple properties

---

### Cross-Property Features

**Consolidated Reports**:
- All properties combined
- Compare property performance
- Identify trends
- Resource allocation

**Player Tracking**:
- Players can visit multiple properties
- Unified player profile
- Combined lifetime value
- Consolidated comps balance

**User Management**:
- Assign users to specific properties
- Or grant access to all properties
- Property-specific permissions

---

# 18. MOBILE & TABLET SUPPORT

## Responsive Design

### Device Compatibility

**Desktop (1920x1080+)**:
- Full feature set
- Multi-column layouts
- Large data tables
- Complex forms

**Laptop (1366x768+)**:
- Full feature set
- Optimized layouts
- Responsive tables
- Compact forms

**Tablet (768x1024)**:
- Touch-optimized
- Simplified navigation
- Large touch targets
- Camera QR scanning

**Mobile (375x667+)**:
- Essential features
- Vertical layouts
- Swipe gestures
- Mobile-first forms

---

### Touch Optimization

**Tablet Features**:
- Large buttons (48x48px minimum)
- Swipe gestures
- Pull-to-refresh
- Touch-friendly dropdowns

**Camera Access**:
- QR code scanning via camera
- Photo capture for profiles
- Instant recognition

**Full-Screen Mode**:
- F11 for full-screen
- Kiosk mode ready
- Auto-hide browser chrome

---

### Offline Capabilities (Future)

**Progressive Web App (PWA)**:
- Install as app
- Offline data caching
- Background sync
- Push notifications

---

# 19. DEPLOYMENT & SCALABILITY

## Cloud-Native Architecture

### Deployment Options

**Option 1: Vercel (Recommended)**
- Automatic deployments
- Global CDN
- Instant rollback
- Zero downtime
- Free tier available

**Option 2: Self-Hosted**
- Full control
- On-premises
- Custom domain
- VPN integration

---

### Scalability

**Automatic Scaling**:
- Handle traffic spikes
- No manual intervention
- Pay-as-you-grow
- Unlimited capacity

**Database Scaling**:
- Automatic indexing
- Query optimization
- Connection pooling
- Read replicas (if needed)

---

### Update Process

```
Local Development
      ↓
   Test Changes
      ↓
   Deploy to Vercel
      ↓
   Automatic Build
      ↓
   Zero-Downtime Deploy
      ↓
   Production Live (30-60 sec)
```

**Update Frequency**:
- Deploy as often as needed
- Bug fixes: Immediate
- Features: Weekly/Monthly
- Zero data impact

---

### Backup & Recovery

**Automatic Backups**:
- Daily backups (Supabase)
- 7-day retention (free tier)
- Point-in-time recovery
- One-click restore

**Manual Backups**:
- Excel export anytime
- Full data export
- Import to other systems
- Regulatory compliance

---

### Monitoring

**Application Monitoring**:
- Vercel analytics
- Error tracking
- Performance metrics
- Usage statistics

**Database Monitoring**:
- Query performance
- Storage usage
- Connection count
- Slow query detection

---

# 20. SECURITY FEATURES

## Enterprise-Grade Security

### Access Control

**7-Level User Hierarchy**:
1. Super Manager - Full access
2. Manager - Administrative
3. Pit Boss - Floor operations
4. Inspector - Table-specific
5. Cashier - Cage only
6. Host - Player services
7. Waiter - Comps only

**Granular Permissions**:
- Feature-level control
- Data-level control
- Action-level control
- Time-based access (future)

---

### Authentication

**Login Security**:
- Strong password requirements
- Password hashing (bcrypt)
- Session management
- Auto-logout after inactivity

**Dual-Signature System**:
- Vault transfers
- VIP discounts
- Critical operations
- Audit trail with both signatures

---

### Data Security

**Encryption**:
- HTTPS (in transit)
- Database encryption (at rest)
- Secure credential storage
- No plain-text passwords

**Audit Logging**:
- Every action logged
- Immutable records
- Tamper-evident
- Regulatory compliance

---

### Compliance

**Gaming Regulations**:
- Complete audit trail
- Financial transparency
- Player protection
- Responsible gaming

**Data Protection**:
- GDPR-ready (if applicable)
- Data retention policies
- Right to erasure
- Data portability

---

# 21. KEYBOARD SHORTCUTS

## Productivity Boosters

### Universal Shortcuts

Available on all pages:

| Shortcut | Action |
|----------|--------|
| `Ctrl+1` | Dashboard |
| `Ctrl+2` | Players |
| `Ctrl+3` | Floats |
| `Ctrl+4` | Ratings |
| `Ctrl+5` | Drop |
| `Ctrl+6` | Reports |
| `Ctrl+7` | Cage |
| `Ctrl+8` | Comps |
| `Ctrl+9` | Setup |
| `Ctrl+L` | Logout |
| `Ctrl+H` | Help |
| `F11` | Full-screen toggle |

### Context-Specific

**Players Page**:
- `Ctrl+N` - New player
- `Ctrl+F` - Focus search
- `Ctrl+E` - Export to Excel

**Ratings Page**:
- `Ctrl+R` - Start new rating
- `Ctrl+P` - Pause active session
- `Ctrl+S` - End and save session

**Reports Page**:
- `Ctrl+G` - Generate report
- `Ctrl+X` - Export current view
- `Ctrl+P` - Print

---

# 22. STANDARDIZED CURRENCY

## FCFA Currency System

### Currency Display

**Format**: `CFA XXX,XXX`

**Examples**:
- CFA 1,000 (one thousand)
- CFA 50,000 (fifty thousand)
- CFA 1,000,000 (one million)
- CFA 10,000,000 (ten million)

**Thousand Separator**: Comma (,)
**Decimal Places**: 0 (whole numbers only)
**Currency Symbol**: CFA or FCFA

---

### Calculations

**Comps Calculation**:
```
Comps = Theoretical Win × 0.1%

Example:
Theo Win = CFA 75,000
Comps = 75,000 × 0.001
Comps = CFA 75 (rounded to nearest 50)
```

**Hold Percentage**:
```
Hold % = (Win ÷ Drop) × 100

Example:
Win = CFA 2,250,000
Drop = CFA 45,000,000
Hold % = (2,250,000 ÷ 45,000,000) × 100
Hold % = 5.0%
```

---

# 23. FUTURE ENHANCEMENTS

## Roadmap

### Phase 1 (Completed) ✅
- Core player management
- Float management
- Rating system
- Comps tracking
- Employee management
- QR codes
- Thermal printing

### Phase 2 (Current)
- Multi-property support
- Advanced analytics
- Custom reporting
- API integrations

### Phase 3 (Planned)
- Mobile app (native iOS/Android)
- Offline mode (PWA)
- AI-powered analytics
- Predictive player behavior
- Automated marketing
- SMS/email notifications
- Advanced fraud detection
- Integration with gaming systems

### Phase 4 (Future)
- Blockchain for audit trail
- Biometric authentication
- Virtual reality casino tour
- Cryptocurrency support
- Machine learning for player segmentation
- Advanced business intelligence
- Third-party integrations

---

# 24. SUPPORT & TRAINING

## Getting Help

### Documentation
- **Deployment Guides**: 7 comprehensive guides
- **User Manuals**: Role-specific guides
- **Video Tutorials**: Coming soon
- **FAQ**: Common questions answered

### Technical Support
- **Email**: support@yourdomain.com
- **Phone**: +XXX XXX XXX XXX
- **Live Chat**: Coming soon
- **Response Time**: 24-48 hours

### Training Services
- **On-site Training**: Available
- **Remote Training**: Via video call
- **Train-the-Trainer**: Empower your team
- **Custom Training**: Tailored to your needs

### Updates & Maintenance
- **Software Updates**: Free forever
- **Bug Fixes**: Priority support
- **Feature Requests**: Considered for roadmap
- **Security Patches**: Immediate deployment

---

# CONCLUSION

## MF-Intel CMS for Gaming IQ v2.3.0

**A Complete Casino Management Solution**

### Key Takeaways

✅ **Comprehensive**: Covers all casino operations  
✅ **Modern**: Latest web technologies  
✅ **Scalable**: Cloud-based architecture  
✅ **Secure**: Enterprise-grade security  
✅ **User-Friendly**: Intuitive interface  
✅ **Mobile-Ready**: Works on any device  
✅ **Real-Time**: Instant data sync  
✅ **Auditable**: Complete audit trail  
✅ **Flexible**: Multi-property support  
✅ **Affordable**: Cost-effective deployment  

---

### By The Numbers

- **7** User Types
- **20+** Major Features
- **100+** Functions
- **0** Paper Forms Needed
- **30-60** Second Deployment Updates
- **99.9%** Uptime
- **<2** Second Page Loads
- **100%** Data Safety

---

### Get Started Today

**Step 1**: Read deployment guides  
**Step 2**: Deploy to Vercel (5 minutes)  
**Step 3**: Configure devices (30 minutes)  
**Step 4**: Train staff (1 week)  
**Step 5**: Go live! 🚀  

---

### Contact Information

**Technical Support**:
- Documentation: See deployment guides
- Email: support@yourdomain.com
- Phone: +XXX XXX XXX XXX

**Sales & Licensing**:
- Email: sales@yourdomain.com
- Phone: +XXX XXX XXX XXX

**Website**: www.yourdomain.com

---

**Thank you for choosing MF-Intel CMS for Gaming IQ!**

**Version 2.3.0 - March 2026**

---

**End of Presentation**
