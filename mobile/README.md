# SmartHR AI Mobile

React Native mobile client for SmartHR AI.

## Current Scope

The mobile app currently focuses on:

- Login
- Basic dashboard view
- Attendance history view
- API integration with backend auth and attendance endpoints

## Stack

- React Native
- TypeScript
- Zustand
- Axios

## Setup

```bash
cd mobile
npm install
```

## Run

```bash
# Metro
npm start

# Android
npm run android

# iOS (macOS only)
npm run ios
```

## API Base URL

Check `mobile/src/services/api.ts` for environment-specific base URLs.

Backend should be running at `http://localhost:5000` (or reachable host from emulator/device).

## Folder Highlights

- `src/screens` - Login, dashboard, attendance history screens
- `src/services` - API, location, biometric utility services
- `src/store` - Auth store
- `src/navigation` - Navigator setup

## Important Note

Some advanced features described in old docs (full push notification workflows, complete offline sync, and full leave/payroll management in mobile UI) are not yet fully implemented in the current mobile app screens.
