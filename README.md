# Fitness Workouts App

A comprehensive mobile application for fitness enthusiasts to track workouts, set goals, and maintain a healthy lifestyle.

## Features

- **User Authentication**: Create accounts, log in, and manage user profiles
- **Workout Tracking**: Log and monitor workout sessions
- **Multi-language Support**: Available in English, Spanish, French, German, Italian, and Russian
- **Customizable Settings**: Adjust preferences for units (imperial/metric) and language
- **Progress Monitoring**: Track fitness progress over time
- **Dual Database Support**: Local database for development and cloud database for production

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- For local builds: Android Studio / Xcode

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd fitness-workouts-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npx expo start
   ```

4. Open the app in your preferred environment:
   - iOS simulator
   - Android emulator
   - Physical device using Expo Go app
   - Web browser with `npx expo start --web`

## Environment Setup

The app uses Firebase for authentication, database, and storage. You need to set up your own Firebase project:

1. Create a project in [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore Database, and Storage
3. Create a file `src/config/secrets.js` with your Firebase configuration:

```javascript
// SECURITY WARNING: Do not commit this file to version control
export const EAS_CREDENTIALS = {
  username: 'your_expo_username',
  password: 'your_expo_password',
};

export const FIREBASE_CONFIG = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

export const APK_BUILD_CONFIG = {
  profile: 'preview', // Options: preview, simple-apk, production
};
```

### Local vs Cloud Database

The application supports both local and cloud Firebase databases:

- **Local Database**: Used for development and testing, utilizing Firebase Emulators
- **Cloud Database**: Used for production with real-time data synchronization

The application includes a "Delete Local Users" functionality in the Workouts screen (developer option) that allows cleaning up the local database without affecting the cloud database.

To set up Firebase Emulators for local development:

1. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Initialize Firebase Emulators:
   ```
   firebase init emulators
   ```

3. Start the emulators:
   ```
   firebase emulators:start
   ```

## Building APK

### App Versioning

The app includes an automatic version increment system:

- The version code/build number automatically increments each time you build using the build scripts
- For Android: `versionCode` is incremented (an integer value)
- For iOS: `buildNumber` is incremented (a string value)
- The version is displayed in the Settings screen, showing both the semantic version (1.0.0) and the build number
- The automatic increment happens in these build commands:
  - `npm run build:android` - For Android APK with version increment
  - `npm run build:android-app-bundle` - For Android App Bundle with version increment
  - `npm run build:ios` - For iOS build with version increment
  - `npm run build:ios-simulator` - For iOS simulator build with version increment
  - `npm run build:ios-archive` - For iOS archive build with version increment
  - `npm run build:local-apk` - For local Android debug APK with version increment
  - `npm run build:local-ios` - For local iOS build with version increment

To manually increment the version code without building:
```
npm run increment-version
```

This updates:
- The `versionCode` in `app.json` under `expo.android`
- The `buildNumber` in `app.json` under `expo.ios`
- The `versionCode` in `android/app/build.gradle` (if exists)

### Using Build Scripts

The project includes scripts to simplify the APK build process:

#### Windows
- Interactive build: Double-click `build-apk.bat` or run it from CMD/PowerShell
- Automated build with secrets: Double-click `auto-build-apk.bat` or run it from CMD/PowerShell

#### Unix (Linux/macOS)
1. Make the script executable:
   ```
   chmod +x build-apk.sh
   ```

2. Run the script:
   ```
   ./build-apk.sh
   ```

### Manual Build with EAS

1. Ensure you are logged in to EAS:
   ```
   eas login
   ```

2. Configure your build in `eas.json` if needed

3. Build for Android:
   ```
   eas build -p android --profile preview
   ```

4. Build for iOS:
   ```
   eas build -p ios --profile preview
   ```

### Local Build for Android

1. Install the Android SDK and configure environment variables
2. Generate native code:
   ```
   npx expo prebuild --platform android
   ```
3. Build the APK:
   ```
   cd android && ./gradlew assembleRelease
   ```
4. The APK will be in `android/app/build/outputs/apk/release/`

## Project Structure

```
fitness-workouts-app/
├── assets/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── config/          # Configuration files
│   ├── contexts/        # React context providers
│   ├── languages/       # Translations
│   ├── navigation/      # Navigation setup
│   ├── screens/         # App screens
│   ├── services/        # API services
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── app.json             # Expo configuration
├── App.js               # App entry point
├── eas.json             # EAS Build configuration
├── package.json         # Package dependencies
└── README.md            # This file
```

## Development Guidelines

- Follow the existing coding style
- Use components from react-native-paper for consistent UI
- Add translations for all new text in all supported languages
- Test on both Android and iOS before submitting changes

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Expo team for the excellent React Native toolchain
- Firebase for backend services
- All contributors to this project