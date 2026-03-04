# Manager User Guide
## MF-Intel CMS for Gaming IQ v2.3.0

**Complete Guide for Managers**

---

# YOUR ROLE: MANAGER

## Welcome!

As a **Manager**, you have **administrative access** to most operational features. You're responsible for day-to-day casino operations, approvals, and oversight.

### What You CAN Do ✅
- Access Dashboard, Players, Floats, Ratings, Drop, Cage, Comps, Reports
- Approve vault transfers
- Manage most users (not Super Managers)
- Override decisions
- Generate reports
- Approve VIP discounts

### What You CANNOT Do ❌
- Create/edit/delete Super Manager accounts
- Change system configuration
- Access advanced setup features
- Modify system-wide settings

---

# QUICK START

## Login
```
1. Go to: https://your-casino-url.vercel.app
2. Username: manager1
3. Password: YourPassword
4. Click Login ✅
```

## Your Dashboard

**[SCREENSHOT: Manager Dashboard]**
```
┌──────────────────────────────────────────────────────────────┐
│ MF-Intel CMS    [manager1 ▼]                  [🔔] [Help]    │
├──────────────────────────────────────────────────────────────┤
│ [Dashboard] [Players] [Floats] [Ratings] [Drop] [Cage]       │
│ [Comps] [Reports]                                             │
└──────────────────────────────────────────────────────────────┘

Today's Operations:
  Tables: 12 open, 8 active
  Players: 23 active, 156 total
  Drop: CFA 45,000,000
  Win: CFA 2,250,000 (5.0% hold)
```

---

# CORE RESPONSIBILITIES

## 1. Operations Oversight
**Morning (Start of Shift):**
- [ ] Review overnight activity
- [ ] Check active tables/players
- [ ] Review any incidents
- [ ] Brief staff

**Throughout Shift:**
- [ ] Monitor floor operations
- [ ] Approve vault transfers
- [ ] Address escalated issues
- [ ] Support staff

**End of Shift:**
- [ ] Review shift performance
- [ ] Generate shift report
- [ ] Handover to next manager
- [ ] Document issues

## 2. Vault Transfer Approvals

**CRITICAL DUTY:** You approve vault transfers.

### Approve Transfer
```
┌─────────────────────────────────────────┐
│  VAULT TRANSFER APPROVAL                │
├─────────────────────────────────────────┤
│  Request: VLT-2026-0042                 │
│  Cashier: cashier1                      │
│  Amount: CFA 10,000,000                 │
│  Type: Withdrawal (Vault → Cage)        │
│  Reason: Replenish cage float           │
│                                         │
│  Your Username: manager1                │
│  Your Password: ••••••••                │
│  [Sign Here]                            │
│                                         │
│  [✅ APPROVE]  [❌ REJECT]              │
└─────────────────────────────────────────┘
```

**When to APPROVE:**
- ✅ Reasonable amount
- ✅ Valid reason
- ✅ Sufficient vault balance
- ✅ Trust the cashier

**When to REJECT:**
- ❌ Amount too large
- ❌ Vague reason
- ❌ Low vault balance
- ❌ Need clarification

## 3. VIP Discount Approvals

When a waiter requests VIP discount:

```
┌─────────────────────────────────────────┐
│  VIP DISCOUNT APPROVAL                  │
├─────────────────────────────────────────┤
│  Player: Sarah Lee (VIP Platinum)       │
│  Items: Steak Dinner, Premium Whisky    │
│  Subtotal: CFA 140,000                  │
│  VIP Discount (20%): -CFA 28,000        │
│  Final Total: CFA 112,000               │
│                                         │
│  Waiter: waiter1                        │
│                                         │
│  Your Password: ••••••••                │
│                                         │
│  [✅ APPROVE]  [❌ DENY]                │
└─────────────────────────────────────────┘
```

**Verify:**
- Player tier matches discount
- Amount is reasonable
- Not being abused

## 4. User Management (Limited)

You can manage users EXCEPT Super Managers.

### Create New User
```
Setup → Users → [+ Add New User]

Username: inspector3
Password: SecurePass123!
Name: David Wilson
Type: Inspector ▼
Property: Main Casino ✓
[Create User] ✅
```

**Users You Can Manage:**
- ✅ Managers (same level)
- ✅ Pit Boss
- ✅ Inspector
- ✅ Cashier
- ✅ Host
- ✅ Waiter

**Users You CANNOT Manage:**
- ❌ Super Managers

## 5. Monitor Operations

### Check Active Sessions
```
Ratings → Active Sessions

┌──────────────────────────────────────────┐
│  ACTIVE SESSIONS (23)                    │
├──────────────────────────────────────────┤
│  John Doe    BJ-01   2h15m   ✅ Active   │
│  Jane Smith  BJ-01   1h45m   ✅ Active   │
│  Mike Brown  RO-01   0h30m   ✅ Active   │
│  Sarah Lee   BC-01   3h10m   ⏸️ Paused   │
└──────────────────────────────────────────┘
```

**Watch For:**
- Long sessions (fatigue?)
- Paused sessions (forgotten?)
- Unusual patterns

### Check Float Status
```
Floats → Active Floats

┌──────────────────────────────────────────┐
│  Table  Open    Current  Net Change      │
├──────────────────────────────────────────┤
│  BJ-01  5.0M    6.5M     +1.5M ✅        │
│  BJ-02  5.0M    3.8M     -1.2M ⚠️        │
│  RO-01  8.0M    9.5M     +1.5M ✅        │
└──────────────────────────────────────────┘
```

**Concern:** BJ-02 is losing (-1.2M)
**Action:** Monitor, check camera if continues

## 6. Generate Reports

### Daily Shift Report
```
Reports → Shift Report

Date Range: Today
Shift: Your shift (16:00-00:00)
Property: Main Casino

[Generate Report]

Report includes:
- Tables operated
- Drop and win
- Player count
- Staff performance
- Incidents
- Approvals given

[Export to Excel] [Print] [Email]
```

---

# TROUBLESHOOTING

## Player Disputes

**Scenario:** Player claims incorrect payout

**Steps:**
1. Stay calm, listen to player
2. Review session history
3. Check camera footage (if available)
4. Consult with dealer/inspector
5. Make decision:
   - If player correct: Apologize, compensate
   - If casino correct: Explain politely
6. Document in notes
7. Report to Super Manager

## System Errors

**Scenario:** User reports "cannot login"

**Steps:**
1. Verify username (case-sensitive)
2. Try password reset
3. Check if account active
4. Check if internet connection stable
5. If persists: Contact support

## Cash Discrepancies

**Scenario:** Float closure shows CFA 50K variance

**Steps:**
1. Recount physical chips/cash
2. Review all receipts
3. Check for recording errors
4. Interview cashier/dealer
5. Document findings
6. If unresolved: Report to Super Manager

---

# KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| Ctrl+1 | Dashboard |
| Ctrl+2 | Players |
| Ctrl+3 | Floats |
| Ctrl+4 | Ratings |
| Ctrl+5 | Drop |
| Ctrl+6 | Reports |
| Ctrl+7 | Cage |
| Ctrl+8 | Comps |
| Ctrl+L | Logout |
| Ctrl+H | Help |

---

# BEST PRACTICES

## Daily Checklist

**Start of Shift:**
- [ ] Log in and check dashboard
- [ ] Review handover notes
- [ ] Check pending approvals
- [ ] Brief team

**During Shift:**
- [ ] Walk the floor hourly
- [ ] Review approvals promptly
- [ ] Monitor key metrics
- [ ] Support staff

**End of Shift:**
- [ ] Generate shift report
- [ ] Document incidents
- [ ] Handover to next manager
- [ ] Sign out properly

## Communication Tips

**With Staff:**
- Be clear and direct
- Provide feedback
- Support decisions
- Lead by example

**With Players:**
- Professional and courteous
- Listen actively
- Resolve issues fairly
- Maintain composure

## Security

**Passwords:**
- Never share your password
- Change every 90 days
- Use strong passwords
- Don't write down

**Approvals:**
- Verify before approving
- Document decisions
- Be accountable
- If unsure, ask Super Manager

---

# FAQ

**Q: Can I delete a Super Manager?**
A: No, only Super Managers can manage Super Manager accounts.

**Q: How do I reset a user password?**
A: Setup → Users → Find user → Edit → Reset Password → Enter new password → Force change on login ✓

**Q: What if I reject a vault transfer by mistake?**
A: Cashier can submit new request. Contact them to resubmit.

**Q: Can I approve my own vault transfer request?**
A: No, another manager or Super Manager must approve.

**Q: How do I handle an angry player?**
A: Stay calm, listen, be fair, escalate to Super Manager if needed.

**Q: What reports can I generate?**
A: All operational reports except system configuration reports.

**Q: Can I change menu prices?**
A: No, only Super Managers can modify setup/configuration.

---

# CONTACT SUPPORT

📧 Email: support@your-casino.com  
📱 Phone: +XXX XXX XXX XXX  
💬 Emergency: Contact Super Manager  

**Support Hours:**  
Mon-Fri: 8 AM - 10 PM  
Sat-Sun: 10 AM - 8 PM  
Emergency: 24/7  

---

**END OF MANAGER USER GUIDE**
**Version 2.3.0 | March 2026**
