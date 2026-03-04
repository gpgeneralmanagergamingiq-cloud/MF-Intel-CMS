# Printer Setup Guide
## MF-Intel CMS for Gaming IQ

---

## 📋 Your Printer Inventory

| Printer Model | Quantity | Location | Purpose |
|--------------|----------|----------|---------|
| Epson TM-T20III | 2 | Cage PCs | Cashier receipts |
| Epson TM-T20III | 1 | Pit Boss Station | Rating tickets |
| Epson TM-T20III | 1 | Host Laptop | Player tickets |
| Card Printer | 1 | Host Laptop | QR code cards |
| Premax PM-RP 80 | 1 | Sales/Comps Station | POS receipts |

**Total: 5 Thermal Printers + 1 Card Printer**

---

## 🖨️ Epson TM-T20III Setup (4 units)

### Hardware Specifications
- **Type**: Thermal receipt printer
- **Paper Width**: 80mm (3.15 inches)
- **Connection**: USB, Serial, or Ethernet
- **Speed**: 200mm/sec
- **Auto-cutter**: Yes

### Driver Installation (Windows)

**Step 1: Download Driver**
1. Go to: https://epson.com/Support/Printers/Receipt-Printers/TM-T20III-Series/s/SPT_C31CH51001
2. Click "Drivers" tab
3. Download "Advanced Printer Driver"
4. Save to Desktop

**Step 2: Install Driver**
1. Connect printer to PC via USB
2. Power on printer
3. Run downloaded installer
4. Follow wizard:
   - Select "USB" connection
   - Detect printer automatically
   - Complete installation
5. Restart computer (if prompted)

**Step 3: Test Print**
1. Open Notepad
2. Type: "Test Print - Casino CMS"
3. Ctrl+P to print
4. Select "TM-T20III" printer
5. Click Print
6. Receipt should print and auto-cut

### Paper Loading

1. Open printer cover
2. Insert thermal paper roll (print side facing up)
3. Feed paper through slot
4. Close cover (will auto-cut excess)
5. Paper should be visible at front

**Paper Direction Check:**
- Scratch paper with fingernail
- If black mark appears, that's the thermal (print) side
- This side should face UP when loading

### Network Setup (Optional - For Shared Printing)

**For shared access from tablets:**

1. **Connect Ethernet Cable**
   - Plug into printer LAN port
   - Connect to network switch

2. **Configure IP Address**
   - Print self-test sheet (hold Feed button during power-on)
   - Note current IP or set static IP
   - Recommended: 192.168.1.201 (Cage 1), 192.168.1.202 (Cage 2), etc.

3. **Add Network Printer on Devices**
   - Windows: Settings → Printers → Add Printer → Add by IP
   - Enter printer IP address
   - Select "Generic Network Card" driver

### Cage PC 1 Configuration

**Device**: Cashier workstation #1
**Printer Name**: "CagePrinter1"

1. Connect printer via USB
2. Install driver (see above)
3. Right-click printer → "Set as default printer"
4. Test from Cage tab in application

### Cage PC 2 Configuration

**Device**: Cashier workstation #2
**Printer Name**: "CagePrinter2"

1. Connect printer via USB
2. Install driver
3. Set as default printer
4. Test from Cage tab

### Pit Boss Station Configuration

**Device**: Pit Boss tablet/laptop
**Printer Name**: "PitBossPrinter"

1. If Windows device: USB connection + driver
2. If tablet only: Use network printing via WiFi
3. Test from Ratings tab → End Rating → Print Ticket

### Host Laptop Configuration

**Device**: Host laptop
**Printer Name**: "HostPrinter"

1. Connect via USB
2. Install driver
3. Used for player tickets and QR cards
4. Test from Players tab

---

## 🎴 Card Printer Setup (Host Laptop)

### Purpose
- Print plastic cards with QR codes
- Player identification cards
- Employee ID cards with QR codes

### Setup Steps

**Step 1: Install Manufacturer Software**
1. Insert driver CD or download from manufacturer website
2. Install card printer software
3. Install printer driver
4. Restart computer

**Step 2: Load Card Stock**
1. Open card input tray
2. Load blank plastic cards (standard CR80 size: 85.6mm × 53.98mm)
3. Adjust guides to card width
4. Close tray

**Step 3: Install Ribbon (if required)**
1. Open ribbon compartment
2. Insert color ribbon cartridge
3. Follow manufacturer threading guide
4. Close compartment

**Step 4: Configure in Application**
1. Open Players tab in application
2. Select a player
3. Click "Print QR Card"
4. Select card printer from dialog
5. Verify card prints correctly

### Card Design

The application automatically generates:
- Player name
- Member ID
- QR code (for scanning)
- Casino logo/branding
- Tier level (VIP, Regular, etc.)

### Troubleshooting
- **Card jams**: Check card thickness, clean rollers
- **Poor print quality**: Replace ribbon, clean print head
- **QR code doesn't scan**: Increase QR size in settings

---

## 🖨️ Premax PM-RP 80 Setup (Sales Station)

### Hardware Specifications
- **Type**: Portable thermal receipt printer
- **Paper Width**: 80mm
- **Connection**: Bluetooth, USB
- **Battery**: Rechargeable (portable)
- **Speed**: 90mm/sec

### Charging the Printer

1. Connect charging cable to printer
2. Plug into power outlet
3. Charge fully before first use (4-6 hours)
4. LED indicator shows charging status
5. Can print while charging

### Bluetooth Pairing (Android Tablet)

**Step 1: Prepare Printer**
1. Power on printer (hold power button)
2. Press Bluetooth button (LED blinks blue)
3. Printer is now discoverable

**Step 2: Pair with Tablet**
1. Open Android Settings
2. Go to Bluetooth
3. Enable Bluetooth
4. Scan for devices
5. Select "Premax PM-RP 80" or similar name
6. Pair (no PIN usually required)
7. LED turns solid blue when connected

**Step 3: Test from Application**
1. Open Comps tab
2. Create test sale
3. Click "Print Receipt"
4. Select Premax printer
5. Receipt should print wirelessly

### USB Connection (Alternative)

1. Get USB OTG cable
2. Connect Android tablet to printer
3. Printer should be detected automatically
4. Test print from Comps tab

### Paper Loading

1. Open printer cover (pull tab)
2. Insert 80mm thermal paper roll
3. Feed paper through opening
4. Close cover firmly
5. Paper should extend 2-3 cm

### Battery Life
- **Continuous printing**: 4-6 hours
- **Standby**: 3-4 days
- **Recommendation**: Charge overnight daily

### Mobile Operation

This printer is portable - perfect for:
- Waiter station moving between tables
- Outdoor casino areas
- Temporary POS stations
- Events and promotions

---

## 🔧 Troubleshooting All Printers

### Printer Not Detected

**Check:**
- [ ] Printer powered on
- [ ] USB cable securely connected
- [ ] Driver installed correctly
- [ ] Try different USB port
- [ ] Restart computer

### Paper Jam

**Steps:**
1. Power off printer
2. Open cover
3. Gently remove jammed paper
4. Check for torn pieces
5. Reload paper correctly
6. Close cover and power on

### Print Quality Issues

**Solutions:**
- Clean print head with alcohol wipe
- Check paper quality (use thermal paper only)
- Verify paper loaded correct side up
- Replace paper if old/degraded
- Check printer settings (darkness level)

### Auto-Cutter Not Working

**Steps:**
1. Open printer cover
2. Check for paper debris in cutter
3. Clean cutter blade carefully
4. Manually test cutter (should click)
5. If broken, contact service

### Bluetooth Connection Lost (Premax)

**Steps:**
1. Turn printer off and on
2. Re-enable Bluetooth on tablet
3. Forget device and re-pair
4. Move closer to tablet (within 10 meters)
5. Check battery level

### Network Printer Offline

**Steps:**
1. Verify printer has network cable connected
2. Check printer IP address (print self-test)
3. Ping printer from computer: `ping 192.168.1.201`
4. Remove and re-add network printer
5. Check firewall settings

---

## 📄 Receipt Examples

### Cage Receipt (Epson TM-T20III)
```
================================
    CASINO NAME
    MF-Intel CMS
================================
Transaction Type: Float Open
Table: BJ-01
Dealer: John Smith
Amount: CFA 5,000,000
--------------------------------
Date: 2026-03-03 14:30:25
Cashier: cashier1
Transaction ID: FLT-2026-0042
================================
  Authorized by Management
================================
```

### Player Rating Ticket (Epson TM-T20III)
```
================================
    PLAYER RATING SUMMARY
================================
Player: Jane Doe
Member ID: P-2026-0123
--------------------------------
Table: BJ-01
Session: 2h 30m
Buy-In: CFA 1,000,000 (Cash)
Cash-Out: CFA 850,000
Win/Loss: -CFA 150,000
Avg Bet: CFA 50,000
--------------------------------
Theo Win: CFA 75,000
Comps Earned: CFA 750
--------------------------------
Date: 2026-03-03 14:30
Inspector: inspector1
================================
   Thank you for playing!
================================
```

### Comps Receipt (Premax PM-RP 80)
```
================================
    CASINO NAME - F&B
================================
Item: Drink - Beer
Player: John Smith (P-123)
Comps Value: CFA 5,000
--------------------------------
Waiter: waiter1
Date: 2026-03-03 15:45
================================
    Enjoy your beverage!
================================
```

---

## 📦 Maintenance Schedule

### Daily
- [ ] Check paper levels
- [ ] Verify all printers online
- [ ] Test print from each device

### Weekly
- [ ] Clean print heads (alcohol wipe)
- [ ] Check auto-cutter function
- [ ] Verify Bluetooth connections
- [ ] Stock spare paper rolls

### Monthly
- [ ] Deep clean all printers
- [ ] Check USB cables for wear
- [ ] Update printer firmware (if available)
- [ ] Replace worn cutter blades

### Quarterly
- [ ] Professional service (if needed)
- [ ] Calibrate card printer
- [ ] Update drivers
- [ ] Inventory spare parts

---

## 🛒 Spare Parts & Supplies

### Paper Supplies

**Thermal Paper Rolls - 80mm x 80mm**
- Order: 50-100 rolls
- Lifespan: 1-2 months (depending on volume)
- Source: Office supply stores, Amazon, thermal paper suppliers

**Plastic Card Stock (for card printer)**
- Order: 500-1000 cards
- Size: CR80 (credit card size)
- Type: PVC, 0.76mm thick

### Spare Parts

- [ ] Extra USB cables (2-3)
- [ ] Ethernet cables (if using network printing)
- [ ] Premax charging cable (backup)
- [ ] OTG cables for Android (2-3)
- [ ] Print head cleaning kit
- [ ] Card printer ribbon cartridges (2-3)

### Emergency Kit

Keep near each printer:
- Extra paper roll
- Cleaning wipes
- Spare USB cable
- Instruction manual
- Technical support phone number

---

## 📞 Technical Support

### Epson TM-T20III
- Website: https://epson.com/support
- Phone: Check Epson website for regional number
- Manual: Available on support page

### Premax PM-RP 80
- Manual: Included in box
- Support: Check manufacturer website
- Common issues: Battery, Bluetooth pairing

### Card Printer
- Manufacturer specific
- Keep manual accessible
- Note model number and serial number

---

## ✅ Printer Setup Checklist

### Cage PC 1
- [ ] Epson TM-T20III connected
- [ ] Driver installed
- [ ] Set as default printer
- [ ] Test receipt printed
- [ ] Paper loaded
- [ ] Spare rolls stocked

### Cage PC 2
- [ ] Epson TM-T20III connected
- [ ] Driver installed
- [ ] Set as default printer
- [ ] Test receipt printed
- [ ] Paper loaded
- [ ] Spare rolls stocked

### Pit Boss Station
- [ ] Epson TM-T20III connected
- [ ] Driver installed
- [ ] Test rating ticket printed
- [ ] Paper loaded

### Host Laptop
- [ ] Epson TM-T20III connected
- [ ] Card printer connected
- [ ] Both drivers installed
- [ ] Test receipt printed
- [ ] Test card printed
- [ ] Card stock loaded

### Sales Station (Android)
- [ ] Premax PM-RP 80 charged
- [ ] Bluetooth paired
- [ ] Test receipt printed
- [ ] Paper loaded
- [ ] Charging cable accessible

---

**End of Printer Setup Guide**
