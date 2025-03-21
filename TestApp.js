import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Simple screen components
const WorkoutsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Workout Library</Text>
    <Text style={styles.text}>Your workouts will appear here</Text>
  </View>
);

const TrainingHubScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Training Hub</Text>
    <Text style={styles.text}>Your training options will appear here</Text>
  </View>
);

// Create tab navigator
const Tab = createBottomTabNavigator();

// Main app component
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            if (route.name === 'Workouts') {
              iconName = focused ? 'barbell' : 'barbell-outline';
            } else if (route.name === 'TrainingHub') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4F46E5',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Workouts" 
          component={WorkoutsScreen}
          options={{ title: 'Workouts' }}
        />
        <Tab.Screen 
          name="TrainingHub" 
          component={TrainingHubScreen}
          options={{ title: 'Training Hub' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1F2937',
  },
  text: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
