# VibeMatch Mobile App Implementation Guide

## Overview

This guide provides step-by-step instructions for setting up and implementing the VibeMatch mobile applications for iOS and Android.

## Step 1: Initialize React Native Project

```bash
npx react-native init VibeMatch --version 0.72.6
cd VibeMatch
```

## Step 2: Install Dependencies

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context
npm install react-native-image-picker react-native-camera react-native-video
npm install react-native-webrtc react-native-audio-recorder-player
npm install react-native-permissions react-native-geolocation-service
npm install @react-native-async-storage/async-storage
npm install react-native-push-notification react-native-in-app-purchase react-native-biometrics
npm install axios
```

## Step 3: iOS Setup

### Install CocoaPods Dependencies

```bash
cd ios
pod install
cd ..
```

### Configure Permissions (ios/VibeMatch/Info.plist)

Add these keys:
```xml
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to take photos for your profile</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone for voice messages and video calls</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photo library to upload photos</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to find matches nearby</string>
```

## Step 4: Android Setup

### Configure Permissions (android/app/src/main/AndroidManifest.xml)

Add these permissions:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## Step 5: Project Structure

Create the following structure:

```
src/
├── screens/
│   ├── Auth/
│   │   ├── LoginScreen.js
│   │   └── OnboardingScreen.js
│   ├── Discover/
│   │   └── DiscoverScreen.js
│   ├── Matches/
│   │   └── MatchesScreen.js
│   ├── Messages/
│   │   ├── MessagesListScreen.js
│   │   └── ChatScreen.js
│   └── Profile/
│       └── ProfileScreen.js
├── components/
│   ├── PhotoUpload.js
│   ├── PhotoVerification.js
│   ├── VideoChat.js
│   ├── VoiceMessage.js
│   └── SafetyActions.js
├── navigation/
│   └── AppNavigator.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── storage.js
└── utils/
    └── helpers.js
```

## Step 6: Key Features Implementation

### Photo Upload
- Use `react-native-image-picker` for photo selection
- Implement multiple photo upload (6-9 photos)
- Add photo reordering functionality

### Photo Verification
- Use `react-native-camera` for selfie capture
- Implement face matching (requires backend API)

### Video Chat
- Use `react-native-webrtc` for video calls
- Implement signaling server connection
- Add call controls (mute, video toggle, end call)

### Voice Messages
- Use `react-native-audio-recorder-player` for recording
- Implement playback controls
- Add waveform visualization

### Safety Features
- Implement block user functionality
- Add report user with reasons
- Store blocked users locally

### Social Media Integration
- Add Instagram linking (requires OAuth)
- Add Spotify linking (requires OAuth)
- Display social media badges on profiles

## Step 7: Navigation Setup

Create bottom tab navigation with:
- Discover
- Matches
- Messages
- Profile

## Step 8: State Management

Use React Context or Redux for:
- User authentication state
- Current user profile
- Matches list
- Conversations
- Subscription status

## Step 9: Testing

### iOS Testing
```bash
npm run ios
```

### Android Testing
```bash
npm run android
```

## Step 10: Build for Production

### iOS
1. Open `ios/VibeMatch.xcworkspace` in Xcode
2. Select "Any iOS Device" as target
3. Product > Archive
4. Upload to App Store Connect

### Android
1. Generate keystore
2. Update `android/app/build.gradle` with signing config
3. Run `cd android && ./gradlew assembleRelease`
4. Upload to Google Play Console

## Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [WebRTC for React Native](https://github.com/react-native-webrtc/react-native-webrtc)

## Notes

- All API endpoints should match the web application
- Use AsyncStorage for local data persistence
- Implement proper error handling and loading states
- Add analytics tracking
- Implement push notifications for matches and messages

