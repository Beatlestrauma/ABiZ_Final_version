# BizAI Mobile App - Pre-Build Checklist

**Date:** February 4, 2026  
**Status:** ✅ Ready to Build  
**Next Action:** Run `build-apk.bat` or `./build-apk.sh`

---

## ✅ SETUP VERIFICATION

### System Requirements
- [ ] Windows 10+ / Mac / Linux
- [ ] At least 10 GB free disk space
- [ ] 8 GB RAM minimum (16 GB recommended)
- [ ] Stable internet connection

### Required Software
- [ ] Java JDK 11+ installed
  - Verify: `java -version` (should be 11+)
- [ ] Node.js 16+ installed
  - Verify: `node --version`
- [ ] npm installed
  - Verify: `npm --version`
- [ ] Android SDK installed
  - Verify: `adb devices` (should list devices/emulators)

### Optional but Recommended
- [ ] Android Studio installed
- [ ] Android device connected (or emulator running)
- [ ] USB Debugging enabled on device

---

## 📁 PROJECT FILES

### Verify Files Created/Modified

#### New Mobile Files ✅
- [ ] `capacitor.config.ts` - Capacitor configuration
- [ ] `AndroidManifest.xml` - Android permissions
- [ ] `frontend/src/capacitor-init.js` - Mobile initialization
- [ ] `frontend/src/mobile-styles.css` - Mobile CSS
- [ ] `frontend/src/utils/MobileConfig.ts` - Mobile utilities

#### Build Scripts ✅
- [ ] `build-apk.bat` - Windows build script
- [ ] `build-apk.sh` - Mac/Linux build script

#### Documentation Files ✅
- [ ] `VISUAL_BUILD_GUIDE.md` - Visual guide
- [ ] `QUICK_START_APK.md` - Quick reference
- [ ] `MOBILE_SETUP.md` - Detailed setup
- [ ] `MOBILE_COMMANDS.md` - All commands
- [ ] `MOBILE_CONVERSION_SUMMARY.md` - Summary
- [ ] `MOBILE_DOCUMENTATION_INDEX.md` - Index
- [ ] `PRE_BUILD_CHECKLIST.md` - This file

#### Updated Files ✅
- [ ] `frontend/package.json` - Mobile scripts added
- [ ] `frontend/index.html` - Mobile meta tags added
- [ ] `frontend/src/main.jsx` - Capacitor init added
- [ ] `frontend/src/App.jsx` - Mobile config added
- [ ] `frontend/src/index.css` - Mobile styles imported

---

## 🔧 CONFIGURATION

### Code Configuration
- [ ] Backend API URL checked in code
  - Location: `frontend/src/context/NewsContext.jsx`
  - Change `localhost:4000` to actual backend domain
- [ ] Firebase config updated (if applicable)
- [ ] Environment variables configured (if needed)

### Mobile Configuration
- [ ] `capacitor.config.ts` reviewed
  - App ID: `com.bizai.app` ✅
  - App name: `BizAI` ✅
  - Web directory: `frontend/dist` ✅
- [ ] `AndroidManifest.xml` reviewed
  - Required permissions included ✅
  - App metadata correct ✅

---

## 📱 DEVICE SETUP

### Android Device (if available)
- [ ] Device connected via USB
- [ ] Developer mode enabled
- [ ] USB Debugging enabled
- [ ] Device recognized: `adb devices`

### Android Emulator (if no device)
- [ ] Emulator created in Android Studio
- [ ] Emulator running
- [ ] Recognized: `adb devices`

### Alternative (Email APK)
- [ ] Device has file manager
- [ ] Can install from unknown sources
- [ ] Can receive APK via email

---

## 🎯 PRE-BUILD

### System Cleanup
- [ ] Close Android Studio (if open)
- [ ] Close emulators (if open)
- [ ] Restart ADB: 
  ```bash
  adb kill-server
  adb start-server
  ```
- [ ] Verify ADB works: `adb devices`

### Frontend Ready
- [ ] All frontend code finalized
- [ ] No syntax errors in React code
- [ ] API endpoints updated
- [ ] Authentication configured

### Backend Ready
- [ ] Backend server available
- [ ] API endpoints working
- [ ] CORS configured
- [ ] Database connected

---

## 🚀 BUILD READINESS

### Scripts Location
- [ ] `build-apk.bat` located (Windows users)
- [ ] `build-apk.sh` located (Mac/Linux users)
- [ ] Scripts have execute permission

### Storage Space
- [ ] At least 10 GB free disk space
- [ ] Android SDK location has space
- [ ] Temp directory has space

### Time Allocation
- [ ] First-time: 20-35 minutes available
  - SDK setup: 10-20 min
  - App build: 5-10 min
  - Verification: 5 min
- [ ] Subsequent: 5-10 minutes available

---

## 📋 BUILD DAY CHECKLIST

### Morning Of
- [ ] System restarted
- [ ] Disk space verified
- [ ] Internet connection stable
- [ ] No important processes running

### Before Running Script
- [ ] Terminal/Command Prompt open
- [ ] Located in project root directory (`V1/`)
- [ ] All systems checked above

### Running Build
- [ ] Double-click `build-apk.bat` (Windows)
  - OR run `./build-apk.sh` (Mac/Linux)
- [ ] Watch for errors in terminal
- [ ] Don't close terminal while building
- [ ] Wait for "SUCCESS" message

### After Build
- [ ] Check for APK file:
  ```
  android/app/build/outputs/apk/debug/app-debug.apk
  ```
- [ ] Verify file size: ~25-30 MB
- [ ] File exists and is readable

---

## 📲 INSTALLATION

### Prepare Device/Emulator
- [ ] Device powered on
- [ ] Emulator running (if using emulator)
- [ ] USB cable connected (if using device)
- [ ] Device recognized: `adb devices`

### Install APK
- [ ] Run install command:
  ```bash
  adb install android/app/build/outputs/apk/debug/app-debug.apk
  ```
- [ ] Watch for "Success" message
- [ ] No errors in output

### Launch App
- [ ] App appears on device home screen
- [ ] Or manually launch from app drawer
- [ ] Splash screen appears (6 seconds)
- [ ] App loads successfully

---

## ✨ TESTING

### First Launch
- [ ] Splash screen shows
- [ ] App initializes
- [ ] No error dialogs
- [ ] UI loads correctly

### Navigation Testing
- [ ] Home page displays
- [ ] Sidebar opens/closes
- [ ] Can navigate between pages
- [ ] Back button works

### Feature Testing
- [ ] News loads
- [ ] Market data displays
- [ ] Search works
- [ ] Saved articles function
- [ ] Quizzes load
- [ ] Videos play

### API Testing
- [ ] No blank pages
- [ ] Data loads from backend
- [ ] Images display
- [ ] Text content shows

### Network Testing
- [ ] Works on WiFi
- [ ] Works on cellular (if available)
- [ ] Can handle network changes
- [ ] Error handling works

### Performance Testing
- [ ] App responds quickly
- [ ] No crashes
- [ ] Smooth scrolling
- [ ] Buttons respond immediately

---

## 🐛 TROUBLESHOOTING STEPS

### If Build Fails
1. [ ] Read error message carefully
2. [ ] Run script again (auto-cleanup)
3. [ ] Check Internet connection
4. [ ] Restart ADB:
   ```bash
   adb kill-server
   adb start-server
   ```
5. [ ] Check disk space: `df -h` (Mac/Linux) or `dir C:\` (Windows)
6. [ ] Review [QUICK_START_APK.md](QUICK_START_APK.md) troubleshooting

### If Installation Fails
1. [ ] Verify device connected: `adb devices`
2. [ ] Enable USB Debugging on device
3. [ ] Trust computer on device
4. [ ] Disconnect and reconnect USB
5. [ ] Try different USB port
6. [ ] Uninstall old version: `adb uninstall com.bizai.app`
7. [ ] Try again: `adb install [path-to-apk]`

### If App Won't Launch
1. [ ] Check device logs: `adb logcat`
2. [ ] Look for error messages
3. [ ] Restart app
4. [ ] Restart device
5. [ ] Reinstall app
6. [ ] Check backend API reachable

### If Features Don't Work
1. [ ] Verify Internet connection
2. [ ] Check backend server running
3. [ ] Verify backend API URL in code
4. [ ] Check device logs: `adb logcat`
5. [ ] Test backend directly (browser)
6. [ ] Check network permissions in manifest

---

## 📊 SUCCESS INDICATORS

### ✅ Build Successful When:
- [ ] No errors in terminal
- [ ] "SUCCESS" message appears
- [ ] APK file created
- [ ] File size ~25-30 MB

### ✅ Installation Successful When:
- [ ] `adb install` returns "Success"
- [ ] App icon appears on device
- [ ] App appears in settings

### ✅ App Working When:
- [ ] Launches without crashing
- [ ] Splash screen displays
- [ ] Main interface loads
- [ ] Can navigate between pages
- [ ] Features respond to interaction

---

## 🎯 NEXT STEPS (In Order)

1. **Complete This Checklist** ← You are here
2. **Run Build Script**
   - Windows: `build-apk.bat`
   - Mac/Linux: `./build-apk.sh`
3. **Verify APK Created**
   - Check: `android/app/build/outputs/apk/debug/app-debug.apk`
4. **Install APK**
   - Command: `adb install [path-to-apk]`
5. **Test on Device**
   - Launch app
   - Test all features
   - Check for errors
6. **Deploy (Optional)**
   - Build release APK
   - Create Google Play account
   - Submit to Play Store

---

## ❓ QUICK HELP

### Can't Find APK?
```bash
# Find it manually
find . -name "app-debug.apk" 2>/dev/null
# Or navigate to:
android/app/build/outputs/apk/debug/
```

### ADB Commands Not Working?
```bash
# Restart ADB
adb kill-server
adb start-server

# Check devices
adb devices
```

### Need to Rebuild?
```bash
# Quick rebuild
cd frontend && npm run build && cd .. && npx cap sync android
```

### Want to See What's Building?
```bash
# Run script with logging
build-apk.bat
# Watch terminal for progress
```

---

## 📞 GETTING HELP

### Start Here
1. [VISUAL_BUILD_GUIDE.md](VISUAL_BUILD_GUIDE.md)
2. [QUICK_START_APK.md](QUICK_START_APK.md)
3. [MOBILE_DOCUMENTATION_INDEX.md](MOBILE_DOCUMENTATION_INDEX.md)

### Check Logs
```bash
# View device logs
adb logcat | grep -i bizai

# Save to file
adb logcat > logcat.txt
```

### Verify Setup
```bash
java -version        # Check Java
node --version       # Check Node
npm --version        # Check npm
adb devices         # Check Android
```

---

## ✅ FINAL SIGN-OFF

- [ ] All items in this checklist reviewed
- [ ] All system requirements met
- [ ] All files created/modified
- [ ] Build script located and ready
- [ ] Device/emulator prepared
- [ ] Time allocated for build
- [ ] Troubleshooting guide reviewed

**IF ALL CHECKED:** You're ready to build! 🚀

---

## 🎉 LET'S BUILD!

### Windows Users
```
Double-click → build-apk.bat
```

### Mac/Linux Users
```
chmod +x build-apk.sh
./build-apk.sh
```

---

## 📝 BUILD LOG

Use this space to record your build process:

```
Date Started: ______________
Time Started: ______________

Build Script Run: [ ] Yes [ ] No
Errors Encountered: ______________
Time Completed: ______________

APK Location: ______________
APK File Size: ______________

Installation Time: ______________
Installation Success: [ ] Yes [ ] No

Testing Results: ______________
All Features Working: [ ] Yes [ ] No

Issues Found: ______________
```

---

**You're all set! Time to build your BizAI mobile app!** 📱✨

Questions? Check the documentation files listed above.

**Next Action:** Run `build-apk.bat` (Windows) or `./build-apk.sh` (Mac/Linux)
