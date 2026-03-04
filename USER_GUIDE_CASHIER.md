# Cashier User Guide
## MF-Intel CMS for Gaming IQ v2.3.0

---

# YOUR ROLE: CASHIER

## Welcome!

As a **Cashier**, you manage the **cage** - the central cash handling area. You handle all float operations, vault transfers, and player cashouts.

### What You CAN Do ✅
- Open/close table floats
- Process fills (add chips to tables)
- Process credits (remove chips from tables)
- Request vault transfers
- Handle player cashouts
- Manage holding chips
- Print receipts

### What You CANNOT Do ❌
- Approve vault transfers (Manager only)
- Rate players (Inspector/Pit Boss only)
- Create/edit players (Host only)
- Access reports (limited access)

---

# QUICK START

## Login

```
URL: https://your-casino-url.vercel.app
Username: cashier1
Password: YourPassword
[Login] ✅

You see: Cage tab available
```

## Cage Dashboard

```
┌──────────────────────────────────────────┐
│  CAGE OPERATIONS                         │
├──────────────────────────────────────────┤
│  Vault Balance: CFA 140,000,000          │
│                                          │
│  Today:                                  │
│  Floats Opened: 12                       │
│  Floats Closed: 8                        │
│  Fills: 28                               │
│  Credits: 15                             │
│  Cashouts: 156                           │
│                                          │
│  [New Transaction ▼]                     │
└──────────────────────────────────────────┘
```

---

# CORE DUTIES

## 1. OPEN FLOAT

**When:** Table starts operations (morning/shift start)

```
Cage → [New Transaction] → Open Float

┌─────────────────────────────────────────┐
│  OPEN FLOAT                             │
├─────────────────────────────────────────┤
│  Table: BJ-01 ▼                         │
│  Dealer: John Smith ▼                   │
│  Inspector: Jane Doe ▼                  │
│  Amount: CFA 5,000,000                  │
│  Time: 08:00:25 (auto)                  │
│                                         │
│  [Submit] ✅                            │
└─────────────────────────────────────────┘

Process:
1. Prepare chips from vault (count carefully!)
2. Enter details in system
3. Dealer/Inspector verify amount
4. Submit
5. Receipt prints (2 copies) ✅
6. Deliver chips to table
7. Get signatures

Receipt Prints:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    CASINO NAME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOAT OPEN
Table: BJ-01
Dealer: John Smith
Inspector: Jane Doe
Amount: CFA 5,000,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: 2026-03-03 08:00:25
Cashier: cashier1
ID: FLT-2026-0042
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Copy 1: Cage File
Copy 2: Table
```

---

## 2. CLOSE FLOAT

**When:** Table ends operations (evening/shift end)

```
Cage → [New Transaction] → Close Float

┌─────────────────────────────────────────┐
│  CLOSE FLOAT                            │
├─────────────────────────────────────────┤
│  Table: BJ-01 ▼                         │
│  Opening Amount: CFA 5,000,000 (auto)   │
│  Closing Amount: CFA 6,500,000          │
│  Difference: +CFA 1,500,000 (Table Win) │
│                                         │
│  Dealer: John Smith (auto)              │
│  Inspector: Jane Doe (auto)             │
│                                         │
│  [Submit] ✅                            │
└─────────────────────────────────────────┘

Process:
1. Dealer/Inspector bring chips to cage
2. Count chips carefully (together!)
3. Enter closing amount
4. System calculates difference
5. Submit
6. Receipt prints ✅
7. Store chips in vault
8. File paperwork
```

---

## 3. FILL (Add Chips to Table)

**When:** Table running low on chips (players winning)

```
Cage → [New Transaction] → Fill

┌─────────────────────────────────────────┐
│  FILL FLOAT                             │
├─────────────────────────────────────────┤
│  Table: BJ-01 ▼                         │
│  Current Float: CFA 2,500,000           │
│  Fill Amount: CFA 2,000,000             │
│  New Float: CFA 4,500,000 (auto calc)   │
│                                         │
│  Reason: Low chips / High player wins   │
│                                         │
│  [Submit] ✅                            │
└─────────────────────────────────────────┘

Process:
1. Receive fill request from floor
2. Prepare chips from vault
3. Enter details
4. Submit
5. Receipt prints ✅
6. Deliver to table
7. Inspector verifies and signs
```

---

## 4. CREDIT (Remove Chips from Table)

**When:** Table has excess chips (players losing/slow period)

```
Cage → [New Transaction] → Credit

┌─────────────────────────────────────────┐
│  CREDIT FLOAT                           │
├─────────────────────────────────────────┤
│  Table: BJ-01 ▼                         │
│  Current Float: CFA 8,500,000           │
│  Credit Amount: CFA 3,000,000           │
│  New Float: CFA 5,500,000 (auto calc)   │
│                                         │
│  Reason: Excess chips / Low activity    │
│                                         │
│  [Submit] ✅                            │
└─────────────────────────────────────────┘

Process:
1. Inspector brings chips to cage
2. Count chips together
3. Enter details
4. Submit
5. Receipt prints ✅
6. Store chips in vault
```

---

## 5. VAULT TRANSFER REQUEST

**When:** Need cash from vault OR deposit cash to vault

### Withdrawal (Vault → Cage)

```
Cage → [New Transaction] → Vault Transfer

┌─────────────────────────────────────────┐
│  VAULT TRANSFER REQUEST                 │
├─────────────────────────────────────────┤
│  Type: ◉ Withdrawal  ○ Deposit         │
│  Amount: CFA 10,000,000                 │
│  Reason: Replenish cage float           │
│                                         │
│  Your Password: ••••••••                │
│  [Sign Here]                            │
│                                         │
│  [Submit Request] ✅                    │
└─────────────────────────────────────────┘

✅ Request Submitted!
Status: ⏳ Pending Manager Approval

Wait for manager to approve...

[Manager approves] ✅

✅ APPROVED!
You can now complete transfer.
Receipt prints with both signatures.
```

### Deposit (Cage → Vault)

```
Same process, select "Deposit"
Use when you have excess cash in cage.
```

**⚠️ IMPORTANT:** You can only REQUEST transfers. Manager must APPROVE.

---

## 6. PLAYER CASHOUT

**When:** Player wants to exchange chips for cash

```
Cage → [New Transaction] → Player Cashout

┌─────────────────────────────────────────┐
│  PLAYER CASHOUT                         │
├─────────────────────────────────────────┤
│  Player: John Doe ▼ (optional)          │
│  Or scan QR: [📷]                       │
│                                         │
│  Chips Presented: CFA 850,000           │
│  Cash Given: CFA 850,000                │
│                                         │
│  (Even exchange - no fill/credit)       │
│                                         │
│  [Process Cashout] ✅                   │
└─────────────────────────────────────────┘

Process:
1. Player presents chips
2. Count chips carefully
3. Count cash to give
4. Enter in system
5. Submit
6. Receipt prints ✅
7. Give cash to player
8. Thank player!

Receipt:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    PLAYER CASHOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Player: John Doe
Member: P-2026-0001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Chips: CFA 850,000
Cash Given: CFA 850,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cashier: cashier1
Date: 2026-03-03 17:05:30
ID: CSH-2026-0158
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Thank you for visiting!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 7. HOLDING CHIPS

**When:** Chips held for investigation/dispute

```
Cage → [New Transaction] → Holding Chips

┌─────────────────────────────────────────┐
│  HOLDING CHIPS                          │
├─────────────────────────────────────────┤
│  Table: BJ-01 ▼                         │
│  Amount: CFA 500,000                    │
│  Reason: Player dispute                 │
│  Details: ________________________      │
│                                         │
│  Held By: manager1 ▼                    │
│                                         │
│  [Submit] ✅                            │
└─────────────────────────────────────────┘

Chips stored separately.
Manager will release when resolved.
```

---

# DAILY WORKFLOW

## Opening Your Shift

```
- [ ] Log in
- [ ] Check vault balance
- [ ] Review handover notes
- [ ] Count your cage drawer
- [ ] Verify starting cash matches record
- [ ] Ready for transactions
```

## During Your Shift

```
Regular Tasks:
- [ ] Process floats as requested
- [ ] Handle fills/credits promptly
- [ ] Process cashouts efficiently
- [ ] Submit vault transfer requests when needed
- [ ] Keep workspace organized
- [ ] Maintain security

Every Hour:
- [ ] Check vault balance
- [ ] Review pending approvals
- [ ] Verify receipts filed
- [ ] Count cash drawer periodically
```

## Closing Your Shift

```
- [ ] Process all pending transactions
- [ ] Count cash drawer
- [ ] Reconcile with opening balance + transactions
- [ ] Generate shift report
- [ ] File all receipts
- [ ] Handover notes to next cashier
- [ ] Sign out
```

---

# SHIFT RECONCILIATION

## End of Shift Count

```
Opening Drawer: CFA 50,000,000

Transactions:
+ Floats Closed: CFA 52,000,000
+ Credits: CFA 12,000,000
- Floats Opened: CFA 60,000,000
- Fills: CFA 28,000,000
- Cashouts: CFA 38,000,000

Expected Closing: CFA 48,000,000
Actual Count: CFA 48,000,000

Variance: CFA 0 ✅ BALANCED!
```

**If Variance:**
```
Small (<0.1%): Acceptable, document
Medium (0.1-0.5%): Recount, investigate
Large (>0.5%): Call manager immediately
```

---

# TROUBLESHOOTING

## Problem: Cannot Open Float

**Solution:**
```
1. Check if table already has open float
2. Verify table exists in system
3. Check dealer/inspector exist
4. Refresh page
5. Contact Pit Boss if persists
```

## Problem: Vault Transfer Rejected

**Solution:**
```
1. Read rejection reason
2. Address the concern
3. Submit new request with:
   - Adjusted amount?
   - Better reason?
   - Different timing?
```

## Problem: Drawer Doesn't Balance

**Solution:**
```
1. Recount carefully
2. Review all transactions
3. Check for recording errors
4. Look for missing receipts
5. Document variance
6. Report to manager
```

## Problem: Receipt Printer Jammed

**Solution:**
```
1. Don't force!
2. Open printer cover
3. Remove jammed paper gently
4. Check paper roll loaded correctly
5. Reprint receipt
6. If damaged, call IT
```

---

# SECURITY BEST PRACTICES

## Cash Handling

✅ **DO:**
- Count all cash twice
- Count in view of camera
- Verify denominations
- Get signatures for large amounts
- Keep drawer organized
- Lock drawer when away

❌ **DON'T:**
- Leave drawer open unattended
- Count cash out of view
- Trust without verifying
- Rush counts
- Mix personal money with casino
- Share access

## Chip Handling

✅ **DO:**
- Verify chip authenticity
- Count chips methodically
- Use counting racks
- Double-check totals
- Store securely

❌ **DON'T:**
- Accept damaged chips without approval
- Shortcut counting
- Leave chips unattended

---

# KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| Ctrl+1 | Dashboard |
| Ctrl+7 | Cage (your main page) |
| Ctrl+H | Help |
| Ctrl+L | Logout |

---

# FAQ

**Q: Can I approve my own vault transfer?**
A: No, manager must approve all vault transfers.

**Q: What if I make counting error?**
A: Call manager immediately. Better to catch and correct than discover later.

**Q: Can I give cash advance to player?**
A: No, players must cashout chips only.

**Q: What if player disputes cashout amount?**
A: Recount together. If still disputed, call manager. Camera footage available.

**Q: How do I handle suspected counterfeit?**
A: DO NOT ACCEPT. Politely hold bill, call manager/security immediately.

**Q: What if vault balance is low?**
A: Alert manager immediately. They'll arrange cash delivery.

**Q: Can I take bathroom break?**
A: Yes, but must close/lock drawer and inform supervisor. Another cashier covers.

---

# EMERGENCY PROCEDURES

## Robbery/Threat

```
1. Stay calm
2. Comply with demands (safety first!)
3. Observe details (description, direction)
4. Activate silent alarm (if safe)
5. After: Secure area, call police, preserve evidence
6. DO NOT CHASE
```

## Fire

```
1. Secure cash/chips (if time permits)
2. Close vault (if time permits)
3. Evacuate immediately
4. Follow fire procedures
5. DO NOT RE-ENTER
```

## System Down

```
1. Switch to manual procedures
2. Use paper forms
3. Document all transactions
4. Enter in system when back up
5. Inform manager
```

---

# CONTACT SUPPORT

📱 Manager: Your shift manager (immediate)  
💬 Pit Boss: Floor supervisor  
📧 Email: support@your-casino.com  
🚨 Security: Emergency button / Radio  

---

**END OF CASHIER USER GUIDE**
**Version 2.3.0 | March 2026**
