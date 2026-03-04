# 🎰 MF-Intel CMS for Gaming IQ

**Version 2.3.2** - Grand Palace Casino Management System

[![Auto-Deploy](https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS/actions/workflows/deploy.yml/badge.svg)](https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS/actions)
[![Live](https://img.shields.io/badge/Live-app.mfintelcms.com-brightgreen)](https://app.mfintelcms.com/GrandPalace)
[![Version](https://img.shields.io/badge/version-2.3.2-blue)](https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS)

## 📋 Overview

MF-Intel CMS is a comprehensive casino management system designed exclusively for **Grand Palace Casino**. Built with React, TypeScript, Tailwind CSS, and powered by Supabase backend.

### 🌐 Live Application
**Production**: https://app.mfintelcms.com/GrandPalace

---

## ✨ Key Features

### 🎯 Core Modules
- **Player Management** - Complete player profiles with QR code system
- **Rating System** - Real-time table game tracking and theo calculations
- **Float Management** - Multi-shift cashier float operations
- **Cage Operations** - Buy-ins, cash-outs, markers, and fills
- **Jackpots** - Progressive and fixed jackpot management
- **Comps System** - Three modes (Host, Waiter, Cashier) for complimentary services
- **Reports** - Comprehensive analytics and export capabilities
- **Employee Management** - 7 user roles with granular permissions

### 🔐 User Roles
1. **Super Manager** - Full system access
2. **Manager** - Operations management
3. **Inspector** - Audit and oversight
4. **Pit Boss** - Gaming floor operations
5. **Cashier** - Float and cage operations
6. **Host** - Player management and comps (Players: Edit, Others: View Only)
7. **Waiter** - Comps and service operations

### 🛠️ Technical Features
- ✅ **QR Code Integration** - Player identification via NFC readers (ACR122U)
- ✅ **Thermal Printing** - Receipt generation for Epson TM-T20III
- ✅ **Keyboard Shortcuts** - Universal hotkeys for efficient operations
- ✅ **Audit Trail** - Complete logging of all operations
- ✅ **Admin Edit System** - Record correction with approval workflow
- ✅ **Vault Approvals** - Two-step verification for sensitive transfers
- ✅ **Real-time Updates** - Live data synchronization
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

---

## 🚀 Deployment

### Automatic Deployment

This project uses **GitHub Actions** for automatic deployment to **Cloudflare Pages**.

**Every push to `main` branch automatically:**
1. ✅ Installs dependencies
2. 🔨 Builds the application
3. 🚀 Deploys to Cloudflare Pages
4. ✅ Goes live at https://app.mfintelcms.com

### Manual Deployment

```bash
# Build production version
npm run build

# Deploy to Cloudflare Pages
npm run deploy:cloudflare

# Deploy Supabase functions
npm run deploy:supabase

# Deploy everything
npm run deploy:all
```

---

## 🛠️ Development

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS.git

# Navigate to project directory
cd MF-Intel-CMS

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudflare Configuration (for deployment)
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

---

## 📦 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **React Router v7** - Navigation
- **Motion** - Animations
- **Recharts** - Data visualization
- **html5-qrcode** - QR scanning
- **jsPDF** - PDF generation
- **XLSX** - Excel export

### Backend
- **Supabase** - Database, Auth, Storage
- **PostgreSQL** - Relational database
- **Supabase Edge Functions** - Serverless API

### Deployment
- **Cloudflare Pages** - Hosting
- **GitHub Actions** - CI/CD

---

## 📁 Project Structure

```
MF-Intel-CMS/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Auto-deployment workflow
├── src/
│   ├── app/
│   │   ├── components/         # React components
│   │   │   ├── ui/            # UI components
│   │   │   ├── Players.tsx    # Player management
│   │   │   ├── Ratings.tsx    # Rating system
│   │   │   ├── Cage.tsx       # Cage operations
│   │   │   ├── Comps.tsx      # Comps system
│   │   │   └── ...
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── routes.ts          # Route configuration
│   │   └── App.tsx            # Main application
│   ├── styles/                # CSS styles
│   └── index.tsx              # Entry point
├── supabase/
│   ├── functions/             # Edge functions
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── package.json               # Dependencies
├── vite.config.ts            # Vite configuration
└── README.md                  # This file
```

---

## 🎯 Key Workflows

### Player Management
1. Add player → Generate QR card → Scan for quick lookup
2. Track player activity, comps, and rebates
3. Marketing campaigns and winner selection

### Rating System
1. Start rating → Player scans QR → Select game
2. Track buy-ins, cash-outs, and play time
3. Auto-calculate theoretical win (THEO)
4. Generate player activity reports

### Float Operations
1. Open float → Record opening amount
2. Track buy-ins, cash-outs, tips, drop
3. Close float → Reconcile and generate report
4. Shift handover with variance tracking

### Cage Operations
1. Buy-in → Convert cash to chips
2. Cash-out → Convert chips to cash
3. Markers (credit) → Issue and collect
4. Fills/Credits → Table chip management

---

## 🔒 Security Features

- ✅ **Role-based Access Control** - 7 distinct user roles
- ✅ **Password Protection** - Secure authentication
- ✅ **Audit Logging** - Complete operation history
- ✅ **Approval Workflows** - Multi-step verification for sensitive operations
- ✅ **Data Validation** - Input sanitization and validation
- ✅ **Encrypted Storage** - Secure data at rest

---

## 📊 Reports & Analytics

### Available Reports
- Player Activity Reports (with FCFA calculations)
- New Players Report
- Tables & Games Activity
- Rebate Summary
- THEO Breakdown
- Daily Tables Report
- Comps End-of-Day Report
- Float Reconciliation Reports

### Export Formats
- 📄 PDF
- 📊 Excel (XLSX)
- 🖨️ Thermal Receipt Print

---

## 🆘 Support & Documentation

### Documentation
- **Deployment Guide**: `/START_HERE_GITHUB_UPLOAD.md`
- **User Guides**: `/USER_GUIDE_*.md` (by role)
- **Printer Setup**: `/PRINTER_SETUP.md`
- **NFC Reader Guide**: `/NFC_READER_GUIDE.md`

### Quick References
- **Keyboard Shortcuts**: Built-in Help System (F1)
- **Troubleshooting**: `/TROUBLESHOOTING.md`
- **Version History**: `/CHANGES_v2.3.2.md`

---

## 🔄 Changelog

### Version 2.3.2 (Current)
- ✅ Complete GitHub Actions auto-deployment setup
- ✅ Cloudflare Pages integration
- ✅ Host role permissions refined (Players: Edit, Others: View Only)
- ✅ All input fields start blank (no preset "0" values)
- ✅ Single-property mode for Grand Palace Casino
- ✅ Updated thermal receipt system
- ✅ Enhanced audit trail system
- ✅ Performance optimizations

---

## 📝 License

**PROPRIETARY** - © 2026 MF-Intel CMS for Gaming IQ. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 👥 Author

**Marius** - Lead Developer

---

## 🎉 Acknowledgments

- Grand Palace Casino team for requirements and testing
- Supabase for backend infrastructure
- Cloudflare for hosting and CDN
- React and TypeScript communities

---

## 📞 Links

- **Live Application**: https://app.mfintelcms.com/GrandPalace
- **GitHub Repository**: https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS
- **GitHub Actions**: https://github.com/gpgeneralmanagergamingiq-cloud/MF-Intel-CMS/actions
- **Cloudflare Dashboard**: https://dash.cloudflare.com/

---

**Built with ❤️ for Grand Palace Casino**

Last Updated: March 4, 2026
