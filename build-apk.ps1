#!/usr/bin/env pwsh

# Script untuk build APK dengan Gradle di Windows

param(
    [ValidateSet('debug', 'release')]
    [string]$BuildType = 'debug'
)

Write-Host "Building APK ($BuildType)..." -ForegroundColor Green

# Cek apakah gradlew.bat ada
$gradleWrapper = "android\gradlew.bat"
if (-not (Test-Path $gradleWrapper)) {
    Write-Host "gradlew.bat tidak ditemukan di folder android" -ForegroundColor Red
    Write-Host "Pastikan sudah menjalankan: npx cap add android" -ForegroundColor Yellow
    exit 1
}

# Build APK
if ($BuildType -eq 'debug') {
    Write-Host "Building debug APK..." -ForegroundColor Cyan
    & cmd /c "android\gradlew.bat assembleDebug"
    $outputPath = "android\app\build\outputs\apk\debug\app-debug.apk"
} else {
    Write-Host "Building release APK..." -ForegroundColor Cyan
    & cmd /c "android\gradlew.bat assembleRelease"
    $outputPath = "android\app\build\outputs\apk\release\app-release.apk"
}
