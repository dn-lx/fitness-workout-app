import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Create a Tab Navigator
const Tab = createBottomTabNavigator();

// Simple Screen Components
const ExercisesScreen = () => (
  <View style={styles.screenContainer}>
    <View style={styles.header}>
      <Text style={styles.headerText}>Exercises</Text>
    </View>
    <ScrollView style={styles.content}>
      {['Bench Press', 'Squats', 'Deadlift', 'Overhead Press'].map((exercise, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{exercise}</Text>
          <Text style={styles.cardSubtitle}>Category</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

const WorkoutScreen = () => (
  <View style={styles.screenContainer}>
    <View style={styles.header}>
      <Text style={styles.headerText}>Current Workout</Text>
    </View>
    <View style={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>No active workout</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.screenContainer}>
    <View style={styles.header}>
      <Text style={styles.headerText}>Settings</Text>
    </View>
    <View style={styles.content}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>One Rep Max Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Add New Exercise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Create Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// Main App component with navigation
export default function TestApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            if (route.name === 'Exercises') {
              iconName = focused ? 'barbell' : 'barbell-outline';
            } else if (route.name === 'Workout') {
              iconName = focused ? 'fitness' : 'fitness-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4F46E5',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Exercises" component={ExercisesScreen} />
        <Tab.Screen name="Workout" component={WorkoutScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  settingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
    color: '#444',
  },
});
