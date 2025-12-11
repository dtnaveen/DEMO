# VibeMatch Mobile Apps

Native mobile applications for iOS and Android built with React Native.

## Project Structure

```
mobile/
├── ios/              # iOS native project
├── android/          # Android native project
├── src/              # Shared React Native code
│   ├── screens/      # Screen components
│   ├── components/  # Reusable components
│   ├── navigation/  # Navigation setup
│   ├── services/    # API services
│   └── utils/       # Utilities
├── package.json      # Dependencies
└── README.md         # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- React Native CLI: `npm install -g react-native-cli`
- iOS: Xcode 14+ (Mac only)
- Android: Android Studio with Android SDK

### Installation

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **iOS Setup (Mac only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Android Setup:**
   - Open Android Studio
   - Install Android SDK (API 33+)
   - Set up Android emulator or connect physical device

### Running the Apps

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## Features Implemented

- ✅ User authentication
- ✅ Profile management
- ✅ Photo uploads (multiple photos)
- ✅ Photo verification
- ✅ Discover page with filters
- ✅ Matching algorithm
- ✅ Messaging with voice messages
- ✅ Video chat
- ✅ Safety features (block/report)
- ✅ Social media integration
- ✅ Premium subscription tiers

## Native Features

### iOS
- Camera access for photos
- Push notifications
- In-app purchases
- Biometric authentication
- Location services

### Android
- Camera access for photos
- Push notifications
- In-app purchases
- Biometric authentication
- Location services

## API Integration

The mobile apps connect to the same backend API as the web application. Update the API base URL in `src/config/api.js`.

## Building for Production

### iOS
```bash
cd ios
xcodebuild -workspace VibeMatch.xcworkspace -scheme VibeMatch -configuration Release
```

### Android
```bash
cd android
./gradlew assembleRelease
```

## Testing

```bash
npm test
```

## Deployment

### iOS (App Store)
1. Archive in Xcode
2. Upload to App Store Connect
3. Submit for review

### Android (Google Play)
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Submit for review

