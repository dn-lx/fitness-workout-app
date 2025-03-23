import { 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { 
  ref as storageRef, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Collection reference
const WORKOUTS_COLLECTION = 'workouts';

// Replace with a simple ID generator function
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Workout Service - Handles all workout-related functionality
 */
class WorkoutService {
  /**
   * Upload a workout image to Firebase Storage
   * 
   * @param {string} uri - The local image URI
   * @returns {Promise<string>} The download URL for the uploaded image
   */
  async uploadWorkoutImage(uri) {
    try {
      if (!uri) return null;

      // Convert uri to blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Generate a unique filename
      const filename = `workouts/${generateId()}.jpg`;
      const reference = storageRef(storage, filename);
      
      // Upload the blob
      await uploadBytesResumable(reference, blob);
      
      // Get the download URL
      return await getDownloadURL(reference);
    } catch (error) {
      console.error('Error uploading workout image:', error);
      throw error;
    }
  }

  /**
   * Save a workout to Firestore
   * 
   * @param {Object} workoutData - Workout data to save
   * @param {string} workoutImage - Optional image URI to upload
   * @returns {Object} Result with success status and workout data
   */
  async saveWorkout(workoutData, workoutImage = null) {
    try {
      if (!workoutData || !workoutData.userId) {
        return { success: false, error: 'Missing required data' };
      }
      
      // Upload workout image if provided
      let imageURL = null;
      if (workoutImage) {
        imageURL = await this.uploadWorkoutImage(workoutImage);
      }
      
      // Prepare workout data
      const workoutWithMetadata = {
        ...workoutData,
        imageURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Delete local image URI as it's not needed in the database
      delete workoutWithMetadata.imageUri;
      
      // Save workout to Firestore
      const workoutsRef = collection(db, WORKOUTS_COLLECTION);
      const docRef = await setDoc(doc(workoutsRef, workoutData.id), workoutWithMetadata);
      
      return {
        success: true,
        workout: {
          id: workoutData.id,
          ...workoutData,
          imageURL,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to save workout' 
      };
    }
  }

  /**
   * Get workouts for a specific user
   * 
   * @param {string} userId - The user ID to get workouts for
   * @returns {Object} Result with success status and workouts array
   */
  async getUserWorkouts(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }
      
      // Query workouts collection for user's workouts
      const workoutsQuery = query(
        collection(db, WORKOUTS_COLLECTION), 
        where("userId", "==", userId)
      );
      
      const snapshot = await getDocs(workoutsQuery);
      
      // Convert to array of workout objects
      const workouts = [];
      snapshot.forEach(doc => {
        workouts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return {
        success: true,
        workouts
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to get workouts' 
      };
    }
  }
}

// Export as a singleton
export default new WorkoutService(); 