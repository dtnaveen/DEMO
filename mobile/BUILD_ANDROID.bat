@echo off
echo ========================================
echo Building VibeMatch for Android
echo ========================================
echo.

if not exist "android" (
    echo ERROR: android folder not found!
    echo Please run INIT_ANDROID_IOS.bat first or initialize React Native project.
    pause
    exit /b 1
)

echo Step 1: Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed.
    pause
    exit /b 1
)

echo.
echo Step 2: Starting Metro bundler in background...
start "Metro Bundler" cmd /k "npm start"

echo.
echo Step 3: Building Android APK...
cd android
call gradlew assembleRelease

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Android build failed!
    echo.
    echo Troubleshooting:
    echo 1. Make sure Android Studio is installed
    echo 2. Set ANDROID_HOME environment variable
    echo 3. Install Android SDK (API 33+)
    echo 4. Run: gradlew clean
    echo.
    pause
    exit /b 1
)

cd ..
echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo APK location:
echo android\app\build\outputs\apk\release\app-release.apk
echo.
echo To install on device:
echo adb install android\app\build\outputs\apk\release\app-release.apk
echo.
pause

