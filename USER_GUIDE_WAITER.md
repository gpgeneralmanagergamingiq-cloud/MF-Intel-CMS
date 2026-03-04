# Waiter User Guide
## MF-Intel CMS for Gaming IQ v2.3.0

---

# YOUR ROLE: WAITER

## Welcome!

As a **Waiter**, you provide **food & beverage service** and record **comps** (complimentary items). You're the face of customer service!

### What You CAN Do ✅
- Record free comp redemptions
- Process cash sales (POS)
- Process staff purchases (50% discount)
- Scan player/employee QR codes
- Print receipts
- View menu items

### What You CANNOT Do ❌
- Create/edit players (Host only)
- Approve large comp overages (Host/Manager only)
- Cage operations (Cashier only)
- Rate players (Inspector/Pit Boss only)
- Edit menu (Manager/Super Manager only)

---

# QUICK START

## Login

```
URL: https://your-casino-url.vercel.app
Username: waiter1
Password: YourPassword
[Login] ✅

You see: Comps tab available
```

## Your Dashboard

```
┌──────────────────────────────────────────┐
│  COMPS DASHBOARD                         │
├──────────────────────────────────────────┤
│  Today's Activity:                       │
│  Free Comps: CFA 45,000 (15 trans)       │
│  Cash Sales: CFA 285,000 (38 trans)      │
│  Staff Purchases: CFA 22,000 (8 trans)   │
│                                          │
│  [New Transaction ▼]                     │
│    • Free Comp Redemption                │
│    • Cash Sale (POS)                     │
│    • Staff Purchase                      │
└──────────────────────────────────────────┘
```

---

# THREE COMPS MODES

## Mode 1: FREE COMP REDEMPTION

**Player uses their comp balance**

### Step 1: Scan Player QR

```
Comps → [Free Comp Redemption]

[📷 Scan Player QR Code]

Scanning...
✅ Found: John Doe (P-2026-0001)

Player Info:
- Name: John Doe
- Tier: VIP Gold ⭐⭐
- Comps Balance: CFA 13,000
```

### Step 2: Select Items

```
┌─────────────────────────────────────────┐
│  FREE COMP REDEMPTION                   │
│  Player: John Doe (CFA 13,000 balance)  │
├─────────────────────────────────────────┤
│  Select Items:                          │
│                                         │
│  DRINKS:                                │
│  ☐ Beer (CFA 5,000)                     │
│  ☐ Wine (CFA 10,000)                    │
│  ☐ Whisky (CFA 15,000)                  │
│  ☐ Soft Drink (CFA 2,000)               │
│                                         │
│  CIGARETTES:                            │
│  ☐ Pack (CFA 3,000)                     │
│                                         │
│  FOOD:                                  │
│  ☐ Appetizer (CFA 10,000)               │
│  ☐ Burger (CFA 25,000)                  │
│                                         │
│  [Next Step] →                          │
└─────────────────────────────────────────┘
```

**Select items:** Beer x 2, Soft Drink x 1

### Step 3: Review & Confirm

```
┌─────────────────────────────────────────┐
│  CONFIRM FREE COMP                      │
├─────────────────────────────────────────┤
│  Player: John Doe                       │
│                                         │
│  Items:                                 │
│  • Beer x 2         CFA 10,000          │
│  • Soft Drink x 1   CFA 2,000           │
│                                         │
│  Total: CFA 12,000                      │
│                                         │
│  Previous Balance: CFA 13,000           │
│  Redeemed: -CFA 12,000                  │
│  New Balance: CFA 1,000 ✅              │
│                                         │
│  [Confirm] ✅  [Cancel]                 │
└─────────────────────────────────────────┘

✅ Comp Redeemed!
Receipt printing... ✅

Receipt:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    COMPLIMENTARY SERVICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Player: John Doe
Member: P-2026-0001
Tier: VIP Gold
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ITEMS:
Beer x 2           CFA 10,000
Soft Drink x 1     CFA 2,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal:          CFA 12,000
Comp Discount:    -CFA 12,000
TOTAL DUE:         CFA 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Previous Balance:  CFA 13,000
Redeemed:         -CFA 12,000
New Balance:       CFA 1,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Waiter: waiter1
Date: 2026-03-03 15:30:25
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Thank you for playing!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Give receipt to player ✅
Deliver items ✅
```

---

### What If Insufficient Balance?

**Example:** Player balance CFA 5,000, wants items worth CFA 20,000

```
┌─────────────────────────────────────────┐
│  ⚠️ INSUFFICIENT COMPS                  │
├─────────────────────────────────────────┤
│  Items Total: CFA 20,000                │
│  Player Balance: CFA 5,000              │
│  Overage: CFA 15,000                    │
│                                         │
│  OPTIONS:                               │
│  1. Remove items to fit balance         │
│  2. Request Host approval for overage   │
│  3. Player pays difference (cash)       │
│                                         │
│  [Remove Items]                         │
│  [Request Approval]                     │
│  [Charge Difference]                    │
└─────────────────────────────────────────┘
```

**Option 1:** Remove expensive items until fits  
**Option 2:** Host approves overage (VIP players)  
**Option 3:** Use Mode 2 (cash sale) for difference  

---

## Mode 2: CASH SALE (POS)

**Regular sale - player pays cash**

### Step 1: Select Items

```
Comps → [Cash Sale (POS)]

┌─────────────────────────────────────────┐
│  CASH SALE (POS)                        │
├─────────────────────────────────────────┤
│  Customer: Walk-in / Player             │
│                                         │
│  Select Items:                          │
│  Beer x 3          CFA 15,000           │
│  Burger x 2        CFA 50,000           │
│  Soft Drink x 2    CFA 4,000            │
│                                         │
│  SUBTOTAL: CFA 69,000                   │
│                                         │
│  VIP Discount? [Scan Player QR]         │
│                                         │
│  [Proceed to Payment] →                 │
└─────────────────────────────────────────┘
```

### Step 2: Payment

```
┌─────────────────────────────────────────┐
│  PAYMENT                                │
├─────────────────────────────────────────┤
│  Total: CFA 69,000                      │
│                                         │
│  Payment Method:                        │
│  ◉ Cash  ○ Card                        │
│                                         │
│  Amount Received: CFA 70,000            │
│  Change: CFA 1,000 ✅                   │
│                                         │
│  [Complete Sale] ✅                     │
└─────────────────────────────────────────┘

✅ Sale Complete!
Receipt printing... ✅

Receipt:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    CASINO F&B SALE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ITEMS:
Beer x 3           CFA 15,000
Burger x 2         CFA 50,000
Soft Drink x 2     CFA 4,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal:          CFA 69,000
Tax:               CFA 0
TOTAL:             CFA 69,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Payment: Cash
Received:          CFA 70,000
Change:            CFA 1,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Waiter: waiter1
Date: 2026-03-03 15:45:12
Transaction: POS-2026-0234
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Thank you!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Give receipt + change ✅
Deliver items ✅
```

---

### VIP Discount (Requires Manager Approval)

**Step 1:** Scan player QR during item selection

```
[Scan Player QR] → Sarah Lee (VIP Platinum)

VIP Discount Available: 20% OFF
```

**Step 2:** Items selected, discount applied

```
┌─────────────────────────────────────────┐
│  VIP DISCOUNTED SALE                    │
├─────────────────────────────────────────┤
│  Player: Sarah Lee (VIP Platinum)       │
│                                         │
│  Premium Whisky x 2    CFA 60,000       │
│  Steak Dinner x 1      CFA 80,000       │
│                                         │
│  Subtotal: CFA 140,000                  │
│  VIP Discount (20%): -CFA 28,000        │
│                                         │
│  🔐 MANAGER APPROVAL REQUIRED           │
│                                         │
│  Manager Username: manager1             │
│  Manager Password: ••••••••             │
│                                         │
│  TOTAL: CFA 112,000                     │
│                                         │
│  [Request Approval] →                   │
└─────────────────────────────────────────┘

Manager enters credentials ✅

✅ APPROVED by manager1

Proceed to payment:
Amount Received: CFA 120,000
Change: CFA 8,000

Receipt shows:
- Subtotal: CFA 140,000
- VIP Discount: -CFA 28,000
- Total: CFA 112,000
- Approved By: manager1
```

---

## Mode 3: STAFF PURCHASE

**Employee purchase with 50% discount**

### Step 1: Scan Employee QR

```
Comps → [Staff Purchase]

[📷 Scan Employee QR Card]

✅ Found: Mike Johnson (EMP-0042)

Employee Info:
- Name: Mike Johnson
- Department: Floor Operations
- Staff Discount: ✅ ENABLED (50%)
```

### Step 2: Select Items

```
┌─────────────────────────────────────────┐
│  STAFF PURCHASE                         │
│  Employee: Mike Johnson (EMP-0042)      │
├─────────────────────────────────────────┤
│  Lunch Combo x 1       CFA 25,000       │
│  Soft Drink x 1        CFA 2,000        │
│                                         │
│  Subtotal: CFA 27,000                   │
│  Staff Discount (50%): -CFA 13,500      │
│                                         │
│  TOTAL: CFA 13,500 ✅                   │
│                                         │
│  Payment: ◉ Cash  ○ Payroll Deduction  │
│                                         │
│  [Complete Purchase] ✅                 │
└─────────────────────────────────────────┘

✅ Staff Purchase Complete!
Receipt printing... ✅

Receipt:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    STAFF PURCHASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Employee: Mike Johnson
ID: EMP-0042
Department: Floor Operations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ITEMS:
Lunch Combo x 1     CFA 25,000
Soft Drink x 1      CFA 2,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal:           CFA 27,000
Staff Discount (50%): -CFA 13,500
TOTAL:              CFA 13,500
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Payment: Cash
Amount Paid:        CFA 13,500
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Served By: waiter1
Date: 2026-03-03 12:30:15
Transaction: STF-2026-0087
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Staff Discount Applied
    Enjoy your meal!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**💡 NOTE:** Staff discount only applies if enabled in Employee Management. If disabled, full price charged.

---

# DAILY WORKFLOW

## Opening Your Shift

```
- [ ] Log in
- [ ] Check your service area assignment
- [ ] Verify printer is working (test print)
- [ ] Review menu items
- [ ] Check for any out-of-stock items
- [ ] Get QR scanner ready
- [ ] Brief with supervisor
```

## During Your Shift

```
Regular Service:
- [ ] Approach players proactively
- [ ] Offer beverages/food
- [ ] Scan player card
- [ ] Process comps/sales
- [ ] Deliver items promptly
- [ ] Maintain clean service area

Every Transaction:
- [ ] Scan QR code correctly
- [ ] Verify items selected
- [ ] Confirm amounts
- [ ] Print receipt
- [ ] Give receipt to customer
- [ ] Deliver items

Every Hour:
- [ ] Walk your service area
- [ ] Check on served players
- [ ] Clear empty glasses/plates
- [ ] Restock supplies
```

## Closing Your Shift

```
- [ ] Complete all pending orders
- [ ] Clean service area
- [ ] Restock for next shift
- [ ] Review your transaction summary
- [ ] Report any issues
- [ ] Handover notes
- [ ] Sign out
```

---

# TRANSACTION SUMMARY

View your shift performance:

```
Comps → My Shift Summary

┌─────────────────────────────────────────┐
│  YOUR SHIFT SUMMARY                     │
│  Waiter: waiter1                        │
│  Shift: 08:00 - 16:00 (8 hours)         │
├─────────────────────────────────────────┤
│  FREE COMPS:                            │
│  Transactions: 15                       │
│  Value: CFA 42,000                      │
│  Players Served: 12                     │
│                                         │
│  CASH SALES:                            │
│  Transactions: 38                       │
│  Revenue: CFA 285,000                   │
│  Average Sale: CFA 7,500                │
│                                         │
│  STAFF PURCHASES:                       │
│  Transactions: 8                        │
│  Revenue: CFA 22,000                    │
│  Employees Served: 6                    │
│                                         │
│  TOTAL:                                 │
│  All Transactions: 61                   │
│  Total Value: CFA 349,000               │
│                                         │
│  [Export] [Print]                       │
└─────────────────────────────────────────┘
```

---

# COMMON SCENARIOS

## Scenario 1: Player Has No QR Card

**Solution:**
```
1. Ask player name
2. Call Host to look up player
3. Host provides Member ID
4. Manual search in system
5. Or: Host creates account if new player
6. Process transaction
7. Suggest player get card from Host
```

## Scenario 2: QR Code Won't Scan

**Solutions:**
```
1. Try again (hold steady, good lighting)
2. Clean scanner lens
3. Try different angle
4. Check card condition (damaged?)
5. Use manual player search
6. If scanner broken, report to manager
```

## Scenario 3: Player Wants Comp But Insufficient Balance

**Options:**
```
1. Reduce items to fit balance
2. Call Host to approve overage (VIPs)
3. Player pays difference with cash
4. Explain how to earn more comps
5. Suggest they play more to earn comps
```

## Scenario 4: Manager Not Available for VIP Discount

**Solution:**
```
1. Try to reach another manager
2. If urgent: Process as regular sale (full price)
3. Give receipt
4. Note transaction ID
5. Manager can refund difference later
6. Or: Player waits for manager
```

## Scenario 5: Receipt Printer Jammed

**Solution:**
```
1. Don't force!
2. Open printer carefully
3. Remove jammed paper
4. Reload paper roll
5. Test print
6. Reprint customer receipt
7. If broken, report immediately
8. Use backup printer if available
```

## Scenario 6: Item Out of Stock

**Solution:**
```
1. Apologize to customer
2. Suggest alternative
3. Note item out of stock
4. Report to supervisor
5. Update accordingly
```

---

# CUSTOMER SERVICE TIPS

## Excellent Service

✅ **DO:**
- Smile and be friendly
- Use player name (check tier!)
- Be proactive (offer before asked)
- Quick and efficient
- Thank players
- Keep area clean

❌ **DON'T:**
- Ignore players
- Rush visibly
- Forget receipts
- Be distracted (phone!)
- Argue with players
- Discuss other players

## Handling Difficult Customers

**Complaint about Service:**
```
1. Listen calmly
2. Apologize sincerely
3. Fix immediately if possible
4. Escalate to supervisor if needed
5. Follow up
6. Document
```

**Drunk/Disruptive Player:**
```
1. Stay professional
2. Don't serve more alcohol (policy)
3. Call security/manager
4. Don't argue
5. Safety first
```

---

# TROUBLESHOOTING

## Cannot Process Transaction

**Check:**
- [ ] Internet connection OK?
- [ ] Logged in correctly?
- [ ] Player/employee exists in system?
- [ ] QR code scanning working?
- [ ] All required fields filled?

**If persists:** Contact supervisor

## Wrong Item/Amount Recorded

**If not yet confirmed:**
- Remove item
- Re-add correctly
- Verify
- Confirm

**If already confirmed:**
- Cannot undo
- Note transaction ID
- Report to manager
- Manager can void/refund

## Receipt Not Printing

**Check:**
- [ ] Printer powered on?
- [ ] Paper loaded?
- [ ] Not jammed?
- [ ] Connected to system?

**Quick fix:** Reprint from transaction history

---

# BEST PRACTICES

## Speed & Efficiency

- Have scanner ready
- Know menu prices
- Pre-count common items
- Keep receipts organized
- Restock proactively

## Accuracy

- Double-check amounts
- Verify items before confirming
- Count change carefully
- Give correct receipts
- Update immediately

## Security

- Never share login
- Don't leave system unattended
- Verify QR codes
- Count cash carefully
- Report suspicious activity

---

# KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| Ctrl+1 | Dashboard |
| Ctrl+8 | Comps (your main page) |
| Ctrl+H | Help |
| Ctrl+L | Logout |

---

# FAQ

**Q: Can I give free items without scanning?**
A: No, must scan player QR or get Host approval.

**Q: What if player argues about their comp balance?**
A: Show them on screen. If they insist, call Host to verify.

**Q: Can I approve my own staff purchases?**
A: Not your own. Another staff member must process yours.

**Q: What if I accidentally charged wrong amount?**
A: Call manager to void and redo transaction.

**Q: Do I need manager approval for every VIP discount?**
A: Yes, EVERY TIME. Security requirement.

**Q: Can players pay with chips?**
A: No, only cash or card. They must cashout chips at cage first.

**Q: What if employee QR doesn't show discount?**
A: Their discount is disabled. Charge full price. They should contact HR/manager.

---

# MENU QUICK REFERENCE

## DRINKS
- Beer: CFA 5,000
- Wine: CFA 10,000
- Whisky: CFA 15,000
- Premium Whisky: CFA 30,000
- Champagne: CFA 50,000
- Soft Drink: CFA 2,000
- Water: CFA 1,000

## CIGARETTES
- Pack: CFA 3,000
- Carton: CFA 30,000

## FOOD
- Appetizer: CFA 10,000
- Burger: CFA 25,000
- Steak Dinner: CFA 80,000
- Dessert: CFA 8,000

*(Ask supervisor for full menu or check system)*

---

# CONTACT SUPPORT

📱 Supervisor: Your shift supervisor (immediate)  
💬 Host: Player account issues  
👨‍💼 Manager: Approvals, disputes  
📧 Email: support@your-casino.com  

---

**END OF WAITER USER GUIDE**
**Version 2.3.0 | March 2026**
