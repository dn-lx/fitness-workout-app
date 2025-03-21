import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StatsCard({ stat }) {
  return (
    <View className="flex-1 bg-gray-50 p-3 rounded-xl">
      <View className="w-8 h-8 bg-blue-100 items-center justify-center rounded-full mb-2">
        <Ionicons name={stat.icon} size={18} color="#3b82f6" />
      </View>
      <Text className="text-gray-500 text-xs">{stat.title}</Text>
      <Text className="text-gray-800 font-bold text-lg">{stat.value}</Text>
    </View>
  );
}
