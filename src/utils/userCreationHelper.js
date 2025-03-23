// Helper functions for user creation screen
import firebaseService from '../services/firebaseService';

/**
 * Save user data to Firebase
 * @param {Object} userData - User data from form
 * @returns {Promise<Object>} Result of the save operation
 */
export const saveUserToDatabase = async (userData) => {
  try {
    // Calculate age from date of birth
    const today = new Date();
    const birthDate = new Date(userData.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Format date of birth as ISO string for Firestore
    const formattedDob = userData.dob instanceof Date ? userData.dob.toISOString() : userData.dob;
    
    // Prepare user data with age
    const completeUserData = {
      ...userData,
      dob: formattedDob,
      age,
    };
    
    // Save to Firebase
    const result = await firebaseService.saveUser(completeUserData);
    
    if (result.success) {
      console.log('User saved successfully to Firebase:', result.user);
      return { success: true, user: result.user };
    } else {
      console.error('Failed to save user to Firebase:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in saveUserToDatabase:', error);
    return { success: false, error: error.message || 'Unknown error saving user' };
  }
}; 