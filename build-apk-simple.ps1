#!/usr/bin/env pwsh

# Script untuk build APK dengan Gradle di Windows

param(
    [ValidateSet('debug', 'release')]
    [string]$BuildType = 'debug'
)

Write-Host "Building APK ($BuildType)..." -ForegroundColor Green

# Cek apakah gradlew.bat ada
$gradleWrapper = ".\android\gradlew.bat"
if (-not (Test-Path $gradleWrapper)) {
    Write-Host "gradlew.bat tidak ditemukan di folder android" -ForegroundColor Red
    Write-Host "Pastikan sudah menjalankan: npx cap add android" -ForegroundColor Yellow
    exit 1
}

# Change ke folder android
Push-Location ".\android"

try {
    # Clean build
    Write-Host "Cleaning build files..." -ForegroundColor Cyan
    & $gradleWrapper clean

    # Build APK
    if ($BuildType -eq 'debug') {
        Write-Host "Building debug APK..." -ForegroundColor Cyan
        & $gradleWrapper assembleDebug
        $outputPath = ".\app\build\outputs\apk\debug\app-debug.apk"
    } else {
        Write-Host "Building release APK..." -ForegroundColor Cyan
        & $gradleWrapper assembleRelease
        $outputPath = ".\app\build\outputs\apk\release\app-release.apk"
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Host "APK build success!" -ForegroundColor Green
        Write-Host "APK location: $outputPath" -ForegroundColor Green
        
        if (Test-Path $outputPath) {
            $sizeMB = [math]::Round((Get-Item $outputPath).Length / 1MB, 2)
            Write-Host "Size: $sizeMB MB" -ForegroundColor Green
        }
    } else {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
} finally {
    Pop-Location
}
