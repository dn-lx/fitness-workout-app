@echo off
setlocal enabledelayedexpansion

:: =============================================
:: Fitness Workouts App - Interactive APK Builder
:: =============================================

:: Colors for cmd output
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

:: Print header
echo %GREEN%=========================================%NC%
echo %GREEN%    Fitness Workouts App APK Builder    %NC%
echo %GREEN%=========================================%NC%

echo.
echo %YELLOW%This script will guide you through building an APK for the Fitness Workouts App.%NC%
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo %RED%Node.js not found. Please install Node.js to continue.%NC%
    exit /b 1
)

:: Check if EAS CLI is installed
where eas >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo %RED%EAS CLI not found. Installing...%NC%
    npm install -g eas-cli
    if %ERRORLEVEL% neq 0 (
        echo %RED%Failed to install EAS CLI. Please install it manually:%NC%
        echo npm install -g eas-cli
        exit /b 1
    )
)

:: Check if already logged in
eas whoami >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %YELLOW%You need to log in to your Expo/EAS account.%NC%
    
    :: Ask for credentials
    set /p EXPO_USERNAME=Enter your Expo username (email): 
    echo Enter your Expo password: 
    set "EXPO_PASSWORD="
    
    :: Read password without showing it
    setlocal disabledelayedexpansion
    for /f "delims=" %%i in ('powershell -Command "$pwd = Read-Host -AsSecureString; $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pwd); [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)"') do set "EXPO_PASSWORD=%%i"
    setlocal enabledelayedexpansion
    
    :: Create a temporary script to handle login
    echo const { execSync } = require('child_process'); > temp_login.js
    echo const username = '%EXPO_USERNAME%'; >> temp_login.js
    echo const password = `%EXPO_PASSWORD%`; >> temp_login.js
    echo const command = `npx eas-cli login --non-interactive -u ${username} -p ${password}`; >> temp_login.js
    echo try { >> temp_login.js
    echo   execSync(command, { stdio: 'inherit' }); >> temp_login.js
    echo   console.log('Login successful'); >> temp_login.js
    echo } catch (error) { >> temp_login.js
    echo   console.error('Login failed:', error.message); >> temp_login.js
    echo   process.exit(1); >> temp_login.js
    echo } >> temp_login.js
    
    :: Execute the login script
    node temp_login.js
    if %ERRORLEVEL% neq 0 (
        echo %RED%Failed to log in to EAS. Please check your credentials.%NC%
        del temp_login.js
        exit /b 1
    )
    del temp_login.js
    
    :: Verify login worked
    eas whoami >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo %RED%Failed to log in to EAS. Please check your credentials.%NC%
        exit /b 1
    )
) else (
    echo %GREEN%Already logged in to EAS%NC%
    eas whoami
    echo.
    set /p CONTINUE=Do you want to continue with this account? (Y/N): 
    if /i "%CONTINUE%"=="N" (
        echo %YELLOW%Logging out...%NC%
        eas logout
        echo %YELLOW%Please run the script again to log in with a different account.%NC%
        exit /b 0
    )
)

:: Ask for build profile
echo.
echo %YELLOW%Available build profiles:%NC%
echo %GREEN%1. preview%NC% - Development build with debug tools
echo %GREEN%2. simple-apk%NC% - Simple APK without EAS optimizations
echo %GREEN%3. production%NC% - Optimized build for release
echo.
set /p PROFILE_CHOICE=Enter your choice (1-3): 

if "%PROFILE_CHOICE%"=="1" (
    set "BUILD_PROFILE=preview"
) else if "%PROFILE_CHOICE%"=="2" (
    set "BUILD_PROFILE=simple-apk"
) else if "%PROFILE_CHOICE%"=="3" (
    set "BUILD_PROFILE=production"
) else (
    echo %RED%Invalid choice. Using default profile (preview).%NC%
    set "BUILD_PROFILE=preview"
)

:: Ask for build method
echo.
echo %YELLOW%Build methods:%NC%
echo %GREEN%1. EAS Build (Cloud)%NC% - Build in the cloud (requires Expo account)
echo %GREEN%2. Local Build%NC% - Build locally (requires Android SDK)
echo.
set /p BUILD_METHOD=Enter your choice (1-2): 

if "%BUILD_METHOD%"=="1" (
    :: EAS Build
    echo.
    echo %GREEN%Starting EAS build with profile: %BUILD_PROFILE%%NC%
    echo.
    
    eas build -p android --profile %BUILD_PROFILE% --non-interactive
    
    if %ERRORLEVEL% equ 0 (
        echo.
        echo %GREEN%Build process started successfully!%NC%
        echo %YELLOW%You can check the build status on the EAS website or by running:%NC%
        echo eas build:list
    ) else (
        echo.
        echo %RED%Build initiation failed.%NC%
        exit /b 1
    )
) else if "%BUILD_METHOD%"=="2" (
    :: Local Build
    echo.
    echo %YELLOW%Starting local build...%NC%
    echo %YELLOW%This may take several minutes.%NC%
    echo.
    
    :: Check if Android SDK is available
    if not defined ANDROID_SDK_ROOT (
        echo %RED%ANDROID_SDK_ROOT environment variable not set.%NC%
        echo %RED%Please install Android SDK and set ANDROID_SDK_ROOT environment variable.%NC%
        exit /b 1
    )
    
    :: Run the build
    npx expo run:android --variant release
    
    if %ERRORLEVEL% equ 0 (
        echo.
        echo %GREEN%Local build completed successfully!%NC%
        echo %YELLOW%The APK can be found in:%NC%
        echo android/app/build/outputs/apk/release/
    ) else (
        echo.
        echo %RED%Local build failed.%NC%
        exit /b 1
    )
) else (
    echo %RED%Invalid choice. Exiting.%NC%
    exit /b 1
)

endlocal 