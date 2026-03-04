# 📧 Email Notification System Setup Guide

## MF-Intel CMS - Automatic Email Notifications

---

## ✅ System Features

### 1. End of Day Reports
Automatic emails when rolling the shift with Drop, Win/Loss, and Hold % data.

### 2. 🚨 Big Player Alarms (NEW!)
Instant email alerts when high-value players are detected on the floor.

**Alarm Triggers:**
- Average Bet > **500,000** OR
- Buy In Amount > **5,000,000**

**Alarm Email Includes:**
- Player Name
- Table Number
- Game Type
- Buy In Amount
- Average Bet
- Timestamp

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create EmailJS Account (Free)

1. Go to **https://www.emailjs.com**
2. Click "Sign Up" (Free - 200 emails/month)
3. Verify your email address

---

### Step 2: Add Email Service

1. In EmailJS dashboard, click **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended)
   - Outlook
   - Yahoo
   - Custom SMTP
4. Follow the connection wizard
5. Copy your **Service ID** (e.g., `service_abc123`)

---

### Step 3: Create Email Template

1. In EmailJS dashboard, click **"Email Templates"**
2. Click **"Create New Template"**
3. Use this template:

**Subject Line:**
```
End of Day Report - {{shift_date}}
```

**Email Content:**
```
Dear Management,

Please find the end of day table performance report for {{shift_date}}.

{{summary}}

Detailed Table Performance (CSV Format):

{{csv_data}}

This report includes:
• Drop amounts for each table
• Win/Loss calculations
• Hold percentages

You can copy the CSV data above into Excel or Google Sheets for further analysis.

---
Best regards,
MF-Intel CMS for Gaming IQ
Automated Casino Management System
```

4. Click **"Save"**
5. Copy your **Template ID** (e.g., `template_xyz789`)

---

### Step 4: Get Public Key

1. In EmailJS dashboard, click **"Account"** (top right)
2. Go to **"API Keys"** section
3. Copy your **Public Key** (e.g., `abcdef123456`)

---

### Step 5: Configure in MF-Intel CMS

1. **Login** to your MF-Intel CMS
2. Go to **Setup** tab → **Users** section
3. Scroll down to **"Email Notifications Setup"**
4. Enter your credentials:
   - Service ID: `service_abc123`
   - Template ID: `template_xyz789`
   - Public Key: `abcdef123456`
5. Check ✅ **"Enable automatic email notifications"**
6. Click **"Save Email Settings"**

---

### Step 6: Add User Email Addresses

1. Still in **Setup** → **Users** tab
2. For each **Owner** or **Management** user:
   - Click **"Edit"** (pencil icon)
   - Fill in **Email Address** (required)
   - Fill in **Phone Number** (required)
   - Click **"Update User"**

---

## 📊 How It Works

### When Rolling the Shift:

1. System calculates performance for ALL closed tables
2. Generates data:
   - **Table Name**
   - **Drop** (total cash collected)
   - **Win/Loss** (actual casino profit)
   - **Hold %** (efficiency percentage)
3. Formats data as CSV
4. Sends email to EACH Owner/Management user
5. Shows confirmation message

---

## 📧 Email Recipients

**Who Receives Emails:**
- ✅ Users with role: **Owner** OR **Management**
- ✅ Users with status: **Active**
- ✅ Users with **email address** configured

**What They Receive:**
- 📊 **End of Day Reports** (when rolling shift)
- 🚨 **Big Player Alarms** (when threshold exceeded)

**Who Does NOT Receive:**
- ❌ Pit Boss, Inspector, Host, Dealer roles
- ❌ Inactive users
- ❌ Users without email addresses

---

## 📋 CSV Format Example

```csv
Table Name,Drop (CFA),Win/Loss (CFA),Hold %
"Blackjack 1",150000,45000,30.00%
"Blackjack 2",200000,55000,27.50%
"Roulette 1",300000,90000,30.00%
"Baccarat 1",500000,145000,29.00%
```

**Can be imported directly into:**
- Microsoft Excel
- Google Sheets
- Apple Numbers
- Any spreadsheet software

---

## 🔄 Fallback System

**If Email Fails:**
- System automatically downloads CSV file
- File saved as: `end_of_day_report_[DATE].csv`
- Contains same data as email would have

**Reasons for Fallback:**
- Email not configured
- No users with email addresses
- EmailJS service error
- Internet connection issue

**You Always Get the Data!**

---

## ✅ Testing the System

### Test End of Day Email:

1. **Add test users** (Setup → Users):
   ```
   Username: testowner
   Password: test123
   Type: Owner
   Email: your.email@gmail.com
   Phone: 555-1234
   ```

2. **Create test data**:
   - Open a few tables (Float tab)
   - Add some drops (Float tab)
   - Close all tables

3. **Roll the shift**:
   - Go to Float tab
   - Click "Roll Shift & Start New Gaming Day"
   - Select tables to reopen
   - Click "Confirm Roll Shift"

4. **Check results**:
   - ✅ Email should arrive in 1-2 minutes
   - ✅ Check spam/junk folder if not in inbox
   - ✅ CSV should auto-download if email failed

### Test Big Player Alarm:

1. **Ensure Owner/Management user has email configured**

2. **Start a rating with high values**:
   - Go to Ratings tab
   - Click "Start New Rating"
   - Enter Average Bet > 500,000 OR Buy In > 5,000,000
   - Submit the rating

3. **Check your email**:
   - ✅ Should receive "Alarm - Big Player" email within seconds
   - ✅ Email includes player details and threshold values

4. **Alternative test: Edit existing rating**:
   - Edit a rating to increase average bet above 500K
   - Should trigger alarm if threshold wasn't met before

---

## ���� Pro Tips

### Tip 1: Whitelist EmailJS
Add `@emailjs.com` to your email whitelist/safe senders to ensure delivery.

### Tip 2: Test Template
Use EmailJS "Test" button in template editor to verify email format.

### Tip 3: Multiple Recipients
System sends individual emails to each Owner/Management user. Each gets their own copy.

### Tip 4: CSV in Excel
Copy CSV data from email → Paste into Excel → Data will auto-format into columns.

### Tip 5: Archive Emails
Create email folder "MF-Intel Reports" to organize daily reports.

### Tip 6: 🚨 Big Player Alarms
- Alarms sent instantly when player starts or rating is edited
- Sent to all Owner/Management users with emails
- Helps management respond quickly to high-value players
- Thresholds: Avg Bet > 500K OR Buy In > 5M

---

## 🔒 Security Notes

**Email Credentials:**
- Stored in browser localStorage only
- Never sent to any server (except EmailJS)
- Can be hidden with "Hide Keys" button

**Best Practices:**
- Use dedicated business email
- Don't share EmailJS credentials
- Regularly change passwords
- Use 2FA on email account if available

---

## 🐛 Troubleshooting

### Email Not Sending?

**Check 1:** Is email enabled?
- Setup → Email Notifications → Box checked?

**Check 2:** Are credentials correct?
- Click "Show Keys" to verify
- No spaces before/after keys

**Check 3:** Do users have emails?
- Setup → Users → Check "Contact Info" column
- Owner/Management must have emails

**Check 4:** Is EmailJS working?
- Login to emailjs.com
- Check usage/quota (200 free/month)

**Check 5:** Check browser console
- Press F12 → Console tab
- Look for error messages

### CSV Downloaded Instead of Email?

**This is normal when:**
- Email not configured (just set it up)
- No Owner/Management with emails
- EmailJS daily limit reached
- Internet connection issue

**This is GOOD:**
- You still get your data!
- Import CSV to Excel/Sheets
- Set up email for next time

---

## 📈 EmailJS Free Tier Limits

**What's Included (FREE):**
- ✅ 200 emails per month
- ✅ Unlimited templates
- ✅ All email services supported
- ✅ 70MB monthly bandwidth

**For Most Casinos:**
- 1 email per day = 30 emails/month
- 10 recipients = 300 emails/month (needs paid plan)
- 3 properties × 1 email = 90 emails/month (within free tier)

**If You Need More:**
- EmailJS Pro: $14/month = 1,000 emails
- EmailJS Enterprise: Custom pricing

---

## 🎯 Success Checklist

After setup, verify:
- [ ] EmailJS account created
- [ ] Email service connected
- [ ] Email template created with correct variables
- [ ] Credentials entered in MF-Intel CMS
- [ ] Email notifications enabled
- [ ] At least one Owner/Management user has email
- [ ] Test email sent successfully
- [ ] Email arrived in inbox (not spam)

---

## 📞 Support

**EmailJS Support:**
- Website: https://www.emailjs.com
- Docs: https://www.emailjs.com/docs
- Support: support@emailjs.com

**Email Variables Used:**
- `{{to_email}}` - Recipient address
- `{{shift_date}}` - Date of shift (e.g., "2/28/2026")
- `{{csv_data}}` - Full CSV table data
- `{{summary}}` - Quick summary (totals, averages)

---

**🎰 Your casino now has automatic end-of-day reporting! 📊✨**

---

**Last Updated:** Current Session  
**System:** MF-Intel CMS for Gaming IQ  
**Feature:** Automatic Email Notifications  
**Status:** ✅ Fully Functional
