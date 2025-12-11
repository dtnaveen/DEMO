# Complete Android & iOS Setup Guide

## 🚀 Quick Start - Initialize React Native Project

Since the `mobile/` directory has React Native source code but is missing native folders, we need to initialize a proper React Native project.

### Step 1: Create React Native Project

**Option A: In a new directory (Recommended)**
```powershell
# Navigate to parent directory
cd ..

# Create new React Native project
npx react-native@latest init VibeMatchMobile --version 0.72.6

# Copy our source code
Copy-Item -Path "DEMO\mobile\src" -Destination "VibeMatchMobile\src" -Recurse -Force
Copy-Item -Path "DEMO\mobile\package.json" -Destination "VibeMatchMobile\package.json" -Force
Copy-Item -Path "DEMO\mobile\index.js" -Destination "VibeMatchMobile\index.js" -Force
Copy-Item -Path "DEMO\mobile\app.json" -Destination "VibeMatchMobile\app.json" -Force
Copy-Item -Path "DEMO\mobile\babel.config.js" -Destination "VibeMatchMobile\babel.config.js" -Force
Copy-Item -Path "DEMO\mobile\metro.config.js" -Destination "VibeMatchMobile\metro.config.js" -Force

# Install dependencies
cd VibeMatchMobile
npm install
```

**Option B: Use Capacitor (Wrap Next.js Web App)**
This wraps your existing Next.js web app as a native mobile app.

```powershell
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# Initialize Capacitor
npx cap init

# Add Android
npx cap add android

# Add iOS (Mac only)
npx cap add ios

# Build Next.js app
npm run build

# Copy web build to Capacitor
npx cap copy

# Open in Android Studio
npx cap open android

# Open in Xcode (Mac only)
npx cap open ios
```

## 📱 Android Setup

### Prerequisites
1. **Install Android Studio**: https://developer.android.com/studio
2. **Install Android SDK**:
   - Open Android Studio
   - Go to Tools → SDK Manager
   - Install Android SDK (API 33+)
   - Install Android SDK Platform-Tools

3. **Set Environment Variables**:
   ```powershell
   # Add to System Environment Variables
   ANDROID_HOME = C:\Users\Admin\AppData\Local\Android\Sdk
   
   # Add to PATH:
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

4. **Create Android Virtual Device (AVD)**:
   - Open Android Studio
   - Go to Tools → Device Manager
   - Click "Create Device"
   - Select a device (e.g., Pixel 5)
   - Select a system image (API 33+)
   - Finish setup

### Build and Run Android

```powershell
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android

# Or build release APK
cd android
.\gradlew assembleRelease
```

## 🍎 iOS Setup (Mac Only)

### Prerequisites
1. **Install Xcode**: From Mac App Store
2. **Install CocoaPods**:
   ```bash
   sudo gem install cocoapods
   ```

3. **Install iOS Dependencies**:
   ```bash
   cd ios
   pod install
   cd ..
   ```

### Build and Run iOS

```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios

# Or build for device
# Open ios/VibeMatchMobile.xcworkspace in Xcode
# Select your device and click Run
```

## 🔧 Configuration

### Update API Endpoint
Edit `mobile/src/config/api.js`:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'  // Android emulator
  : 'https://api.vibematch.com';  // Production
```

For iOS simulator, use `http://localhost:3000/api`

### Update App Name and Package
Edit `mobile/app.json`:
```json
{
  "name": "VibeMatch",
  "displayName": "VibeMatch"
}
```

Edit `android/app/build.gradle`:
```gradle
applicationId "com.vibematch"
```

## 📦 Building for Production

### Android APK
```powershell
cd android
.\gradlew assembleRelease
# APK will be in: android/app/build/outputs/apk/release/app-release.apk
```

### Android AAB (for Google Play)
```powershell
cd android
.\gradlew bundleRelease
# AAB will be in: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS Archive (Mac only)
1. Open `ios/VibeMatchMobile.xcworkspace` in Xcode
2. Select "Any iOS Device" as target
3. Product → Archive
4. Distribute App → App Store Connect

## 🐛 Troubleshooting

### Android Build Fails
- Check `ANDROID_HOME` is set correctly
- Run `.\gradlew clean` in `android/` folder
- Delete `android/.gradle` and rebuild

### iOS Build Fails
- Run `pod install` in `ios/` folder
- Clean build folder in Xcode: Product → Clean Build Folder
- Delete `ios/Pods` and `ios/Podfile.lock`, then `pod install`

### Metro Bundler Issues
```powershell
npm start -- --reset-cache
```

### Port Already in Use
```powershell
# Kill process on port 8081
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

## ✅ Verification Checklist

- [ ] Android Studio installed
- [ ] Android SDK (API 33+) installed
- [ ] ANDROID_HOME environment variable set
- [ ] Android emulator created and running
- [ ] `npm install` completed successfully
- [ ] `npm run android` runs successfully
- [ ] App opens on Android emulator
- [ ] (Mac only) Xcode installed
- [ ] (Mac only) CocoaPods installed
- [ ] (Mac only) `pod install` completed
- [ ] (Mac only) `npm run ios` runs successfully

