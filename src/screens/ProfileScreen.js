import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  // Sample user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joined: 'January 2023',
    workoutsCompleted: 87,
    currentStreak: 12,
    preferences: {
      workoutDuration: '30-45 min',
      fitnessLevel: 'Intermediate',
      workoutDays: ['Mon', 'Wed', 'Fri', 'Sat']
    }
  };

  // Option items for settings
  const settingOptions = [
    { icon: 'person-outline', title: 'Personal Information', screen: 'PersonalInfo' },
    { icon: 'notifications-outline', title: 'Notifications', screen: 'Notifications' },
    { icon: 'fitness-outline', title: 'Workout Preferences', screen: 'WorkoutPreferences' },
    { icon: 'lock-closed-outline', title: 'Privacy & Security', screen: 'Privacy' },
    { icon: 'help-circle-outline', title: 'Help & Support', screen: 'Support' },
    { icon: 'log-out-outline', title: 'Log Out', screen: 'Logout' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-800">Profile</Text>
          <TouchableOpacity className="p-1">
            <Ionicons name="settings-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* User Info Section */}
        <View className="items-center py-6">
          <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
            <Text className="text-2xl font-bold text-white">JD</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-1">{user.name}</Text>
          <Text className="text-sm text-gray-500 mb-1">{user.email}</Text>
          <Text className="text-xs text-gray-400">Member since {user.joined}</Text>
        </View>

        {/* Stats Section */}
        <View className="flex-row bg-gray-50 mx-4 rounded-xl p-4 justify-around items-center">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-800">{user.workoutsCompleted}</Text>
            <Text className="text-sm text-gray-500">Workouts</Text>
          </View>
          <View className="h-10 w-px bg-gray-200" />
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-800">{user.currentStreak}</Text>
            <Text className="text-sm text-gray-500">Day Streak</Text>
          </View>
        </View>

        {/* Preferences Section */}
        <View className="px-4 mt-6 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">Workout Preferences</Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-500">Duration:</Text>
              <Text className="font-medium text-gray-800">{user.preferences.workoutDuration}</Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-500">Fitness Level:</Text>
              <Text className="font-medium text-gray-800">{user.preferences.fitnessLevel}</Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-500">Workout Days:</Text>
              <Text className="font-medium text-gray-800">{user.preferences.workoutDays.join(', ')}</Text>
            </View>
          </View>
        </View>

        {/* Settings Options */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">Settings</Text>
          {settingOptions.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Ionicons name={option.icon} size={18} color="#4b5563" />
              </View>
              <Text className="flex-1 text-base text-gray-800">{option.title}</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Version info */}
        <View className="items-center pb-6">
          <Text className="text-xs text-gray-400">App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
