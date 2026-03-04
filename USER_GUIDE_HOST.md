# Host User Guide
## MF-Intel CMS for Gaming IQ v2.3.0

---

# YOUR ROLE: HOST

## Welcome!

As a **Host**, you manage **player relationships**. You create players, manage their profiles, approve comps, and ensure VIP service.

### What You CAN Do ✅
- Create, edit, delete players (full CRUD)
- Manage player tiers
- Approve comps redemptions
- Print QR player cards (individual/bulk)
- Import/export player data
- Access player reports
- Manage marketing campaigns
- Handle player complaints

### What You CANNOT Do ❌
- Cage operations (Cashier only)
- Approve vault transfers (Manager only)
- Create/edit users (Manager/Super Manager only)
- System configuration

---

# QUICK START

## Login

```
URL: https://your-casino-url.vercel.app
Username: host1
Password: YourPassword
[Login] ✅

You see: Players tab, Comps tab available
```

---

# CORE DUTIES

## 1. CREATE NEW PLAYER

**New player arrives at casino**

```
Players → [+ Add New Player]

┌─────────────────────────────────────────┐
│  ADD NEW PLAYER                         │
├─────────────────────────────────────────┤
│  Full Name: Michael Torres             │
│  Email: m.torres@email.com              │
│  Phone: +237 655 123 456                │
│  Date of Birth: 1985-07-20              │
│                                         │
│  Tier: Regular ▼ (start here)           │
│  Property: Main Casino ▼                │
│  Status: Active ✓                       │
│                                         │
│  Profile Picture: [Upload]              │
│                                         │
│  [Create Player] ✅                     │
└─────────────────────────────────────────┘

✅ Player Created!
Member ID: P-2026-1251 (auto-generated)
QR Code: Generated automatically

[Print Welcome Card]
[Give to Player]
```

**Welcome Process:**
1. Greet warmly
2. Explain membership benefits
3. Take photo (optional)
4. Create account
5. Print QR card
6. Explain how to use
7. Show them to tables

---

## 2. SEARCH PLAYERS

```
Players → Search

Search by:
- Name (partial OK): "john"
- Member ID: "P-2026-0001"
- Email: "john@email.com"
- Phone: "+237 655"

Results:
┌──────────────────────────────────────────┐
│  P-2026-0001  John Doe   VIP Gold   ✓   │
│  P-2026-0087  John Smith Regular    ✓   │
│  P-2026-0234  Johnson    VIP Silver ✓   │
└──────────────────────────────────────────┘
```

---

## 3. VIEW PLAYER PROFILE

```
Click [View] on player

╔══════════════════════════════════════════╗
║  JOHN DOE (P-2026-0001)                  ║
╠══════════════════════════════════════════╣
║  [Photo]    Tier: VIP Gold ⭐⭐          ║
║  150x150    Status: Active ✅             ║
║             Joined: 2024-01-10           ║
╠══════════════════════════════════════════╣
║  CONTACT:                                ║
║  📧 john.doe@email.com                   ║
║  📱 +237 655 111 222                     ║
║  🎂 Birthday: May 15 (in 73 days)       ║
╠══════════════════════════════════════════╣
║  GAMING STATS:                           ║
║  Sessions: 45                            ║
║  Lifetime Drop: CFA 25,000,000           ║
║  Win/Loss: -CFA 3,200,000 (Losses)       ║
║  Average Bet: CFA 45,000                 ║
║  Theoretical Win: CFA 2,800,000          ║
║  Play Time: 112h 30m                     ║
╠══════════════════════════════════════════╣
║  COMPS:                                  ║
║  Balance: CFA 13,000                     ║
║  Earned: CFA 28,000                      ║
║  Redeemed: CFA 15,000                    ║
╠══════════════════════════════════════════╣
║  [Edit] [Print QR] [View Sessions]       ║
╚══════════════════════════════════════════╝
```

---

## 4. EDIT PLAYER

**Update information, change tier, etc.**

```
Player Profile → [Edit]

┌─────────────────────────────────────────┐
│  EDIT PLAYER: P-2026-0001               │
├─────────────────────────────────────────┤
│  Name: John Doe                         │
│  Email: john.doe@email.com              │
│  Phone: +237 655 111 222                │
│  Birthday: 1980-05-15                   │
│                                         │
│  Tier: VIP Gold ▼                       │
│        Change to VIP Platinum? ↓        │
│                                         │
│  Status: ◉ Active  ○ Inactive          │
│                                         │
│  Photo: [Current] [Change]              │
│                                         │
│  [Save Changes] ✅                      │
└─────────────────────────────────────────┘
```

**Common Edits:**
- Update contact info
- Change tier (upgrade/downgrade)
- Update photo
- Mark inactive (self-excluded, etc.)

---

## 5. PLAYER TIER MANAGEMENT

### Understanding Tiers

```
NEW ⭐
- First-time players
- No history yet
- Basic service

REGULAR ⭐⭐
- Established players
- Some play history
- Standard service

VIP SILVER ⭐⭐⭐
- 10+ visits OR CFA 5M+ drop
- Priority service
- 10% higher comps

VIP GOLD ⭐⭐⭐⭐
- 25+ visits OR CFA 15M+ drop
- VIP service
- 20% higher comps
- Special events

VIP PLATINUM ⭐⭐⭐⭐⭐
- 50+ visits OR CFA 50M+ drop
- Concierge service
- 30% higher comps
- Exclusive access
```

### When to Upgrade

**Example: Regular → VIP Silver**

```
Player: Mike Brown
Current: Regular
Stats:
- 12 sessions ✓ (need 10+)
- CFA 6M drop ✓ (need 5M+)

DECISION: ✅ UPGRADE!

Process:
1. Edit player profile
2. Change tier to "VIP Silver"
3. Save
4. Print new card
5. Call player to inform
6. Mail new card with letter
```

---

## 6. PRINT QR CARDS

### Individual Card

```
Player Profile → [Print QR Card]

Card Preview:
╔═══════════════════════════════╗
║                               ║
║    CASINO NAME                ║
║    MEMBER CARD                ║
║                               ║
║    [Photo]     ███████        ║
║                ███████ (QR)   ║
║                ███████        ║
║                               ║
║    JOHN DOE                   ║
║    Member ID: P-2026-0001     ║
║    Tier: VIP GOLD ⭐⭐         ║
║                               ║
║    Member Since 2024          ║
║                               ║
╚═══════════════════════════════╝

Printer: [Card Printer 1 ▼]
[Print Card] ✅

⏳ Printing... (30-60 seconds)
✅ Done! Give to player.
```

### Bulk Card Printing

```
Players → Select multiple players → [Bulk Actions ▼]
→ Print QR Cards

┌─────────────────────────────────────────┐
│  BULK PRINT QR CARDS                    │
├─────────────────────────────────────────┤
│  Players Selected: 25                   │
│                                         │
│  Estimated Time: 15-20 minutes          │
│  (30-60 sec per card)                   │
│                                         │
│  Printer: [Card Printer 1 ▼]           │
│                                         │
│  ⚠️ Ensure printer has:                 │
│  • 25+ blank cards loaded               │
│  • Sufficient ribbon/ink                │
│                                         │
│  [Start Printing] ✅                    │
└─────────────────────────────────────────┘

Use for:
- Member appreciation events
- Card replacement programs
- Tier upgrade mailings
```

---

## 7. IMPORT/EXPORT PLAYERS

### Export Players

```
Players → [Export]

┌─────────────────────────────────────────┐
│  EXPORT PLAYERS                         │
├─────────────────────────────────────────┤
│  Format: ◉ Excel  ○ CSV                │
│                                         │
│  Include Fields:                        │
│  ☑ Member ID                            │
│  ☑ Name                                 │
│  ☑ Email                                │
│  ☑ Phone                                │
│  ☑ Tier                                 │
│  ☑ Status                               │
│  ☑ Gaming Stats                         │
│                                         │
│  Current Filters:                       │
│  • Tier: VIP Gold                       │
│  • Status: Active                       │
│  • Result: 25 players                   │
│                                         │
│  [Download Excel] ✅                    │
└─────────────────────────────────────────┘

File: Players_Export_20260303.xlsx
Use for: Marketing, analysis, backup
```

### Import Players

```
Players → [Import]

Step 1: [Download Template] ✅
Step 2: Fill in Excel with player data
Step 3: [Choose File] → Upload

Example Excel:
| Name        | Email            | Phone        | Tier    |
|-------------|------------------|--------------|---------|
| Tom Wilson  | tom@email.com    | +237 655 444 | Regular |
| Lisa Brown  | lisa@email.com   | +237 655 555 | VIP Gold|

Step 4: System validates

┌─────────────────────────────────────────┐
│  IMPORT VALIDATION                      │
├─────────────────────────────────────────┤
│  File: players_import.xlsx              │
│  Rows: 50                               │
│                                         │
│  ✅ Valid: 48 players                   │
│  ⚠️ Warnings: 2 (missing optional data) │
│  ❌ Errors: 0                           │
│                                         │
│  [Import 48 Players] ✅                 │
└─────────────────────────────────────────┘

✅ Imported!
QR codes auto-generated for all.
```

---

## 8. COMPS MANAGEMENT

### Approve Comp Redemption

**Waiter requests approval for overage**

```
Comps → Pending Approvals

┌─────────────────────────────────────────┐
│  COMP REDEMPTION APPROVAL               │
├─────────────────────────────────────────┤
│  Player: John Doe (VIP Gold)            │
│  Comps Balance: CFA 13,000              │
│                                         │
│  Items Requested:                       │
│  • Beer x 2         CFA 10,000          │
│  • Whisky x 1       CFA 15,000          │
│  • Cigarettes x 1   CFA 3,000           │
│                                         │
│  Total: CFA 28,000                      │
│  Balance: CFA 13,000                    │
│  Overage: CFA 15,000 ⚠️                 │
│                                         │
│  Waiter: waiter1                        │
│                                         │
│  Options:                               │
│  ◉ Approve overage (add to account)    │
│  ○ Deny (remove items to fit balance)  │
│                                         │
│  Your Password: ••••••••                │
│                                         │
│  [✅ APPROVE]  [❌ DENY]                │
└─────────────────────────────────────────┘

Approve if:
✅ Player is VIP
✅ Reasonable amount
✅ Good player history
✅ Special occasion

Deny if:
❌ Excessive amount
❌ Pattern of abuse
❌ New player with no history
```

---

## 9. PLAYER REPORTS

### Player Performance Report

```
Reports → Player Performance

┌─────────────────────────────────────────┐
│  PLAYER PERFORMANCE REPORT              │
├─────────────────────────────────────────┤
│  Date Range: This Month ▼               │
│  Tier: All ▼                            │
│  Property: Main Casino ▼                │
│                                         │
│  [Generate Report] ✅                   │
└─────────────────────────────────────────┘

Report Shows:
- Top players by drop
- Top players by theo
- Most active players
- New player acquisition
- Inactive players (re-engagement needed)
- Tier distribution
- Comps redemption rates

[Export] [Print] [Email]
```

### Player Retention Report

```
Reports → Player Retention

┌─────────────────────────────────────────┐
│  PLAYER RETENTION                       │
├─────────────────────────────────────────┤
│  7-Day Return Rate: 68% ✅              │
│  30-Day Return Rate: 42% ⚠️             │
│                                         │
│  At Risk Players (90+ days no visit):   │
│  • John Doe (VIP Gold) - 95 days        │
│  • Jane Smith (VIP Plat) - 120 days     │
│                                         │
│  ACTION: Contact for re-engagement      │
│                                         │
│  [Generate Contact List] ✅             │
└─────────────────────────────────────────┘
```

---

# DAILY WORKFLOW

## Morning

```
- [ ] Log in
- [ ] Check new player registrations overnight
- [ ] Review pending comp approvals
- [ ] Check player birthdays today
- [ ] Review VIP arrivals expected
- [ ] Prepare welcome materials
```

## Throughout Day

```
- [ ] Greet arriving VIP players
- [ ] Register new players
- [ ] Handle player requests
- [ ] Approve comp redemptions
- [ ] Address complaints
- [ ] Update player information
- [ ] Print cards as needed
```

## Evening

```
- [ ] Follow up with VIPs who visited
- [ ] Send thank you messages
- [ ] Update player notes
- [ ] Review day's registrations
- [ ] Plan next day VIP contacts
```

---

# COMMON SCENARIOS

## Scenario 1: VIP Player Arrives

```
1. Greet by name: "Welcome back, Mr. Doe!"
2. Check their profile quickly
3. Note any preferences/history
4. Offer assistance
5. Inform pit boss of VIP arrival
6. Check comps balance
7. Offer beverages/service
8. Monitor during visit
9. Thank them when leaving
```

## Scenario 2: Player Complaint

```
Example: "I never got my comps!"

Steps:
1. Listen calmly
2. Pull up player profile
3. Check comps history
4. Investigate:
   - Did session end properly?
   - Was theo calculated?
   - Were comps credited?
5. If error: Apologize, correct immediately
6. If correct: Explain politely with evidence
7. If unsure: Escalate to manager
8. Document interaction
9. Follow up
```

## Scenario 3: Player Wants Tier Upgrade

```
Player: "Why am I not VIP yet?"

Check criteria:
┌─────────────────────────────────────────┐
│  Mike Brown (P-2026-0003)               │
│  Current: Regular                       │
│                                         │
│  VIP Silver Criteria (need ONE):        │
│  ☑ 10+ sessions (Has: 12) ✅            │
│  ☑ CFA 5M+ drop (Has: 6M) ✅            │
│                                         │
│  ELIGIBLE! ✅                           │
└─────────────────────────────────────────┘

Response:
"Great news! You actually qualify!
Let me upgrade you right now.
You'll get your new VIP Silver card shortly."

[Edit player → Change tier → Save]
[Print new card]
[Explain new benefits]
```

## Scenario 4: Lost Member Card

```
Player: "I lost my card!"

Steps:
1. Verify identity (ID, phone, etc.)
2. Look up player account
3. Mark old card as lost (invalidate QR)
4. Print replacement card (new QR)
5. Charge replacement fee? (policy dependent)
6. Give new card
7. Update notes
```

---

# PLAYER SERVICE EXCELLENCE

## VIP Service Standards

**VIP Platinum:**
- Personal greeting (use name!)
- Dedicated attention
- Anticipate needs
- Private area if available
- Complimentary everything within reason
- Personal follow-up

**VIP Gold:**
- Warm greeting
- Priority service
- Check in during visit
- Generous comps
- Thank you message

**VIP Silver:**
- Friendly greeting
- Attentive service
- Standard comps
- Acknowledge loyalty

## Building Relationships

✅ **DO:**
- Remember names
- Note preferences
- Celebrate birthdays
- Acknowledge milestones
- Be genuine
- Follow up

❌ **DON'T:**
- Be pushy
- Over-promise
- Ignore lower tiers
- Show favoritism obviously
- Forget promises

---

# KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| Ctrl+1 | Dashboard |
| Ctrl+2 | Players (your main page) |
| Ctrl+8 | Comps |
| Ctrl+N | New player |
| Ctrl+F | Focus search |
| Ctrl+H | Help |

---

# FAQ

**Q: Can I change a player's gaming stats?**
A: No, stats are calculated by rating sessions. You can view but not edit.

**Q: Can I delete a player?**
A: Yes, but only if no gaming history. Better to mark "Inactive" to preserve records.

**Q: What if player refuses to give email/phone?**
A: Optional fields. Can create account with just name. But encourage for communications.

**Q: Can I approve unlimited comp overages?**
A: Use judgment. Small overages (10-20%) for VIPs OK. Large overages may need manager approval.

**Q: How often should I upgrade player tiers?**
A: Review monthly. System shows eligible players. Proactive upgrades build loyalty.

**Q: What if player wants to be removed from system?**
A: Mark inactive. Explain we keep minimal records for compliance. Can reactivate anytime.

---

# CONTACT SUPPORT

📱 Manager: Your shift manager  
💬 Pit Boss: Floor operations  
📧 Email: support@your-casino.com  
🎯 Marketing: marketing@your-casino.com  

---

**END OF HOST USER GUIDE**
**Version 2.3.0 | March 2026**
