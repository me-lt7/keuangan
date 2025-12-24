# 🚀 Build APK dengan GitHub Actions (Recommended)

Ini adalah cara **termudah dan tercepat** untuk build APK tanpa perlu install apapun di lokal!

## ✨ Keuntungan:
- ✅ Tidak perlu install Java, Android Studio, atau SDK
- ✅ Build otomatis setiap kali push ke GitHub
- ✅ APK langsung download dari GitHub Release
- ✅ Build di cloud (gratis untuk public repos)

## 📋 Langkah-langkah:

### 1. Push ke GitHub
Pastikan project sudah di-push ke GitHub:
```powershell
git add .
git commit -m "Setup APK build"
git push origin main
```

### 2. Tunggu Build Otomatis
- Buka repository di GitHub
- Klik tab **Actions**
- Tunggu workflow "Build APK" selesai (biasanya 5-10 menit)

### 3. Download APK
Setelah build selesai:
1. Klik workflow "Build APK" yang paling recent
2. Scroll ke bawah, cari "Artifacts"
3. Klik **app-debug.apk** untuk download

### 4. Install ke Device
```powershell
adb install -r app-debug.apk
```

## 🔄 Build Otomatis Setiap Update

APK akan otomatis di-rebuild setiap kali Anda:
- Push code ke `main` branch
- Trigger manual via "Run workflow" button

## 📱 Jika ingin Build Release APK

Edit file `.github/workflows/build-apk.yml`:

Cari baris ini:
```yaml
./gradlew assembleDebug
```

Ubah menjadi:
```yaml
./gradlew assembleRelease
```

Kemudian push, dan workflow akan build APK release.

## 🎯 Tips:

- APK debug bagus untuk testing
- APK release untuk upload ke Play Store
- GitHub Actions gratis untuk public repositories
- Setiap build disimpan di "Releases" section

## ❓ Troubleshooting:

Jika build gagal di GitHub Actions:
1. Klik workflow yang gagal
2. Lihat detail error di logs
3. Fix code dan push lagi
4. Workflow otomatis re-run

---

**Status:** ✅ Workflow sudah siap! Tinggal push ke GitHub! 🎉
