/**
 * iOS Version Increment Script
 * 
 * This script reads the app.json file, increments iOS version numbers only,
 * and writes the updated file back.
 */

const fs = require('fs');
const path = require('path');

// Path to app.json
const appJsonPath = path.join(__dirname, '..', 'app.json');

try {
  // Read the current app.json file
  const appJsonContent = fs.readFileSync(appJsonPath, 'utf8');
  const appJson = JSON.parse(appJsonContent);
  
  // Get current versions
  const currentVersion = appJson.expo.version;
  const currentIosBuildNumber = appJson.expo.ios.buildNumber;
  
  console.log(`Current version: ${currentVersion}`);
  console.log(`Current iOS buildNumber: ${currentIosBuildNumber}`);
  
  // Parse the semantic version
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  // Increment the patch version
  const newVersion = `${major}.${minor}.${patch + 1}`;
  
  // Increment the iOS build number only
  const newIosBuildNumber = String(Number(currentIosBuildNumber) + 1);
  
  // Update iOS versions in the JSON object
  appJson.expo.version = newVersion;
  appJson.expo.ios.buildNumber = newIosBuildNumber;
  
  // Write the updated app.json back to disk
  fs.writeFileSync(
    appJsonPath,
    JSON.stringify(appJson, null, 2),
    'utf8'
  );
  
  console.log(`Updated version: ${newVersion}`);
  console.log(`Updated iOS buildNumber: ${newIosBuildNumber}`);
  
  console.log('iOS version numbers successfully incremented!');
  process.exit(0);
} catch (error) {
  console.error('Error incrementing iOS version numbers:');
  console.error(error);
  process.exit(1);
} 