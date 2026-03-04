# 🗑️ Clear All Test Data

## Instructions to Reset System to Fresh State

The MF-Intel CMS stores all data in browser localStorage. To clear all test data and start fresh:

---

## Method 1: Browser Console (Recommended)

1. **Open the application** in your browser (http://localhost:8080)
2. **Press F12** to open Developer Tools
3. **Click on "Console" tab**
4. **Paste this code** and press Enter:

```javascript
// Clear all casino data
localStorage.removeItem('casino_players');
localStorage.removeItem('casino_ratings');
localStorage.removeItem('casino_floats');
localStorage.removeItem('casino_drops');
localStorage.removeItem('casino_rebates');
localStorage.removeItem('casino_correction_reports');
localStorage.removeItem('casino_properties');

// Clear archived data
Object.keys(localStorage).forEach(key => {
  if (key.includes('_archive_')) {
    localStorage.removeItem(key);
  }
});

console.log('✅ All test data cleared! Users remain intact.');
console.log('🔄 Refresh the page to see empty system.');
```

5. **Refresh the page** (F5 or Ctrl+R)

---

## Method 2: Complete System Reset (Including Users)

⚠️ **WARNING:** This will delete ALL data including user accounts!

```javascript
// Nuclear option - clear everything
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('casino_')) {
    localStorage.removeItem(key);
  }
});

console.log('💥 Complete system reset! All data cleared.');
console.log('🔄 Refresh to start with default admin user only.');
```

---

## Method 3: Browser Settings

### Chrome/Edge:
1. Press F12 → Application tab
2. Expand "Local Storage" in left sidebar
3. Click on your domain (http://localhost:8080)
4. Select all items with "casino_" prefix
5. Right-click → Delete

### Firefox:
1. Press F12 → Storage tab
2. Expand "Local Storage"
3. Click on your domain
4. Select and delete "casino_" items

---

## What Gets Cleared

| Data Type | Key | Description |
|-----------|-----|-------------|
| **Players** | `casino_players` | All player records |
| **Ratings** | `casino_ratings` | All gaming sessions |
| **Floats** | `casino_floats` | All float records |
| **Drops** | `casino_drops` | All drop records |
| **Rebates** | `casino_rebates` | All rebate records |
| **Reports** | `casino_correction_reports` | Correction reports |
| **Properties** | `casino_properties` | Property configuration |
| **Archives** | `*_archive_*` | Archived data from shift rolls |
| **Users** | `casino_users` | User accounts (optional) |

---

## What Remains After Clearing

✅ **User accounts** (unless you use Method 2)
- Default admin user will be recreated on next login
- Other default users (manager, pitboss, dealer) will be recreated

✅ **System configuration**
- Application settings
- UI preferences

---

## Verify Data is Cleared

After clearing, verify by:

1. **Players tab** - Should show "No players found"
2. **Ratings tab** - Should show empty list
3. **Float tab** - Should show "No active floats"
4. **Reports** - Should show "No data available" messages

---

## Fresh Start Checklist

After clearing data:

- [ ] Refresh browser page
- [ ] Login with default credentials
- [ ] Verify all tabs show empty state
- [ ] Create your first real player
- [ ] Start first real rating
- [ ] Open first real float

---

## Quick Reference

**Clear data only (keep users):**
```javascript
['casino_players', 'casino_ratings', 'casino_floats', 'casino_drops', 'casino_rebates', 'casino_correction_reports', 'casino_properties'].forEach(k => localStorage.removeItem(k));
location.reload();
```

**Complete reset:**
```javascript
Object.keys(localStorage).filter(k => k.startsWith('casino_')).forEach(k => localStorage.removeItem(k));
location.reload();
```

---

**✅ Your system is now clean and ready for production use!**
