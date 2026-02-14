# BizAI Mobile App - Quick Start Guide

## Overview
Your BizAI app is now ready to be converted into an Android APK. All features are enabled and optimized for mobile devices.

## What's Been Set Up

✅ **Capacitor Integration** - Framework for converting web app to native mobile  
✅ **Mobile Optimizations** - Touch, safe areas, keyboard handling, haptics  
✅ **All Features Enabled** - News, markets, AI insights, quizzes, games, etc.  
✅ **Build Scripts** - Automated build process for Windows and Linux/Mac  
✅ **Configuration Files** - Android manifest, Capacitor config, mobile styles  

---

## Option 1: Quick Build (Recommended)

### Windows Users
```bash
# Simply run the batch file
build-apk.bat
```

### Mac/Linux Users
```bash
# Make the script executable
chmod +x build-apk.sh

# Run the build script
./build-apk.sh
```

The script will:
1. Install dependencies
2. Build the frontend
3. Set up Capacitor (if needed)
4. Compile the Android app
5. Generate the APK
6. Show you where to find it

**Result:** Your APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Option 2: Manual Build

### Step 1: Install Dependencies
```bash
cd frontend
npm install
npm run build
cd ..
```

### Step 2: Initialize Capacitor (if not done)
```bash
npx cap init
npx cap add android
```

### Step 3: Build the App
```bash
npx cap sync android
cd android
./gradlew build        # or gradlew.bat build on Windows
./gradlew assembleDebug
cd ..
```

---

## Option 3: Using Android Studio (Best for Debugging)

1. Open Android Studio
2. File → Open → Select the `android` folder
3. Android Studio will sync and install dependencies automatically
4. Click "Run" button (▶)
5. Select your device or emulator
6. App will build and launch automatically

---

## Installing the APK

### On Your Phone
```bash
# Using ADB (Android Debug Bridge)
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### On Android Emulator
```bash
# First, start the emulator in Android Studio
# Then run the install command above
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Creating a Release APK (for Google Play Store)

### Step 1: Generate Signing Key
```bash
keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Update Build Configuration
Edit `android/app/build.gradle` and add:
```gradle
signingConfigs {
    release {
        keystore file('../../release.keystore')
        keystorePassword 'your_password'
        keyAlias 'release'
        keyPassword 'your_password'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

### Step 3: Build Release APK
```bash
cd android
./gradlew assembleRelease
cd ..
```

**Result:** Release APK at `android/app/build/outputs/apk/release/app-release.apk`

---

## Mobile Features Enabled

### Core Features
- ✅ Daily Business Briefing
- ✅ News Library (Fully searchable)
- ✅ Saved Articles (Offline access)
- ✅ Market Data & Charts
- ✅ AI Insights (Powered by Gemini API)
- ✅ Sustainability News
- ✅ Women in Business
- ✅ Podcasts
- ✅ Entrepreneurs Section
- ✅ Quiz Games
- ✅ Leaderboards
- ✅ User Profiles

### Mobile-Specific Features
- ✅ Back button navigation (Android)
- ✅ Haptic feedback on button taps
- ✅ Keyboard auto-hide on scroll
- ✅ Safe area support (notches, gestures)
- ✅ Network status detection
- ✅ App pause/resume handling
- ✅ Optimized touch targets
- ✅ Mobile-friendly splash screen
- ✅ Firebase authentication
- ✅ Responsive design (all screen sizes)

---

## Troubleshooting

### Issue: Build Fails
**Solution:**
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Issue: Gradle Daemon Error
**Solution:**
```bash
cd android
./gradlew --stop
./gradlew assembleDebug
cd ..
```

### Issue: APK Installation Fails
- Check ADB: `adb devices`
- Enable Developer Mode on phone
- Enable USB Debugging
- Use latest ADB version

### Issue: App Shows Blank Screen
- Check device logs: `adb logcat`
- Verify backend API is reachable from your network
- Check that API URL in app is not localhost

### Issue: Features Don't Work
- Verify internet permission in manifest
- Check backend API connectivity
- Test with: `adb shell ping google.com`

---

## Project Structure

```
V1/
├── frontend/                    # React web app
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── context/            # State management
│   │   ├── utils/
│   │   │   └── MobileConfig.ts # Mobile initialization
│   │   ├── index.css
│   │   ├── mobile-styles.css   # Mobile optimizations
│   │   └── capacitor-init.js
│   ├── index.html              # Updated for mobile
│   ├── package.json            # Mobile build scripts
│   └── vite.config.mts
│
├── backend/                     # Node.js backend
│   ├── src/
│   │   ├── server.js
│   │   ├── services/          # API services
│   │   ├── database/
│   │   └── ...
│   └── package.json
│
├── android/                     # Generated Android project
│   ├── app/
│   │   ├── src/main/AndroidManifest.xml
│   │   └── build.gradle
│   └── build.gradle
│
├── capacitor.config.ts         # Capacitor configuration
├── AndroidManifest.xml         # Permissions template
├── build-apk.bat              # Windows build script
├── build-apk.sh               # Mac/Linux build script
└── MOBILE_SETUP.md            # Complete mobile setup guide
```

---

## API Configuration

### Important: Backend URL
Update your API calls to use your actual backend domain:

❌ **Wrong** (localhost won't work on phone)
```javascript
const API_URL = 'http://localhost:4000/api';
```

✅ **Correct**
```javascript
const API_URL = 'https://yourdomain.com/api';
```

Update in your API service files:
- `frontend/src/context/NewsContext.jsx`
- `frontend/src/pages/*` (if API calls exist)
- Any service files in `backend/src/services/`

---

## Performance Tips

1. **Optimize Images**
   - Compress all images before building
   - Use WebP format when possible

2. **Lazy Load Components**
   - React.lazy() for page components
   - Code splitting for bundle size

3. **Cache API Responses**
   - Implement service worker
   - Cache articles locally

4. **Monitor App Size**
   - Target APK size < 50MB
   - Use ProGuard for code minification

---

## Publishing to Google Play Store

Once you have a release APK:

1. Create Google Play Developer Account ($25 one-time)
2. Create app in Google Play Console
3. Upload release APK
4. Add screenshots, description, rating info
5. Submit for review (typically 4-24 hours)

For detailed instructions: https://developer.android.com/studio/publish

---

## Next Steps

1. **Run the build script** to generate your APK
2. **Test on a device** to verify all features work
3. **Adjust backend API URL** for your deployment
4. **Create release APK** for App Store submission
5. **Set up Firebase** for authentication if using
6. **Configure analytics** to track user behavior

---

## Support & Resources

- **Capacitor Docs:** https://capacitorjs.com
- **Android Development:** https://developer.android.com
- **React Native (if you prefer):** https://reactnative.dev
- **Firebase Setup:** https://firebase.google.com/docs

---

## Questions?

Check the following files for more info:
- `MOBILE_SETUP.md` - Detailed setup guide
- `capacitor.config.ts` - Capacitor configuration
- `AndroidManifest.xml` - Permissions and manifest settings

**Happy building! 🚀**
