# 🧪 Property Management UI - Testing Guide

## ✅ **Test #1: Access the Property Management Interface**

### Steps:
1. **Open your application** in browser
2. **Login with admin credentials:**
   - Property: `MF-Intel Gaming IQ` (or `MF-Intel-Gaming-IQ`)
   - Username: `admin`
   - Password: `admin123`
3. **Click "Setup"** in the navigation menu
4. **Click "Properties" tab** (has a Building icon)

### What You Should See:
```
┌─────────────────────────────────────────────────────────────┐
│  Property Management                     [+ Add New Property]│
│  Manage multiple casino properties from one system          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────┐                      │
│  │ 🏢 MF-Intel Gaming IQ            │ ✅ Active           │
│  │    MF-Intel-Gaming-IQ            │                      │
│  │                                   │                      │
│  │  Currency:        FCFA           │                      │
│  │  Timezone:        Africa/Douala  │                      │
│  │  Comps:           15% Theo       │                      │
│  │  Printer:         Disabled       │                      │
│  │                                   │                      │
│  │  [Currently Selected]             │                      │
│  │  [Edit] [Deactivate]             │                      │
│  └──────────────────────────────────┘                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘

💡 Multi-Property Benefits
✅ Data Isolation: Each property has completely separate data
✅ One System: Manage all properties from one interface
✅ Instant Updates: Bug fixes apply to all properties automatically
✅ Default Users: Each new property gets admin/owner/pitboss...
✅ Scalable: Add unlimited properties with no infrastructure changes
```

### Expected Results:
- ✅ See Property Management title
- ✅ See "Add New Property" button (blue, top-right)
- ✅ See at least one property card (MF-Intel Gaming IQ)
- ✅ Property card shows:
  - Display name
  - URL-safe name
  - Currency (FCFA)
  - Timezone
  - Comps status
  - Printer status
- ✅ "Currently Selected" label on active property
- ✅ Edit and Deactivate buttons visible
- ✅ Info box at bottom with benefits list

---

## ✅ **Test #2: Open the Add New Property Form**

### Steps:
1. **Click the blue "Add New Property" button** (top-right)

### What You Should See:
```
┌─────────────────────────────────────────────────────────────┐
│  Add New Property                                      [X]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Basic Information                                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Display Name *                                      │    │
│  │ [e.g., MF-Intel Yaounde_________________]          │    │
│  │                                                     │    │
│  │ Timezone                                            │    │
│  │ [Africa/Douala ▼]                                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Thermal Printer                                            │
│  ☐ Enable Epson TM-T20III Printer                         │
│                                                              │
│  Comps System                                               │
│  ☑ Enable Comps System                                     │
│  Theo Percentage (%)  [15_______________]                  │
│  Staff Discount (%)   [50_______________]                  │
│                                                              │
│  Casino Settings                                            │
│  Min Buy-In (FCFA)    [10000____________]                  │
│  Max Buy-In (FCFA)    [10000000_________]                  │
│  VIP Threshold (FCFA) [1000000__________]                  │
│                                                              │
│  Receipt Customization                                      │
│  Receipt Header  [________________________]                │
│  Receipt Footer  [________________________]                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                    [Cancel] [Create Property]│
└─────────────────────────────────────────────────────────────┘
```

### Expected Results:
- ✅ Modal/dialog appears overlaying the screen
- ✅ Title says "Add New Property"
- ✅ All form sections visible:
  - Basic Information
  - Thermal Printer
  - Comps System
  - Casino Settings
  - Receipt Customization
- ✅ Default values pre-filled:
  - Timezone: Africa/Douala
  - Comps Enabled: Checked
  - Theo %: 15
  - Staff Discount: 50%
  - Min Buy-in: 10,000
  - Max Buy-in: 10,000,000
  - VIP Threshold: 1,000,000
- ✅ Cancel and Create Property buttons visible

---

## ✅ **Test #3: Fill Out the Form (Don't Submit Yet)**

### Steps:
1. **In the Display Name field, type:** `Test Casino Yaounde`
2. **Change timezone to:** `Africa/Yaounde` (if available)
3. **Check the "Enable Epson TM-T20III Printer" checkbox**
4. **In Printer IP, type:** `192.168.1.100`
5. **Change Theo Percentage to:** `20`
6. **In Receipt Header, type:** `Welcome to Test Casino!`

### Expected Results:
- ✅ All fields accept input
- ✅ Printer IP field appears when checkbox is checked
- ✅ Number fields only accept numbers
- ✅ No errors or console warnings
- ✅ Create Property button remains enabled

---

## ✅ **Test #4: Close Form Without Saving**

### Steps:
1. **Click the "Cancel" button**

### Expected Results:
- ✅ Modal closes
- ✅ Back to property grid
- ✅ No new property was created
- ✅ Original property still visible

---

## ✅ **Test #5: Create a Test Property**

### Steps:
1. **Click "Add New Property" again**
2. **Fill in Display Name:** `MF-Intel Yaounde Test`
3. **Click "Create Property"**

### What You Should See:
- ⏳ Brief loading state
- ✅ Success alert/notification:
  ```
  ✅ Property "MF-Intel Yaounde Test" created successfully!
  
  Default login:
  Username: admin
  Password: admin123
  ```
- ✅ Modal closes automatically
- ✅ Property grid now shows **2 properties**

### Property Grid Should Now Show:
```
┌──────────────────────┐  ┌──────────────────────┐
│ MF-Intel Gaming IQ   │  │ MF-Intel Yaounde Test│
│ Currently Selected   │  │ [Switch To] [Edit] X │
│ [Edit] [Deactivate]  │  │                      │
└──────────────────────┘  └──────────────────────┘
```

### Expected Results:
- ✅ Two property cards visible
- ✅ New property shows correct name
- ✅ New property has "Switch To" button
- ✅ New property has Edit and Deactivate buttons
- ✅ Original property still marked as "Currently Selected"

---

## ✅ **Test #6: Edit Property Settings**

### Steps:
1. **Click the Edit button (pencil icon)** on the new "MF-Intel Yaounde Test" property
2. **Modal should open with pre-filled values**
3. **Change Theo Percentage to:** `25`
4. **Add Receipt Footer:** `Thank you for your visit!`
5. **Click "Save Changes"**

### Expected Results:
- ✅ Edit modal opens with existing values
- ✅ Display Name field is disabled (can't change)
- ✅ All other fields are editable
- ✅ Changes save successfully
- ✅ Success notification appears
- ✅ Modal closes
- ✅ Property card updates if settings are visible

---

## ✅ **Test #7: Test Property Switching (Visual Only)**

### Steps:
1. **Click "Switch To"** button on "MF-Intel Yaounde Test" property
2. **A confirmation dialog should appear:**
   ```
   Switch to "MF-Intel Yaounde Test"?
   
   You will be redirected to the login page.
   
   [Cancel] [OK]
   ```
3. **Click "Cancel"** for now (we're just testing the UI)

### Expected Results:
- ✅ Confirmation dialog appears
- ✅ Shows property name in dialog
- ✅ Warns about redirect
- ✅ Clicking Cancel closes dialog
- ✅ No property switch occurs
- ✅ Original property still selected

---

## ✅ **Test #8: Test Deactivation**

### Steps:
1. **Click the Deactivate button (trash icon)** on "MF-Intel Yaounde Test"
2. **Confirmation dialog should appear:**
   ```
   Are you sure you want to deactivate "MF-Intel Yaounde Test"?
   
   This will hide it from the property selector but data will be preserved.
   
   [Cancel] [OK]
   ```
3. **Click "OK"**

### Expected Results:
- ✅ Confirmation dialog appears
- ✅ After confirming, property list reloads
- ✅ "MF-Intel Yaounde Test" disappears from grid
- ✅ Only original property visible
- ✅ Success notification appears

---

## ✅ **Test #9: Check Browser Console**

### Steps:
1. **Press F12** to open browser developer tools
2. **Click the "Console" tab**
3. **Look for any errors** (red text)

### Expected Results:
- ✅ No red errors
- ✅ May see blue info logs like:
  - `"Loading properties..."`
  - `"Properties loaded:"`
  - `"Property created successfully"`
- ✅ API calls to `/properties` endpoint succeed (200 status)

---

## ✅ **Test #10: Responsive Design (Optional)**

### Steps:
1. **Resize browser window** to tablet width (~800px)
2. **Resize to mobile width** (~400px)

### Expected Results:
- ✅ Property cards stack vertically on narrow screens
- ✅ Add button stays accessible
- ✅ Modal is scrollable on small screens
- ✅ All text remains readable
- ✅ Buttons don't overflow

---

## 📊 **Test Results Checklist**

After completing all tests, check off:

- [ ] Can access Property Management UI
- [ ] Can open Add New Property form
- [ ] All form fields work correctly
- [ ] Can cancel without saving
- [ ] Can create new property successfully
- [ ] New property appears in grid
- [ ] Can edit property settings
- [ ] Switch confirmation dialog works
- [ ] Can deactivate property
- [ ] No console errors
- [ ] Responsive design works

---

## 🐛 **Common Issues & Solutions**

### Issue: "Cannot read properties of undefined"
**Solution:** Backend not returning proper property structure. Redeploy backend with updated code.

### Issue: "Network Error" when creating property
**Solution:** Check Supabase backend is running. Check browser console for API errors.

### Issue: Properties not loading
**Solution:** 
1. Check browser console for errors
2. Verify you're logged in as Management or Owner
3. Check network tab to see if API call succeeds

### Issue: Modal doesn't close after creating property
**Solution:** Check console for JavaScript errors. May need to refresh page.

### Issue: Property cards look broken
**Solution:** CSS may not be loading. Check for style errors in console.

---

## ✅ **Success Criteria**

Your Property Management UI is working correctly if:

1. ✅ You can see the property grid
2. ✅ You can open the add property form
3. ✅ You can create a new property
4. ✅ The new property appears in the grid
5. ✅ You can edit property settings
6. ✅ Switch and deactivate buttons work
7. ✅ No errors in browser console
8. ✅ UI is responsive and looks good

---

## 🎯 **After Testing**

Once all tests pass:
1. ✅ Deactivate any test properties you created
2. ✅ Keep only your real properties
3. ✅ Ready to add second/third property for production
4. ✅ Document any issues you found

---

## 📞 **Report Results**

After testing, let me know:
- ✅ Which tests passed
- ❌ Which tests failed (if any)
- 💬 Any unexpected behavior
- 🐛 Console errors (copy and paste)
- 💡 Suggestions for improvements

---

**Ready to test! Follow the steps above and report back with results.** 🚀
