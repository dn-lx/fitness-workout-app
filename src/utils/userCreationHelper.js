// Helper functions for user creation screen
import firebaseService from '../services/firebaseService';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Save user data to Firebase database
 * @param {Object} userData User data to save
 * @returns {Promise<Object>} Result of the save operation
 */
export const saveUserToDatabase = async (userData) => {
  try {
    // Validate user data
    if (!userData || typeof userData !== 'object') {
      return { success: false, error: 'Invalid user data provided' };
    }

    // Get reference to users collection
    const usersRef = collection(db, 'users');
    
    // Create a new user document with auto-generated ID
    const newUserRef = doc(usersRef);
    
    // Add timestamp for tracking
    const userDataWithTimestamp = {
      ...userData,
      id: newUserRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Save the user to Firestore
    await setDoc(newUserRef, userDataWithTimestamp);
    
    // Return success with user data
    return { 
      success: true, 
      user: { id: newUserRef.id, ...userData } 
    };
  } catch (error) {
    // Return error information
    return { 
      success: false, 
      error: error.message || 'Failed to save user to database' 
    };
  }
}; 