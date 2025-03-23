#!/bin/bash

# =============================================
# Fitness Workouts App - APK Builder (Unix)
# =============================================

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}    Fitness Workouts App APK Builder    ${NC}"
echo -e "${GREEN}=========================================${NC}"

echo
echo -e "${YELLOW}This script will guide you through building an APK for the Fitness Workouts App.${NC}"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found. Please install Node.js to continue.${NC}"
    exit 1
fi

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${RED}EAS CLI not found. Installing...${NC}"
    npm install -g eas-cli
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install EAS CLI. Please install it manually:${NC}"
        echo "npm install -g eas-cli"
        exit 1
    fi
fi

# Try to extract credentials from secrets.js if it exists
if [ -f "./src/config/secrets.js" ]; then
    echo -e "${YELLOW}Found secrets.js file. Attempting to extract credentials...${NC}"
    
    # Create temporary Node.js script to extract credentials
    cat > temp_secrets.js << EOL
const fs = require('fs');
const path = require('path');
try {
  const secretsFile = path.join(__dirname, 'src/config/secrets.js');
  const content = fs.readFileSync(secretsFile, 'utf8');
  
  // Updated regex patterns to match EAS_CREDENTIALS structure
  const usernameMatch = content.match(/EAS_CREDENTIALS[\\s\\S]*?username:\\s*['"]([^'"]+)['"]/);
  const passwordMatch = content.match(/EAS_CREDENTIALS[\\s\\S]*?password:\\s*['"]([^'"]+)['"]/);
  const profileMatch = content.match(/APK_BUILD_CONFIG[\\s\\S]*?profile:\\s*['"]([^'"]+)['"]/);
  
  if (usernameMatch && passwordMatch) {
    const username = usernameMatch[1];
    const password = passwordMatch[1];
    const profile = profileMatch ? profileMatch[1] : 'preview';
    console.log(JSON.stringify({username, password, profile}));
  } else {
    console.error('Could not extract credentials from secrets.js');
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading secrets file:', error.message);
  process.exit(1);
}
EOL

    # Execute the script and capture output
    CREDS_JSON=$(node temp_secrets.js 2>/dev/null)
    CREDS_STATUS=$?
    rm temp_secrets.js
    
    if [ $CREDS_STATUS -eq 0 ]; then
        # Parse credentials from JSON
        EXPO_USERNAME=$(echo $CREDS_JSON | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).username)")
        EXPO_PASSWORD=$(echo $CREDS_JSON | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).password)")
        BUILD_PROFILE=$(echo $CREDS_JSON | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).profile)")
        
        echo -e "${GREEN}Credentials extracted successfully!${NC}"
        USE_SECRETS=true
    else
        echo -e "${YELLOW}Could not extract credentials from secrets.js. Will ask for manual input.${NC}"
        USE_SECRETS=false
    fi
else
    echo -e "${YELLOW}No secrets.js file found. Will ask for credentials.${NC}"
    USE_SECRETS=false
fi

# Check if already logged in
eas whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}You need to log in to your Expo/EAS account.${NC}"
    
    if [ "$USE_SECRETS" = true ]; then
        echo -e "${YELLOW}Using credentials from secrets.js${NC}"
    else
        # Ask for credentials
        read -p "Enter your Expo username (email): " EXPO_USERNAME
        read -s -p "Enter your Expo password: " EXPO_PASSWORD
        echo
    fi
    
    # Create a temporary script to handle login
    cat > temp_login.js << EOL
const { execSync } = require('child_process');
const username = '${EXPO_USERNAME}';
const password = '${EXPO_PASSWORD}';
const command = \`npx eas-cli login --non-interactive -u \${username} -p \${password}\`;
try {
  execSync(command, { stdio: 'inherit' });
  console.log('Login successful');
} catch (error) {
  console.error('Login failed:', error.message);
  process.exit(1);
}
EOL
    
    # Execute the login script
    node temp_login.js
    LOGIN_STATUS=$?
    rm temp_login.js
    
    if [ $LOGIN_STATUS -ne 0 ]; then
        echo -e "${RED}Failed to log in to EAS. Please check your credentials.${NC}"
        exit 1
    fi
    
    # Verify login worked
    eas whoami &> /dev/null
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to log in to EAS. Please check your credentials.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}Already logged in to EAS${NC}"
    eas whoami
    echo
    read -p "Do you want to continue with this account? (Y/N): " CONTINUE
    if [[ $CONTINUE == "N" || $CONTINUE == "n" ]]; then
        echo -e "${YELLOW}Logging out...${NC}"
        eas logout
        echo -e "${YELLOW}Please run the script again to log in with a different account.${NC}"
        exit 0
    fi
fi

# Ask for build profile if not extracted from secrets
if [ "$USE_SECRETS" != true ] || [ -z "$BUILD_PROFILE" ]; then
    echo
    echo -e "${YELLOW}Available build profiles:${NC}"
    echo -e "${GREEN}1. preview${NC} - Development build with debug tools"
    echo -e "${GREEN}2. simple-apk${NC} - Simple APK without EAS optimizations"
    echo -e "${GREEN}3. production${NC} - Optimized build for release"
    echo
    read -p "Enter your choice (1-3): " PROFILE_CHOICE
    
    if [ "$PROFILE_CHOICE" = "1" ]; then
        BUILD_PROFILE="preview"
    elif [ "$PROFILE_CHOICE" = "2" ]; then
        BUILD_PROFILE="simple-apk"
    elif [ "$PROFILE_CHOICE" = "3" ]; then
        BUILD_PROFILE="production"
    else
        echo -e "${RED}Invalid choice. Using default profile (preview).${NC}"
        BUILD_PROFILE="preview"
    fi
fi

# Ask for build method
echo
echo -e "${YELLOW}Build methods:${NC}"
echo -e "${GREEN}1. EAS Build (Cloud)${NC} - Build in the cloud (requires Expo account)"
echo -e "${GREEN}2. Local Build${NC} - Build locally (requires Android SDK)"
echo
read -p "Enter your choice (1-2): " BUILD_METHOD

if [ "$BUILD_METHOD" = "1" ]; then
    # EAS Build
    echo
    echo -e "${GREEN}Starting EAS build with profile: ${BUILD_PROFILE}${NC}"
    echo
    
    eas build -p android --profile $BUILD_PROFILE --non-interactive
    
    if [ $? -eq 0 ]; then
        echo
        echo -e "${GREEN}Build process started successfully!${NC}"
        echo -e "${YELLOW}You can check the build status on the EAS website or by running:${NC}"
        echo "eas build:list"
    else
        echo
        echo -e "${RED}Build initiation failed.${NC}"
        exit 1
    fi
elif [ "$BUILD_METHOD" = "2" ]; then
    # Local Build
    echo
    echo -e "${YELLOW}Starting local build...${NC}"
    echo -e "${YELLOW}This may take several minutes.${NC}"
    echo
    
    # Check if Android SDK is available
    if [ -z "$ANDROID_SDK_ROOT" ] && [ -z "$ANDROID_HOME" ]; then
        echo -e "${RED}ANDROID_SDK_ROOT or ANDROID_HOME environment variable not set.${NC}"
        echo -e "${RED}Please install Android SDK and set ANDROID_SDK_ROOT environment variable.${NC}"
        exit 1
    fi
    
    # Run the build
    npx expo run:android --variant release
    
    if [ $? -eq 0 ]; then
        echo
        echo -e "${GREEN}Local build completed successfully!${NC}"
        echo -e "${YELLOW}The APK can be found in:${NC}"
        echo "android/app/build/outputs/apk/release/"
    else
        echo
        echo -e "${RED}Local build failed.${NC}"
        exit 1
    fi
else
    echo -e "${RED}Invalid choice. Exiting.${NC}"
    exit 1
fi 