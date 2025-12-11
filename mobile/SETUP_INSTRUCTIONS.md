# VibeMatch Mobile App Setup Instructions

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **React Native CLI** - Install globally: `npm install -g react-native-cli`
3. **For iOS (Mac only):**
   - Xcode 14+ from Mac App Store
   - CocoaPods: `sudo gem install cocoapods`
4. **For Android:**
   - Android Studio with Android SDK
   - Java Development Kit (JDK) 11+
   - Android SDK Platform 33+
   - Android Virtual Device (AVD) or physical device

## Windows PowerShell Execution Policy

If you encounter script execution errors, run this in PowerShell (as Administrator):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Setup Steps

### Option 1: Initialize Fresh React Native Project (Recommended)

Since we have the source code structure ready, you need to initialize a React Native project to get the native iOS/Android folders:

1. **Navigate to parent directory:**
   ```powershell
   cd ..
   ```

2. **Initialize React Native project:**
   ```powershell
   npx react-native@latest init VibeMatchMobile --version 0.72.6
   ```

3. **Copy our source code:**
   ```powershell
   Copy-Item -Path "DEMO\mobile\src\*" -Destination "VibeMatchMobile\src\" -Recurse -Force
   Copy-Item -Path "DEMO\mobile\package.json" -Destination "VibeMatchMobile\package.json" -Force
   Copy-Item -Path "DEMO\mobile\index.js" -Destination "VibeMatchMobile\index.js" -Force
   Copy-Item -Path "DEMO\mobile\app.json" -Destination "VibeMatchMobile\app.json" -Force
   ```

4. **Navigate to new project:**
   ```powershell
   cd VibeMatchMobile
   ```

5. **Install dependencies:**
   ```powershell
   npm install
   ```

6. **For iOS (Mac only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

### Option 2: Use Existing Mobile Directory (Manual Setup)

If you want to use the existing `mobile/` directory:

1. **Install dependencies:**
   ```powershell
   cd mobile
   npm install
   ```

2. **Create React Native native folders manually:**
   - You'll need to run `react-native init` in a temporary location and copy the `ios/` and `android/` folders
   - Or use React Native CLI to generate them

## Running the App

### iOS (Mac only):
```bash
npm run ios
```

### Android:
```bash
npm run android
```

Make sure you have:
- Android emulator running, OR
- Physical Android device connected with USB debugging enabled

### Start Metro Bundler:
```bash
npm start
```

## Troubleshooting

### Windows Execution Policy Error:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
```

### Android Build Issues:
- Ensure Android SDK is properly installed
- Check `ANDROID_HOME` environment variable
- Run `android` command to open SDK Manager

### iOS Build Issues (Mac):
- Ensure Xcode Command Line Tools are installed: `xcode-select --install`
- Run `pod install` in `ios/` directory
- Open `ios/VibeMatchMobile.xcworkspace` (not .xcodeproj) in Xcode

### Metro Bundler Issues:
```bash
npm start -- --reset-cache
```

## Project Structure

```
mobile/
├── src/
│   ├── App.js
│   ├── screens/          # All screen components
│   ├── components/      # Reusable components
│   ├── navigation/       # Navigation setup
│   ├── context/         # React Context providers
│   ├── services/        # API services
│   └── config/          # Configuration files
├── ios/                  # iOS native project (after init)
├── android/              # Android native project (after init)
├── package.json
├── index.js
└── app.json
```

## Next Steps

1. Connect to your backend API by updating `src/config/api.js`
2. Test authentication flow
3. Test core features (Discover, Matches, Messages)
4. Build for production (see README.md)

## Notes

- The app is configured to connect to `http://localhost:3000/api` in development
- Update `API_BASE_URL` in `src/config/api.js` for production
- All screens are implemented and ready to use
- Navigation is fully set up with bottom tabs and stack navigation

