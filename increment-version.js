const fs = require('fs');
const path = require('path');

// Function to increment version code
const incrementVersionCode = () => {
  try {
    // Read app.json
    const appJsonPath = path.join(__dirname, 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    // Handle Android version
    let androidVersionCode = appJson.expo.android.versionCode || 1;
    androidVersionCode++;
    appJson.expo.android.versionCode = androidVersionCode;
    
    // Handle iOS version (buildNumber)
    if (!appJson.expo.ios) {
      appJson.expo.ios = {};
    }
    
    let iosBuildNumber = appJson.expo.ios.buildNumber || "1";
    let iosBuild = parseInt(iosBuildNumber);
    iosBuild++;
    appJson.expo.ios.buildNumber = iosBuild.toString();
    
    // Save app.json
    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
    console.log(`Updated app.json: Android version code now ${androidVersionCode}, iOS build number now ${iosBuild}`);
    
    // Update android/app/build.gradle
    try {
      const gradlePath = path.join(__dirname, 'android', 'app', 'build.gradle');
      if (fs.existsSync(gradlePath)) {
        let gradleContent = fs.readFileSync(gradlePath, 'utf8');
        
        // Replace the versionCode in the gradle file
        gradleContent = gradleContent.replace(
          /versionCode\s+\d+/,
          `versionCode ${androidVersionCode}`
        );
        
        fs.writeFileSync(gradlePath, gradleContent);
        console.log(`Updated build.gradle: Version code now ${androidVersionCode}`);
      }
    } catch (gradleError) {
      console.warn('Could not update Android build.gradle file:', gradleError.message);
      console.log('Continuing with app.json update only');
    }
    
    // Update iOS project if it exists
    try {
      const iosProjectPath = path.join(__dirname, 'ios');
      if (fs.existsSync(iosProjectPath)) {
        // For Expo-managed iOS projects, the buildNumber in app.json is sufficient
        // For bare workflow projects, you would need to update Info.plist
        console.log(`iOS build number updated in app.json. For bare workflow projects, you may need to update Info.plist manually.`);
      }
    } catch (iosError) {
      console.warn('Could not check iOS project:', iosError.message);
    }
    
    return {
      androidVersionCode,
      iosBuildNumber: iosBuild
    };
  } catch (error) {
    console.error('Failed to increment version code:', error);
    process.exit(1);
  }
};

// Run the increment function
incrementVersionCode(); 