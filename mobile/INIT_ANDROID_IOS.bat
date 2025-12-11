@echo off
echo ========================================
echo VibeMatch Mobile - Android/iOS Setup
echo ========================================
echo.

echo Step 1: Checking prerequisites...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm not found. Please install Node.js first.
    pause
    exit /b 1
)

echo Node.js and npm found!
echo.

echo Step 2: Navigating to parent directory...
cd ..
if not exist "DEMO" (
    echo ERROR: DEMO directory not found in parent.
    pause
    exit /b 1
)

echo Step 3: Initializing React Native project...
echo This will create a new React Native project with native Android/iOS folders.
echo.
set /p confirm="Continue? (Y/N): "
if /i not "%confirm%"=="Y" (
    echo Setup cancelled.
    pause
    exit /b 0
)

echo.
echo Creating React Native project...
call npx react-native@latest init VibeMatchMobile --version 0.72.6

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create React Native project.
    pause
    exit /b 1
)

echo.
echo Step 4: Copying source code...
if exist "VibeMatchMobile" (
    echo Copying src folder...
    xcopy /E /I /Y "DEMO\mobile\src" "VibeMatchMobile\src"
    
    echo Copying configuration files...
    copy /Y "DEMO\mobile\package.json" "VibeMatchMobile\package.json"
    copy /Y "DEMO\mobile\index.js" "VibeMatchMobile\index.js"
    copy /Y "DEMO\mobile\app.json" "VibeMatchMobile\app.json"
    copy /Y "DEMO\mobile\babel.config.js" "VibeMatchMobile\babel.config.js"
    copy /Y "DEMO\mobile\metro.config.js" "VibeMatchMobile\metro.config.js"
    
    echo.
    echo Step 5: Installing dependencies...
    cd VibeMatchMobile
    call npm install
    
    if %ERRORLEVEL% NEQ 0 (
        echo WARNING: npm install had errors. Please check manually.
    )
    
    echo.
    echo ========================================
    echo Setup Complete!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Set up Android Studio and Android SDK
    echo 2. Set ANDROID_HOME environment variable
    echo 3. Create an Android Virtual Device (AVD)
    echo 4. Run: npm run android
    echo.
    echo For iOS (Mac only):
    echo 1. Install Xcode from App Store
    echo 2. Run: cd ios ^&^& pod install
    echo 3. Run: npm run ios
    echo.
) else (
    echo ERROR: VibeMatchMobile directory not created.
    pause
    exit /b 1
)

pause

