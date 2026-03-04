# 🔧 How to Enable ACR122U Keyboard Emulation Mode

## What You Downloaded

The ACS drivers you downloaded **don't include keyboard emulation mode** by default. The ACR122U needs additional software to act like a keyboard.

---

## ✅ EASIEST METHOD: Use Python Script (5 minutes)

This is the **simplest and most reliable** method.

### Step 1: Install Python (if not already installed)

Download from: https://www.python.org/downloads/

**Windows**: Make sure to check ✅ "Add Python to PATH" during installation

### Step 2: Install Required Package

Open Command Prompt (Windows) or Terminal (Mac/Linux):

```bash
pip install pyscard
```

On Mac/Linux, you may also need:
```bash
pip install pyusb
```

### Step 3: Create the Keyboard Emulation Script

Save this as `acr122u_keyboard.py`:

```python
#!/usr/bin/env python3
"""
ACR122U Keyboard Emulation Script
Reads NFC card UIDs and types them like a keyboard
"""

from smartcard.System import readers
from smartcard.util import toHexString
import time
import sys

# For Windows
try:
    import pyautogui
except ImportError:
    print("Installing pyautogui...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyautogui"])
    import pyautogui

# APDU command to get UID
GET_UID = [0xFF, 0xCA, 0x00, 0x00, 0x00]

def wait_for_card(connection):
    """Wait for a card to be present"""
    try:
        # Try to get UID
        data, sw1, sw2 = connection.transmit(GET_UID)
        if sw1 == 0x90 and sw2 == 0x00:
            return data
    except:
        pass
    return None

def main():
    print("=" * 50)
    print("ACR122U Keyboard Emulation Mode")
    print("=" * 50)
    
    # Get available readers
    available_readers = readers()
    if not available_readers:
        print("❌ No card readers found!")
        print("   Make sure ACR122U is plugged in via USB")
        input("Press Enter to exit...")
        return
    
    print(f"✅ Found {len(available_readers)} reader(s):")
    for idx, reader in enumerate(available_readers):
        print(f"   [{idx}] {reader}")
    
    # Use first reader
    reader = available_readers[0]
    print(f"\n📡 Using: {reader}")
    
    # Connect to reader
    try:
        connection = reader.createConnection()
        connection.connect()
        print("✅ Connected to reader")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        input("Press Enter to exit...")
        return
    
    print("\n" + "=" * 50)
    print("🎯 READY! Scan your NFC cards now...")
    print("   The UID will be typed automatically")
    print("   Press Ctrl+C to stop")
    print("=" * 50 + "\n")
    
    last_uid = None
    no_card_count = 0
    
    try:
        while True:
            uid_data = wait_for_card(connection)
            
            if uid_data:
                # Convert to hex string
                uid_hex = toHexString(uid_data).replace(" ", "")
                
                # Only type if it's a new card (avoid duplicates)
                if uid_hex != last_uid:
                    print(f"✅ Card detected: {uid_hex}")
                    
                    # Type the UID like a keyboard
                    pyautogui.typewrite(uid_hex, interval=0.05)
                    
                    # Optionally press Enter (uncomment if needed)
                    # pyautogui.press('enter')
                    
                    last_uid = uid_hex
                    no_card_count = 0
            else:
                no_card_count += 1
                if no_card_count > 5 and last_uid is not None:
                    # Card removed
                    last_uid = None
            
            time.sleep(0.3)  # Poll every 300ms
            
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping...")
        connection.disconnect()
        print("✅ Disconnected. Goodbye!")

if __name__ == "__main__":
    main()
```

### Step 4: Run the Script

```bash
python acr122u_keyboard.py
```

**Keep this window open** while using the Casino app!

### Step 5: Test It

1. Open the Casino app (or Notepad to test)
2. Click in the "Card Number" field
3. Scan an NFC card on the ACR122U
4. The card UID should **automatically appear** typed in the field!

---

## 🔧 ALTERNATIVE METHOD: Use NFC Tools Software

If you don't want to use Python, try these tools:

### Option A: NFCGate (Windows/Mac/Linux)
1. Download from: https://github.com/nfcgate/nfcgate
2. Configure to output UIDs as keyboard input
3. Run alongside your Casino app

### Option B: LibNFC Tools (Advanced)
1. Download from: http://nfc-tools.org/
2. Use `nfc-poll` to detect cards
3. Pipe output to keyboard emulator

### Option C: AutoHotkey Script (Windows Only)

Save as `acr122u_keyboard.ahk`:

```ahk
; ACR122U Keyboard Emulation
; Requires: ACR122U software + AutoHotkey
; This is a template - needs customization

Loop {
    ; Check for card scan (customize based on your ACR122U software)
    ; When card detected, send the UID as keyboard input
    ; Send, %CardUID%
    Sleep, 300
}
```

---

## 🧪 Testing Your Setup

### Test 1: Notepad Test
1. Open Notepad
2. Run your keyboard emulation script/software
3. Scan a card
4. **Expected**: Card UID appears in Notepad

✅ **If text appears** → Keyboard mode is working!  
❌ **If nothing appears** → Reader is not configured yet

### Test 2: Casino App Test
1. Open Casino app in browser
2. Click "Players" tab
3. Click "Add Player"
4. **Don't click** in the Card Number field
5. Scan a card on the ACR122U
6. **Expected**: Green notification + Card Number auto-filled

---

## ⚙️ Configuration Tips

### Make it Auto-Start (Optional)

**Windows**: Add the Python script to Task Scheduler  
**Mac**: Add to Login Items in System Preferences  
**Linux**: Add to startup applications

### Customize Output Format

In the Python script, you can modify line:
```python
pyautogui.typewrite(uid_hex, interval=0.05)
```

To add prefix/suffix:
```python
pyautogui.typewrite(f"CARD-{uid_hex}", interval=0.05)
```

To press Enter after typing:
```python
pyautogui.typewrite(uid_hex, interval=0.05)
pyautogui.press('enter')
```

---

## 🚨 Common Issues

### Issue: "No card readers found"
**Solution**: 
- Unplug and replug the ACR122U
- Install drivers from ACS website
- Try a different USB port

### Issue: "Module 'smartcard' not found"
**Solution**:
```bash
pip install pyscard
```

### Issue: "Module 'pyautogui' not found"
**Solution**:
```bash
pip install pyautogui
```

### Issue: Cards detected but nothing types
**Solution**:
- Make sure a text field is focused
- Check if pyautogui is blocked by security software
- Try uncommenting the `press('enter')` line

### Issue: Same card types multiple times
**Solution**: 
- The script already handles this with `last_uid` tracking
- Increase the `sleep()` duration in the script

---

## 📖 What Files Did You Download?

If you downloaded from ACS website, you likely got:

- **ACR122U_Driver_Installer.exe** - USB drivers (needed)
- **ACR122U_API_V2.04.zip** - Programming API (developer docs)
- **ACR122U_SDK.zip** - Software development kit (optional)

⚠️ **None of these include keyboard emulation!** You need the Python script above or alternative software.

---

## ✅ Summary

**Easiest Solution**:
1. Install Python: `python.org`
2. Install package: `pip install pyscard pyautogui`
3. Run the script: `python acr122u_keyboard.py`
4. Leave it running in the background
5. Scan cards in your Casino app - they'll auto-fill!

**The Casino app is already ready** - it has built-in keyboard detection. You just need to make the ACR122U type like a keyboard! 🎰✨

---

## 💡 Pro Tip

Once you have the Python script running, you can:
- Minimize the window (keep it running)
- Use the Casino app normally
- Cards will auto-fill whenever you scan them
- Works in Figma Make AND production deployment!

No USB permissions, no browser popups, no Web USB issues. Just scan and go! 🚀
