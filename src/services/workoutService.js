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
      // Generate a unique filename using timestamp
      const filename = `workout_${Date.now()}.jpg`;
      
      // Create a reference to the image path in storage
      const storageReference = storageRef(storage, `workout-images/${filename}`);
      
      // Fetch the image from the URI
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Upload the image
      await uploadBytesResumable(storageReference, blob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageReference);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading workout image:', error);
      return null;
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
      // Generate a unique ID for the workout
      const workoutId = `workout_${Date.now()}`;
      
      // Upload workout image if provided
      let imageURL = null;
      if (workoutImage) {
        imageURL = await this.uploadWorkoutImage(workoutImage);
      }
      
      // Add image URL and timestamps to workout data
      const workoutWithMetadata = {
        ...workoutData,
        imageURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Save workout to Firestore
      await setDoc(doc(db, WORKOUTS_COLLECTION, workoutId), workoutWithMetadata);
      
      return {
        success: true,
        workout: {
          id: workoutId,
          ...workoutData,
          imageURL,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };
    } catch (error) {
      console.error('Error saving workout:', error);
      return {
        success: false,
        error: error.message
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
      console.error('Error getting user workouts:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export as a singleton
export default new WorkoutService(); 