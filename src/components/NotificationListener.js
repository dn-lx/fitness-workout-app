import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

/**
 * Component that listens for and handles push notifications
 * This component should be added near the root of your navigation structure.
 */
const NotificationListener = () => {
  const navigation = useNavigation();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Set up notification listeners when component mounts

    // Foreground notification listener
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        // Handle a notification received when app is in foreground
        const { data } = notification.request.content;
        
        // Process notification based on type or other properties
        // This is a good place to show in-app alerts if needed
      }
    );

    // Notification response listener (when user taps on notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        // Handle user interaction with the notification
        const { data } = response.notification.request.content;
        
        // Navigate based on notification type
        handleNotificationNavigation(data);
      }
    );

    // Cleanup on unmount
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [navigation]);

  /**
   * Handle navigation based on notification data
   * @param {Object} data - Notification data 
   */
  const handleNotificationNavigation = (data) => {
    if (!data) return;

    // Navigate based on notification type
    switch (data.type) {
      case 'workout_reminder':
        // Navigate to workouts screen
        navigation.navigate('Workouts');
        break;
      
      case 'achievement':
        // Navigate to achievements/progress screen
        navigation.navigate('Progress');
        break;
      
      case 'new_content':
        // Navigate to specific content
        if (data.workoutId) {
          navigation.navigate('WorkoutDetails', { id: data.workoutId });
        }
        break;
        
      case 'test':
        // For test notifications, just go to the home screen
        navigation.navigate('Home');
        break;
        
      default:
        // Default navigation for unspecified types
        navigation.navigate('Home');
    }
  };

  // This component doesn't render anything
  return null;
};

export default NotificationListener; 