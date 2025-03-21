import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import WorkoutLibraryScreen from '../screens/WorkoutLibraryScreen';
import TrainingHubScreen from '../screens/TrainingHubScreen';
import WorkoutExecutionScreen from '../screens/WorkoutExecutionScreen';
import ExerciseManagementScreen from '../screens/ExerciseManagementScreen';
import ExercisesListScreen from '../screens/ExercisesListScreen';
import { useAppContext } from '../context/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Bar Icon
function tabBarIcon({ focused, color, size }, route) {
  let iconName;

  if (route.name === 'WorkoutsTab') {
    iconName = focused ? 'barbell' : 'barbell-outline';
  } else if (route.name === 'TrainingHubTab') {
    iconName = focused ? 'fitness' : 'fitness-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
}

// Stack Navigator for Workouts Tab
function WorkoutsStack() {
  const { isDarkMode } = useAppContext();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? '#374151' : '#E5E7EB',
        },
        headerTintColor: isDarkMode ? '#FFFFFF' : '#1F2937',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }
      }}
    >
      <Stack.Screen 
        name="WorkoutLibrary" 
        component={WorkoutLibraryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="WorkoutExecution" 
        component={WorkoutExecutionScreen}
        options={({ route }) => ({ 
          title: route.params?.workout?.name || 'Workout',
          headerBackTitle: 'Back'
        })}
      />
      <Stack.Screen 
        name="ExerciseManagement" 
        component={ExerciseManagementScreen}
        options={({ route }) => ({ 
          title: `Edit ${route.params?.workout?.name || 'Workout'}`,
          headerBackTitle: 'Back' 
        })}
      />
      <Stack.Screen 
        name="ExercisesList" 
        component={ExercisesListScreen}
        options={{ 
          title: 'Select Exercise',
          headerBackTitle: 'Back' 
        }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for Training Hub Tab
function TrainingHubStack() {
  const { isDarkMode } = useAppContext();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? '#374151' : '#E5E7EB',
        },
        headerTintColor: isDarkMode ? '#FFFFFF' : '#1F2937',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }
      }}
    >
      <Stack.Screen 
        name="TrainingHub" 
        component={TrainingHubScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ExercisesList" 
        component={ExercisesListScreen}
        options={{ 
          title: 'Select Exercise',
          headerBackTitle: 'Back' 
        }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator with tabs
export default function AppNavigator() {
  const { isDarkMode, t } = useAppContext();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => tabBarIcon(props, route),
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : '#ffffff',
          borderTopColor: isDarkMode ? '#374151' : '#E5E7EB',
        },
        tabBarActiveTintColor: isDarkMode ? '#6366F1' : '#4F46E5',
        tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="WorkoutsTab" 
        component={WorkoutsStack}
        options={{ title: t('workouts') }}
      />
      <Tab.Screen 
        name="TrainingHubTab" 
        component={TrainingHubStack} 
        options={{ title: t('trainingHub') }}
      />
    </Tab.Navigator>
  );
}