# Inspector User Guide
## MF-Intel CMS for Gaming IQ v2.3.0

---

# YOUR ROLE: INSPECTOR

## Welcome!

As an **Inspector**, you monitor **specific assigned tables**, rate players, record drop, and ensure smooth table operations.

### What You CAN Do ✅
- Rate players on YOUR assigned tables only
- Start/pause/end rating sessions
- Record drop for your tables
- Update average bets
- Print rating receipts
- View your table performance

### What You CANNOT Do ❌
- Rate players on other tables (Pit Boss only)
- Approve vault transfers (Manager only)
- Cage operations (Cashier only)
- Create/edit players (Host only)
- System configuration

---

# QUICK START

## Login & Your Tables

```
URL: https://your-casino-url.vercel.app
Username: inspector1
Password: YourPassword
[Login] ✅

Your Assigned Tables: BJ-01, BJ-02
```

---

# CORE DUTIES

## 1. START RATING SESSION

**Player sits at your table BJ-01**

### Scan QR Card
```
Ratings → [+ New Rating]
[📷 Scan QR Code]

✅ Found: John Doe (P-2026-0001)
```

### Enter Details
```
┌─────────────────────────────────────────┐
│  START RATING                           │
├─────────────────────────────────────────┤
│  Player: John Doe (VIP Gold)            │
│  Table: BJ-01 ✓ (your table)            │
│  Buy-In Type: ◉ Cash  ○ Chips          │
│  Buy-In Amount: CFA 1,000,000           │
│  Average Bet: CFA 50,000                │
│  [Start Session] ✅                     │
└─────────────────────────────────────────┘

✅ Session Started!
Timer running: 0h 0m
```

**💡 TIP:** If no QR card, manually select player from dropdown.

---

## 2. MONITOR ACTIVE SESSIONS

```
Ratings → Active Sessions (Your Tables)

┌──────────────────────────────────────────┐
│  BJ-01 (4 players)                       │
├──────────────────────────────────────────┤
│  John Doe      2h 15m   1.0M   50K  [→] │
│  Jane Smith    1h 45m   850K   40K  [→] │
│  Mike Brown    0h 30m   500K   25K  [→] │
│  Sarah Lee     3h 10m   2.0M   100K [→] │
└──────────────────────────────────────────┘

Click [→] to view/update session
```

---

## 3. UPDATE AVERAGE BET

**Player increases bet size**

```
Click session → [Update Bet]

┌─────────────────────────────────────────┐
│  UPDATE AVERAGE BET                     │
├─────────────────────────────────────────┤
│  Player: John Doe                       │
│  Current Avg: CFA 50,000                │
│  New Avg: CFA 75,000                    │
│  [Update] ✅                            │
└─────────────────────────────────────────┘

✅ Updated! Theo calculation will reflect change.
```

---

## 4. END RATING SESSION

**Player cashes out**

```
Session → [End Session]

┌─────────────────────────────────────────┐
│  END SESSION                            │
├─────────────────────────────────────────┤
│  Player: John Doe                       │
│  Duration: 2h 30m                       │
│  Buy-In: CFA 1,000,000 (Cash)           │
│  Cash-Out: CFA 850,000                  │
│  Cash-Out Type: ◉ Cash  ○ Chips        │
│  [Calculate & End] ✅                   │
└─────────────────────────────────────────┘

SUMMARY:
  Win/Loss: -CFA 150,000 (Player Loss)
  Theo Win: CFA 75,000
  Comps Earned: CFA 75
  New Balance: CFA 13,075

[Print Receipt] ✅ Receipt prints automatically
```

---

## 5. RECORD DROP

**Player buys chips with cash**

```
Drop → [Record Drop]

┌─────────────────────────────────────────┐
│  RECORD DROP                            │
├─────────────────────────────────────────┤
│  Table: BJ-01 ✓ (your table)            │
│  Player: John Doe ▼ (optional)          │
│  Amount: CFA 500,000                    │
│  Time: 14:30:25 (auto)                  │
│  [Record] ✅                            │
└─────────────────────────────────────────┘

✅ Drop Recorded!
Added to table total.
```

---

# DAILY WORKFLOW

## Opening Your Shift

```
- [ ] Log in
- [ ] Check your assigned tables
- [ ] Verify tables are open (float active)
- [ ] Check for any overnight sessions
- [ ] Brief dealer on procedures
- [ ] Ready to rate players
```

## During Your Shift

```
Every Player:
- [ ] Start rating when player sits
- [ ] Monitor session during play
- [ ] Update bet if changes significantly
- [ ] End session when player leaves

Every Cash Buy-In:
- [ ] Record drop immediately
- [ ] Verify amount with dealer
- [ ] Confirm recorded in system

Every Hour:
- [ ] Check active sessions
- [ ] Verify all players rated
- [ ] Check drop totals
- [ ] Address any issues
```

## End of Shift

```
- [ ] Ensure all sessions updated
- [ ] End any forgotten sessions
- [ ] Verify drop totals
- [ ] Handover notes to next inspector
- [ ] Sign out
```

---

# COMMON SCENARIOS

## Scenario 1: Player Has No QR Card

**Solution:**
```
1. Ask player name
2. Use manual player selection dropdown
3. If not in system, call Host to register
4. Once registered, start rating
```

## Scenario 2: Player Moves to Different Table

**If moving to YOUR other table:**
```
1. End session at Table 1
2. Note cash-out as "Chips" (taking to next table)
3. Start new session at Table 2
4. Note buy-in as "Chips" (from previous table)
```

**If moving to ANOTHER INSPECTOR'S table:**
```
1. End session at your table
2. Cash-out as "Chips"
3. Inform other inspector
4. They start new session
```

## Scenario 3: Forgot to Start Session

**Player already playing:**
```
1. Start session now
2. Estimate start time (ask player/dealer)
3. Add note: "Started late, estimated start 14:00"
4. Better late than never!
```

## Scenario 4: Player Takes Break

```
Session → [Pause]

Timer stops.
Session still active.

When returns:
Session → [Resume]

Timer resumes from where it stopped.
```

## Scenario 5: Dealer Reports Wrong Cash-Out

**Before you end session:**
```
1. Stop! Don't end yet
2. Verify amount with dealer
3. Recount if needed
4. Use correct amount
5. Then end session
```

**After you ended session:**
```
1. Cannot undo
2. Note the error
3. Report to Pit Boss
4. They can adjust if needed
```

---

# TROUBLESHOOTING

## Problem: Cannot See My Tables

**Solution:**
```
1. Check if you're assigned to tables
2. Ask Pit Boss/Manager to verify assignments
3. Refresh page
4. Re-login if needed
```

## Problem: QR Scanner Not Working

**Solution:**
```
1. Check camera permissions (allow in browser)
2. Try different lighting
3. Hold card steady
4. Use manual selection as backup
```

## Problem: Session Won't Start

**Solution:**
```
1. Verify table float is open
2. Check table is assigned to you
3. Try different player (test)
4. Refresh page
5. Contact Pit Boss if persists
```

## Problem: Wrong Table Selected

**Solution:**
```
1. End session immediately
2. Start new session at correct table
3. Note in comments
4. Inform Pit Boss
```

---

# BEST PRACTICES

## Rating Accuracy

✅ **DO:**
- Start sessions immediately when player sits
- Update bets when they change (25%+ difference)
- End sessions promptly when player leaves
- Record drops accurately
- Double-check amounts

❌ **DON'T:**
- Forget to start sessions
- Leave sessions running when player left
- Estimate buy-in amounts
- Round bets significantly
- Delay drop recording

## Communication

**With Players:**
- Professional and courteous
- Explain process if asked
- Protect player privacy
- Quick and efficient

**With Dealer:**
- Verify amounts together
- Confirm drop recordings
- Report any discrepancies
- Work as team

**With Pit Boss:**
- Report issues promptly
- Ask when unsure
- Document concerns
- Follow instructions

---

# KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| Ctrl+1 | Dashboard |
| Ctrl+4 | Ratings (your main page) |
| Ctrl+5 | Drop |
| Ctrl+R | New rating session |
| Ctrl+H | Help |
| Ctrl+L | Logout |

---

# FAQ

**Q: Can I rate players on any table?**
A: No, only your assigned tables. Pit Boss can rate all tables.

**Q: What if player doesn't want to be rated?**
A: Casino policy required. Explain benefits (comps). Escalate to Pit Boss if refused.

**Q: How accurate must average bet be?**
A: Within 10-20% is acceptable. Update if you observe significant changes.

**Q: Can I pause a session overnight?**
A: Yes, but not recommended. Best to end and start new session next day.

**Q: What if I record wrong drop amount?**
A: Contact Pit Boss immediately to correct. Cannot edit after submission.

**Q: Do I print receipts?**
A: Yes, system prints automatically when you end sessions. Player receives copy.

**Q: What if player argues about win/loss amount?**
A: Stay calm, verify math, call Pit Boss if needed. You tracked buy-in/cash-out correctly.

---

# CONTACT SUPPORT

📱 Pit Boss: Your immediate supervisor  
💬 Manager: Shift manager on duty  
📧 Email: support@your-casino.com  
🚨 Emergency: Security/Management  

---

**END OF INSPECTOR USER GUIDE**
**Version 2.3.0 | March 2026**
