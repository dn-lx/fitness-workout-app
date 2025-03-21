import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

export default function SimplifiedWorkoutLibraryScreen() {
  const { isDarkMode, t, formatWeight } = useAppContext();
  
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

  // Start a workout - simplified to just show an alert instead of navigating
  const startWorkout = (workout) => {
    Alert.alert('Start Workout', `You selected: ${workout.name}`, [
      { text: 'OK', onPress: () => console.log('Start workout pressed') }
    ]);
  };
  
  // Manage exercises - simplified to just show an alert instead of navigating
  const manageExercises = (workout) => {
    Alert.alert('Edit Workout', `You selected to edit: ${workout.name}`, [
      { text: 'OK', onPress: () => console.log('Edit workout pressed') }
    ]);
  };
  
  // Function to render each workout card
  const renderWorkoutItem = ({ item }) => (
    <View className={`mb-4 rounded-xl overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <View className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Text className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {item.name}
        </Text>
        
        <Text className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {item.exercises.length} {t('exercises')}
        </Text>
        
        {/* Exercise list preview */}
        <View className="mb-4">
          <View className="grid grid-cols-1 gap-2">
            {item.exercises.slice(0, 3).map((exercise, index) => (
              <View key={exercise.id} className="flex-row items-center justify-between py-1">
                <View className="flex-row items-center flex-1">
                  <View 
                    className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} mr-2`}
                  />
                  <Text numberOfLines={1} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {exercise.name}
                  </Text>
                </View>
                <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
                  {exercise.sets} × {exercise.reps} ({formatWeight(exercise.weight)})
                </Text>
              </View>
            ))}
          </View>
          
          {item.exercises.length > 3 && (
            <Text className={`mt-1 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              +{item.exercises.length - 3} more exercises
            </Text>
          )}
        </View>
        
        {/* Button row */}
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => startWorkout(item)}
            className="bg-blue-500 py-3 rounded-lg items-center flex-1"
          >
            <Text className="text-white font-semibold">{t('startWorkout')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => manageExercises(item)}
            className={`py-3 rounded-lg items-center justify-center flex-row px-3 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <Ionicons name="list" size={20} color={isDarkMode ? '#f3f4f6' : '#374151'} />
            <Text className={`ml-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="items-center mb-4">
          <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('workoutLibrary')}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => Alert.alert('Add Workout', 'Create a new workout', [
            { text: 'Cancel' },
            { text: 'Create', onPress: () => console.log('Create workout pressed') }
          ])}
          className={`mb-4 flex-row items-center py-3 px-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
          }`}
        >
          <Ionicons 
            name="add-circle" 
            size={24} 
            color={isDarkMode ? "#f3f4f6" : "#3b82f6"} 
          />
          <Text className={`ml-2 font-medium ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>
            Create New Workout
          </Text>
        </TouchableOpacity>
        
        <Text className={`mb-3 font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {t('selectWorkout')}
        </Text>
        
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={item => item.id}
          scrollEnabled={false} // Because we're using ScrollView as parent
        />
      </ScrollView>
    </SafeAreaView>
  );
}
