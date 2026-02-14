@echo off
REM BizAI Mobile App Build Script for Windows
REM This script automates the process of building and deploying the APK

setlocal enabledelayedexpansion

echo.
echo ================================
echo BizAI Mobile App Build Script
echo ================================
echo.

REM Step 1: Install dependencies
echo [1/6] Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Error installing dependencies
    exit /b 1
)
echo Dependencies installed successfully
echo.

REM Step 2: Build frontend
echo [2/6] Building frontend...
call npm run build
if errorlevel 1 (
    echo Error building frontend
    exit /b 1
)
echo Frontend built successfully
echo.
cd ..

REM Step 3: Check if Capacitor is initialized
echo [3/6] Checking Capacitor setup...
if not exist "android" (
    echo Android platform not found. Initializing Capacitor...
    call npx cap init
    call npx cap add android
)
echo Capacitor configured
echo.

REM Step 4: Sync with Capacitor
echo [4/6] Syncing with Capacitor...
call npx cap sync android
if errorlevel 1 (
    echo Error syncing Capacitor
    exit /b 1
)
echo Synced successfully
echo.

REM Step 5: Build project
echo [5/6] Building Android project...
cd android
call gradlew.bat build
if errorlevel 1 (
    echo Error building Android project
    exit /b 1
)
echo Android project built
echo.

REM Step 6: Build debug APK
echo [6/6] Building debug APK...
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo Error building debug APK
    exit /b 1
)
echo Debug APK created successfully
echo.

cd ..

REM Show completion message
set APK_PATH=android\app\build\outputs\apk\debug\app-debug.apk
if exist "%APK_PATH%" (
    echo.
    echo ================================
    echo   BUILD SUCCESSFUL!
    echo ================================
    echo.
    echo APK Location: %APK_PATH%
    echo.
    echo Install options:
    echo - adb install "%APK_PATH%"
    echo - Or open in Android Studio and run on emulator/device
    echo.
) else (
    echo.
    echo APK not found at expected location
    echo Check build output above for errors
    echo.
)

pause
