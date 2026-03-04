# Pit Boss User Guide
## MF-Intel CMS for Gaming IQ v2.3.0

**Complete Guide for Pit Bosses**

---

# YOUR ROLE: PIT BOSS

## Welcome!

As a **Pit Boss**, you manage **all floor operations**. You oversee all tables, monitor player ratings, track drop, and ensure smooth gaming operations.

### What You CAN Do ✅
- Rate players on ANY table
- Monitor all active sessions
- View float status (all tables)
- Record drop (all tables)
- View/generate operational reports
- Oversee dealer/inspector performance

### What You CANNOT Do ❌
- Approve vault transfers (managers only)
- Cage operations (cashiers only)
- Create/edit users (managers only)
- System configuration (Super Manager only)

---

# QUICK START

## Login
```
URL: https://your-casino-url.vercel.app
Username: pitboss1
Password: YourPassword
[Login] ✅
```

## Your Dashboard
```
┌──────────────────────────────────────────┐
│ MF-Intel CMS    [pitboss1 ▼]       [🔔] │
├──────────────────────────────────────────┤
│ [Dashboard] [Players] [Floats] [Ratings]│
│ [Drop] [Reports]                         │
└──────────────────────────────────────────┘

Floor Status:
  Active Tables: 8
  Active Players: 23
  Total Sessions Today: 234
  Total Drop: CFA 45M
```

---

# CORE DUTIES

## 1. PLAYER RATINGS

### Start a Rating Session

**Scenario:** Player sits at table BJ-01

**Steps:**

**1. Scan Player QR Card**
```
Ratings → [+ New Rating]
[📷 Scan QR Code]

Scanning...
✅ Found: John Doe (P-2026-0001)
```

**2. Enter Session Details**
```
┌─────────────────────────────────────────┐
│  START RATING SESSION                   │
├─────────────────────────────────────────┤
│  Player: John Doe (P-2026-0001)         │
│  Tier: VIP Gold ⭐⭐                     │
│                                         │
│  Table: BJ-01 ▼                         │
│  Game: Blackjack (auto-filled)          │
│                                         │
│  Buy-In Type:                           │
│  ◉ Cash  ○ Chips                       │
│                                         │
│  Buy-In Amount: CFA 1,000,000           │
│  Average Bet: CFA 50,000                │
│                                         │
│  Inspector: inspector1 ▼                │
│  Start Time: 14:30 (auto)               │
│                                         │
│  [Start Session] ✅                     │
└─────────────────────────────────────────┘
```

**💡 TIP:** If player doesn't have QR card, manually select from dropdown.

**3. Session Started!**
```
✅ Rating Session Started
Player: John Doe
Table: BJ-01
Duration: 0h 0m (counting...)

[View Active Sessions]
```

---

### Monitor Active Sessions

```
Ratings → Active Sessions

┌──────────────────────────────────────────────────────────────┐
│  ACTIVE SESSIONS (23 players)                 [Refresh]      │
├──────────────────────────────────────────────────────────────┤
│  Player      │ Table │ Duration│ Buy-In │ Avg Bet │ Actions │
├──────────────────────────────────────────────────────────────┤
│  John Doe    │ BJ-01 │ 2h 15m  │ 1.0M   │ 50K     │ [View]  │
│  Jane Smith  │ BJ-01 │ 1h 45m  │ 850K   │ 40K     │ [View]  │
│  Mike Brown  │ RO-01 │ 0h 30m  │ 500K   │ 25K     │ [View]  │
│  Sarah Lee   │ BC-01 │ 3h 10m  │ 2.0M   │ 100K    │ [View]  │
│  ...         │ ...   │ ...     │ ...    │ ...     │ ...     │
└──────────────────────────────────────────────────────────────┘

BY TABLE:
  BJ-01: 4 players    BJ-02: 3 players
  RO-01: 6 players    BC-01: 2 players
  ...
```

**Click [View]** to see session details or update.

---

### Update Average Bet

**Scenario:** Inspector notices player increasing bets

**Steps:**
```
1. Find session in Active Sessions
2. Click [View]
3. Click [Update Bet]

┌─────────────────────────────────────────┐
│  UPDATE AVERAGE BET                     │
├─────────────────────────────────────────┤
│  Player: John Doe                       │
│  Table: BJ-01                           │
│  Duration: 2h 15m                       │
│                                         │
│  Current Avg Bet: CFA 50,000            │
│  New Avg Bet: CFA 75,000                │
│                                         │
│  Reason: Player increased bets          │
│                                         │
│  [Update] ✅                            │
└─────────────────────────────────────────┘
```

**Why This Matters:**
- Accurate Theo calculation
- Fair comps
- Player value tracking

---

### End Rating Session

**Scenario:** Player cashes out

**Steps:**
```
1. Find session in Active Sessions
2. Click [View] → [End Session]

┌─────────────────────────────────────────┐
│  END RATING SESSION                     │
├─────────────────────────────────────────┤
│  Player: John Doe (P-2026-0001)         │
│  Table: BJ-01                           │
│  Duration: 2h 30m                       │
│                                         │
│  Buy-In: CFA 1,000,000 (Cash)           │
│                                         │
│  Cash-Out Type:                         │
│  ◉ Cash  ○ Chips                       │
│                                         │
│  Cash-Out Amount: CFA 850,000           │
│                                         │
│  [Calculate & End] ✅                   │
└─────────────────────────────────────────┘
```

**System Calculates Automatically:**
```
┌─────────────────────────────────────────┐
│  SESSION SUMMARY                        │
├─────────────────────────────────────────┤
│  Buy-In: CFA 1,000,000                  │
│  Cash-Out: CFA 850,000                  │
│  Win/Loss: -CFA 150,000 (Player Loss)   │
│                                         │
│  Average Bet: CFA 50,000                │
│  Hands Played: 300 (estimated)          │
│  Theoretical Win: CFA 75,000            │
│                                         │
│  Comps Earned: CFA 75 (0.1% of Theo)    │
│  New Balance: CFA 13,075                │
│                                         │
│  [Print Ticket] [Confirm] ✅            │
└─────────────────────────────────────────┘
```

**Receipt Prints Automatically** ✅

---

## 2. DROP MANAGEMENT

### Record Drop

**When:** Player buys chips with cash at table

**Steps:**
```
Drop → [Record Drop]

┌─────────────────────────────────────────┐
│  RECORD DROP                            │
├─────────────────────────────────────────┤
│  Table: BJ-01 ▼                         │
│                                         │
│  Player (optional):                     │
│  John Doe ▼  or  [Scan QR]             │
│                                         │
│  Amount: CFA 500,000                    │
│                                         │
│  Inspector: inspector1 ▼                │
│  Time: 14:30:25 (auto)                  │
│                                         │
│  [Record Drop] ✅                       │
└─────────────────────────────────────────┘
```

**✅ Drop Recorded!**
- Added to table total
- Contributes to daily drop
- Tracked for reports

---

### View Drop by Table

```
Drop → Drop Summary

┌──────────────────────────────────────────┐
│  DROP SUMMARY - Today                    │
├──────────────────────────────────────────┤
│  Table  │ Drop        │ Transactions     │
├──────────────────────────────────────────┤
│  BJ-01  │ 8,500,000   │ 47               │
│  BJ-02  │ 6,200,000   │ 35               │
│  RO-01  │ 5,800,000   │ 52               │
│  BC-01  │ 4,900,000   │ 28               │
│  ...    │ ...         │ ...              │
├──────────────────────────────────────────┤
│  TOTAL  │ 45,000,000  │ 234              │
└──────────────────────────────────────────┘
```

**Click on a table** to see detailed drop history.

---

## 3. FLOOR MONITORING

### Full-Screen Table View

**Use Case:** Display on pit monitor for real-time visibility

**Steps:**
```
1. Go to Floats or Ratings
2. Select table (e.g., BJ-01)
3. Press F11 (full-screen)

╔═══════════════════════════════════════════╗
║         TABLE BJ-01 STATUS                ║
╠═══════════════════════════════════════════╣
║  Float: CFA 5,500,000                     ║
║  Active Players: 4                        ║
║  Drop Today: CFA 2,800,000                ║
║  Win/Loss: +CFA 450,000 (Table Win)       ║
║                                           ║
║  Dealer: John Smith (08:00 - 16:00)       ║
║  Inspector: Jane Doe                      ║
║                                           ║
║  ACTIVE SESSIONS:                         ║
║  • Mike Johnson  - CFA 500K (1h 30m)      ║
║  • Sarah Lee     - CFA 350K (2h 15m)      ║
║  • Tom Brown     - CFA 250K (0h 45m)      ║
║  • Lisa White    - CFA 150K (1h 00m)      ║
╚═══════════════════════════════════════════╝
```

**Press F11 again** to exit full-screen.

**💡 TIP:** Great for wall-mounted displays in pit area!

---

### Check Table Performance

```
Reports → Table Performance

┌──────────────────────────────────────────────────────────────┐
│  TABLE PERFORMANCE - Today                                    │
├──────────────────────────────────────────────────────────────┤
│  Table│ Drop   │ Win     │ Hold %│ Sessions│ Avg Session     │
├──────────────────────────────────────────────────────────────┤
│  BJ-01│ 8.5M   │ +425K   │ 5.0%  │ 47      │ 2h 15m          │
│  BJ-02│ 6.2M   │ +310K   │ 5.0%  │ 35      │ 1h 45m          │
│  RO-01│ 5.8M   │ +290K   │ 5.0%  │ 52      │ 1h 30m          │
│  BC-01│ 4.9M   │ +245K   │ 5.0%  │ 28      │ 3h 00m          │
│  BJ-03│ 3.2M   │ -150K   │ -4.7% │ 22      │ 2h 30m ⚠️       │
└──────────────────────────────────────────────────────────────┘

⚠️ BJ-03 is losing money - Monitor or investigate
```

**Action on BJ-03:**
- Check dealer performance
- Review camera footage
- Normal variance or issue?
- Document and report if concerning

---

## 4. PLAYER MANAGEMENT

You can **view** all players but cannot create/edit/delete (Hosts/Managers only).

### View Player Profile

```
Players → Search: John

┌─────────────────────────────────────────┐
│  John Doe (P-2026-0001)                 │
│  Tier: VIP Gold ⭐⭐                     │
│  Status: Active ✅                       │
└─────────────────────────────────────────┘

Click [View] to see:
- Gaming statistics
- Session history
- Comps balance
- Behavioral patterns
```

**Use This For:**
- Understanding player value
- Tailoring service level
- Identifying VIPs
- Tracking regulars

---

# DAILY WORKFLOW

## Opening Shift (08:00)

### Morning Checklist
```
- [ ] Log in to system
- [ ] Check overnight activity
- [ ] Review table assignments
- [ ] Brief inspectors/dealers
- [ ] Verify all tables ready
- [ ] Check for any issues
- [ ] Open tables as needed
```

## During Shift (08:00-16:00)

### Every Hour
```
- [ ] Walk the floor
- [ ] Check active sessions
- [ ] Review drop totals
- [ ] Monitor table performance
- [ ] Support inspectors
- [ ] Address player needs
```

### As Needed
```
- [ ] Start rating sessions
- [ ] Update average bets
- [ ] End sessions
- [ ] Record drops
- [ ] Resolve issues
- [ ] Coordinate with cashiers
```

## Closing Shift (16:00)

### End of Shift Checklist
```
- [ ] Review shift performance
- [ ] Generate shift report
- [ ] Document incidents
- [ ] Handover notes to next Pit Boss
- [ ] Ensure all sessions updated
- [ ] Check outstanding issues
- [ ] Sign out
```

---

# COMMON SCENARIOS

## Scenario 1: New Player Arrives

**Steps:**
1. Greet player warmly
2. Check if they have member card
   - **YES:** Scan QR, start rating
   - **NO:** Direct to Host to register
3. Once registered, start rating session
4. Inform dealer/inspector
5. Monitor session

## Scenario 2: Player Dispute

**Example:** Player claims underpaid on win

**Steps:**
1. Stay calm, professional
2. Listen to player's concern
3. Review session history
4. Check camera footage (if available)
5. Consult dealer/inspector
6. Make fair decision:
   - If player correct: Apologize, correct
   - If casino correct: Explain politely
7. Document incident
8. Inform manager

## Scenario 3: Inspector Calls You Over

**Example:** "Player betting very large amounts"

**Steps:**
1. Go to table immediately
2. Observe player
3. Check session details
4. Update average bet if needed
5. Increase surveillance (if policy)
6. Ensure proper drop recording
7. Inform manager if exceptional

## Scenario 4: Table Running Hot/Cold

**Hot Table (Players winning):**
- Normal variance
- Monitor float level
- Coordinate fills if needed
- Document if extreme

**Cold Table (Players losing heavily):**
- Also normal variance
- Check player satisfaction
- Ensure proper service
- Document exceptional runs

## Scenario 5: Long Session Player

**Example:** Player at table for 5+ hours

**Steps:**
1. Check player welfare
2. Offer break suggestion
3. Verify session is active (not paused)
4. Check average bet is current
5. Ensure proper service
6. Monitor for fatigue

---

# REPORTS YOU CAN ACCESS

## Daily Floor Report

```
Reports → Floor Report

Date: Today
Pit Boss: pitboss1

Includes:
- All tables operated
- Total drop per table
- Total win/loss per table
- Sessions per table
- Top players
- Incidents
- Performance summary

[Generate] [Export] [Print]
```

## Player Activity Report

```
Reports → Player Activity

Filters:
- Date range
- Table
- Player tier
- Session length

Shows:
- All sessions
- Drop and win
- Average bets
- Comps earned

[Generate] [Export]
```

## Table Performance Report

```
Reports → Table Performance

Compare tables:
- Drop volume
- Win/loss
- Hold percentage
- Session count
- Average session length

Identify:
- Top performers
- Problem tables
- Trends

[Generate] [Export]
```

---

# TROUBLESHOOTING

## Cannot Start Rating Session

**Problem:** "Error: Table not available"

**Solution:**
1. Check if table float is open
2. Verify inspector assigned
3. Refresh page
4. If persists, contact manager

## Player QR Won't Scan

**Problem:** QR scanner not reading card

**Solution:**
1. Try again (hold steady)
2. Check camera permissions
3. Use manual player selection
4. If broken, report to manager

## Session Shows Wrong Table

**Problem:** Rating started at wrong table

**Solution:**
1. End session immediately
2. Start new session at correct table
3. Note in comments
4. Inform manager

## Drop Not Recording

**Problem:** "Error: Cannot record drop"

**Solution:**
1. Verify table exists
2. Check float is open
3. Refresh page
4. If persists, document manually and enter later

---

# KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| Ctrl+1 | Dashboard |
| Ctrl+2 | Players (view only) |
| Ctrl+3 | Floats |
| Ctrl+4 | Ratings |
| Ctrl+5 | Drop |
| Ctrl+6 | Reports |
| Ctrl+R | New rating session |
| F11 | Full-screen toggle |
| Ctrl+H | Help |
| Ctrl+L | Logout |

---

# BEST PRACTICES

## Rating Accuracy

✅ **DO:**
- Start sessions promptly
- Update bets when they change
- End sessions accurately
- Record drops consistently
- Double-check amounts

❌ **DON'T:**
- Estimate buy-in amounts
- Forget to end sessions
- Leave sessions paused overnight
- Round average bets significantly

## Floor Management

✅ **DO:**
- Walk floor regularly
- Know your players
- Support your team
- Communicate clearly
- Lead by example

❌ **DON'T:**
- Stay in pit office all shift
- Ignore player requests
- Micromanage inspectors
- Delay issue resolution

## Communication

**With Players:**
- Professional and courteous
- Use player name (check tier)
- Anticipate needs
- Resolve issues quickly

**With Staff:**
- Clear instructions
- Positive feedback
- Constructive criticism
- Team support

**With Management:**
- Regular updates
- Document incidents
- Ask when unsure
- Report issues promptly

---

# FAQ

**Q: Can I approve vault transfers?**
A: No, only Managers and Super Managers can approve vault transfers.

**Q: Can I create new players?**
A: No, Hosts create players. You can view player profiles.

**Q: What if a player refuses to show member card?**
A: Cannot start rating without identification. Politely explain policy or direct to Host to register.

**Q: Can I override an inspector's rating?**
A: Yes, you can update any active session if you observe different average bet or have better information.

**Q: How often should I update average bets?**
A: Update whenever you observe significant changes (25%+ increase/decrease).

**Q: What if I accidentally end a session?**
A: Cannot undo. Start new session with corrected information and note in comments.

**Q: Can I print receipts?**
A: Yes, receipts print automatically when you end sessions. Can reprint from session history.

**Q: What reports can I generate?**
A: Floor reports, player activity, table performance, drop reports. Cannot access financial/admin reports.

---

# CONTACT SUPPORT

📧 Email: support@your-casino.com  
📱 Phone: +XXX XXX XXX XXX  
💬 Manager: Contact your shift manager  
🚨 Emergency: Call security/management  

**Support Hours:**  
Mon-Fri: 8 AM - 10 PM  
Sat-Sun: 10 AM - 8 PM  

---

**END OF PIT BOSS USER GUIDE**
**Version 2.3.0 | March 2026**
