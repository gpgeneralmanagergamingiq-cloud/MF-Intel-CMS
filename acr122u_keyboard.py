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
