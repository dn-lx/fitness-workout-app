import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing notification settings
const NOTIFICATION_SETTINGS_KEY = '@fitness_app_notification_settings';

// Helper to check if the device can receive push notifications
export const checkNotificationPermissions = async () => {
  try {
    // Check if notifications are enabled for the app
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus !== 'granted') {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      
      if (status !== 'granted') {
        return { 
          granted: false, 
          error: 'Permission not granted' 
        };
      }
    }

    // For Android 13+ and iOS, we need to ensure permissions are granted
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        return { 
          granted: false, 
          error: 'Permission not granted' 
        };
      }
    }

    // Simulator warning - silent in release
    if (!Device.isDevice) {
      console.log('Push Notifications may not work fully in emulators/simulators');
    }

    // Get Expo push token if available
    const token = await getPushNotificationToken();
    
    return { granted: true, token };
  } catch (error) {
    console.error('Notification permission error:', error);
    return { 
      granted: false, 
      error: error.message 
    };
  }
};

// Get the Expo push notification token
export const getPushNotificationToken = async () => {
  try {
    // Check if we're running on a physical device
    if (!Device.isDevice) {
      return null;
    }
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return null;
    }
    
    // Get the Expo push token
    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
    
    return token;
  } catch (error) {
    return null;
  }
};

// Schedule a local notification
export const scheduleLocalNotification = async (title, body, trigger = null, data = {}) => {
  try {
    // Default trigger is immediate notification
    const notificationTrigger = trigger || null;
    
    // Schedule the notification
    const notificationContent = {
      title,
      body,
      data,
      sound: true,
    };
    
    const notificationRequest = {
      content: notificationContent,
      trigger: notificationTrigger,
    };
    
    const notificationId = await Notifications.scheduleNotificationAsync(notificationRequest);
    return { success: true, notificationId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Schedule a daily workout reminder
export const scheduleWorkoutReminder = async (time = '18:00', title, body) => {
  try {
    // Parse the time string (format: HH:MM)
    const [hours, minutes] = time.split(':').map(Number);
    
    // Create a trigger for a daily notification at the specified time
    const trigger = {
      hour: hours,
      minute: minutes,
      repeats: true,
    };
    
    // Default title and body if not provided
    const notificationTitle = title || "It's workout time!";
    const notificationBody = body || "Don't forget your fitness routine for today.";
    
    // Schedule the notification with the workout reminder type
    return await scheduleLocalNotification(
      notificationTitle,
      notificationBody,
      trigger,
      { type: 'workout_reminder' }
    );
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Save notification settings to AsyncStorage
export const saveNotificationSettings = async (settings) => {
  try {
    // Validate settings object
    if (!settings) {
      throw new Error('Settings object is required');
    }
    
    // Default settings structure
    const defaultSettings = {
      enabled: true,
      workoutReminders: true,
      reminderTime: '18:00',
      announcements: true,
    };
    
    // Merge with defaults
    const mergedSettings = { ...defaultSettings, ...settings };
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(
      NOTIFICATION_SETTINGS_KEY, 
      JSON.stringify(mergedSettings)
    );
    
    // If notifications are enabled and workout reminders are enabled,
    // schedule the workout reminder, otherwise cancel all
    if (mergedSettings.enabled && mergedSettings.workoutReminders) {
      await scheduleWorkoutReminder(mergedSettings.reminderTime);
    } else {
      await cancelAllNotifications();
    }
    
    return { success: true, settings: mergedSettings };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get notification settings from AsyncStorage
export const getNotificationSettings = async () => {
  try {
    // Default settings
    const defaultSettings = {
      enabled: true,
      workoutReminders: true,
      reminderTime: '18:00',
      announcements: true,
    };
    
    // Get from AsyncStorage
    const settingsJson = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    
    if (!settingsJson) {
      // If no settings found, save and return defaults
      await saveNotificationSettings(defaultSettings);
      return defaultSettings;
    }
    
    // Parse the settings
    const settings = JSON.parse(settingsJson);
    
    // Merge with defaults in case structure has changed
    const mergedSettings = { ...defaultSettings, ...settings };
    
    return mergedSettings;
  } catch (error) {
    // On error, return default settings
    return {
      enabled: true,
      workoutReminders: true,
      reminderTime: '18:00',
      announcements: true,
    };
  }
};

export default {
  checkNotificationPermissions,
  getPushNotificationToken,
  scheduleLocalNotification,
  scheduleWorkoutReminder,
  cancelAllNotifications,
  saveNotificationSettings,
  getNotificationSettings,
}; 