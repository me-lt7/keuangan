#!/bin/bash

# Script untuk build APK menggunakan Gradle

echo "Building APK..."
cd android

# Build APK (debug mode)
./gradlew assembleDebug

echo "APK build complete!"
echo "APK location: android/app/build/outputs/apk/debug/app-debug.apk"
