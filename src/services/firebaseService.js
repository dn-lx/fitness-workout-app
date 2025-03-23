import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, useEmulators } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import specialized services
import userService from './userService';
import workoutService from './workoutService';

// AsyncStorage keys
const USER_STORAGE_KEY = '@fitness_app_user';

/**
 * Firebase Service - A facade that coordinates access to Firebase services
 * This class delegates to specialized services for different domains
 */
class FirebaseService {
  // Test Firestore connection
  async checkFirebaseConnection() {
    try {
      console.log('Testing Firestore connection...');
      
      // Try to get Firestore collections to verify connection
      const testCollection = collection(db, 'users');
      const snapshot = await getDocs(testCollection);
      
      console.log('Connection successful! Found', snapshot.size, 'documents');
      return {
        success: true,
        message: `Connection successful! Found ${snapshot.size} documents in users collection.`
      };
    } catch (error) {
      console.error('Firebase connection error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // User services (delegated to userService)
  saveUser(userData) {
    return userService.saveUser(userData);
  }

  uploadUserProfileImage(uri, userId) {
    return userService.uploadUserProfileImage(uri, userId);
  }

  getUser(email) {
    return userService.getUser(email);
  }

  userExists(email) {
    return userService.userExists(email);
  }

  anyUsersExist() {
    return userService.anyUsersExist();
  }
  
  syncLocalUserToCloud() {
    return userService.syncLocalUserToCloud();
  }

  checkDatabaseSync() {
    return userService.checkDatabaseSync();
  }

  // Workout services (delegated to workoutService)
  uploadWorkoutImage(uri) {
    return workoutService.uploadWorkoutImage(uri);
  }

  saveWorkout(workoutData, workoutImage) {
    return workoutService.saveWorkout(workoutData, workoutImage);
  }

  getUserWorkouts(userId) {
    return workoutService.getUserWorkouts(userId);
  }

  // Delete user from local storage only
  async deleteUser(email) {
    try {
      if (!email) return { success: false, error: 'Email is required to delete user' };
      
      // Clear from AsyncStorage
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      
      // Additional step: Store a flag indicating we've deleted local data
      await AsyncStorage.setItem('userData_cleared', 'true');
      
      return { 
        success: true, 
        message: 'User data deleted from local storage' 
      };
    } catch (error) {
      console.error('Error deleting user from local storage:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete all users from local storage only
  async deleteAllLocalUsers() {
    try {
      console.log('Deleting all users from local storage only...');
      
      // 1. Clear local storage first
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.setItem('userData_cleared', 'true');
      
      // Clear other related local storage
      const keys = await AsyncStorage.getAllKeys();
      const userDataKeys = keys.filter(key => 
        key.startsWith('@fitness_app_') || 
        key.startsWith('user_') ||
        key.includes('userData')
      );
      
      if (userDataKeys.length > 0) {
        await AsyncStorage.multiRemove(userDataKeys);
      }
      
      // Only delete from local database (Firestore emulator)
      if (useEmulators) {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);
        
        if (!snapshot.empty) {
          // Delete each user document from local database only
          const deletePromises = [];
          snapshot.forEach(document => {
            deletePromises.push(deleteDoc(doc(db, 'users', document.id)));
          });
          
          await Promise.all(deletePromises);
          
          return { 
            success: true, 
            message: `Deleted ${snapshot.size} users from local database only` 
          };
        }
      }
      
      return { 
        success: true, 
        message: 'All user data cleared from local storage' 
      };
    } catch (error) {
      console.error('Error deleting users from local storage:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Keep for backward compatibility but mark as deprecated
  async deleteAllUsers() {
    console.warn('DEPRECATED: Use deleteAllLocalUsers() instead');
    return this.deleteAllLocalUsers();
  }
}

// Export as a singleton
export default new FirebaseService(); 