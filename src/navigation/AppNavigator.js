import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { useContext } from 'react';
import { createAppTheme } from '../styles/AppTheme';
import { FontAwesome5 } from '@expo/vector-icons';

// Import screens
import UserCreationScreen from '../screens/UserCreationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import ActiveWorkoutScreen from '../screens/ActiveWorkoutScreen';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import EditWorkoutScreen from '../screens/EditWorkoutScreen';

// Import user context
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab navigator (main app screens)
function MainNavigator() {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? 'dark' : 'light';
  const Scheme = createAppTheme(theme);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Workouts') {
            iconName = 'dumbbell';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Scheme.color.primary,
        tabBarInactiveTintColor: Scheme.color.text,
        tabBarStyle: { 
          backgroundColor: Scheme.color.background,
          borderTopColor: Scheme.color.border,
        },
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Workouts" component={WorkoutsStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function WorkoutsStackNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen name="WorkoutsList" component={WorkoutsScreen} />
      <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} />
      <Stack.Screen name="EditWorkout" component={EditWorkoutScreen} />
      <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
    </Stack.Navigator>
  );
}

// Main navigator
const AppNavigator = ({ initialRouteName = 'UserCreation' }) => {
  const paperTheme = usePaperTheme();
  
  return (
    <Stack.Navigator 
      initialRouteName={initialRouteName}
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        headerStyle: {
          backgroundColor: paperTheme.colors.surface,
        },
        headerTintColor: paperTheme.colors.onSurface,
        contentStyle: {
          backgroundColor: paperTheme.colors.background
        }
      }}
    >
      <Stack.Screen name="UserCreation" component={UserCreationScreen} />
      <Stack.Screen name="MainTabs" component={MainNavigator} />
      <Stack.Screen 
        name="ActiveWorkout" 
        component={ActiveWorkoutScreen}
        options={{ 
          headerShown: true, 
          title: 'Active Workout',
          headerStyle: {
            backgroundColor: paperTheme.colors.surface,
          },
          headerTintColor: paperTheme.colors.onSurface,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 