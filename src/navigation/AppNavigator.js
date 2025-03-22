import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import UserCreationScreen from '../screens/UserCreationScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import styles
import { navigationStyles, tabBarOptions, stackScreenOptions, colors } from '../styles';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator (for the main app screens)
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textLight,
      tabBarStyle: navigationStyles.tabBar,
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Workouts"
      component={WorkoutsScreen}
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
      name="Settings"
      component={SettingsScreen}
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
  return (
    <Stack.Navigator
      initialRouteName="UserCreation"
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
        }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 