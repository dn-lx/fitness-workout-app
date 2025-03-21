import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Components
import WorkoutCard from '../components/WorkoutCard';

export default function WorkoutsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Sample data for demo purposes
  const workouts = [
    { id: '1', title: 'Full Body Burn', duration: '30 min', level: 'Beginner', category: 'Strength', image: null },
    { id: '2', title: 'HIIT Challenge', duration: '25 min', level: 'Advanced', category: 'Cardio', image: null },
    { id: '3', title: 'Yoga Flow', duration: '40 min', level: 'Intermediate', category: 'Flexibility', image: null },
    { id: '4', title: 'Core Crusher', duration: '20 min', level: 'Beginner', category: 'Strength', image: null },
    { id: '5', title: 'Cardio Blast', duration: '35 min', level: 'Advanced', category: 'Cardio', image: null },
    { id: '6', title: 'Stretch & Relax', duration: '30 min', level: 'Beginner', category: 'Flexibility', image: null },
  ];

  const filters = ['All', 'Strength', 'Cardio', 'Flexibility'];

  // Filter workouts based on search query and category filter
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || workout.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Workouts</Text>
        
        {/* Search bar */}
        <View className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg mb-4">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search workouts"
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
        
        {/* Workout list */}
        <FlatList
          data={filteredWorkouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <WorkoutCard workout={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-gray-500 text-lg">No workouts found</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
