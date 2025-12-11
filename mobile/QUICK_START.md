# Quick Start Guide - VibeMatch Mobile

## ⚡ Fastest Setup (Windows)

### Step 1: Fix PowerShell Execution Policy
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
```

### Step 2: Initialize React Native Project
```powershell
# From DEMO directory
cd ..
npx react-native@latest init VibeMatchMobile --version 0.72.6
```

### Step 3: Copy Our Code
```powershell
# Copy source code
Copy-Item -Path "DEMO\mobile\src" -Destination "VibeMatchMobile\" -Recurse -Force

# Copy config files
Copy-Item -Path "DEMO\mobile\package.json" -Destination "VibeMatchMobile\package.json" -Force
Copy-Item -Path "DEMO\mobile\index.js" -Destination "VibeMatchMobile\index.js" -Force
Copy-Item -Path "DEMO\mobile\app.json" -Destination "VibeMatchMobile\app.json" -Force
Copy-Item -Path "DEMO\mobile\babel.config.js" -Destination "VibeMatchMobile\babel.config.js" -Force
Copy-Item -Path "DEMO\mobile\metro.config.js" -Destination "VibeMatchMobile\metro.config.js" -Force
```

### Step 4: Install Dependencies
```powershell
cd VibeMatchMobile
npm install
```

### Step 5: Run on Android
```powershell
# Make sure Android emulator is running or device is connected
npm run android
```

## 📱 For iOS (Mac Only)

```bash
cd ios
pod install
cd ..
npm run ios
```

## ✅ What's Included

- ✅ Complete navigation (Stack + Bottom Tabs)
- ✅ Authentication screens (Login, Onboarding)
- ✅ Core screens (Discover, Matches, Messages, Profile)
- ✅ Context providers (Auth, User)
- ✅ API service layer
- ✅ All dependencies configured

## 🔧 Configuration

Update API endpoint in `src/config/api.js`:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://api.vibematch.com';  // Production
```

## 🐛 Common Issues

**"Scripts are disabled"**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
```

**"Android build failed"**
- Install Android Studio
- Set up Android SDK
- Create an AVD (Android Virtual Device)

**"Metro bundler won't start"**
```bash
npm start -- --reset-cache
```

