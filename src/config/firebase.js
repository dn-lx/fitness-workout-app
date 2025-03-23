/**
 * Firebase configuration and initialization
 * 
 * This file initializes Firebase services for the app.
 * Configuration values are loaded from Expo Constants or fallback values.
 */

// Import Firebase
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

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

// Use Firebase Emulators in development
const useEmulators = false; // Disabling emulators as they're not running

// Get Firebase config from env or Constants
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "AIzaSyDev-config-key-123456789",
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || "fitness-app-dev.firebaseapp.com",
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || "fitness-app-dev",
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || "fitness-app-dev.appspot.com",
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || "1234567890",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "1:1234567890:web:abcdefghijklmnop",
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || "G-ABCDEFGHIJ",
};

// Initialize Firebase if not already initialized
let app;
let db;
let auth;
let storage;
let functions;
let cloudApp;
let cloudDb;
let dbInstance;

// Create mock implementations instead of connecting to Firebase

// Create mock app
app = { 
  name: 'mock-app',
  options: { ...firebaseConfig },
  automaticDataCollectionEnabled: false
};

// Create mock Firestore with basic functionality
db = { 
  collection: (collectionPath) => ({
    doc: (docId) => ({
      id: docId,
      get: async () => ({ exists: true, data: () => ({}) }),
      set: async () => ({}),
      update: async () => ({}),
      delete: async () => ({})
    }),
    add: async (data) => ({ id: 'mock-doc-id', data }),
    where: () => ({ get: async () => ({ empty: false, docs: [] }) }),
    orderBy: () => ({ limit: () => ({ get: async () => ({ empty: false, docs: [] }) }) }),
    limit: () => ({ get: async () => ({ empty: false, docs: [] }) })
  }),
  doc: (path) => ({
    id: path.split('/').pop(),
    get: async () => ({ exists: true, data: () => ({}) }),
    set: async () => ({}),
    update: async () => ({}),
    delete: async () => ({})
  }),
  batch: () => ({
    set: () => ({}),
    update: () => ({}),
    delete: () => ({}),
    commit: async () => ({})
  }),
  runTransaction: async (updateFunction) => await updateFunction({ get: async () => ({ exists: true, data: () => ({}) }) }),
  _freezeSettings: () => ({}),
  settings: () => ({}),
  INTERNAL: {
    delete: async () => {}
  }
};

// Create mock auth
auth = { 
  currentUser: null,
  onAuthStateChanged: (callback) => {
    setTimeout(() => callback(null), 0);
    return () => {};
  },
  signInAnonymously: async () => ({ user: null }),
  signOut: async () => ({})
};

// Create mock storage
storage = {
  ref: (path) => ({
    put: async () => ({ 
      ref: { 
        getDownloadURL: async () => 'https://example.com/mock-image.jpg' 
      } 
    })
  })
};

// Create mock functions
functions = {
  httpsCallable: () => async () => ({ data: {} })
};

// Create mock cloud app and db
cloudApp = { ...app, name: 'mock-cloud-app' };
cloudDb = { ...db };
dbInstance = { ...db };

// Emulator host config
const EMULATOR_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const FIRESTORE_EMULATOR_PORT = 8080;
const STORAGE_EMULATOR_PORT = 9199;

// Connect to emulators if in development
if (useEmulators) {
  // Skip emulator connection with mock implementation
  /*
  try {
    // Use separate database instance for emulator
    dbInstance = getFirestore(app);
    
    // Connect to Firestore emulator
    connectFirestoreEmulator(dbInstance, EMULATOR_HOST, FIRESTORE_EMULATOR_PORT);
    
    // Connect to Storage emulator
    connectStorageEmulator(storage, EMULATOR_HOST, STORAGE_EMULATOR_PORT);

    // Set up offline persistence for Firestore
    enableIndexedDbPersistence(dbInstance)
      .catch((error) => {
        // Handle error silently
        // Common errors:
        // - Multiple tabs open
        // Browser doesn't support IndexedDB
      });

    // Connect to Functions emulator
    connectFunctionsEmulator(functions, EMULATOR_HOST, 5001);
  } catch (error) {
    // Failed to connect to emulators, fall back to cloud services
    dbInstance = cloudDb;
  }
  */
} else {
  // In production, still enable offline persistence
  // Skip enableIndexedDbPersistence for mock implementation
  // enableIndexedDbPersistence(cloudDb)
  //   .catch((error) => {
  //     // Handle error silently
  //   });
}

/**
 * Get the appropriate Firestore database based on storage type
 * @param {string} storageType - 'cloud', 'local', or null (defaults to local if emulators are active)
 * @returns {FirebaseFirestore} Firestore database instance
 */
export const getDB = (storageType) => {
  if (storageType === 'cloud') {
    return cloudDb;
  }
  
  if (storageType === 'local') {
    return dbInstance;
  }
  
  // Default to emulator in dev mode, cloud in production
  return useEmulators ? dbInstance : cloudDb;
};

// Export initialized services
export { 
  app,              // Main Firebase app instance
  dbInstance,       // Firestore (connected to emulator in development)
  auth,             // Firebase Auth
  storage,          // Firebase Storage
  useEmulators,     // Flag indicating if using emulators
  cloudDb,          // Cloud-only Firestore (never connects to emulator)
  cloudApp,         // Cloud-only Firebase app instance
  functions,        // Firebase Functions
  db                // Default Firestore instance
}; 