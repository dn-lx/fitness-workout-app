import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput,
  TouchableOpacity, 
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ExercisesListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { onSelectExercise } = route.params || {};
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [bodyPartFilter, setBodyPartFilter] = useState('All');
  const [equipmentFilter, setEquipmentFilter] = useState('All');
  
  // Exercise data (in a real app, this would come from a database or API)
  const exercises = [
    { id: '1', name: 'Bench Press', bodyPart: 'Chest', equipment: 'Barbell' },
    { id: '2', name: 'Squats', bodyPart: 'Legs', equipment: 'Barbell' },
    { id: '3', name: 'Deadlift', bodyPart: 'Back', equipment: 'Barbell' },
    { id: '4', name: 'Pull-ups', bodyPart: 'Back', equipment: 'Bodyweight' },
    { id: '5', name: 'Push-ups', bodyPart: 'Chest', equipment: 'Bodyweight' },
    { id: '6', name: 'Shoulder Press', bodyPart: 'Shoulders', equipment: 'Dumbbells' },
    { id: '7', name: 'Lunges', bodyPart: 'Legs', equipment: 'Bodyweight' },
    { id: '8', name: 'Bicep Curls', bodyPart: 'Arms', equipment: 'Dumbbells' },
    { id: '9', name: 'Tricep Extensions', bodyPart: 'Arms', equipment: 'Cable' },
    { id: '10', name: 'Lat Pulldown', bodyPart: 'Back', equipment: 'Cable' },
    { id: '11', name: 'Leg Press', bodyPart: 'Legs', equipment: 'Machine' },
    { id: '12', name: 'Crunches', bodyPart: 'Core', equipment: 'Bodyweight' },
    { id: '13', name: 'Plank', bodyPart: 'Core', equipment: 'Bodyweight' },
    { id: '14', name: 'Russian Twists', bodyPart: 'Core', equipment: 'Dumbbell' },
    { id: '15', name: 'Burpees', bodyPart: 'Full Body', equipment: 'Bodyweight' },
    { id: '16', name: 'Jumping Jacks', bodyPart: 'Cardio', equipment: 'Bodyweight' },
    { id: '17', name: 'Dumbbell Rows', bodyPart: 'Back', equipment: 'Dumbbells' },
    { id: '18', name: 'Leg Curls', bodyPart: 'Legs', equipment: 'Machine' },
    { id: '19', name: 'Chest Flys', bodyPart: 'Chest', equipment: 'Cable' },
    { id: '20', name: 'Lateral Raises', bodyPart: 'Shoulders', equipment: 'Dumbbells' },
  ];
  
  // Get unique body parts and equipment for filters
  const bodyParts = ['All', ...new Set(exercises.map(ex => ex.bodyPart))];
  const equipmentTypes = ['All', ...new Set(exercises.map(ex => ex.equipment))];
  
  // Filter exercises based on search and filters
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBodyPart = bodyPartFilter === 'All' || exercise.bodyPart === bodyPartFilter;
    const matchesEquipment = equipmentFilter === 'All' || exercise.equipment === equipmentFilter;
    return matchesSearch && matchesBodyPart && matchesEquipment;
  });
  
  // Select an exercise
  const handleSelectExercise = (exercise) => {
    if (onSelectExercise) {
      onSelectExercise(exercise.name);
      navigation.goBack();
    }
  };
  
  // Render filter chip
  const renderFilterChip = (label, isActive, onPress) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 mr-2 rounded-full ${
        isActive 
          ? (isDarkMode ? 'bg-blue-600' : 'bg-blue-500') 
          : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
      }`}
    >
      <Text className={`${
        isActive ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-800')
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  // Render exercise item
  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelectExercise(item)}
      className={`flex-row items-center p-4 mb-2 rounded-xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <View className="flex-1">
        <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {item.name}
        </Text>
        <View className="flex-row mt-1">
          <View className={`px-2 py-1 mr-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {item.bodyPart}
            </Text>
          </View>
          <View className={`px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {item.equipment}
            </Text>
          </View>
        </View>
      </View>
      
      {onSelectExercise && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDarkMode ? "#9ca3af" : "#6b7280"} 
        />
      )}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Exercises
          </Text>
          
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons 
              name="close" 
              size={24} 
              color={isDarkMode ? "#f3f4f6" : "#374151"} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View className={`flex-row items-center px-3 py-2 mb-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Ionicons 
            name="search" 
            size={20} 
            color={isDarkMode ? "#9ca3af" : "#6b7280"} 
            className="mr-2"
          />
          <TextInput
            className={`flex-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            placeholder="Search exercises"
            placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={isDarkMode ? "#9ca3af" : "#6b7280"} 
              />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Body Part Filter */}
        <View className="mb-4">
          <Text className={`mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Body Part
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={bodyParts}
            keyExtractor={(item) => item}
            renderItem={({ item }) => renderFilterChip(
              item,
              bodyPartFilter === item,
              () => setBodyPartFilter(item)
            )}
            contentContainerStyle={{ paddingVertical: 4 }}
          />
        </View>
        
        {/* Equipment Filter */}
        <View className="mb-4">
          <Text className={`mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Equipment
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={equipmentTypes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => renderFilterChip(
              item,
              equipmentFilter === item,
              () => setEquipmentFilter(item)
            )}
            contentContainerStyle={{ paddingVertical: 4 }}
          />
        </View>
        
        {/* Results Count */}
        <Text className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'} found
        </Text>
        
        {/* Exercise List */}
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Ionicons 
                name="fitness-outline" 
                size={60} 
                color={isDarkMode ? "#4b5563" : "#d1d5db"} 
              />
              <Text className={`text-lg font-semibold mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No exercises found
              </Text>
              <Text className={`text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
