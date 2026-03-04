# MF-Intel CMS Full Day Operations Workflow Test Plan

## 🎯 Test Objective
Complete end-to-end testing of a full casino day operation including all modules and workflows.

---

## ✅ Pre-Test Setup

### 1. Login
- **Credentials**: `admin` / `admin123`
- **Property**: Select default property
- **Expected**: Should login successfully as Management user

### 2. Initial Data Check
- Navigate to each tab to verify system is ready
- Check that all modules load without errors

---

## 📋 PHASE 1: Morning Setup (8:00 AM)

### Test 1.1: Initialize Cage Main Float
**Module**: Cage → Main Float

1. Click "Edit Float" button
2. Enter initial inventory for each chip denomination:
   - 1,000,000: 50 chips
   - 500,000: 100 chips
   - 100,000: 200 chips
   - 50,000: 200 chips
   - 25,000: 400 chips
   - 10,000: 500 chips
   - 5,000: 1000 chips
   - 1,000: 2000 chips
   - 500: 2000 chips
3. Click "Save Changes"

**Expected Results**:
- ✅ Total float amount calculated correctly
- ✅ Chip inventory displayed in table
- ✅ Success message appears
- ✅ Data persists on page refresh

### Test 1.2: Create Players
**Module**: Players

Create 5 test players:

**Player 1** (High Roller):
- Name: "John Chen"
- Member ID: "VIP001"
- Contact: "+1-555-0101"
- Status: Active

**Player 2** (Regular):
- Name: "Maria Garcia"  
- Member ID: "REG002"
- Contact: "+1-555-0102"
- Status: Active

**Player 3** (New Player):
- Name: "David Smith"
- Member ID: "NEW003"
- Contact: "+1-555-0103"
- Status: Active

**Player 4** (Comp Eligible):
- Name: "Lisa Wong"
- Member ID: "VIP004"
- Contact: "+1-555-0104"
- Status: Active

**Player 5** (Loser):
- Name: "Robert Johnson"
- Member ID: "REG005"
- Contact: "+1-555-0105"
- Status: Active

**Expected Results**:
- ✅ All players created successfully
- ✅ Players appear in player list
- ✅ Search functionality works
- ✅ Player details can be viewed/edited

### Test 1.3: Open Table Floats
**Module**: Floats

Open 4 tables with different game types:

**Table 1** (Baccarat):
- Table Name: "Baccarat 1"
- Dealer: "Dealer Mike"
- Game Type: "Baccarat"
- Min Bet: 50,000
- Max Bet: 5,000,000
- Amount: 10,000,000
- Type: Open

**Table 2** (BlackJack):
- Table Name: "BlackJack 1"
- Dealer: "Dealer Sarah"
- Game Type: "BlackJack"
- Min Bet: 10,000
- Max Bet: 500,000
- Amount: 5,000,000
- Type: Open

**Table 3** (Roulette):
- Table Name: "Roulette 1"
- Dealer: "Dealer Tom"
- Game Type: "Roulette"
- Min Bet: 5,000
- Max Bet: 1,000,000
- Amount: 8,000,000
- Type: Open

**Table 4** (Poker):
- Table Name: "Poker 1"
- Dealer: "Dealer Alex"
- Game Type: "Poker"
- Min Bet: 25,000
- Max Bet: 2,000,000
- Amount: 6,000,000
- Type: Open

**Expected Results**:
- ✅ All table openers created with status "Active"
- ✅ Each table shows correct float amount
- ✅ Dashboard shows 4 active tables
- ✅ Float totals update correctly

---

## 📋 PHASE 2: Player Activity (10:00 AM - 2:00 PM)

### Test 2.1: Player Buy-Ins at Cage
**Module**: Cage → Operations Tab

Process 3 player buy-ins:

**Buy-In 1** (John Chen):
1. Click "New Transaction"
2. Type: "Player Buy-in"
3. Amount: 50,000,000
4. Player Name: "John Chen"
5. Submit → Admit → Issue → Mark as Received

**Buy-In 2** (Maria Garcia):
1. Type: "Player Buy-in"
2. Amount: 10,000,000
3. Player Name: "Maria Garcia"
4. Submit → Admit → Issue → Mark as Received

**Buy-In 3** (David Smith):
1. Type: "Player Buy-in"
2. Amount: 5,000,000
3. Player Name: "David Smith"
4. Submit → Admit → Issue → Mark as Received

**Expected Results**:
- ✅ All transactions flow through 4-step workflow
- ✅ Cage float chips decrease correctly
- ✅ "Money Out" statistics update
- ✅ Receipt can be generated for each

### Test 2.2: Create Rating Cards
**Module**: Ratings

Create active rating sessions for all 5 players:

**Rating 1** (John Chen - Baccarat 1):
- Player: "John Chen"
- Table: "Baccarat 1"
- Buy-In Type: "Cash"
- Buy-In Amount: 50,000,000
- Average Bet: 2,000,000
- Start Time: Current time

**Rating 2** (Maria Garcia - BlackJack 1):
- Player: "Maria Garcia"
- Table: "BlackJack 1"
- Buy-In Type: "Cash"
- Buy-In Amount: 10,000,000
- Average Bet: 250,000
- Start Time: Current time

**Rating 3** (David Smith - Roulette 1):
- Player: "David Smith"
- Table: "Roulette 1"
- Buy-In Type: "Chips"
- Buy-In Amount: 5,000,000
- Average Bet: 100,000
- Start Time: Current time

**Rating 4** (Lisa Wong - Baccarat 1):
- Player: "Lisa Wong"
- Table: "Baccarat 1"
- Buy-In Type: "Cash"
- Buy-In Amount: 20,000,000
- Average Bet: 1,000,000
- Start Time: Current time

**Rating 5** (Robert Johnson - Poker 1):
- Player: "Robert Johnson"
- Table: "Poker 1"
- Buy-In Type: "Cash"
- Buy-In Amount: 8,000,000
- Average Bet: 500,000
- Start Time: Current time

**Expected Results**:
- ✅ All ratings show status "Active"
- ✅ Dashboard shows 5 active players
- ✅ Player names appear in Big Player Alarm if bets are high enough
- ✅ Theo Win calculated automatically

### Test 2.3: Table Fill Requests
**Module**: Floats

Request fills for 2 tables:

**Fill 1** (Baccarat 1):
1. Click "Add Float" for Baccarat 1
2. Type: "Fill"
3. Amount: 15,000,000
4. Dealer: "Dealer Mike"
5. Submit

**Fill 2** (Poker 1):
1. Type: "Fill"
2. Amount: 10,000,000
3. Dealer: "Dealer Alex"
4. Submit

**Expected Results**:
- ✅ Fill transactions show status "Pending" in Floats page
- ✅ Pending operations appear in Cage Operations tab
- ✅ Money Out statistics DO NOT update yet

### Test 2.4: Process Fill Requests at Cage
**Module**: Cage → Operations Tab

Process both fills through workflow:

**For Each Fill**:
1. Click "Admit Request" (Status: Submitted → Admitted)
2. Click "Issue to Table" (Status: Admitted → Issued, Cage chips decrease)
3. *Switch to Floats page*
4. Click "Mark Received" (Status: Issued → Received, Float status changes to Active)

**Expected Results**:
- ✅ 4-step workflow completes smoothly
- ✅ Cage Main Float chips decrease by correct amounts
- ✅ Table float amounts increase correctly
- ✅ Fill transactions show as "Active" in Floats page
- ✅ "Money Out" statistics now include fills
- ✅ Operation moves from Pending to Completed Transactions

### Test 2.5: Record Drop Entries
**Module**: Drop

Record drops from multiple tables:

**Drop 1**:
- Table: "Baccarat 1"
- Amount: 25,000,000
- Player: "John Chen"
- Notes: "High roller session - heavy play"

**Drop 2**:
- Table: "BlackJack 1"
- Amount: 5,000,000
- Player: "Maria Garcia"
- Notes: "Steady play"

**Drop 3**:
- Table: "Baccarat 1"
- Amount: 10,000,000
- Player: "Lisa Wong"
- Notes: "VIP session"

**Drop 4**:
- Table: "Roulette 1"
- Amount: 2,000,000
- Player: "David Smith"
- Notes: "Multiple small bets"

**Expected Results**:
- ✅ All drop entries saved successfully
- ✅ Drop totals calculate correctly per table
- ✅ Dashboard shows updated drop statistics
- ✅ Filter by table works correctly

---

## 📋 PHASE 3: Mid-Day Operations (2:00 PM - 6:00 PM)

### Test 3.1: Table Credit Request
**Module**: Floats

**Credit 1** (Roulette 1 - Overfill):
1. Type: "Credit"
2. Table: "Roulette 1"
3. Amount: 3,000,000
4. Dealer: "Dealer Tom"
5. Reason: "Table has excess chips"
6. Submit

**Expected Results**:
- ✅ Credit shows as "Pending" in Floats page
- ✅ Appears in Cage Pending Operations

### Test 3.2: Process Credit at Cage
**Module**: Cage → Operations Tab

1. Click "Admit Request" for the credit
2. Click "Issue to Table" (prepare to receive chips)
3. *Switch to Floats page*
4. Click "Mark Received" (chips returned to cage)

**Expected Results**:
- ✅ Workflow completes properly
- ✅ Cage Main Float chips increase by 3,000,000
- ✅ Roulette 1 float decreases by 3,000,000
- ✅ "Money In" statistics update
- ✅ Credit appears in Completed Transactions

### Test 3.3: Player Cashout at Cage
**Module**: Cage → Operations Tab

**Cashout 1** (Maria Garcia leaves):
1. New Transaction
2. Type: "Player Cashout"
3. Amount: 12,000,000
4. Player Name: "Maria Garcia"
5. Complete workflow: Submit → Admit → Issue → Received

**Expected Results**:
- ✅ Workflow completes
- ✅ Cage chips increase by 12,000,000
- ✅ "Money In" statistics update
- ✅ Receipt generated

### Test 3.4: Complete Rating Session (Winner)
**Module**: Ratings

**Complete Rating for Maria Garcia**:
1. Find Maria Garcia's active rating
2. Click "Complete Session"
3. Cash Out Amount: 12,000,000
4. End Time: Current time
5. Submit

**Expected Results**:
- ✅ Win/Loss calculated automatically: +2,000,000 (Win)
- ✅ Status changes to "Completed"
- ✅ Session duration calculated
- ✅ Theo Win vs Actual Win displayed
- ✅ Dashboard statistics update

---

## 📋 PHASE 4: Evening Operations (6:00 PM - 10:00 PM)

### Test 4.1: Additional Player Activities

**Complete Rating for Robert Johnson (Loser)**:
1. Cash Out Amount: 3,000,000
2. Complete session
3. Win/Loss: -5,000,000 (Loss)

**Complete Rating for David Smith (Small Winner)**:
1. Cash Out Amount: 6,000,000
2. Complete session
3. Win/Loss: +1,000,000 (Win)

**Complete Rating for Lisa Wong (Big Loser)**:
1. Cash Out Amount: 5,000,000
2. Complete session
3. Win/Loss: -15,000,000 (Loss)

**Complete Rating for John Chen (Big Winner)**:
1. Cash Out Amount: 80,000,000
2. Complete session
3. Win/Loss: +30,000,000 (Win)

**Expected Results**:
- ✅ All win/loss calculations correct
- ✅ Total house win/loss calculated
- ✅ Rebate calculations trigger for losses
- ✅ Big Player Alarm shows high-value players

### Test 4.2: Additional Cage Transactions

**Table Opener** (Open new table):
1. Type: "Table Opener"
2. Amount: 5,000,000
3. Table Name: "BlackJack 2"
4. Complete workflow

**Table Closer** (Close BlackJack 2):
1. Type: "Table Closer"
2. Amount: 6,500,000
3. Table Name: "BlackJack 2"
4. Complete workflow

**Expected Results**:
- ✅ Opener decreases cage chips
- ✅ Closer increases cage chips
- ✅ Net table profit: +1,500,000
- ✅ Statistics reflect both transactions

---

## 📋 PHASE 5: End of Day (10:00 PM - Midnight)

### Test 5.1: Close All Table Floats
**Module**: Floats

Close all 4 original tables:

**For Each Table**:
1. Type: "Close"
2. Enter closing amount (may differ from opening + fills - credits)
3. Record dealer name
4. Submit

**Expected Results**:
- ✅ All tables show status "Completed"
- ✅ Dashboard shows 0 active tables
- ✅ Variance calculated (if amounts differ from expected)

### Test 5.2: Verify Cage Final Inventory
**Module**: Cage → Main Float

1. Review final chip inventory
2. Verify total matches expected:
   - Starting Float
   - Minus: Player Buy-ins, Fills, Table Openers
   - Plus: Player Cashouts, Credits, Table Closers

**Expected Results**:
- ✅ Chip counts are accurate
- ✅ Total float value makes sense
- ✅ No negative chip counts

### Test 5.3: Generate Reports
**Module**: Reports

**Generate and Verify Each Report**:

1. **New Players Report**:
   - Date Range: Today
   - Should show David Smith (NEW003)

2. **Player Activity Report**:
   - Date Range: Today
   - Should show all 5 players
   - Win/Loss amounts correct
   - Export CSV works

3. **Float Summary Report**:
   - Date Range: Today
   - Shows all float transactions
   - Opening/Closing balances
   - Fills and Credits listed
   - Export CSV works

4. **Drop Report**:
   - Date Range: Today
   - Shows all 4 drop entries
   - Total drop amount calculated
   - Per-table breakdown
   - Export CSV works

**Expected Results**:
- ✅ All reports generate without errors
- ✅ Data is accurate and complete
- ✅ CSV exports work correctly
- ✅ Date filters work properly

### Test 5.4: Verify Dashboard Statistics
**Module**: Dashboard

**Check Final Statistics**:
- Total Active Players: 0 (all completed)
- Total Active Tables: 0 (all closed)
- Active Floats: Should show only opening amounts
- Total Drop: Sum of all drop entries
- Today's Performance: House win/loss for the day
- Recent Activity: Shows latest transactions

**Expected Results**:
- ✅ All metrics are accurate
- ✅ Charts display correctly
- ✅ Trends show daily activity
- ✅ No console errors

---

## 📋 PHASE 6: Special Workflows & Edge Cases

### Test 6.1: Rebate on Loss Feature
**Module**: Reports → Player Activity

1. Find players with losses
2. Check if 14-day expiry tracking works
3. Verify rebate calculation (if configured)

**Expected Results**:
- ✅ Loss amounts tracked correctly
- ✅ Rebate eligibility calculated
- ✅ Expiry dates set to 14 days from session

### Test 6.2: User Management
**Module**: Setup → User Management

**Create Test Users**:

**Pit Boss User**:
- Username: "pitboss1"
- Password: "test123"
- User Type: "Pit Boss"

**Inspector User**:
- Username: "inspector1"
- Password: "test123"
- User Type: "Inspector"

**Test Access**:
1. Logout as admin
2. Login as pitboss1
   - Verify: Can access Floats, Ratings
   - Verify: Cannot access Setup, Cage
3. Login as inspector1
   - Verify: Can ONLY access Ratings tab
   - Verify: Cannot see other tabs

**Expected Results**:
- ✅ User creation works
- ✅ Role-based permissions enforced
- ✅ Pit Boss has correct access
- ✅ Inspector limited to Ratings only

### Test 6.3: Edit and Delete Operations

**Test Editing**:
1. Edit a player's contact information
2. Edit a table float amount
3. Update a rating's average bet

**Test Deletion**:
1. Try to delete a completed rating (should have confirmation)
2. Delete a drop entry
3. Delete a test user

**Expected Results**:
- ✅ Edits save correctly
- ✅ Deletions work with confirmation
- ✅ Data integrity maintained
- ✅ No orphaned records

### Test 6.4: Filter and Search Functions

**Test Each Module**:
1. **Players**: Search by name, member ID, filter by status
2. **Ratings**: Filter by status, table, player
3. **Floats**: Filter by type, status, table, date range
4. **Drop**: Filter by table, date range
5. **Cage Operations**: Filter by type, status, date

**Expected Results**:
- ✅ All filters work correctly
- ✅ Search returns accurate results
- ✅ Date range filters work
- ✅ Can clear filters

### Test 6.5: Data Persistence

1. Complete several transactions
2. Refresh the page (F5)
3. Close browser and reopen
4. Check all data is still present

**Expected Results**:
- ✅ All data persists in localStorage
- ✅ No data loss on refresh
- ✅ Relationships maintained
- ✅ Statistics recalculate correctly

---

## 🎯 Critical Integration Points to Verify

### Integration 1: Floats ↔ Cage
- ✅ Fill from Floats creates Cage operation
- ✅ Credit from Floats creates Cage operation
- ✅ Cage workflow completion updates Float status
- ✅ Chips transfer correctly between systems

### Integration 2: Players ↔ Ratings
- ✅ Player list available in rating dropdown
- ✅ Player statistics update from ratings
- ✅ Big Player Alarm triggers correctly

### Integration 3: Ratings ↔ Drop
- ✅ Drop entries associated with correct tables
- ✅ Drop amounts correlate with player activity
- ✅ Reports show integrated data

### Integration 4: All Modules ↔ Dashboard
- ✅ Dashboard shows real-time statistics
- ✅ Charts update with new data
- ✅ Recent activity feed accurate
- ✅ Performance metrics correct

---

## 📊 Success Criteria

### Functional Requirements
- [ ] All CRUD operations work in every module
- [ ] All workflows complete without errors
- [ ] Data calculations are accurate
- [ ] All filters and searches function correctly
- [ ] Reports generate with accurate data
- [ ] CSV exports work properly

### Data Integrity
- [ ] No negative chip counts in Cage
- [ ] Float balances are accurate
- [ ] Win/loss calculations correct
- [ ] All relationships maintained
- [ ] No orphaned records
- [ ] Data persists correctly

### User Experience
- [ ] All forms validate correctly
- [ ] Error messages are clear
- [ ] Success confirmations appear
- [ ] Loading states work properly
- [ ] Mobile responsive (if applicable)
- [ ] No console errors

### Security & Permissions
- [ ] Role-based access enforced
- [ ] Pit Boss has correct permissions
- [ ] Inspector limited to Ratings only
- [ ] Management has full access
- [ ] Login required for all operations

---

## 🐛 Bug Tracking Template

Use this format to report any issues found:

```
**Bug ID**: BUG-001
**Module**: [Module Name]
**Severity**: [Critical / High / Medium / Low]
**Description**: [What went wrong]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]
**Expected Result**: [What should happen]
**Actual Result**: [What actually happened]
**Screenshot**: [If applicable]
```

---

## ✅ Test Completion Checklist

- [ ] Phase 1: Morning Setup - All tests passed
- [ ] Phase 2: Player Activity - All tests passed
- [ ] Phase 3: Mid-Day Operations - All tests passed
- [ ] Phase 4: Evening Operations - All tests passed
- [ ] Phase 5: End of Day - All tests passed
- [ ] Phase 6: Special Workflows - All tests passed
- [ ] All Critical Integrations - Verified
- [ ] All Success Criteria - Met
- [ ] Zero Critical Bugs - Confirmed
- [ ] Production Ready - Approved

---

## 📝 Notes
- Test in development mode (localStorage)
- Use browser DevTools to monitor console for errors
- Clear localStorage between major test runs if needed
- Document any unexpected behavior
- Take screenshots of successful workflows
- Record actual vs expected results

---

**Test Plan Version**: 1.0  
**Last Updated**: March 1, 2026  
**Tester**: [Your Name]  
**Test Environment**: Development (localStorage)  
**Browser**: [Chrome/Firefox/Safari]
