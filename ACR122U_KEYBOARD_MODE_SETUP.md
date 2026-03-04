# ACR122U - Keyboard Emulation Mode Setup

## 🚨 IMPORTANT: Web USB doesn't work in Figma Make

The Casino app runs inside Figma Make's iframe, which **blocks Web USB access** for security reasons. This is a browser restriction that cannot be bypassed.

## ✅ Solution: Configure ACR122U in Keyboard Emulation Mode

Instead of using Web USB, configure your ACR122U to act like a keyboard. When you scan a card, it will type the UID automatically.

---

## Setup Instructions

### Step 1: Download ACR122U Configuration Software

1. Go to: https://www.acs.com.hk/en/driver/302/acr122u-usb-nfc-reader/
2. Download **"ACR122U Application Programming Interface V2.04"** or similar
3. Or download **"ACR122U SDK"** which includes configuration tools

### Step 2: Install Drivers (if needed)

- **Windows**: Drivers usually install automatically when you plug in the device
- **Mac**: May require manual driver installation from ACS website
- **Linux**: Works with libusb or pcscd

### Step 3: Configure Keyboard Emulation

You need software that configures the ACR122U to output UIDs as keyboard input. Options:

#### Option A: ACR122U Configuration Tool (Recommended)
1. Open the ACS configuration software
2. Look for "Keyboard Emulation" or "HID Mode" settings
3. Enable keyboard emulation
4. Set output format to "UID only" (no prefix/suffix if possible)
5. Save configuration to the device

#### Option B: Third-Party Software
Some options:
- **NFC Tools** (Windows/Mac)
- **TagWriter** (Windows/Mac)
- **ACR122U-HID** scripts (GitHub)

#### Option C: Custom Script (Advanced)
You can write a simple script using `pyscard` or `nfc-tools` that:
1. Detects when a card is scanned
2. Reads the UID
3. Types it using keyboard simulation libraries

---

## How It Works After Configuration

Once configured in keyboard emulation mode:

1. **Scan a card** on the ACR122U reader
2. The reader **beeps** (confirming detection)
3. The UID is **automatically typed** like keyboard input
4. The Casino app **detects the rapid typing** and auto-fills the Card Number field
5. You see a **green success notification**: "Card Scanned Successfully!"

**No "Connect Reader" button needed!** The keyboard detection already works in the app.

---

## Testing Keyboard Mode

To test if your reader is in keyboard mode:

1. Open Notepad or any text editor
2. Tap an NFC card on the reader
3. If you see text appear automatically, **it's working!**
4. If nothing appears, the reader is NOT in keyboard mode

---

## Alternative: Manual ACR122U Software

If you can't configure keyboard mode, use ACR122U software alongside the Casino app:

1. Keep the ACR122U software open in a separate window
2. Scan a card in the ACR122U software
3. Copy the UID
4. Paste it into the Casino app's "Card Number" field

---

## Why This Error Occurs

```
SecurityError: Failed to execute 'requestDevice' on 'USB': 
Access to the feature "usb" is disallowed by permissions policy.
```

**Cause**: 
- Figma Make runs your app in an `<iframe>`
- Browsers block USB access in iframes for security
- Even with `Permissions-Policy: usb=*`, parent frame controls access

**Cannot be fixed** in the current environment without:
- Running the app outside Figma Make (deploy to your server)
- Using keyboard emulation mode instead

---

## Production Deployment

When you deploy to **GamingIq.net/Casino**:

### Option 1: Keep Keyboard Emulation (Recommended)
- Simplest solution
- No browser permission popups
- Works immediately
- All existing code already supports it

### Option 2: Enable Web USB (Advanced)
If you want to try Web USB in production:

1. **Must use HTTPS** (already have this)
2. **App cannot be in iframe** (already direct access)
3. `.htaccess` is already configured with `Permissions-Policy: usb=*`
4. Users must grant USB permission in browser popup

---

## Summary

✅ **Recommended**: Configure ACR122U in Keyboard Emulation Mode
- Works in Figma Make immediately
- Works in production immediately
- No permission popups
- Already fully supported by the app

❌ **Not Recommended**: Web USB API
- Blocked by Figma Make iframe
- Requires user permission popup
- Only works in Chrome/Edge
- More complex setup

---

## Resources

- **ACR122U Official Page**: https://www.acs.com.hk/en/products/3/acr122u-usb-nfc-reader/
- **ACR122U SDK**: https://www.acs.com.hk/en/driver/302/acr122u-usb-nfc-reader/
- **LibNFC**: http://nfc-tools.org/index.php/Libnfc (open source alternative)

## Need Help?

The Casino app is **already configured** to detect keyboard input from card readers. Once you configure your ACR122U in keyboard emulation mode, it will work automatically - no code changes needed!
