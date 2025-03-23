import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, ActivityIndicator } from 'react-native';

// Import custom hook for initial route
import { useInitialRoute } from '../hooks/useInitialRoute';
import { useUser } from '../contexts/UserContext';

// Import screens
import UserCreationScreen from '../screens/UserCreationScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StorageTestScreen from '../screens/StorageTestScreen';

// Import styles
import { navigationStyles, tabBarOptions, stackScreenOptions, colors } from '../styles';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create a fallback screen in case components fail to load
const FallbackScreen = ({ route }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <Text style={{ fontSize: 18, marginBottom: 20 }}>Screen not available</Text>
    <Text>Could not load: {route?.name}</Text>
  </View>
);

// Loading screen for initial route determination
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={{ marginTop: 20, fontSize: 16, color: colors.textLight }}>
      Loading...
    </Text>
  </View>
);

// Main tab navigator (for the main app screens)
const MainTabNavigator = () => {
  // Access user context to check loading state
  const { loading } = useUser();
  
  // If user data is still loading, show a simple loading indicator
  // but limit the loading time to prevent infinite loops
  const [localLoading, setLocalLoading] = useState(loading);
  
  // Set a timeout to stop loading after 5 seconds max
  useEffect(() => {
    if (loading) {
      console.log('MainTabs: User data is loading...');
      // Set a timeout to forcibly stop loading after 5 seconds
      const timer = setTimeout(() => {
        console.log('MainTabs: Forcing loading to end after timeout');
        setLocalLoading(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setLocalLoading(false);
    }
  }, [loading]);
  
  // Don't show a loading screen, just render the tabs
  // This prevents blocking UI even if data is still loading
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: navigationStyles.tabBar,
        headerShown: false,
      }}
      initialRouteName="Workouts"
    >
      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen || FallbackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons 
              name="dumbbell" 
              color={color} 
              size={size} 
              style={navigationStyles.tabBarIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Storage"
        component={StorageTestScreen || FallbackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons 
              name="database" 
              color={color} 
              size={size} 
              style={navigationStyles.tabBarIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen || FallbackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons 
              name="cog" 
              color={color} 
              size={size} 
              style={navigationStyles.tabBarIcon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Custom Stack navigator options to ensure scrolling works
const customStackScreenOptions = {
  ...stackScreenOptions,
  cardStyle: { 
    backgroundColor: colors.background,
  },
  contentStyle: {
    flex: 1,
  },
  animationEnabled: true,
  headerMode: 'float',
};

// Main app navigator
const AppNavigator = () => {
  // Use custom hook to determine initial route based on existing users
  const { initialRoute, isLoading } = useInitialRoute();
  
  // Show loading screen while checking for existing users
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  console.log('Initial route determined:', initialRoute);
  
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={customStackScreenOptions}
    >
      <Stack.Screen 
        name="UserCreation" 
        component={UserCreationScreen} 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator} 
        options={{ 
          gestureEnabled: false,
          headerShown: false,
          animationEnabled: true,
        }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 