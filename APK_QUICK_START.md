# APK Build Instructions

## Prerequisites (Install these first):
1. **Android Studio** - https://developer.android.com/studio
2. **JDK 11+** (comes with Android Studio)
3. **Node.js 18+** - https://nodejs.org

## Build Steps:

### Step 1: Build and Sync
```powershell
npm run build
npx cap sync android
```

### Step 2: Build APK using Gradle

**Debug APK:**
```powershell
cd android
./gradlew.bat assembleDebug
```

**Release APK:**
```powershell
cd android
./gradlew.bat assembleRelease
```

### Step 3: Find your APK
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

## Install APK to Device:

### Connect device via USB with Developer Mode enabled, then:
```powershell
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Using Android Studio to Build:

1. Open `android` folder in Android Studio
2. Wait for Gradle sync to complete
3. Click: **Build > Build Bundle(s) / APK(s) > Build APK(s)**
4. Select debug or release
5. Done!

## Notes:
- Application saves data locally (no internet needed)
- Data can be downloaded as JSON
- Use Release APK for production/upload to Play Store
