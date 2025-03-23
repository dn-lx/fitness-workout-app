import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getUserByEmail, 
  saveUser, 
  anyUsersExist, 
  syncLocalUserToCloud, 
  checkDatabaseSync 
} from '../services/userService';
import { testFirebaseConnection, deleteAllLocalUsers } from '../services/firebaseService';

// Create the context
const UserContext = createContext();

// User provider component
export const UserProvider = ({ children }) => {
  // State for the current user
  const [user, setUser] = useState(null);
  
  // State for loading status
  const [loading, setLoading] = useState(true);
  
  // State for sync status
  const [syncStatus, setSyncStatus] = useState({
    attempted: false,
    success: false,
    lastAttempt: null
  });
  
  // Load user on component mount
  useEffect(() => {
    loadUser();
  }, []);
  
  // Function to load user from database
  const loadUser = async () => {
    setLoading(true);
    
    try {
      // Check if any users exist
      const usersExistResult = await anyUsersExist('local');
      
      if (usersExistResult.exists) {
        // Get all users (in a real app, you'd have a way to identify the current user)
        const result = await getUserByEmail('user@example.com', 'local');
        
        if (result.success) {
          setUser(result.user);
        }
      }
    } catch (err) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };
  
  // Function to save user to database
  const saveUserData = async (userData) => {
    try {
      // Save user data
      const result = await saveUser(userData);
      
      if (result.success) {
        // Update state with the saved user
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  // Function to delete user (from local cache only)
  const deleteUser = async () => {
    try {
      // For now, just remove from state
      setUser(null);
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  // Function to delete all users (development only)
  const deleteAllUsers = async () => {
    try {
      // Delete all users from local
      const result = await deleteAllLocalUsers();
      
      if (result.success) {
        // Clear current user
        setUser(null);
        return { success: true, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  // Function to sync local user to cloud
  const syncUserToCloud = async () => {
    // Don't try to sync again if already attempted
    if (syncStatus.attempted) {
      return { 
        success: false, 
        error: 'Sync already attempted',
        attempted: true
      };
    }
    
    try {
      // Update sync status
      setSyncStatus({
        ...syncStatus,
        attempted: true,
        lastAttempt: new Date().toISOString()
      });
      
      // Test connection first
      const connectionTest = await testFirebaseConnection('cloud');
      
      if (!connectionTest.success) {
        return { 
          success: false, 
          error: 'Firebase connection failed',
          attempted: true
        };
      }
      
      // User must exist to sync
      if (!user || !user.email) {
        return { 
          success: false, 
          error: 'No user to sync',
          attempted: true
        };
      }
      
      // Perform the sync
      const result = await syncLocalUserToCloud(user.email);
      
      // Update sync status
      setSyncStatus({
        attempted: true,
        success: result.success,
        lastAttempt: new Date().toISOString()
      });
      
      return result;
    } catch (err) {
      setSyncStatus({
        attempted: true,
        success: false,
        lastAttempt: new Date().toISOString()
      });
      
      return { 
        success: false, 
        error: err.message,
        attempted: true
      };
    }
  };
  
  // Check database sync status
  const checkSyncStatus = async () => {
    try {
      const status = await checkDatabaseSync();
      return status;
    } catch (err) {
      return { 
        success: false, 
        error: err.message 
      };
    }
  };
  
  // Context value
  const value = {
    user,
    loading,
    syncStatus,
    loadUser,
    saveUser: saveUserData,
    deleteUser,
    deleteAllUsers,
    syncUserToCloud,
    checkSyncStatus
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

export default UserContext; 