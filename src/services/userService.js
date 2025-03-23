import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  serverTimestamp,
  addDoc,
  query,
  limit
} from 'firebase/firestore';
import { 
  ref as storageRef, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage, useEmulators, cloudDb } from '../config/firebase';
import { STORAGE_TYPE } from './firestoreService';

// Collection reference
const USERS_COLLECTION = 'users';

/**
 * User Service - Handles all user-related functionality
 */
class UserService {
  /**
   * Save a user to both local and cloud databases
   * 
   * @param {Object} userData - User data to save
   * @returns {Object} Result with success status and user data
   */
  async saveUser(userData) {
    try {
      console.log('Saving user:', userData.email);
      
      // Validate input
      if (!userData || !userData.email) {
        console.error('Invalid user data - email is required');
        return {
          success: false,
          error: 'Email is required'
        };
      }
      
      // Generate a unique ID or use the email as ID
      const userId = userData.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      // Clean up data before storing
      const cleanData = this.sanitizeUserData(userData);
      
      // Save to BOTH cloud and local databases
      const results = {
        local: null,
        cloud: null
      };
      
      // Create base user data
      const userWithTimestamps = {
        ...cleanData,
        email: userData.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // 1. SAVE TO CLOUD FIRST
      try {
        console.log('Saving user to CLOUD Firestore...');
        
        // Create cloud data with cloud storage type
        const cloudUserData = {
          ...userWithTimestamps,
          storageType: STORAGE_TYPE.CLOUD
        };
        
        // Use cloudDb which is never connected to emulators
        const cloudCollection = collection(cloudDb, USERS_COLLECTION);
        const cloudUserRef = await addDoc(cloudCollection, cloudUserData);
        
        console.log('User saved to CLOUD with ID:', cloudUserRef.id);
        results.cloud = {
          success: true,
          id: cloudUserRef.id
        };
      } catch (cloudError) {
        console.error('Error saving to CLOUD:', cloudError);
        results.cloud = {
          success: false,
          error: cloudError.message
        };
      }
      
      // 2. SAVE TO LOCAL EMULATOR
      try {
        console.log('Saving user to LOCAL Firestore emulator...');
        
        // Create local data with local storage type
        const localUserData = {
          ...userWithTimestamps,
          storageType: STORAGE_TYPE.LOCAL
        };
        
        // Use the default db instance (connected to emulator if enabled)
        const localCollection = collection(db, USERS_COLLECTION);
        const localUserRef = await addDoc(localCollection, localUserData);
        
        console.log('User saved to LOCAL with ID:', localUserRef.id);
        results.local = {
          success: true,
          id: localUserRef.id
        };
      } catch (localError) {
        console.error('Error saving to LOCAL:', localError);
        results.local = {
          success: false,
          error: localError.message
        };
      }
      
      // Return overall success status
      const overallSuccess = results.local?.success || results.cloud?.success;
      const userId1 = results.cloud?.success ? results.cloud.id : results.local?.id;
      
      if (overallSuccess) {
        return {
          success: true,
          user: {
            id: userId1,
            ...cleanData,
            createdAt: new Date(),
            updatedAt: new Date(),
            saveResults: results
          }
        };
      } else {
        return {
          success: false,
          error: 'Failed to save user to both LOCAL and CLOUD storage',
          saveResults: results
        };
      }
    } catch (error) {
      console.error('Error saving user:', error);
      return {
        success: false,
        error: error.message || 'Unknown error saving user'
      };
    }
  }
  
  /**
   * Sanitize user data to prevent issues with Firestore
   * 
   * @param {Object} userData - Raw user data
   * @returns {Object} Sanitized data safe for Firestore
   */
  sanitizeUserData(userData) {
    // Create a copy to modify
    const sanitized = { ...userData };
    
    // Remove photoUri because it might be a problem with binary data
    if (sanitized.photoUri) {
      delete sanitized.photoUri;
    }
    
    // Convert date objects to strings
    if (sanitized.dob && sanitized.dob instanceof Date) {
      sanitized.dob = sanitized.dob.toISOString();
    }
    
    // Make sure we're not trying to store undefined values
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === undefined) {
        sanitized[key] = null;
      }
    });
    
    return sanitized;
  }

  /**
   * Upload a user's profile image to Firebase Storage
   * 
   * @param {string} uri - The local image URI
   * @param {string} userId - The user's ID
   * @returns {Promise<string>} The download URL for the uploaded image
   */
  async uploadUserProfileImage(uri, userId) {
    try {
      // Create a reference to the image path in storage
      const storageReference = storageRef(storage, `user-profiles/${userId}/profile.jpg`);
      
      // Fetch the image from the URI
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Upload the image
      await uploadBytesResumable(storageReference, blob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageReference);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return null;
    }
  }

  /**
   * Get a user by email or get the first user if no email is provided
   * 
   * @param {string} email - Optional email to look up
   * @returns {Object} Result with success status and user data
   */
  async getUser(email) {
    try {
      // If email is provided, use it to get the user
      if (email) {
        const userId = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
        
        if (userDoc.exists()) {
          return {
            success: true,
            user: {
              id: userDoc.id,
              ...userDoc.data()
            }
          };
        } else {
          return { success: false, error: 'User not found' };
        }
      } 
      // If no email, try to find the first user (demo app)
      else {
        const usersCollection = collection(db, USERS_COLLECTION);
        const usersSnapshot = await getDocs(usersCollection);
        
        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          return {
            success: true,
            user: {
              id: userDoc.id,
              ...userDoc.data()
            }
          };
        } else {
          return { success: false, error: 'No users found' };
        }
      }
    } catch (error) {
      console.error('Error getting user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if a user exists by email
   * 
   * @param {string} email - The email to check
   * @returns {Promise<boolean>} True if user exists
   */
  async userExists(email) {
    try {
      if (!email) return false;
      
      const userId = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
      
      return userDoc.exists();
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }

  /**
   * Check if any users exist in the local database
   * 
   * @returns {Promise<boolean>} True if any users exist
   */
  async anyUsersExist() {
    try {
      console.log('Checking if any users exist...');
      
      // Query the users collection with a limit of 1
      const usersCollection = collection(db, USERS_COLLECTION);
      const querySnapshot = await getDocs(query(usersCollection, limit(1)));
      
      const exists = !querySnapshot.empty;
      console.log(`Users exist: ${exists}`);
      
      return exists;
    } catch (error) {
      console.error('Error checking if any users exist:', error);
      return false;
    }
  }
  
  /**
   * Sync local user to cloud if not already there
   * 
   * @returns {Object} Result with success status and sync details
   */
  async syncLocalUserToCloud() {
    try {
      console.log('Syncing local user to cloud...');
      
      // 1. Get the first user from local database
      const localUsersCollection = collection(db, USERS_COLLECTION);
      const localSnapshot = await getDocs(query(localUsersCollection, limit(1)));
      
      if (localSnapshot.empty) {
        console.log('No local user found to sync');
        return { success: false, error: 'No local user found' };
      }
      
      // Get the first local user
      const localUserDoc = localSnapshot.docs[0];
      const localUser = { id: localUserDoc.id, ...localUserDoc.data() };
      console.log('Found local user:', localUser.email);
      
      // 2. Check if user exists in cloud by email and birthdate
      console.log('Checking if user exists in cloud...');
      const cloudUsersCollection = collection(cloudDb, USERS_COLLECTION);
      
      try {
        const cloudSnapshot = await getDocs(cloudUsersCollection);
        console.log(`Found ${cloudSnapshot.size} cloud users`);
        
        let userExistsInCloud = false;
        
        // Loop through cloud users to find a match
        cloudSnapshot.forEach(doc => {
          const cloudUser = doc.data();
          if (cloudUser.email === localUser.email && cloudUser.dob === localUser.dob) {
            console.log('User already exists in cloud');
            userExistsInCloud = true;
          }
        });
        
        // 3. If user doesn't exist in cloud, create it
        if (!userExistsInCloud) {
          console.log('User does not exist in cloud. Creating...');
          
          // Prepare user data for cloud
          const cloudUserData = {
            ...localUser,
            storageType: STORAGE_TYPE.CLOUD,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            syncedFromLocal: true
          };
          
          // Remove local-specific fields
          delete cloudUserData.id;
          if (cloudUserData.saveResults) delete cloudUserData.saveResults;
          
          // Save to cloud database
          try {
            const cloudUserRef = await addDoc(collection(cloudDb, USERS_COLLECTION), cloudUserData);
            console.log('User synced to cloud with ID:', cloudUserRef.id);
            return { 
              success: true, 
              message: 'User synced to cloud',
              localUser,
              cloudUserId: cloudUserRef.id
            };
          } catch (saveError) {
            console.error('Error saving to cloud:', saveError);
            return {
              success: false,
              error: `Failed to save to cloud: ${saveError.message}`,
              code: saveError.code
            };
          }
        }
        
        return { 
          success: true, 
          message: 'User already exists in cloud',
          synced: false
        };
      } catch (cloudQueryError) {
        console.error('Error querying cloud database:', cloudQueryError);
        return { 
          success: false, 
          error: `Error querying cloud database: ${cloudQueryError.message}`,
          code: cloudQueryError.code 
        };
      }
    } catch (error) {
      console.error('Error syncing local user to cloud:', error);
      return { success: false, error: error.message, code: error.code };
    }
  }

  /**
   * Check sync status between local and cloud databases
   * 
   * @returns {Object} Result with sync status details
   */
  async checkDatabaseSync() {
    try {
      console.log('Checking database sync status...');
      
      // Get all users from local database
      const localUsersCollection = collection(db, USERS_COLLECTION);
      const localSnapshot = await getDocs(localUsersCollection);
      
      // Get all users from cloud database
      const cloudUsersCollection = collection(cloudDb, USERS_COLLECTION);
      const cloudSnapshot = await getDocs(cloudUsersCollection);
      
      // Build arrays of users from both databases
      const localUsers = localSnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });
      
      const cloudUsers = cloudSnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });
      
      console.log(`Found ${localUsers.length} local users and ${cloudUsers.length} cloud users`);
      
      // Track sync status for each local user
      const syncStatus = [];
      
      // For each local user, check if they exist in the cloud
      for (const localUser of localUsers) {
        const matchingCloudUsers = cloudUsers.filter(cloudUser => 
          cloudUser.email === localUser.email && cloudUser.dob === localUser.dob
        );
        
        syncStatus.push({
          user: localUser.email,
          localId: localUser.id,
          existsInCloud: matchingCloudUsers.length > 0,
          cloudIds: matchingCloudUsers.map(u => u.id),
          createdAt: localUser.createdAt
        });
      }
      
      return {
        success: true,
        localUsers: localUsers.length,
        cloudUsers: cloudUsers.length,
        syncStatus
      };
    } catch (error) {
      console.error('Error checking database sync:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export as a singleton
export default new UserService(); 