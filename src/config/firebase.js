/**
 * Firebase configuration and initialization
 * 
 * This file initializes Firebase services for the app.
 * Actual configuration values are imported from secrets.js
 * (which should not be committed to version control)
 */

// Import Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { Platform } from 'react-native';

// Import configuration from secrets file
import { FIREBASE_CONFIG } from './secrets';

/**
 * Firebase Configuration
 * 
 * This file sets up Firebase services with support for both:
 * - Cloud mode: connecting to the actual Firebase backend
 * - Emulator mode: connecting to local emulators for development
 */

// DEVELOPMENT SETTINGS
// -------------------
// Set this to false before deploying to production
const FORCE_EMULATOR = false; // Always false for mobile APK builds

// Determine if we should use emulators - mobile safe check
const useEmulators = (() => {
  // In mobile environment we need different detection logic
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return FORCE_EMULATOR || __DEV__;
  }
  
  // In web environment
  try {
    return FORCE_EMULATOR || 
      process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true' || 
      (typeof window !== 'undefined' && 
        (window.location.hostname === "localhost" || 
         window.location.hostname === "127.0.0.1"));
  } catch (e) {
    return false; // Default to cloud mode if detection fails
  }
})();

console.log(`Firebase initialized in ${useEmulators ? 'EMULATOR' : 'CLOUD'} mode`);

// Initialize Firebase with configuration from secrets.js
// Make sure to update the FIREBASE_CONFIG in secrets.js with your own Firebase credentials
const app = initializeApp(FIREBASE_CONFIG);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize separate cloud-only instance (never connects to emulators)
const cloudApp = initializeApp(FIREBASE_CONFIG, 'cloudApp');
const cloudDb = getFirestore(cloudApp);

// Connect to emulators if running in development mode
if (useEmulators) {
  try {
    console.log('Connecting to Firebase emulators');
    
    // For mobile, use 10.0.2.2 instead of localhost to access host machine
    const emulatorHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    
    // Connect to Firestore emulator
    connectFirestoreEmulator(db, emulatorHost, 8080);
    console.log('Connected to Firestore emulator');
    
    // Connect to Storage emulator
    connectStorageEmulator(storage, emulatorHost, 9199);
    console.log('Connected to Storage emulator');
    
    // Auth emulator is not used in this app yet
    // connectAuthEmulator(auth, `http://${emulatorHost}:9099`);
  } catch (error) {
    console.error('Failed to connect to emulators:', error);
  }
} else {
  // Enable offline persistence for cloud mode
  try {
    enableMultiTabIndexedDbPersistence(db)
      .then(() => console.log('Offline persistence enabled'))
      .catch((err) => console.warn('Offline persistence not enabled:', err.code));
  } catch (error) {
    console.warn('Error setting up offline persistence:', error);
  }
}

// Export initialized services
export { 
  app,              // Main Firebase app instance
  db,               // Firestore (connected to emulator in development)
  auth,             // Firebase Auth
  storage,          // Firebase Storage
  useEmulators,     // Flag indicating if using emulators
  cloudDb,          // Cloud-only Firestore (never connects to emulator)
  cloudApp          // Cloud-only Firebase app instance
}; 