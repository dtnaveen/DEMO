# 🚀 VibeMatch Mobile - Build Instructions

## Quick Start

### Option 1: Automated Setup (Windows)
1. **Double-click `INIT_ANDROID_IOS.bat`** - This will:
   - Create a new React Native project with native folders
   - Copy all your source code
   - Install dependencies

2. **Set up Android Studio**:
   - Download from https://developer.android.com/studio
   - Install Android SDK (API 33+)
   - Set `ANDROID_HOME` environment variable

3. **Run on Android**:
   - Double-click `RUN_ANDROID.bat`
   - Or run: `npm run android`

### Option 2: Manual Setup

#### For Android:
```powershell
# 1. Navigate to parent directory
cd ..

# 2. Create React Native project
npx react-native@latest init VibeMatchMobile --version 0.72.6

# 3. Copy source code
Copy-Item -Path "DEMO\mobile\src" -Destination "VibeMatchMobile\src" -Recurse -Force
Copy-Item -Path "DEMO\mobile\package.json" -Destination "VibeMatchMobile\package.json" -Force
Copy-Item -Path "DEMO\mobile\index.js" -Destination "VibeMatchMobile\index.js" -Force
Copy-Item -Path "DEMO\mobile\app.json" -Destination "VibeMatchMobile\app.json" -Force
Copy-Item -Path "DEMO\mobile\babel.config.js" -Destination "VibeMatchMobile\babel.config.js" -Force
Copy-Item -Path "DEMO\mobile\metro.config.js" -Destination "VibeMatchMobile\metro.config.js" -Force

# 4. Install dependencies
cd VibeMatchMobile
npm install

# 5. Run on Android
npm run android
```

#### For iOS (Mac only):
```bash
# 1. Follow Android steps 1-4 above

# 2. Install CocoaPods
sudo gem install cocoapods

# 3. Install iOS dependencies
cd ios
pod install
cd ..

# 4. Run on iOS
npm run ios
```

## 📱 Building for Production

### Android APK
```powershell
# Build release APK
npm run build:android

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### Android AAB (Google Play)
```powershell
# Build release AAB
npm run build:android:bundle

# AAB location: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS Archive (Mac only)
1. Open `ios/VibeMatchMobile.xcworkspace` in Xcode
2. Select "Any iOS Device" as target
3. Product → Archive
4. Distribute App → App Store Connect

## 🔧 Configuration

### API Endpoint
Edit `src/config/api.js`:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'  // Android emulator
  : 'https://api.vibematch.com';  // Production
```

### App Name
Edit `app.json`:
```json
{
  "name": "VibeMatch",
  "displayName": "VibeMatch"
}
```

## 🐛 Troubleshooting

### Android Build Fails
- Check `ANDROID_HOME` environment variable
- Run `npm run clean:android`
- Delete `android/.gradle` folder
- Rebuild

### iOS Build Fails (Mac)
- Run `npm run clean:ios`
- Open Xcode and clean build folder
- Rebuild

### Metro Bundler Issues
```powershell
npm start -- --reset-cache
```

## ✅ Checklist

- [ ] Node.js 18+ installed
- [ ] React Native project initialized
- [ ] Source code copied
- [ ] Dependencies installed (`npm install`)
- [ ] Android Studio installed (for Android)
- [ ] Android SDK (API 33+) installed
- [ ] ANDROID_HOME environment variable set
- [ ] Android emulator created OR physical device connected
- [ ] (Mac only) Xcode installed
- [ ] (Mac only) CocoaPods installed
- [ ] (Mac only) `pod install` completed

## 📚 Additional Resources

- React Native Docs: https://reactnative.dev/docs/getting-started
- Android Setup: https://reactnative.dev/docs/environment-setup?os=windows
- iOS Setup: https://reactnative.dev/docs/environment-setup?os=macos

