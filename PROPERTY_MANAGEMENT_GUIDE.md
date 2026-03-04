# 🏢 Property Management UI - User Guide

## ✅ **What's Been Built**

You now have a complete **Property Management UI** that allows you to:
- View all casino properties in a visual grid
- Add new properties with full configuration
- Edit existing property settings
- Deactivate properties (soft delete)
- Switch between properties instantly
- See property status at a glance

---

## 📍 **How to Access**

1. **Login** as Management user (admin/admin123)
2. Click **"Setup"** in the main navigation
3. Click **"Properties"** tab
4. You'll see the Property Management interface!

---

## 🎯 **Key Features**

### 1. Property Grid View
- Each property shown as a card with key info
- Visual status indicators (Active/Inactive)
- Current property highlighted with blue border
- Quick-switch buttons on each card

### 2. Add New Property
Click the **"Add New Property"** button to open the wizard:

**Basic Information:**
- Display Name (e.g., "MF-Intel Yaounde")
- Timezone selection

**Thermal Printer Settings:**
- Enable/disable Epson TM-T20III
- Set printer IP address

**Comps System:**
- Enable/disable comps
- Set Theo percentage (default: 15%)
- Set staff discount (default: 50%)

**Casino Settings:**
- Min/Max buy-in amounts
- VIP threshold

**Receipt Customization:**
- Custom header text
- Custom footer text

### 3. Edit Property
Click the **edit icon** (pencil) on any property card to modify settings.

### 4. Deactivate Property
Click the **delete icon** (trash) on any non-default property to deactivate it.
- Data is preserved
- Property hidden from selector
- Can be reactivated later

### 5. Switch Property
Click **"Switch To"** button on any property card to change active property.
- Confirms before switching
- Redirects to login (security)
- All modules now use new property

---

## 🚀 **Adding Your Second Property**

### Step-by-Step:

1. **Navigate to Property Management**
   - Login → Setup → Properties tab

2. **Click "Add New Property"**

3. **Fill in the form:**
   ```
   Display Name: MF-Intel Yaounde
   Timezone: Africa/Douala
   
   [Configure printer if needed]
   [Configure comps settings]
   [Set buy-in limits]
   [Add custom receipt text]
   ```

4. **Click "Create Property"**

5. **System automatically creates:**
   - Default users (admin, owner, pitboss, inspector, host)
   - Empty data tables (players, ratings, floats, etc.)
   - Property configuration
   - Isolated database namespace

6. **Success!** You'll see a confirmation with login credentials:
   ```
   Username: admin
   Password: admin123
   ```

7. **Switch to new property:**
   - Click "Switch To" on the new property card
   - Confirm the switch
   - Login with admin/admin123
   - Start using the new property!

---

## 💡 **Important Notes**

### Data Isolation
- Each property has **completely separate data**
- Players, ratings, floats, cage operations, etc. are all isolated
- Switching properties = switching to a different "casino"

### User Management
- Users are property-specific
- Same username can exist in multiple properties
- Passwords are property-specific

### Default Users (created automatically)
Every new property gets:
- `admin` / `admin123` (Management)
- `owner` / `owner123` (Owner)
- `pitboss` / `pit123` (Pit Boss)
- `inspector` / `inspect123` (Inspector)
- `host` / `host123` (Host)

### Settings Inheritance
New properties use sensible defaults:
- Currency: FCFA
- Comps Theo: 15%
- Staff Discount: 50%
- Min Buy-in: 10,000 FCFA
- Max Buy-in: 10,000,000 FCFA
- VIP Threshold: 1,000,000 FCFA

---

## 🔧 **Troubleshooting**

### "Property not showing in list"
- Check if it's deactivated
- Refresh the page
- Check browser console for errors

### "Can't switch properties"
- Only Management and Owner can switch
- Must confirm the switch dialog
- Page will reload after switch

### "Settings not saving"
- Check all required fields are filled
- Check console for errors
- Try refreshing and editing again

---

## 📊 **Property Management Best Practices**

### Naming Convention
Use clear, descriptive names:
- ✅ "MF-Intel Yaounde"
- ✅ "MF-Intel Douala"
- ❌ "Test"
- ❌ "Property 2"

### Timezone
Set correct timezone for each location:
- Yaounde: Africa/Yaounde
- Douala: Africa/Douala
- Lagos: Africa/Lagos

### Printer Setup
Only enable printer if physical printer exists:
- Get IP from network admin
- Test with thermal printer before enabling
- Configure receipt header/footer for branding

### VIP Thresholds
Adjust based on local market:
- High-roller markets: Higher threshold
- Casual markets: Lower threshold
- Review and adjust based on data

---

## 🎉 **Quick Start Example**

**Scenario:** You want to add a second casino in Yaounde

1. **Setup → Properties → "Add New Property"**

2. **Fill form:**
   - Display Name: `MF-Intel Yaounde`
   - Timezone: `Africa/Yaounde`
   - Leave other settings at defaults

3. **Click "Create Property"**

4. **Note the login credentials**

5. **Click "Switch To" on the new property card**

6. **Confirm and login with admin/admin123**

7. **Start adding:**
   - Employees (Setup → Employees)
   - Players (Players tab)
   - Set up floats (Floats tab)
   - Configure comps menu (Setup → Comps Menu)

8. **Done!** Your second property is ready!

---

## 📈 **Scaling to Multiple Properties**

The system handles:
- ✅ **2-3 properties**: Perfect, smooth performance
- ✅ **4-10 properties**: No problem, designed for this
- ✅ **10+ properties**: Still works, consider organizing by region

All properties share:
- Same codebase (instant updates!)
- Same backend (one deployment)
- Same user interface (consistent experience)

Each property has:
- Separate data
- Separate users
- Separate settings

---

## 🎯 **Next Steps**

After setting up properties:

1. **Train staff** on property switching
2. **Set up employees** for each property
3. **Configure comps menus** per location
4. **Customize receipt text** for branding
5. **Test printer integration** if enabled
6. **Add players** and start operations!

---

**🎉 You're ready to manage unlimited casino properties from one system!**
