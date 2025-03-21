import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ExercisesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Sample data for demo purposes
  const exercises = [
    { id: '1', name: 'Bench Press', category: 'Chest', equipment: 'Barbell' },
    { id: '2', name: 'Squats', category: 'Legs', equipment: 'Barbell' },
    { id: '3', name: 'Pull-ups', category: 'Back', equipment: 'Bodyweight' },
    { id: '4', name: 'Shoulder Press', category: 'Shoulders', equipment: 'Dumbbell' },
    { id: '5', name: 'Deadlift', category: 'Back', equipment: 'Barbell' },
    { id: '6', name: 'Bicep Curls', category: 'Arms', equipment: 'Dumbbell' },
    { id: '7', name: 'Tricep Extensions', category: 'Arms', equipment: 'Cable' },
    { id: '8', name: 'Leg Press', category: 'Legs', equipment: 'Machine' },
    { id: '9', name: 'Lat Pulldown', category: 'Back', equipment: 'Cable' },
    { id: '10', name: 'Crunches', category: 'Core', equipment: 'Bodyweight' },
  ];

  const filters = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  // Filter exercises based on search query and category filter
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || exercise.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity className="flex-row bg-gray-50 rounded-xl mb-3 p-4 justify-between items-center">
      <View>
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-gray-500 text-sm">
            <Ionicons name="fitness-outline" size={14} color="#6b7280" /> {item.category}
          </Text>
        </View>
      </View>
      <View className="bg-blue-100 px-3 py-1 rounded-full">
        <Text className="text-blue-800 font-medium text-sm">{item.equipment}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Exercises</Text>
        
        {/* Search bar */}
        <View className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg mb-4">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search exercises"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Category filters */}
        <View className="flex-row mb-4">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filters}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setActiveFilter(item)}
                className={`px-4 py-2 mr-2 rounded-full ${activeFilter === item ? 'bg-blue-500' : 'bg-gray-200'}`}
              >
                <Text className={`font-medium ${activeFilter === item ? 'text-white' : 'text-gray-800'}`}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        
        {/* Exercise list */}
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-gray-500 text-lg">No exercises found</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
