# ACR122U Keyboard Emulation Setup - DETAILED GUIDE

## Where to Find the Keyboard Emulation Setting

### Option 1: Using ACR122U Configuration Tool (Recommended)

**Download Location:**
- Official Site: https://www.acs.com.hk/en/driver/302/acr122u-usb-nfc-reader/
- Look for: "ACR122U Application Programming Interface" or "Tools"

**After Installing and Opening the Tool:**

1. **Main Window - Look for These Tabs:**
   ```
   [Reader Settings] [PICC] [SAM] [Buzzer] [LED] [About]
   ```
   OR
   ```
   [Configuration] [Settings] [Advanced]
   ```

2. **Where Keyboard Mode Usually Is:**

   **Location A: "PICC Settings" or "Card Settings" Tab**
   - Look for checkbox: ☐ Enable Keyboard Emulation
   - Or dropdown: Mode: [Standard] [Keyboard] [Auto]
   
   **Location B: "Advanced Settings" Tab**
   - Section: "Output Mode"
   - Radio buttons:
     • Standard Mode
     • Keyboard Emulation Mode ← SELECT THIS
     
   **Location C: "Configuration" Tab**
   - Look for: "Operation Mode"
   - Options: 
     - Normal Mode
     - HID Keyboard Mode ← SELECT THIS
     - Auto Mode

3. **What to Configure:**
   ```
   ✅ Enable Keyboard Emulation
   ✅ Output Format: Hexadecimal
   ✅ Suffix: [CR] or [Enter Key]
   ✅ Prefix: (leave empty)
   ```

4. **Apply Settings:**
   - Click "Update" or "Write to Device" or "Apply"
   - Wait for confirmation message
   - Unplug and replug the ACR122U

---

## Option 2: Using ACS Unified Driver (Alternative)

If the configuration tool doesn't have keyboard mode, you might need:

**Download:** "ACR122U HID Keyboard Driver"
- Search for: "ACR122U HID driver" on ACS website
- This changes the device driver to keyboard mode

**After Installing HID Driver:**
- Windows will detect ACR122U as "HID Keyboard Device"
- It will automatically type card UIDs when scanned
- No configuration needed!

---

## Option 3: Check Windows Device Manager

**See Current Mode:**

1. Open Device Manager (Win + X → Device Manager)
2. Look under:
   - **"Smart card readers"** ← Standard mode (not typing)
   - **"Keyboards"** or **"Human Interface Devices"** ← Keyboard mode (will type!)

**If you see ACR122U under "Smart card readers":**
- It's in standard mode (won't type)
- You need to enable keyboard mode using tool above

**If you see it under "Keyboards" or "HID":**
- It's already in keyboard mode!
- Should type automatically when scanning

---

## 🔍 QUICK TEST - Which Tool Do You Have?

**Take a screenshot and send me:**

1. Open the ACR122U software you downloaded
2. Show me the main window with all tabs/buttons visible
3. I'll tell you EXACTLY where to click!

**OR**

**Tell me the name of the tool:**
- What's the exact name of the .exe file you're running?
- What does the window title say?

---

## 📦 Don't Have Any Tool Yet?

**Here's what to download:**

1. Go to: https://www.acs.com.hk/en/driver/302/acr122u-usb-nfc-reader/
2. Download: **"ACR122U Application Programming Interface V2.04"** (or latest version)
3. Extract the ZIP file
4. Look inside for:
   - `ACR122Tool.exe`
   - `ACR122Config.exe`
   - Or any .exe file with "config" or "tool" in the name
5. Run it as Administrator (right-click → Run as administrator)

---

## 🎯 Still Can't Find It?

Send me:
- Screenshot of the ACR122U software window
- Or tell me what files are in the downloaded folder
- I'll give you EXACT click-by-click instructions!
