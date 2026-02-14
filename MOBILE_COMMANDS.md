# BizAI Mobile App - Available Commands

## Frontend Build Commands

From `frontend/` directory:

```bash
# Development server (web only)
npm run dev

# Build for web
npm run build

# Preview built app (web only)
npm run preview
```

## Mobile Build Commands

From project root directory:

### Quick Build
```bash
# Windows
build-apk.bat

# Mac/Linux
./build-apk.sh
```

### Manual Build Commands
```bash
# Build frontend and sync with Capacitor
npm run build:mobile

# Build APK (full build)
npm run android:build

# Open Android Studio
npm run android:run

# Sync changes with Android
npm run android:sync
```

## Development Workflow

### 1. **Local Web Development**
```bash
cd frontend
npm run dev
# Open http://localhost:5173
```

### 2. **Build and Test Web Version**
```bash
cd frontend
npm run build
npm run preview
# Open http://localhost:4173
```

### 3. **Build APK**
```bash
npm run android:build
# APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
```

### 4. **Install APK on Device**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 5. **Test on Android Studio Emulator**
```bash
npm run android:run
# Select emulator and run
```

## Troubleshooting Commands

```bash
# Clear all caches and rebuild
cd android
./gradlew clean
cd ..
npm run build:mobile

# Sync without rebuilding
npm run android:sync

# Check ADB devices
adb devices

# View device logs
adb logcat

# Restart ADB
adb kill-server
adb start-server

# Install APK with logging
adb install -r app-debug.apk

# Uninstall app from device
adb uninstall com.bizai.app
```

## Environment Variables

Create `frontend/.env` if needed for API endpoints:

```bash
# Development
VITE_API_URL=http://localhost:4000/api

# Production
VITE_API_URL=https://yourdomain.com/api
```

Then use in app:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

## Build Configuration

### Package.json Scripts
Update `frontend/package.json` scripts section for custom builds:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "build:mobile": "vite build && npx cap sync",
  "android:build": "npm run build:mobile && npx cap build android",
  "android:run": "npx cap open android",
  "android:sync": "npx cap sync android"
}
```

## Release Build

```bash
# Create signing key (one time)
keytool -genkey -v -keystore release.keystore \
  -alias release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Build release APK
cd android
./gradlew assembleRelease
cd ..

# Find APK at: android/app/build/outputs/apk/release/app-release.apk
```

## Performance Optimization Commands

```bash
# Analyze app size
cd android
./gradlew assembleDebug
cd ..

# Enable ProGuard/R8 minification
# Edit android/app/build.gradle:
# buildTypes {
#   release {
#     minifyEnabled true
#   }
# }
```

## Testing Commands

```bash
# Run linter (if configured)
npm run lint

# Build and verify
npm run build

# Test backend connectivity
curl https://your-api-domain.com/api/health
```

## Useful Capacitor Commands

```bash
# Initialize Capacitor project
npx cap init

# Add Android platform
npx cap add android

# Sync web files to native project
npx cap sync android

# Copy only web files
npx cap copy android

# Update native dependencies
npx cap update android

# Open Android Studio
npx cap open android

# Build APK through CLI
npx cap build android
```

## Device Management

```bash
# List connected devices
adb devices

# Get device info
adb shell getprop ro.build.version.release

# Get app package info
adb shell pm list packages | grep bizai

# View app data
adb shell run-as com.bizai.app ls /data/data/com.bizai.app

# Clear app data
adb shell pm clear com.bizai.app

# View recent logs
adb logcat -d | tail -100
```

## Quick Checklist Before Deployment

- [ ] Update backend API URL in code
- [ ] Set production Firebase config
- [ ] Test on real Android device
- [ ] Verify all features work
- [ ] Check internet permission in manifest
- [ ] Build release APK with signed keystore
- [ ] Test APK file before distribution
- [ ] Create app screenshots
- [ ] Write app description
- [ ] Set pricing (if paid)
- [ ] Submit to Google Play Store

## Resources

- **Android Studio Download:** https://developer.android.com/studio
- **JDK Download:** https://www.oracle.com/java/technologies/downloads/
- **Android SDK Setup:** https://developer.android.com/about/versions/13
- **Capacitor Docs:** https://capacitorjs.com/docs
- **Build Gradle Docs:** https://gradle.org

---

**Need help?** Run `build-apk.bat` (Windows) or `./build-apk.sh` (Mac/Linux) for automated build!
