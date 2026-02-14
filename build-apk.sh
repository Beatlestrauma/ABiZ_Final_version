#!/bin/bash

# BizAI Mobile App Build Script
# This script automates the process of building and deploying the APK

set -e

echo "================================"
echo "BizAI Mobile App Build Script"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo -e "${BLUE}Step 1: Installing frontend dependencies...${NC}"
cd frontend
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 2: Build frontend
echo -e "${BLUE}Step 2: Building frontend...${NC}"
npm run build
echo -e "${GREEN}✓ Frontend built${NC}"
cd ..

# Step 3: Check if Capacitor is initialized
echo -e "${BLUE}Step 3: Checking Capacitor setup...${NC}"
if [ ! -d "android" ]; then
    echo -e "${YELLOW}Android platform not found. Initializing Capacitor...${NC}"
    npx cap init
    npx cap add android
fi
echo -e "${GREEN}✓ Capacitor configured${NC}"

# Step 4: Sync with Capacitor
echo -e "${BLUE}Step 4: Syncing with Capacitor...${NC}"
npx cap sync android
echo -e "${GREEN}✓ Synced${NC}"

# Step 5: Build APK
echo -e "${BLUE}Step 5: Building APK...${NC}"
cd android
./gradlew build
echo -e "${GREEN}✓ Build complete${NC}"

# Step 6: Build debug APK
echo -e "${BLUE}Step 6: Building debug APK...${NC}"
./gradlew assembleDebug
echo -e "${GREEN}✓ Debug APK created${NC}"

cd ..

# Step 7: Show APK location
APK_PATH="./android/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo -e "${GREEN}================================"
    echo "✓ SUCCESS!"
    echo "================================"
    echo "APK Location: $APK_PATH"
    echo -e "${YELLOW}Install with:${NC}"
    echo "adb install $APK_PATH"
    echo ""
    echo -e "${YELLOW}Or use Android Studio to run on emulator/device${NC}"
    echo "adb install-multiple devices"
else
    echo -e "${YELLOW}APK not found at expected location${NC}"
    echo "Check build output above for errors"
fi
