import { useState, useEffect, useRef } from 'react';
import firebaseService from '../services/firebaseService';
import { useUser } from '../contexts/UserContext';

/**
 * Custom hook to determine the initial route based on whether users exist
 * @returns {Object} Object containing initialRoute and isLoading state
 */
export const useInitialRoute = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { syncLocalUserToCloud } = useUser();
  const syncAttemptedRef = useRef(false);

  useEffect(() => {
    const checkForExistingUsers = async () => {
      try {
        console.log('Checking for existing users...');
        
        // Use the specialized method to check if any users exist
        const usersExist = await firebaseService.anyUsersExist();
        
        if (usersExist) {
          console.log('Existing users found, setting route to MainTabs');
          setInitialRoute('MainTabs');
          
          // Only attempt to sync once to prevent loops
          if (!syncAttemptedRef.current) {
            syncAttemptedRef.current = true;
            
            // Attempt sync in background, don't wait for completion
            syncLocalUserToCloud()
              .then(result => {
                if (result.success) {
                  console.log('User synced to cloud successfully');
                } else if (result.alreadyAttempted) {
                  console.log('Sync was already attempted, continuing');
                } else {
                  console.warn('Sync failed, continuing anyway:', result.error);
                }
              })
              .catch(error => {
                console.error('Error during sync:', error);
              });
            
            // End loading state after a short delay regardless of sync
            setTimeout(() => setIsLoading(false), 1000);
          } else {
            setIsLoading(false);
          }
        } else {
          console.log('No users found, setting route to UserCreation');
          setInitialRoute('UserCreation');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking for users:', error);
        // Default to UserCreation on error
        setInitialRoute('UserCreation');
        setIsLoading(false);
      }
    };

    checkForExistingUsers();
  }, [syncLocalUserToCloud]);

  return { 
    initialRoute: initialRoute || 'UserCreation', // Default to UserCreation if null
    isLoading 
  };
}; 