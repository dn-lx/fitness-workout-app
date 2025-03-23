import React, { createContext, useState, useEffect, useContext } from 'react';
import firebaseService from '../services/firebaseService';

// Create context
const UserContext = createContext(null);

// Create provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncAttempted, setSyncAttempted] = useState(false);

  // Automatically load user on app start
  useEffect(() => {
    loadUser();
  }, []);
  
  // Load user from database
  const loadUser = async () => {
    try {
      setLoading(true);
      // Get the first user (demo app)
      const result = await firebaseService.getUser();
      if (result.success) {
        console.log('User loaded from database:', result.user.email);
        setUser(result.user);
      } else {
        console.log('No user found in the database');
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };
  
  // Save user data
  const saveUser = async (userData) => {
    try {
      console.log('Saving user data:', userData.email);
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!userData.email || !userData.name) {
        setError('Email and name are required');
        return { success: false, error: 'Email and name are required' };
      }
      
      // Save to Firebase
      const result = await firebaseService.saveUser(userData);
      
      if (result.success) {
        console.log('User saved successfully:', result.user.email);
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        console.error('Failed to save user:', result.error);
        setError('Failed to save user data: ' + (result.error || 'Unknown error'));
        return { success: false, error: result.error || 'Unknown error' };
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Failed to save user data: ' + err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete current user
  const deleteUser = async () => {
    try {
      if (!user || !user.email) {
        return { success: false, error: 'No user to delete' };
      }
      
      setLoading(true);
      const result = await firebaseService.deleteUser(user.email);
      
      if (result.success) {
        console.log('User deleted successfully from local cache');
        setUser(null);
        
        // Reset state after cache clear
        setTimeout(() => {
          loadUser();
        }, 1000);
        
        return { success: true };
      } else {
        console.error('Failed to delete user:', result.error);
        setError('Failed to delete user: ' + (result.error || 'Unknown error'));
        return { success: false, error: result.error || 'Unknown error' };
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user: ' + err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete all users (from local database only)
  const deleteAllLocalUsers = async () => {
    try {
      setLoading(true);
      const result = await firebaseService.deleteAllLocalUsers();
      
      if (result.success) {
        console.log('Users deleted successfully:', result.message);
        setUser(null);
        
        // Reset state and reload data after a short delay
        setTimeout(() => {
          loadUser();
        }, 1000);
        
        return { success: true, message: result.message };
      } else {
        console.error('Failed to delete users:', result.error);
        setError('Failed to delete users: ' + (result.error || 'Unknown error'));
        return { success: false, error: result.error || 'Unknown error' };
      }
    } catch (err) {
      console.error('Error deleting users:', err);
      setError('Failed to delete users: ' + err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // For backward compatibility
  const deleteAllUsers = async () => {
    console.warn('DEPRECATED: Use deleteAllLocalUsers instead');
    return deleteAllLocalUsers();
  };

  // Sync local user to cloud if needed - with retry protection
  const syncLocalUserToCloud = async () => {
    try {
      // Prevent multiple sync attempts
      if (syncAttempted) {
        console.log('Sync already attempted, not trying again');
        return { success: false, error: 'Sync already attempted', alreadyAttempted: true };
      }
      
      // Mark that we've attempted a sync
      setSyncAttempted(true);
      setLoading(true);
      
      // Check connection first
      const connectionTest = await firebaseService.checkFirebaseConnection();
      if (!connectionTest.success) {
        console.warn('Cannot sync user - Firebase connection failed:', connectionTest.error);
        return { success: false, error: `Cannot connect to Firebase: ${connectionTest.error}` };
      }
      
      // Attempt the sync
      console.log('Attempting to sync user to cloud...');
      const result = await firebaseService.syncLocalUserToCloud();
      
      if (result.success) {
        console.log('Sync successful:', result.message);
        // Update user if needed
        if (result.localUser && !user) {
          setUser(result.localUser);
        }
        return { success: true, result };
      } else {
        console.error('Sync failed:', result.error);
        return { success: false, error: result.error, code: result.code };
      }
    } catch (err) {
      console.error('Error in syncLocalUserToCloud:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Check sync status between local and cloud databases (for diagnostics)
  const checkDatabaseSync = async () => {
    try {
      setLoading(true);
      return await firebaseService.checkDatabaseSync();
    } catch (err) {
      console.error('Error checking database sync:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        saveUser,
        loadUser,
        deleteUser,
        deleteAllUsers,
        deleteAllLocalUsers,
        syncLocalUserToCloud,
        checkDatabaseSync
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 