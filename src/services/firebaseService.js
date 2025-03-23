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
    // Return mock success without actually testing Firebase connection
    return {
      success: true,
      message: 'Connection successful! Firebase mocked for development.',
      isMocked: true
    };
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
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete all users from local storage only
  async deleteAllLocalUsers() {
    try {
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
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Keep for backward compatibility but mark as deprecated
  async deleteAllUsers() {
    return this.deleteAllLocalUsers();
  }
}

// Export as a singleton
export default new FirebaseService(); 