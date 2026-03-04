# ACR122U NFC Reader - Setup & Troubleshooting Guide

## Overview
The Casino application now supports direct ACR122U NFC card reader integration for automatic player card scanning using the Web USB API.

## Requirements

### Browser Compatibility
✅ **Supported Browsers:**
- Google Chrome (version 61+)
- Microsoft Edge (version 79+)
- Opera (version 48+)

❌ **NOT Supported:**
- Safari (no Web USB support)
- Firefox (no Web USB support)
- Internet Explorer

### Hardware
- **ACR122U** NFC reader from Advanced Card Systems Ltd.
- USB connection to computer
- Compatible NFC cards (ISO14443A, Mifare, NTAGCards)

## Setup Instructions

### 1. Connect Hardware
1. Plug the ACR122U reader into a USB port
2. Wait for Windows/Mac to recognize the device (drivers usually install automatically)
3. The reader's LED should light up (usually red or green)

### 2. Access the Application
1. Open **Chrome** or **Edge** browser
2. Navigate to your Casino application
3. **IMPORTANT:** Must be:
   - Accessed directly (not in an iframe)
   - Using HTTPS in production (HTTP is okay for localhost)

### 3. Connect the Reader
1. Click "**Players**" tab
2. Click "**Add New Player**" button
3. Scroll to "**Player Card Information**" section
4. You should see a blue box labeled "**ACR122U NFC Reader**"
5. Click the "**Connect Reader**" button
6. Browser will show a popup - select your **ACR122U** device
7. Click "**Connect**"

### 4. Scan Cards
1. Once connected, scanning starts automatically
2. **Tap an NFC card** on the reader
3. The card UID will be read and auto-filled as `NFC-{UID}`
4. Example: `NFC-04A3B2C1D2E3F4`

## Troubleshooting

### ❌ Error: "Access to the feature 'usb' is disallowed by permissions policy"

**Cause:** Browser security policy blocking USB access

**Solutions:**

1. **Restart your development server**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart
   npm run dev
   # or
   pnpm dev
   ```

2. **Check if you're in an iframe**
   - Open the app in a new tab directly
   - Don't embed it in another page

3. **Verify HTTPS (Production only)**
   - Web USB requires HTTPS in production
   - HTTP is fine for localhost/127.0.0.1

4. **Clear browser cache**
   - Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Clear cached images and files
   - Restart browser

5. **Check browser flags (Chrome)**
   - Go to: `chrome://flags`
   - Search for "Experimental Web Platform features"
   - Make sure it's not disabled
   - Restart browser

### ❌ Error: "No ACR122U device found"

**Solutions:**
1. Check USB connection
2. Try a different USB port
3. Unplug and replug the device
4. Check if device appears in Device Manager (Windows) or System Information (Mac)

### ❌ "Web USB not supported" warning

**Solutions:**
1. Switch to Chrome or Edge browser
2. Update your browser to the latest version

### ❌ Reader connected but not reading cards

**Solutions:**
1. Check if the NFC card is compatible (ISO14443A cards work best)
2. Hold the card closer to the reader (directly on top)
3. Try a different card
4. The reader's beep confirms card detection, but read may still fail
5. Disconnect and reconnect the reader

### ❌ Permissions Policy issues in Production

Add to your **Apache `.htaccess`** file:
```apache
<IfModule mod_headers.c>
  Header always set Permissions-Policy "usb=*"
</IfModule>
```

Add to your **Nginx config**:
```nginx
add_header Permissions-Policy "usb=*" always;
```

## Production Deployment Checklist

- [ ] Site is served over **HTTPS**
- [ ] USB permissions policy is set in server headers
- [ ] `.htaccess` file is uploaded (Apache)
- [ ] ACR122U drivers are installed on client computers
- [ ] Using Chrome or Edge browser
- [ ] Not embedded in iframe

## Technical Details

### Supported Card Types
- **Mifare Classic** (1K, 4K)
- **Mifare Ultralight**
- **NTAG** (213, 215, 216)
- **ISO14443A** compliant cards

### Card UID Format
- Read as hexadecimal string
- Formatted as `NFC-{UID}`
- Example: `NFC-04A3B2C1D2E3F4`
- Length: 4 bytes (8 hex chars) or 7 bytes (14 hex chars)

### Browser Permissions
The app requests USB permissions when you click "Connect Reader". You must grant permission in the browser popup.

## Alternative: Keyboard Emulation Mode

If Web USB doesn't work, you can configure the ACR122U in **HID Keyboard Emulation Mode**:

1. Download ACR122U configuration tools from ACS website
2. Configure reader to output UID as keyboard input
3. The app will automatically detect rapid keyboard input and fill the card number
4. No "Connect Reader" button needed

## Support

For additional help:
- ACR122U Official: https://www.acs.com.hk/en/products/3/acr122u-usb-nfc-reader/
- Web USB API: https://developer.mozilla.org/en-US/docs/Web/API/USB

## Files Modified

- `/src/app/utils/nfcReader.ts` - NFC reader utility
- `/src/app/components/PlayerForm.tsx` - Player form with NFC integration
- `/vite.config.ts` - Permissions policy configuration
- `/.htaccess` - Apache server configuration
