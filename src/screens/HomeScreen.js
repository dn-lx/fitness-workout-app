import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Components
import WorkoutCard from '../components/WorkoutCard';
import StatsCard from '../components/StatsCard';

export default function HomeScreen() {
  // Sample data for demo purposes
  const recentWorkouts = [
    { id: '1', title: 'Full Body Burn', duration: '30 min', level: 'Beginner', category: 'Strength', image: null },
    { id: '2', title: 'HIIT Challenge', duration: '25 min', level: 'Advanced', category: 'Cardio', image: null },
  ];

  const stats = [
    { title: 'Workouts', value: '12', icon: 'fitness-outline' },
    { title: 'Calories', value: '1,250', icon: 'flame-outline' },
    { title: 'Minutes', value: '360', icon: 'time-outline' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-500 text-base">Welcome back,</Text>
            <Text className="text-2xl font-bold text-gray-800">John Doe</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
            <Ionicons name="notifications-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Your Activity</Text>
          <View className="flex-row space-x-3">
            {stats.map((stat, index) => (
              <StatsCard key={index} stat={stat} />
            ))}
          </View>
        </View>

        {/* Daily Workout Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Today's Workout</Text>
          <TouchableOpacity className="bg-blue-500 rounded-2xl p-5 flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-white font-semibold text-lg mb-1">Full Body Workout</Text>
              <Text className="text-blue-100 mb-2">7 exercises · 30 minutes</Text>
              <TouchableOpacity className="bg-white rounded-full py-2 px-4 self-start">
                <Text className="text-blue-500 font-medium">Start</Text>
              </TouchableOpacity>
            </View>
            <View className="w-16 h-16 bg-blue-400 rounded-full items-center justify-center">
              <Ionicons name="play" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Workouts Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-800">Recent Workouts</Text>
            <TouchableOpacity>
              <Text className="text-blue-500">View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentWorkouts.map(workout => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </View>

        {/* Categories Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Categories</Text>
          <View className="flex-row flex-wrap justify-between">
            {['Strength', 'Cardio', 'Yoga', 'HIIT'].map((category, index) => (
              <TouchableOpacity key={index} className="bg-gray-100 rounded-xl w-[48%] h-24 mb-3 p-4 justify-between">
                <Ionicons 
                  name={index === 0 ? 'barbell-outline' : 
                        index === 1 ? 'heart-outline' : 
                        index === 2 ? 'body-outline' : 'flash-outline'} 
                  size={24} 
                  color="#1f2937" 
                />
                <Text className="text-gray-800 font-medium">{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
