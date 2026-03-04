# Network Architecture & Configuration
## MF-Intel CMS for Gaming IQ

---

## 🌐 Network Diagram

```
                         INTERNET
                             │
                             │ HTTPS
                             │
                    ┌────────▼────────┐
                    │   SUPABASE      │
                    │   (Database)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   VERCEL        │
                    │  (Web Hosting)  │
                    └────────┬────────┘
                             │
                 ┌───────────┴────────────┐
                 │                        │
         HTTPS via WiFi              HTTPS via 4G/5G
                 │                        │
        ┌────────▼────────┐      ┌───────▼────────┐
        │  CASINO ROUTER  │      │  MOBILE PHONES │
        │  192.168.1.1    │      │  (External)    │
        └────────┬────────┘      │  - iOS devices │
                 │                │  - Android     │
     ┌───────────┴───────────┐   └────────────────┘
     │    LOCAL NETWORK      │
     │    192.168.1.x        │
     └───────┬───────────────┘
             │
             │
    ┌────────┼─────────┬─────────┬──────────┬──────────┐
    │        │         │         │          │          │
┌───▼───┐┌───▼───┐┌───▼───┐┌───▼────┐┌────▼────┐┌───▼───┐
│Cage 1 ││Cage 2 ││Admin 1││Admin 2 ││Tablets  ││Android│
│  PC   ││  PC   ││  PC   ││  PC    ││(Windows)││Tablets│
│.10    ││.11    ││.20    ││.21     ││.30-.39  ││.40-.49│
└───┬───┘└───┬───┘└───────┘└────────┘└─────────┘└───┬───┘
    │        │                                       │
┌───▼───┐┌───▼───┐                              ┌───▼───┐
│Epson  ││Epson  │                              │Premax │
│TM-T20 ││TM-T20 │                              │PM-RP80│
│.201   ││.202   │                              │(BT)   │
└───────┘└───────┘                              └───────┘

Additional Printers:
- Epson TM-T20III @ Pit Boss station (USB/WiFi)
- Epson TM-T20III @ Host laptop (USB)
- Card Printer @ Host laptop (USB)
```

---

## 📊 Device IP Address Plan

### Wired Devices (Ethernet - Recommended for PCs)

| Device | IP Address | Hostname | MAC Address | Notes |
|--------|------------|----------|-------------|-------|
| Router | 192.168.1.1 | router | - | Gateway |
| Cage PC 1 | 192.168.1.10 | cage-pc1 | [Record MAC] | Static IP |
| Cage PC 2 | 192.168.1.11 | cage-pc2 | [Record MAC] | Static IP |
| Admin PC 1 | 192.168.1.20 | admin-pc1 | [Record MAC] | Static IP |
| Admin PC 2 | 192.168.1.21 | admin-pc2 | [Record MAC] | Static IP |
| Host Laptop | 192.168.1.25 | host-laptop | [Record MAC] | Static IP |
| Pit Boss Station | 192.168.1.30 | pitboss-pc | [Record MAC] | Static IP |

### Network Printers (Ethernet)

| Printer | IP Address | Location | MAC Address | Notes |
|---------|------------|----------|-------------|-------|
| Epson TM-T20III | 192.168.1.201 | Cage PC 1 | [Record MAC] | Cashier receipts |
| Epson TM-T20III | 192.168.1.202 | Cage PC 2 | [Record MAC] | Cashier receipts |
| Epson TM-T20III | 192.168.1.203 | Pit Boss | [Record MAC] | Rating tickets |
| Epson TM-T20III | 192.168.1.204 | Host Station | [Record MAC] | Player tickets |

### WiFi Devices (DHCP or Static)

| Device | IP Range | Quantity | Notes |
|--------|----------|----------|-------|
| Windows Tablets | 192.168.1.30-39 | Multiple | Ratings/Table ops |
| Android Tablets | 192.168.1.40-49 | Multiple | Comps/Sales |
| Staff Phones | 192.168.1.50-69 | Multiple | Internal viewing |
| Guest WiFi | 192.168.2.x | - | Separate VLAN |

### External Devices (Internet)

| Device | Connection | Notes |
|--------|------------|-------|
| iOS Phones | 4G/5G via HTTPS | Remote viewing |
| Android Phones | 4G/5G via HTTPS | Remote viewing |
| Manager Laptops | VPN (optional) | Remote admin |

---

## 🔧 Router Configuration

### Basic Settings

**Router Model**: [Your router model]
**Admin URL**: http://192.168.1.1
**Username**: [Default: admin]
**Password**: [Change from default!]

### DHCP Server

**Enable DHCP**: Yes
**IP Range**: 192.168.1.100 - 192.168.1.254
**Lease Time**: 24 hours
**Gateway**: 192.168.1.1
**DNS Servers**: 
- Primary: 8.8.8.8 (Google)
- Secondary: 1.1.1.1 (Cloudflare)

### Static IP Reservations (DHCP Reservations)

Create reservations for critical devices:

1. Log into router admin panel
2. Go to DHCP Settings
3. Find "Static Lease" or "IP Reservation"
4. Add each device:
   - Enter MAC address
   - Assign IP address (see table above)
   - Save

**Benefits:**
- Device always gets same IP
- Easier troubleshooting
- Printers always accessible
- No manual IP configuration needed

### WiFi Configuration

**Network 1 - Staff Network (WPA3/WPA2)**
- SSID: `Casino-Staff`
- Password: [Strong password - 16+ characters]
- Security: WPA3-Personal (or WPA2 if WPA3 unavailable)
- Band: 2.4GHz + 5GHz
- Channel: Auto (or manually select least congested)

**Network 2 - Guest Network (Separate VLAN)**
- SSID: `Casino-Guest`
- Password: [Simple password for guests]
- Security: WPA2-Personal
- Isolation: Enable client isolation
- VLAN: 2 (192.168.2.x)
- No access to staff devices

**Recommendations:**
- Hide SSID: No (makes troubleshooting harder)
- MAC Filtering: Optional (additional security)
- Guest Network: Must be separated from staff network

### Firewall Settings

**Enable Firewall**: Yes
**SPI Firewall**: Enable
**DoS Protection**: Enable

**Port Forwarding**: Not required (using Supabase Cloud)

**UPnP**: Disable (security risk)

### QoS (Quality of Service) - Optional

Prioritize casino application traffic:

1. Enable QoS
2. Set priority rules:
   - High: Casino app traffic (port 443)
   - Medium: General web browsing
   - Low: Downloads, streaming

This ensures smooth operation even with heavy network use.

---

## 🔐 Network Security

### Security Checklist

- [ ] Change default router password
- [ ] Enable WPA3 or WPA2 encryption
- [ ] Disable WPS (security vulnerability)
- [ ] Enable router firewall
- [ ] Create separate guest network
- [ ] Use strong WiFi passwords (16+ characters)
- [ ] Disable remote router management
- [ ] Update router firmware
- [ ] Enable MAC address logging
- [ ] Document all network changes

### WiFi Password Recommendations

**Staff Network:**
```
Example: CasinoStaff2026!Secure#Network
- 16+ characters
- Mix of uppercase, lowercase, numbers, symbols
- Change quarterly
```

**Guest Network:**
```
Example: CasinoGuest2026
- 12+ characters
- Easier to share with customers
- Change monthly
```

### Access Control

**Cage Area (Sensitive):**
- Consider separate VLAN (192.168.10.x)
- Restrict access to Cage PCs only
- No guest network access

**Public Areas:**
- Guest network only
- No access to staff devices
- Bandwidth limiting

---

## 📡 WiFi Coverage Planning

### Access Point Placement

For optimal coverage, place WiFi access points:

1. **Main Casino Floor**: Central location, high placement
2. **Cage Area**: Dedicated AP near Cage PCs
3. **Office Area**: AP for admin PCs
4. **Outdoor Areas** (if applicable): Weather-resistant AP

### Coverage Tips

- Avoid metal obstacles
- Place APs high (ceiling-mounted ideal)
- Use 5GHz for tablets (faster, shorter range)
- Use 2.4GHz for extended range
- Test signal strength at all tables

### Signal Strength Test

**Good Signal**: -67 dBm or better
**Acceptable**: -70 to -80 dBm
**Poor**: Below -80 dBm

**Testing:**
- Windows: `netsh wlan show interfaces`
- Android: WiFi Analyzer app
- iOS: Airport Utility app (enable WiFi scanner)

---

## 🖨️ Printer Network Configuration

### USB Printers (Simplest)

**Recommended for:**
- Cage PC printers
- Card printer at Host laptop
- Any fixed workstation printer

**Setup:**
1. Connect via USB
2. Install driver
3. No network configuration needed
4. Most reliable method

### Network Printers (Flexible)

**Recommended for:**
- Shared printers (multiple devices)
- Tablets printing to nearby printer
- Remote printing

**Setup:**

**Step 1: Connect Printer to Network**
- Option A: WiFi (printer must support)
- Option B: Ethernet cable to router/switch

**Step 2: Configure Static IP**
1. Access printer web interface (check manual)
2. Or print self-test page for current IP
3. Assign static IP (e.g., 192.168.1.201)
4. Set gateway: 192.168.1.1
5. Set DNS: 8.8.8.8

**Step 3: Add to Router Reservations**
- Record printer MAC address
- Create DHCP reservation in router
- Printer will always get same IP

**Step 4: Test Connection**
- From PC: `ping 192.168.1.201`
- Should receive replies
- If timeout, check cables/settings

### Bluetooth Printers (Portable)

**Premax PM-RP 80:**
- No IP address needed
- Pairs directly with Android tablet
- Range: ~10 meters
- Can't be shared (single device connection)

---

## 🔄 Data Flow

### How Requests Work

```
User Device → Browser → HTTPS Request
                ↓
            Internet
                ↓
            Vercel (Web Server)
                ↓
            Supabase (Database)
                ↓
            Response Back
                ↓
            User Device → Update Display
```

**Key Points:**
- All data stored in Supabase Cloud
- Real-time sync across all devices
- HTTPS encrypted (secure)
- Works on LAN and externally

### Offline Operation

**Current Setup**: Requires internet

**If Internet Goes Down:**
- Application won't load initially
- Existing loaded pages may work (cached)
- No data sync occurs
- Recommendation: Have backup internet (4G hotspot)

**Future Enhancement (Optional):**
- Implement Progressive Web App (PWA)
- Service worker for offline caching
- Local data queue for sync later

---

## 🌍 External Access Configuration

### For iOS/Android Phones Outside Casino

**No Special Setup Needed!**

Because you're using Supabase Cloud + Vercel:
- ✅ Automatic external access
- ✅ HTTPS encryption included
- ✅ No port forwarding needed
- ✅ No VPN required
- ✅ Works on any internet connection

**Staff Instructions:**
1. Open browser on phone
2. Navigate to your Vercel URL
3. Bookmark the page
4. Login with credentials
5. Access from anywhere!

### VPN (Optional - For Enhanced Security)

If you want extra security for admin access:

**Options:**
1. **WireGuard VPN** (recommended)
   - Open source
   - Fast
   - Secure
   - Free

2. **OpenVPN**
   - Widely supported
   - More complex setup

3. **Router Built-in VPN**
   - Check if your router supports VPN server
   - Usually OpenVPN or PPTP

**Setup** (requires technical knowledge):
- Install VPN server on router or dedicated PC
- Configure user accounts
- Install VPN client on phones
- Connect to VPN before accessing app

**Benefit**: All traffic encrypted, appears as local network access

---

## 🔍 Network Monitoring

### Tools

**Built-in Router Monitoring:**
- Connected devices list
- Bandwidth usage
- Connection history

**Free Tools:**
- **Angry IP Scanner**: Scan network for devices
- **WiFi Analyzer** (Android): Check signal strength
- **PingTools** (iOS/Android): Network diagnostics
- **GlassWire** (Windows): Monitor network traffic

### What to Monitor

**Daily:**
- [ ] All critical devices online
- [ ] Printers accessible
- [ ] Internet connection stable

**Weekly:**
- [ ] Check router logs
- [ ] Verify all IP assignments correct
- [ ] Test WiFi speed on tablets

**Monthly:**
- [ ] Review connected devices list
- [ ] Remove unauthorized devices
- [ ] Check for firmware updates

---

## 🆘 Network Troubleshooting

### Device Can't Connect to WiFi

**Steps:**
1. Verify correct WiFi password
2. Check if WiFi enabled on device
3. Forget network and reconnect
4. Restart device
5. Check if MAC filtering enabled (disable or add device)
6. Verify not connected to Guest network by mistake

### Device Online But App Won't Load

**Steps:**
1. Check internet connection (open google.com)
2. Verify correct URL (should be HTTPS)
3. Clear browser cache
4. Try incognito/private mode
5. Check firewall settings
6. Verify Supabase is online (status.supabase.com)

### Printer Not Found on Network

**Steps:**
1. Check printer powered on
2. Verify Ethernet cable connected
3. Print self-test page to check IP
4. Ping printer: `ping 192.168.1.201`
5. Check if printer on different subnet
6. Verify no IP conflicts (two devices same IP)
7. Restart printer and router

### Slow Network Performance

**Causes:**
- Too many connected devices
- Interference (other WiFi networks)
- Outdated router
- Bandwidth-heavy applications

**Solutions:**
1. Enable QoS on router
2. Change WiFi channel (avoid congested channels)
3. Upgrade router if old (WiFi 5 or WiFi 6)
4. Use 5GHz band for nearby devices
5. Check for malware on devices

### Internet Down

**Immediate Actions:**
1. Restart modem and router
2. Check ISP status page
3. Contact ISP support
4. Use mobile hotspot as backup

**Backup Plan:**
- Keep 4G/5G hotspot device
- Can tether from phone temporarily
- Document operations manually if prolonged outage

---

## 📋 Network Documentation Template

**Fill this out for your installation:**

### Router Information
- **Model**: ___________________
- **Admin URL**: http://192.168.1.1
- **Username**: ___________________
- **Password**: ___________________
- **WiFi SSID (Staff)**: ___________________
- **WiFi Password**: ___________________
- **WiFi SSID (Guest)**: ___________________
- **WiFi Password**: ___________________

### ISP Information
- **Provider**: ___________________
- **Account Number**: ___________________
- **Support Phone**: ___________________
- **Package**: ___________________ Mbps

### Device MAC Addresses

| Device | MAC Address | IP Address | Notes |
|--------|-------------|------------|-------|
| Cage PC 1 | | 192.168.1.10 | |
| Cage PC 2 | | 192.168.1.11 | |
| Admin PC 1 | | 192.168.1.20 | |
| Admin PC 2 | | 192.168.1.21 | |
| Printer 1 | | 192.168.1.201 | |
| Printer 2 | | 192.168.1.202 | |

### Application URLs
- **Production URL**: https://_____________________.vercel.app
- **Supabase URL**: https://_____________________.supabase.co
- **Database**: [Managed by Supabase]

### Support Contacts
- **Network Admin**: ___________________
- **ISP Support**: ___________________
- **IT Vendor**: ___________________
- **Emergency**: ___________________

---

## ✅ Network Setup Checklist

### Pre-Deployment
- [ ] Router configured with strong password
- [ ] WiFi networks created (Staff + Guest)
- [ ] Static IP reservations configured
- [ ] DHCP enabled and tested
- [ ] Firewall enabled
- [ ] QoS configured (optional)
- [ ] Guest network isolated
- [ ] All MAC addresses documented

### Device Configuration
- [ ] All PCs connected to network
- [ ] All tablets connected to WiFi
- [ ] Printers configured with static IPs
- [ ] Signal strength tested at all locations
- [ ] Internet speed test performed
- [ ] External access tested from phone

### Security
- [ ] Default passwords changed
- [ ] WPA3/WPA2 enabled
- [ ] Guest network separated
- [ ] Firewall rules configured
- [ ] Router firmware updated
- [ ] Network documentation completed

### Testing
- [ ] Ping all devices from admin PC
- [ ] Print test from each printer
- [ ] Access app from each device
- [ ] Test external access on phone
- [ ] Verify data syncs across devices
- [ ] Test backup internet connection

---

**End of Network Configuration Guide**
