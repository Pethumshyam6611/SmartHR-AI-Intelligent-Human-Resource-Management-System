# SmartHR AI - Mobile App Quick Start Guide

## What is SmartHR Mobile?

SmartHR Mobile is a cross-platform mobile application (iOS & Android) that allows employees to:

- ⏰ **Clock in/out** with GPS verification
- 📍 **Track location** automatically
- 👆 **Biometric login** (Face ID / Touch ID / Fingerprint)
- 📊 **View attendance** history
- 📅 **Apply for leaves** on the go
- 💰 **Check payroll** information
- 🔔 **Receive notifications** for approvals

## Key Features

### 1. One-Tap Clock In/Out

The main screen features a large, easy-to-tap button for clocking in and out:

- **Blue Button** = Clock In
- **Red Button** = Clock Out
- **Real-time counter** shows current working hours
- **GPS verification** ensures you're at the office

### 2. GPS-Based Attendance

The app automatically:
- Gets your current location
- Calculates distance from office
- Only allows clock in/out within 100 meters of office
- Shows your exact distance if you're too far

### 3. Biometric Authentication

Secure and fast login using:
- **iOS**: Face ID or Touch ID
- **Android**: Fingerprint scanner
- **Fallback**: Password login

### 4. Live Working Hours

Dashboard shows:
- Current time (updates every second)
- Clock in time
- Clock out time (if applicable)
- Total working hours
- Overtime hours

### 5. Attendance History

View past attendance with:
- Calendar dates
- Clock in/out times
- Working hours per day
- Overtime tracking
- Monthly summaries

## Installation

### For Employees

**iOS (iPhone/iPad):**
1. Go to App Store
2. Search "SmartHR AI"
3. Tap "Get" and install
4. Open app and login with your credentials

**Android:**
1. Go to Google Play Store
2. Search "SmartHR AI"
3. Tap "Install"
4. Open app and login

### For Developers

See `mobile/README.md` for full development setup.

Quick start:
```bash
cd mobile
npm install

# iOS
npm run ios

# Android
npm run android
```

## How to Use

### First Time Setup

1. **Download & Install** the app from App Store / Play Store
2. **Open** the SmartHR app
3. **Login** with your company email and password
   - Demo: `john.doe@smarthr.com` / `emp123`
4. **Allow Permissions**:
   - Location access (for attendance)
   - Biometric authentication (optional)
   - Notifications (for updates)

### Clock In (Arriving at Work)

1. Open the SmartHR app
2. Ensure you're **within 100 meters** of the office
3. Tap the **blue "Clock In"** button
4. App will:
   - Get your location
   - Verify you're at the office
   - Record clock in time
   - Show confirmation

**What if I'm too far?**
- The app will show: "You are 250m away from the office. Please be within 100m to clock in."
- Walk closer to the office and try again

### Clock Out (Leaving Work)

1. Open the SmartHR app
2. Tap the **red "Clock Out"** button
3. Confirm by tapping "Clock Out" again
4. App will:
   - Record clock out time
   - Calculate total working hours
   - Update your attendance record

### View Today's Attendance

The dashboard automatically shows:
- **Current Time**: Live clock
- **Clock In**: When you arrived
- **Clock Out**: When you left (if clocked out)
- **Working Time**: Hours worked today (updates live)

### View Attendance History

1. Tap **"Attendance"** tab at the bottom
2. See list of all your attendance records
3. Each record shows:
   - Date
   - Clock in/out times
   - Total working hours
   - Overtime (if any)

### Enable Biometric Login

1. Login with email/password first
2. Go to **Settings** tab
3. Enable **"Use Biometrics"**
4. Next time, use Face ID / Touch ID / Fingerprint to login

## Screens Overview

### 1. Login Screen
- Email input
- Password input
- "Login" button
- "Login with Biometrics" button
- Demo credentials shown at bottom

### 2. Dashboard Screen
- Welcome message with your name
- **Large clock display** with current time
- **Clock In/Out button** (primary action)
- Today's attendance summary
- **Quick Actions** cards:
  - View History
  - Apply Leave
  - Payroll
  - Team

### 3. Attendance History Screen
- List of all attendance records
- Filterable by date range
- Shows working hours and overtime
- Export functionality (coming soon)

### 4. Bottom Navigation
- Dashboard (home icon)
- Attendance (clock icon)
- Leaves (calendar icon)
- Payroll (dollar icon)

## Permissions Explained

### Location Permission
**Why needed?**
- To verify you're at the office when clocking in/out
- Prevents fake check-ins from home

**When used?**
- Only when you tap Clock In or Clock Out
- Not tracked continuously in background

**How to enable:**
- iOS: Settings > SmartHR > Location > While Using App
- Android: Settings > Apps > SmartHR > Permissions > Location

### Biometric Permission
**Why needed?**
- Fast and secure login
- No need to type password every time

**When used?**
- When you open the app (if enabled)
- Optional - you can still use password

**How to enable:**
- iOS: Automatically prompted when needed
- Android: Settings > Apps > SmartHR > Permissions > Biometric

### Notification Permission
**Why needed?**
- Get notified when leave is approved
- Receive payroll updates
- Important HR announcements

**When used?**
- App sends push notifications for important events

**How to enable:**
- iOS: Settings > SmartHR > Notifications > Allow
- Android: Settings > Apps > SmartHR > Notifications > On

## Troubleshooting

### "Location permission denied"
**Solution:**
1. Go to phone Settings
2. Find SmartHR app
3. Enable Location permission
4. Restart the app

### "You are too far from office"
**Solution:**
- Ensure your GPS is enabled
- Walk closer to the office (within 100m)
- Check if office location is configured correctly
- Contact HR if issue persists

### "Clock In button not working"
**Check:**
- ✅ Internet connection is active
- ✅ Location services are enabled
- ✅ You're within office radius
- ✅ You haven't already clocked in today

### "App crashes on launch"
**Solution:**
1. Force close the app
2. Clear app cache:
   - iOS: Delete and reinstall
   - Android: Settings > Apps > SmartHR > Storage > Clear Cache
3. Restart your phone
4. Reinstall if needed

### "Biometric login not working"
**Check:**
- ✅ Biometric is set up on your device
- ✅ Permission is granted to SmartHR
- ✅ You've logged in with password at least once
- ✅ Feature is enabled in Settings

### "Can't see attendance history"
**Solution:**
- Pull down to refresh the list
- Check internet connection
- Ensure you're logged in
- Contact IT support if no data appears

## Tips & Best Practices

### ✅ Do's
- Clock in as soon as you arrive
- Keep location services on while at office
- Enable biometric login for quick access
- Review your attendance history regularly
- Report any issues to HR immediately

### ❌ Don'ts
- Don't clock in from home (GPS will detect)
- Don't share your login credentials
- Don't ask colleagues to clock in/out for you
- Don't disable location permissions
- Don't forget to clock out when leaving

## Support

### Need Help?

**Technical Issues:**
- Email: support@smarthr.com
- Phone: 1-800-SMARTHR
- In-app: Settings > Help & Support

**HR-Related Questions:**
- Contact your HR manager
- Email: hr@yourcompany.com

**Report a Bug:**
- In-app: Settings > Report Issue
- Include screenshots if possible

## Privacy & Security

### Your Data is Safe
- ✅ Location tracked **only** during clock in/out
- ✅ No background location tracking
- ✅ Biometric data stays on your device
- ✅ Encrypted communication with servers
- ✅ Secure token-based authentication

### What We Track
- Clock in/out times
- GPS coordinates (only at clock in/out)
- Working hours
- Attendance records

### What We DON'T Track
- Your location throughout the day
- Your movements
- Your personal activities
- Anything outside work hours

## Updates

The app automatically updates when new versions are available on App Store / Play Store.

### Version History
- **v1.0.0** - Initial release
  - Clock in/out with GPS
  - Biometric authentication
  - Attendance history
  - Dashboard with live counter

## Frequently Asked Questions

**Q: Can I clock in without internet?**
A: No, internet connection is required to verify and record attendance.

**Q: What if I forget to clock out?**
A: Contact your HR manager to manually add clock out time.

**Q: Can I edit my attendance?**
A: No, only HR managers can edit attendance records.

**Q: How accurate is the GPS?**
A: Typically accurate to within 5-10 meters.

**Q: Can I use the app on multiple devices?**
A: Yes, login on any device with your credentials.

**Q: What if my phone battery dies?**
A: Clock out manually when it's charged, or contact HR.

---

**Enjoy hassle-free attendance tracking with SmartHR Mobile!** 📱✨
