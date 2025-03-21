import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutCard({ workout }) {
  // Use placeholder image if no image provided
  const imageSource = workout.image 
    ? { uri: workout.image } 
    : null;

  return (
    <TouchableOpacity className="flex-row bg-gray-50 rounded-xl mb-3 overflow-hidden">
      <View className="w-24 h-24 bg-gray-200 justify-center items-center">
        {imageSource ? (
          <Image source={imageSource} className="w-full h-full" />
        ) : (
          <Ionicons name="fitness-outline" size={32} color="#9ca3af" />
        )}
      </View>
      <View className="flex-1 p-3 justify-center">
        <Text className="text-lg font-semibold text-gray-800">{workout.title}</Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-gray-500 text-sm mr-4">
            <Ionicons name="time-outline" size={14} color="#6b7280" /> {workout.duration}
          </Text>
          <Text className="text-gray-500 text-sm">
            <Ionicons name="barbell-outline" size={14} color="#6b7280" /> {workout.level}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
