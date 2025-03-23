@echo off
setlocal

echo =========================================
echo     iOS App Builder    
echo =========================================
echo.
echo This script will build your iOS app using Expo.dev (EAS Build).
echo NOTE: A paid Apple Developer account ($99/year) is REQUIRED for iOS builds.
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

echo IMPORTANT: Before proceeding, please confirm you have:
echo  - A paid Apple Developer Program membership ($99/year)
echo  - Access to your Apple Developer account credentials
echo.
choice /c YN /m "Do you have an active Apple Developer Program membership"
if errorlevel 2 (
    echo.
    echo You need an Apple Developer Program membership to build iOS apps.
    echo You can sign up at: https://developer.apple.com/programs/enroll/
    echo.
    echo Alternatively, you can build for Android only using the Android build script.
    echo.
    choice /c YN /m "Would you like to run the Android build script instead"
    if errorlevel 1 (
        if errorlevel 2 (
            echo Exiting...
            exit /b 0
        )
        echo Running Android build script instead...
        call %~dp0\build-android-app.bat
        exit /b %ERRORLEVEL%
    )
    exit /b 0
)

:: Increment iOS version using Node.js
echo Incrementing iOS app version...
node .\scripts\increment-ios-version.js
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
echo.
set /p PROFILE_CHOICE=Enter your choice (1-2): 

if "%PROFILE_CHOICE%"=="1" (
    set BUILD_PROFILE=preview
) else if "%PROFILE_CHOICE%"=="2" (
    set BUILD_PROFILE=production
) else (
    echo Invalid choice. Using preview profile by default.
    set BUILD_PROFILE=preview
)

:: Run prebuild to generate native code
echo.
echo Running prebuild to generate iOS native files...
echo This is needed for EAS Build to work properly.
echo.
call npx expo prebuild --platform ios --clean
if %ERRORLEVEL% neq 0 (
    echo Failed to generate iOS native files. 
    echo This is required for EAS Build to work properly.
    pause
    exit /b 1
)

echo.
echo Starting iOS build with profile: %BUILD_PROFILE%
echo.

call eas build -p ios --profile %BUILD_PROFILE%

if %ERRORLEVEL% equ 0 (
    echo.
    echo iOS build process started successfully!
) else (
    echo.
    echo iOS build initiation failed.
    echo.
    echo If you encountered an error about Apple Developer Program membership,
    echo please sign up at: https://developer.apple.com/programs/enroll/
    echo Cost: $99/year (required for iOS app distribution)
    echo.
    echo Alternatively, you can build for Android only using build-android-app.bat
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