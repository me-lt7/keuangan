# 📱 Panduan Build APK - Aplikasi Keuangan

## ✅ Persyaratan Sistem

### Wajib diinstall:
1. **Android Studio** - https://developer.android.com/studio
2. **JDK 11+** (sudah termasuk Android Studio)
3. **Node.js 18+** - https://nodejs.org

### Verifikasi instalasi:
```powershell
java -version
gradle -version
npm --version
```

## 🚀 Cara Build APK

### Opsi 1: Menggunakan npm script (Recommended)

**Build APK Debug (Testing):**
```powershell
npm run cap:build-debug
```

**Build APK Release (Production):**
```powershell
npm run cap:build-release
```

### Opsi 2: Manual dengan Gradle

**Sync files terlebih dahulu:**
```powershell
npm run build
npx cap sync android
```

**Build Debug APK:**
```powershell
cd android
./gradlew.bat assembleDebug
```

**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

**Build Release APK:**
```powershell
cd android
./gradlew.bat assembleRelease
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

### Opsi 3: Menggunakan Android Studio UI

1. Buka folder `android` dengan Android Studio
2. Tunggu Gradle indexing selesai
3. Menu: **Build > Build Bundle(s) / APK(s) > Build APK(s)**
4. Pilih **debug** atau **release**
5. Tunggu selesai - APK akan otomatis disimpan

## 📂 Lokasi File APK

- **Debug:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release:** `android/app/build/outputs/apk/release/app-release.apk`

## 📲 Install ke Device/Emulator

### Via ADB (Android Debug Bridge):
```powershell
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Via Android Studio:
1. Hubungkan device ke komputer
2. Menu: **Run > Run 'app'**
3. Pilih device
4. Klik OK

## 🔧 Troubleshooting

### Error: "Gradle build failed"
```powershell
cd android
./gradlew.bat clean
./gradlew.bat assembleDebug
```

### Error: "JDK not found"
Set JAVA_HOME environment variable:
```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
```

### Error: "Android SDK not found"
- Buka Android Studio
- Settings > Appearance & Behavior > System Settings > Android SDK
- Instal Android SDK 33 atau lebih tinggi

### Build terlalu lambat?
Increase Gradle memory di `android/gradle.properties`:
```
org.gradle.jvmargs=-Xmx4096m
```

## 📱 Testing APK

### Di Emulator:
1. Buka Android Studio > AVD Manager
2. Jalankan emulator
3. Run `adb install app-debug.apk`

### Di Device Fisik:
1. Enable Developer Mode (tap Build Number 7x di Settings)
2. Enable USB Debugging
3. Hubungkan ke komputer
4. Run `adb install app-debug.apk`

## 🎯 Fitur Aplikasi

- ✅ Tambah transaksi (Pemasukan/Pengeluaran)
- ✅ Lihat riwayat transaksi
- ✅ Download data sebagai JSON
- ✅ Penyimpanan lokal (localStorage)
- ✅ Login dengan admin account
- ✅ Responsive design

## 📝 Notes

- Aplikasi menyimpan data di device storage (tidak perlu internet)
- Data dapat di-download sebagai file JSON
- Untuk production, gunakan Release APK
- Pastikan Android 6.0+ untuk compatibility

---

**Butuh bantuan?** Lihat dokumentasi:
- Capacitor: https://capacitorjs.com/docs
- Android: https://developer.android.com/docs
- Next.js: https://nextjs.org/docs
