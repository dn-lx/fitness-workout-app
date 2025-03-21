import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CurrentWorkoutScreen() {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Sample workout data (in a real app, this would come from state management/context/redux)
  const [workouts, setWorkouts] = useState([
    {
      id: '1',
      name: 'Monday Full Body',
      exercises: [
        { id: '1', name: 'Bench Press', sets: 4, reps: 10, weight: 135, restTime: 60, completed: false },
        { id: '2', name: 'Squats', sets: 3, reps: 12, weight: 185, restTime: 90, completed: false },
        { id: '3', name: 'Lat Pulldown', sets: 3, reps: 12, weight: 120, restTime: 60, completed: false },
        { id: '4', name: 'Shoulder Press', sets: 3, reps: 10, weight: 65, restTime: 60, completed: false },
        { id: '5', name: 'Bicep Curls', sets: 3, reps: 12, weight: 30, restTime: 45, completed: false },
      ]
    },
    {
      id: '2',
      name: 'Tuesday Upper Body',
      exercises: [
        { id: '1', name: 'Bench Press', sets: 4, reps: 8, weight: 155, restTime: 90, completed: false },
        { id: '2', name: 'Incline Press', sets: 3, reps: 10, weight: 135, restTime: 60, completed: false },
        { id: '3', name: 'Pull-ups', sets: 3, reps: 8, weight: 0, restTime: 60, completed: false },
        { id: '4', name: 'Shoulder Press', sets: 3, reps: 10, weight: 65, restTime: 60, completed: false },
        { id: '5', name: 'Tricep Extensions', sets: 3, reps: 12, weight: 40, restTime: 45, completed: false },
      ]
    },
    {
      id: '3',
      name: 'Thursday Lower Body',
      exercises: [
        { id: '1', name: 'Squats', sets: 4, reps: 8, weight: 205, restTime: 120, completed: false },
        { id: '2', name: 'Deadlifts', sets: 3, reps: 8, weight: 225, restTime: 120, completed: false },
        { id: '3', name: 'Leg Press', sets: 3, reps: 12, weight: 300, restTime: 90, completed: false },
        { id: '4', name: 'Leg Extensions', sets: 3, reps: 12, weight: 110, restTime: 60, completed: false },
        { id: '5', name: 'Calf Raises', sets: 4, reps: 15, weight: 100, restTime: 45, completed: false },
      ]
    },
    {
      id: '4',
      name: 'Saturday HIIT',
      exercises: [
        { id: '1', name: 'Burpees', sets: 3, reps: 15, weight: 0, restTime: 30, completed: false },
        { id: '2', name: 'Mountain Climbers', sets: 3, reps: 20, weight: 0, restTime: 30, completed: false },
        { id: '3', name: 'Jumping Jacks', sets: 3, reps: 30, weight: 0, restTime: 30, completed: false },
        { id: '4', name: 'Kettlebell Swings', sets: 3, reps: 15, weight: 35, restTime: 30, completed: false },
        { id: '5', name: 'Box Jumps', sets: 3, reps: 12, weight: 0, restTime: 30, completed: false },
      ]
    },
  ]);

  // Start a workout
  const startWorkout = (workout) => {
    // Navigate to workout execution screen with the selected workout
    navigation.navigate('WorkoutExecution', { workout });
  };
  
  // Function to render each workout card
  const renderWorkoutItem = ({ item }) => (
    <View className={`mb-4 rounded-xl overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <View className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Text className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {item.name}
        </Text>
        
        <Text className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {item.exercises.length} exercises
        </Text>
        
        {/* Exercise list preview */}
        <View className="mb-4">
          {item.exercises.slice(0, 3).map((exercise, index) => (
            <View key={exercise.id} className="flex-row items-center py-1">
              <View 
                className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} mr-2`}
              />
              <Text className={`flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {exercise.name} - {exercise.sets} × {exercise.reps}
              </Text>
            </View>
          ))}
          
          {item.exercises.length > 3 && (
            <Text className={`ml-4 mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              +{item.exercises.length - 3} more
            </Text>
          )}
        </View>
        
        <TouchableOpacity
          onPress={() => startWorkout(item)}
          className="bg-blue-500 py-3 rounded-lg items-center"
        >
          <Text className="text-white font-semibold">Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="flex-1 px-4 pt-4">
        <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
          Workout Library
        </Text>
        <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
          Select a workout to begin
        </Text>
        
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkoutItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}
