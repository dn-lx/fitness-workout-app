@echo off
setlocal

echo =========================================
echo     Android APK Builder    
echo =========================================
echo.
echo This script will build your Android APK file using Expo.dev (EAS Build).
echo.

:: Ensure we're in the project root
cd %~dp0\..

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js not found. Please install Node.js to continue.
    pause
    exit /b 1
)

:: Increment Android version using Node.js
echo Incrementing Android app version...
node .\scripts\increment-android-version.js
if %ERRORLEVEL% neq 0 (
    echo Failed to increment app version. Please check the error message.
    pause
    exit /b 1
)

:: Check if EAS CLI is installed
where eas >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo EAS CLI not found. Installing...
    call npm install -g eas-cli
    if %ERRORLEVEL% neq 0 (
        echo Failed to install EAS CLI. Please install it manually
        echo npm install -g eas-cli
        pause
        exit /b 1
    )
)

:: Install dependencies
echo Installing required packages...
call npm install

:: Check if already logged in
call eas whoami >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo You need to log in to your Expo account.
    echo.
    call eas login
    
    if %ERRORLEVEL% neq 0 (
        echo Failed to log in to EAS. Please try again.
        pause
        exit /b 1
    )
) else (
    echo Already logged in to EAS as
    call eas whoami
    echo.
    choice /c YN /m "Do you want to continue with this account"
    if errorlevel 2 (
        echo Logging out...
        call eas logout
        echo Please run the script again to log in with a different account.
        pause
        exit /b 0
    )
)

echo.
echo Select build profile:
echo 1. Preview (development build with debug tools)
echo 2. Production (optimized build for release)
echo 3. Simple APK (fastest build)
echo.
set /p PROFILE_CHOICE=Enter your choice (1-3): 

if "%PROFILE_CHOICE%"=="1" (
    set BUILD_PROFILE=preview
) else if "%PROFILE_CHOICE%"=="2" (
    set BUILD_PROFILE=production
) else if "%PROFILE_CHOICE%"=="3" (
    set BUILD_PROFILE=simple-apk
) else (
    echo Invalid choice. Using simple-apk profile by default.
    set BUILD_PROFILE=simple-apk
)

echo.
echo Starting Android build with profile: %BUILD_PROFILE%
echo.
echo Note: Prebuild will happen automatically on Expo's build servers.
echo.

call eas build -p android --profile %BUILD_PROFILE% --no-wait

if %ERRORLEVEL% equ 0 (
    echo.
    echo Android build process started successfully!
) else (
    echo.
    echo Android build initiation failed.
    pause
    exit /b 1
)

echo.
echo You can check the build status on the EAS website:
echo https://expo.dev/accounts/dn.lx/projects/fitness-workouts-app/builds
echo.
echo Or by running:
echo eas build:list

pause
exit /b 0 