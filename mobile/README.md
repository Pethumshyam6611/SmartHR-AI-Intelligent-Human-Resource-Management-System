# SmartHR AI - Mobile App

Cross-platform mobile application for SmartHR AI built with React Native. Provides easy clock in/clock out functionality with GPS tracking, biometric authentication, and push notifications.

## Features

### Core Features
- ✅ **GPS-Based Attendance** - Clock in/out with automatic location verification
- ✅ **Biometric Authentication** - Face ID, Touch ID, Fingerprint support
- ✅ **Real-Time Tracking** - Live working hours counter
- ✅ **Attendance History** - View past attendance records
- ✅ **Push Notifications** - Leave approvals, payroll updates
- ✅ **Offline Support** - Works without internet (syncs later)
- ✅ **Cross-Platform** - iOS & Android from single codebase

### Attendance Features
- One-tap clock in/clock out
- GPS location verification (must be within office radius)
- Automatic working hours calculation
- Overtime tracking
- Location accuracy display
- Attendance history with calendar view

### Security Features
- Biometric authentication (Face ID / Touch ID / Fingerprint)
- Secure token storage with Keychain
- Encrypted API communication
- Auto-logout on inactivity

## Tech Stack

- **React Native 0.73** - Cross-platform framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation & routing
- **Zustand** - State management
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client
- **React Native Geolocation** - GPS tracking
- **React Native Touch ID** - Biometric authentication
- **React Native Maps** - Map visualization
- **Notifee** - Push notifications
- **Date-fns** - Date formatting

## Project Structure

```
mobile/
├── src/
│   ├── screens/           # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   └── AttendanceHistoryScreen.tsx
│   ├── navigation/        # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── services/          # Business logic
│   │   ├── api.ts         # API client
│   │   ├── location.ts    # GPS service
│   │   └── biometric.ts   # Biometric auth
│   ├── store/             # State management
│   │   └── authStore.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── utils/             # Utilities
│   └── App.tsx            # Root component
├── android/               # Android native code
├── ios/                   # iOS native code
├── package.json
└── tsconfig.json
```

## Prerequisites

### Development Environment

**Node.js & npm:**
```bash
node --version  # v18+
npm --version   # v9+
```

**React Native CLI:**
```bash
npm install -g react-native-cli
```

**For iOS Development:**
- macOS only
- Xcode 14+ (from App Store)
- CocoaPods: `sudo gem install cocoapods`

**For Android Development:**
- Android Studio
- Android SDK (API 31+)
- JDK 17+
- Android emulator or physical device

## Installation

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

Make sure Android SDK is installed and `ANDROID_HOME` is set:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 4. Configure API Endpoint

The app automatically uses:
- **Development**: `http://10.0.2.2:5000/api` (Android emulator)
- **Production**: Your production API URL

Update `src/services/api.ts` if needed.

## Running the App

### iOS

```bash
# Start Metro bundler
npm start

# Run on iOS (separate terminal)
npm run ios

# Run on specific device
npm run ios -- --device "iPhone 14 Pro"

# Run on physical device
npm run ios -- --device
```

### Android

```bash
# Start Metro bundler
npm start

# Run on Android (separate terminal)
npm run android

# Run on specific device
npm run android -- --deviceId=<device-id>
```

## Building for Production

### iOS

```bash
# Build for release
cd ios
xcodebuild -workspace SmartHR.xcworkspace \
  -scheme SmartHR \
  -configuration Release \
  -archivePath $PWD/build/SmartHR.xcarchive \
  archive

# Or use Xcode:
# 1. Open ios/SmartHR.xcworkspace
# 2. Product > Archive
# 3. Distribute App
```

### Android

```bash
# Generate release APK
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk

# Generate AAB (for Play Store)
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

## Permissions

### Android (android/app/src/main/AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

### iOS (ios/SmartHR/Info.plist)

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>SmartHR needs your location for attendance tracking</string>

<key>NSFaceIDUsageDescription</key>
<string>SmartHR uses Face ID for secure authentication</string>
```

## Features Implementation

### GPS-Based Clock In/Out

```typescript
// Get current location
const location = await locationService.getCurrentLocation();

// Check if within office radius
const { isWithin, distance } = await locationService.isWithinOfficeRadius(
  37.7749,  // Office latitude
  -122.4194, // Office longitude
  100        // Radius in meters
);

if (isWithin) {
  // Clock in
  await apiService.clockIn({
    latitude: location.latitude,
    longitude: location.longitude,
  });
}
```

### Biometric Authentication

```typescript
// Check if available
const isAvailable = await biometricService.isAvailable();

if (isAvailable) {
  // Authenticate
  const authenticated = await biometricService.authenticate();

  if (authenticated) {
    // Proceed with login
  }
}
```

### Real-Time Working Hours

The dashboard displays a live counter of working hours that updates every second:

```typescript
useEffect(() => {
  const timer = setInterval(() => setCurrentTime(new Date()), 1000);
  return () => clearInterval(timer);
}, []);
```

## API Integration

The mobile app shares the same API as the web application. See `src/services/api.ts` for available endpoints:

- `POST /auth/login` - User login
- `POST /attendance/clock-in` - Clock in with GPS
- `POST /attendance/clock-out` - Clock out with GPS
- `GET /attendance/my-attendance` - Get attendance history
- `GET /leaves/my-leaves` - Get leave requests
- `POST /leaves` - Apply for leave

## Testing

### Run Tests

```bash
npm test
```

### Debug Mode

**iOS:**
- Shake device or press `Cmd + D` (simulator)
- Enable Debug JS Remotely

**Android:**
- Shake device or press `Cmd + M` (emulator)
- Enable Debug JS Remotely

### Logs

```bash
# iOS logs
npx react-native log-ios

# Android logs
npx react-native log-android
```

## Troubleshooting

### Common Issues

**Metro bundler not starting:**
```bash
npm start -- --reset-cache
```

**iOS build fails:**
```bash
cd ios
rm -rf Pods
pod install
cd ..
npm run ios
```

**Android build fails:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Location not working:**
- Ensure permissions are granted
- Check if GPS is enabled on device
- For Android emulator, send location via Extended Controls

**Biometric not working:**
- Ensure device has biometric hardware
- Check if biometric is set up in device settings
- For simulators, enable Face ID in Features menu

### Reset Everything

```bash
# Clean all
npm start -- --reset-cache
cd ios && rm -rf Pods && pod install && cd ..
cd android && ./gradlew clean && cd ..
```

## Environment Variables

The app uses the following configuration:

```typescript
// Development (Android Emulator)
API_URL = 'http://10.0.2.2:5000/api';

// Production
API_URL = 'https://api.smarthr.com/api';

// Office Location (configure in backend)
OFFICE_LAT = 37.7749;
OFFICE_LON = -122.4194;
OFFICE_RADIUS = 100; // meters
```

## Deployment

### iOS (App Store)

1. Configure app in App Store Connect
2. Update version in `ios/SmartHR/Info.plist`
3. Build & archive in Xcode
4. Upload to App Store Connect
5. Submit for review

### Android (Play Store)

1. Create app in Google Play Console
2. Update version in `android/app/build.gradle`
3. Generate signed AAB:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
4. Upload to Play Console
5. Submit for review

## Performance Optimization

- Use `React.memo` for expensive components
- Lazy load screens with `React.lazy`
- Optimize images with proper dimensions
- Use `FlatList` for long lists
- Enable Hermes for faster startup (enabled by default)

## Security Best Practices

- ✅ Store sensitive data in Keychain (iOS) / Keystore (Android)
- ✅ Use HTTPS for all API calls
- ✅ Validate SSL certificates
- ✅ Enable ProGuard for Android release builds
- ✅ Obfuscate JavaScript bundle
- ✅ Implement certificate pinning for production

## Contributing

1. Create feature branch
2. Make changes
3. Test on both iOS and Android
4. Submit pull request

## License

MIT License

---

**SmartHR AI Mobile** - Clock in/out made easy! 📱
