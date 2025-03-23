@echo off
setlocal enabledelayedexpansion

:: =============================================
:: Fitness Workouts App - Automated APK Builder
:: This script uses credentials from secrets.js
:: =============================================

:: Colors for cmd output
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

:: Print header
echo %GREEN%=========================================%NC%
echo %GREEN%    Fitness Workouts App Auto Builder    %NC%
echo %GREEN%=========================================%NC%

echo.
echo %YELLOW%Starting automated APK build process...%NC%
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

:: Extract credentials from secrets.js
echo %YELLOW%Reading credentials from secrets.js...%NC%

:: Create a temporary script to read the secrets file
echo const fs = require('fs'); > temp_secrets.js
echo const path = require('path'); >> temp_secrets.js
echo try { >> temp_secrets.js
echo   const secretsFile = path.join(__dirname, 'src/config/secrets.js'); >> temp_secrets.js
echo   const content = fs.readFileSync(secretsFile, 'utf8'); >> temp_secrets.js
echo   >> temp_secrets.js
echo   // Updated regex patterns to match EAS_CREDENTIALS structure >> temp_secrets.js
echo   const usernameMatch = content.match(/EAS_CREDENTIALS[\s\S]*?username:\s*['"]([^'"]+)['"]/); >> temp_secrets.js
echo   const passwordMatch = content.match(/EAS_CREDENTIALS[\s\S]*?password:\s*['"]([^'"]+)['"]/); >> temp_secrets.js
echo   const profileMatch = content.match(/APK_BUILD_CONFIG[\s\S]*?profile:\s*['"]([^'"]+)['"]/); >> temp_secrets.js
echo   >> temp_secrets.js
echo   if (usernameMatch && passwordMatch) { >> temp_secrets.js
echo     const username = usernameMatch[1]; >> temp_secrets.js
echo     const password = passwordMatch[1]; >> temp_secrets.js
echo     const profile = profileMatch ? profileMatch[1] : 'preview'; >> temp_secrets.js
echo     fs.writeFileSync('temp_creds.txt', `${username}\n${password}\n${profile}`); >> temp_secrets.js
echo     console.log('Credentials extracted successfully.'); >> temp_secrets.js
echo   } else { >> temp_secrets.js
echo     console.error('Could not extract credentials from secrets.js'); >> temp_secrets.js
echo     process.exit(1); >> temp_secrets.js
echo   } >> temp_secrets.js
echo } catch (error) { >> temp_secrets.js
echo   console.error('Error reading secrets file:', error.message); >> temp_secrets.js
echo   process.exit(1); >> temp_secrets.js
echo } >> temp_secrets.js

:: Execute the script
node temp_secrets.js
if %ERRORLEVEL% neq 0 (
    echo %RED%Failed to extract credentials from secrets.js%NC%
    echo %RED%Please check that src/config/secrets.js exists and contains valid credentials.%NC%
    del temp_secrets.js
    exit /b 1
)

:: Read the credentials from the temporary file
set /p EXPO_USERNAME=<temp_creds.txt
set /p EXPO_PASSWORD=<nul
for /f "skip=1 delims=" %%a in (temp_creds.txt) do (
    if not defined EXPO_PASSWORD (
        set "EXPO_PASSWORD=%%a"
    ) else (
        if not defined BUILD_PROFILE (
            set "BUILD_PROFILE=%%a"
        )
    )
)

:: Clean up temp files
del temp_secrets.js
del temp_creds.txt

:: Verify credentials are loaded
if "%EXPO_USERNAME%"=="" (
    echo %RED%Failed to load Expo username from secrets.js%NC%
    exit /b 1
)
if "%EXPO_PASSWORD%"=="" (
    echo %RED%Failed to load Expo password from secrets.js%NC%
    exit /b 1
)
if "%BUILD_PROFILE%"=="" (
    echo %YELLOW%No build profile specified in secrets.js, using default: preview%NC%
    set "BUILD_PROFILE=preview"
)

echo %GREEN%Credentials loaded successfully!%NC%

:: Check if already logged in
eas whoami >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %YELLOW%Logging in to EAS...%NC%
    
    :: Create a temporary script to handle login
    echo const { execSync } = require('child_process'); > temp_login.js
    echo const username = '%EXPO_USERNAME%'; >> temp_login.js
    echo const password = '%EXPO_PASSWORD%'; >> temp_login.js
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
        echo %RED%Failed to log in to EAS. Please check your credentials in secrets.js.%NC%
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
)

:: Start the build
echo.
echo %GREEN%Starting build with profile: %BUILD_PROFILE%%NC%
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

endlocal 