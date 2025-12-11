# Android Setup Guide

## Prerequisites
1. Install Android Studio: https://developer.android.com/studio
2. Install Android SDK (API 33+)
3. Set up Android environment variables:
   - `ANDROID_HOME` = `C:\Users\Admin\AppData\Local\Android\Sdk`
   - Add to PATH: `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\tools`

## Quick Setup

### Option 1: Initialize New React Native Project (Recommended)
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

# Run on Android
npm run android
```

### Option 2: Use Existing Mobile Directory
We'll create the Android folder structure manually.

