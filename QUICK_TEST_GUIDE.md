# Quick Test Reference Guide

## 🔑 Test Credentials

### Default Admin Login
```
Username: admin
Password: admin123
User Type: Management
Property: [Default Property]
```

### Test Users (Create these in Setup)
```
Pit Boss:
Username: pitboss1
Password: test123

Inspector:
Username: inspector1
Password: test123
```

---

## 🎰 Test Data Quick Reference

### Test Players
| Name | Member ID | Type | Purpose |
|------|-----------|------|---------|
| John Chen | VIP001 | High Roller | Big winner test |
| Maria Garcia | REG002 | Regular | Small winner test |
| David Smith | NEW003 | New Player | New player report test |
| Lisa Wong | VIP004 | VIP | Big loser test |
| Robert Johnson | REG005 | Regular | Loss rebate test |

### Test Tables
| Table | Game | Min Bet | Max Bet | Float |
|-------|------|---------|---------|-------|
| Baccarat 1 | Baccarat | 50,000 | 5,000,000 | 10,000,000 |
| BlackJack 1 | BlackJack | 10,000 | 500,000 | 5,000,000 |
| Roulette 1 | Roulette | 5,000 | 1,000,000 | 8,000,000 |
| Poker 1 | Poker | 25,000 | 2,000,000 | 6,000,000 |

### Initial Cage Float
| Denomination | Count | Value |
|--------------|-------|-------|
| 1,000,000 | 50 | 50,000,000 |
| 500,000 | 100 | 50,000,000 |
| 100,000 | 200 | 20,000,000 |
| 50,000 | 200 | 10,000,000 |
| 25,000 | 400 | 10,000,000 |
| 10,000 | 500 | 5,000,000 |
| 5,000 | 1,000 | 5,000,000 |
| 1,000 | 2,000 | 2,000,000 |
| 500 | 2,000 | 1,000,000 |
| **TOTAL** | **6,450** | **153,000,000** |

---

## 🔄 4-Step Cage Workflow

### For Fills, Credits, Table Openers/Closers, Player Buy-ins/Cashouts

```
Step 1: SUBMIT (Floats page or Cage Operations tab)
   ↓ Creates operation with status "Submitted"
   ↓ Appears in Cage "Pending Operations"

Step 2: ADMIT REQUEST (Cage Operations tab)
   ↓ Click "Admit Request" button
   ↓ Status changes to "Admitted"
   ↓ NO chip changes yet

Step 3: ISSUE (Cage Operations tab)
   ↓ Click "Issue to Table" or "Issue to Player"
   ↓ Status changes to "Issued"
   ↓ Cage chips change NOW
   ↓ Fills/Openers: Chips OUT of cage
   ↓ Credits/Closers: Chips INTO cage

Step 4: MARK RECEIVED (Floats page or complete at Cage)
   ↓ Click "Mark Received" (for fills/credits at Floats page)
   ↓ Status changes to "Received" or "Approved"
   ↓ Float status updates
   ↓ Operation moves to "Completed Transactions"
   ↓ Appears in statistics
```

---

## 🎯 Critical Test Scenarios

### Scenario 1: Successful Fill
```
1. Floats page → Select table → Add Float → Fill
2. Cage page → Pending Operations → Admit Request
3. Cage page → Issue to Table (chips leave cage)
4. Floats page → Mark Received (chips arrive at table)
✅ Result: Table float increases, Cage decreases
```

### Scenario 2: Successful Credit
```
1. Floats page → Select table → Add Float → Credit
2. Cage page → Pending Operations → Admit Request
3. Cage page → Issue to Table (ready to receive)
4. Floats page → Mark Received (chips return to cage)
✅ Result: Table float decreases, Cage increases
```

### Scenario 3: Player Buy-In
```
1. Cage page → New Transaction → Player Buy-in
2. Enter amount and player name
3. Submit → Admit → Issue → Received
✅ Result: Cage chips decrease (Money Out)
```

### Scenario 4: Player Cashout
```
1. Cage page → New Transaction → Player Cashout
2. Enter amount and player name
3. Submit → Admit → Issue → Received
✅ Result: Cage chips increase (Money In)
```

### Scenario 5: Complete Rating (Winner)
```
1. Ratings page → Create rating
2. Buy-In: 10,000,000
3. Play for some time
4. Complete Session
5. Cash-Out: 12,000,000
✅ Result: Win/Loss = +2,000,000 (Win)
```

### Scenario 6: Complete Rating (Loser)
```
1. Ratings page → Create rating
2. Buy-In: 10,000,000
3. Play for some time
4. Complete Session
5. Cash-Out: 7,000,000
✅ Result: Win/Loss = -3,000,000 (Loss)
```

---

## ⚠️ Common Pitfalls to Avoid

### 1. Workflow Order
❌ **DON'T**: Try to receive before issuing
✅ **DO**: Follow the 4-step sequence

### 2. Chip Tracking
❌ **DON'T**: Expect chips to move on Submit
✅ **DO**: Chips move ONLY on Issue step

### 3. Statistics
❌ **DON'T**: Expect pending operations in statistics
✅ **DO**: Only "Received" operations count

### 4. Float Status
❌ **DON'T**: Fills show as "Completed" immediately
✅ **DO**: Fills show as "Pending" until received

### 5. Permission Testing
❌ **DON'T**: Test all features as admin only
✅ **DO**: Test with Pit Boss and Inspector users

---

## 🔍 What to Look For

### In Cage Operations
- ✅ Pending operations section populates
- ✅ Buttons enable/disable correctly
- ✅ Chip counts never go negative
- ✅ Statistics only count completed operations
- ✅ Workflow status progresses logically

### In Floats Page
- ✅ Table floats calculate correctly
- ✅ Pending fills/credits show yellow badge
- ✅ "Mark Received" button only shows for "Issued" operations
- ✅ Float status changes from "Pending" to "Active" on receipt
- ✅ Transaction history is accurate

### In Ratings Page
- ✅ Win/Loss calculates automatically
- ✅ Theo Win displays correctly
- ✅ Big Player Alarm triggers for high bets
- ✅ Session duration calculates properly
- ✅ Rebate on Loss applies to losers

### In Reports
- ✅ All data appears accurately
- ✅ Date filters work correctly
- ✅ CSV exports contain complete data
- ✅ Totals and calculations match

### On Dashboard
- ✅ Statistics update in real-time
- ✅ Active counts are accurate
- ✅ Charts display correctly
- ✅ Recent activity shows latest operations

---

## 🐛 If Something Goes Wrong

### Cage Chips Went Negative
**Cause**: Issued more chips than available
**Fix**: Check cage float inventory, adjust if needed

### Fill Not Appearing in Cage
**Cause**: Float not saved properly
**Fix**: Check Floats page, verify fill was created

### Rating Win/Loss Wrong
**Cause**: Buy-in type might be "Chips" instead of "Cash"
**Fix**: For cash buy-ins, use "Cash" type

### User Can't See Tabs
**Cause**: Role permissions
**Fix**: Verify user type (Inspector can ONLY see Ratings)

### Data Disappeared
**Cause**: localStorage cleared or wrong property
**Fix**: Check property selector, verify localStorage in DevTools

### Workflow Button Not Working
**Cause**: Missing prerequisites or wrong status
**Fix**: Check operation status, ensure previous step completed

---

## 💡 Pro Tips

1. **Use Browser DevTools**: Open Console (F12) to see any errors
2. **Test Property Switching**: Switch properties to verify data isolation
3. **Check localStorage**: DevTools → Application → Local Storage
4. **Test Date Filters**: Use various date ranges in reports
5. **Verify Calculations**: Manually calculate some totals to verify
6. **Test Edge Cases**: Try submitting empty forms, negative numbers, etc.
7. **Mobile Test**: Resize browser to test mobile responsiveness
8. **Performance**: Create 50+ records to test with larger datasets
9. **Refresh Often**: Test data persistence with page refreshes
10. **Document Bugs**: Screenshot and note exact steps to reproduce

---

## 📊 Expected Final Results (After Full Test)

### Cage Main Float
- Should have balanced chip inventory
- Total should account for all transactions
- No negative chip counts

### Floats
- 4 tables opened and closed
- 2 fills processed and received
- 1 credit processed and received
- All transactions show correct status

### Players
- 5 players created
- 5 rating sessions completed
- Win/Loss tracked accurately
- Rebates calculated for losers

### Cage Operations
- ~15-20 total operations
- All completed operations in "Completed Transactions"
- Money In/Out statistics accurate
- No pending operations remaining

### Dashboard
- 0 active players
- 0 active tables
- Accurate day totals
- Charts showing activity trends

---

## ✅ Final Verification Checklist

Before marking test complete:

- [ ] All test players created and visible
- [ ] All test tables opened and closed
- [ ] All cage operations completed successfully
- [ ] All ratings completed with correct win/loss
- [ ] All reports generate without errors
- [ ] All CSV exports work
- [ ] Role-based permissions tested
- [ ] Data persists after refresh
- [ ] No console errors
- [ ] Statistics and calculations accurate
- [ ] Dashboard displays correctly
- [ ] All integrations working smoothly

---

**Quick Start**: 
1. Login as admin
2. Initialize Cage Main Float
3. Create 5 players
4. Open 4 tables
5. Start testing workflows!

Good luck with testing! 🎰🎲🎯
