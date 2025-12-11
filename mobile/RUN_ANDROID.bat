@echo off
echo ========================================
echo Running VibeMatch on Android
echo ========================================
echo.

if not exist "android" (
    echo ERROR: android folder not found!
    echo Please run INIT_ANDROID_IOS.bat first.
    pause
    exit /b 1
)

echo Checking for Android device/emulator...
adb devices

echo.
echo Starting Metro bundler...
start "Metro Bundler" cmd /k "npm start"

timeout /t 3 /nobreak >nul

echo.
echo Running on Android...
call npm run android

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to run on Android!
    echo.
    echo Troubleshooting:
    echo 1. Make sure Android emulator is running OR
    echo 2. Physical device is connected with USB debugging enabled
    echo 3. Run: adb devices (should show your device)
    echo 4. Check ANDROID_HOME is set correctly
    echo.
    pause
    exit /b 1
)

echo.
echo App should be running on your Android device/emulator!
pause

