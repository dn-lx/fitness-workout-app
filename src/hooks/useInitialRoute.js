import { useState, useEffect } from 'react';
import { anyUsersExist, syncLocalUserToCloud } from '../services/userService';

/**
 * Custom hook to determine the initial route based on user existence
 * @returns {Object} Object containing the initial route and loading state
 */
const useInitialRoute = () => {
  // State for the initial route
  const [initialRoute, setInitialRoute] = useState(null);
  
  // State for loading status
  const [loading, setLoading] = useState(true);
  
  // State to track sync attempt
  const [syncAttempted, setSyncAttempted] = useState(false);
  
  // Effect to check for existing users and determine the initial route
  useEffect(() => {
    const checkForUsers = async () => {
      try {
        // Check if users exist in the local database
        const result = await anyUsersExist('local');
        
        if (result.exists) {
          // Users exist, go to main tabs
          setInitialRoute('MainTabs');
          
          // Try to sync user to cloud if not already attempted
          if (!syncAttempted) {
            setSyncAttempted(true);
            try {
              // Try to sync the user to cloud Firestore
              const syncResult = await syncLocalUserToCloud();
              
              if (!syncResult.success && syncResult.error !== 'User already exists in cloud') {
                // Non-critical error, we can still proceed
              }
            } catch (error) {
              // Silent error handling - sync failure isn't critical
            }
          }
        } else {
          // No users, go to user creation screen
          setInitialRoute('UserCreation');
        }
      } catch (error) {
        // On error, default to user creation screen
        setInitialRoute('UserCreation');
      } finally {
        // Set loading to false when done
        setLoading(false);
      }
    };
    
    checkForUsers();
  }, [syncAttempted]);
  
  return { initialRoute, loading };
};

export default useInitialRoute; 