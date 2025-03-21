import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

export default function SimplifiedTrainingHubScreen() {
  const { isDarkMode, t, formatWeight } = useAppContext();
  
  // One Rep Max Calculator state
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRepMax, setOneRepMax] = useState(null);

  // Add Workout state
  const [workoutName, setWorkoutName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Calculate one rep max
  const calculateOneRepMax = () => {
    if (!weight || !reps) {
      Alert.alert('Error', 'Please enter both weight and reps');
      return;
    }
    
    const weightValue = parseFloat(weight);
    const repsValue = parseInt(reps);
    
    if (isNaN(weightValue) || isNaN(repsValue)) {
      Alert.alert('Error', 'Please enter valid numbers');
      return;
    }
    
    if (repsValue < 1 || repsValue > 30) {
      Alert.alert('Error', 'Reps must be between 1 and 30');
      return;
    }
    
    // Brzycki Formula
    const max = weightValue * (36 / (37 - repsValue));
    setOneRepMax(Math.round(max * 10) / 10); // Round to 1 decimal place
  };

  // Add a new workout
  const addWorkout = () => {
    if (!workoutName || selectedCategories.length === 0) {
      Alert.alert('Error', 'Please provide a workout name and select at least one category');
      return;
    }

    // In a real app, this would save to a database or state management
    Alert.alert('Success', `Workout "${workoutName}" added successfully!`);
    setWorkoutName('');
    setSelectedCategories([]);
  };

  // Toggle workout category selection
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Dummy categories
  const categories = ['Strength', 'Hypertrophy', 'Endurance', 'Power', 'HIIT', 'Full Body', 'Upper Body', 'Lower Body'];

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 pt-4">
          <View className="items-center mb-4">
            <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('trainingHub')}
            </Text>
          </View>
          
          {/* Preferences button in placeholder form */}
          <TouchableOpacity 
            onPress={() => Alert.alert('Preferences', 'This would navigate to preferences in the full app')}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} absolute top-4 right-4`}
          >
            <Ionicons name="settings-outline" size={24} color={isDarkMode ? "#f3f4f6" : "#374151"} />
          </TouchableOpacity>
          
          {/* One Rep Max Calculator Section */}
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} rounded-xl p-4 mb-6`}>
            <View className="flex-row items-center mb-3">
              <Ionicons 
                name="barbell-outline" 
                size={24} 
                color={isDarkMode ? "#f3f4f6" : "#3b82f6"} 
              />
              <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} ml-2`}>
                One Rep Max Calculator
              </Text>
            </View>
            
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Weight (lbs/kg)</Text>
              <TextInput
                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} px-3 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter weight"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              />
            </View>
            
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Reps</Text>
              <TextInput
                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} px-3 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                keyboardType="numeric"
                value={reps}
                onChangeText={setReps}
                placeholder="Enter reps"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              />
            </View>
            
            <TouchableOpacity
              onPress={calculateOneRepMax}
              className="bg-blue-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Calculate</Text>
            </TouchableOpacity>
            
            {oneRepMax !== null && (
              <View className="mt-3 p-3 rounded-lg bg-green-100 border border-green-300">
                <Text className="text-green-800 font-medium text-center">
                  Your estimated 1RM: {oneRepMax} {formatWeight(oneRepMax).includes('kg') ? 'kg' : 'lbs'}
                </Text>
              </View>
            )}
          </View>
          
          {/* Create New Workout Section */}
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'} rounded-xl p-4 mb-6`}>
            <View className="flex-row items-center mb-3">
              <Ionicons 
                name="add-circle-outline" 
                size={24} 
                color={isDarkMode ? "#f3f4f6" : "#8b5cf6"} 
              />
              <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} ml-2`}>
                Create New Workout
              </Text>
            </View>
            
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Workout Name</Text>
              <TextInput
                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} px-3 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                value={workoutName}
                onChangeText={setWorkoutName}
                placeholder="e.g. Monday Push Day"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              />
            </View>
            
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Categories</Text>
              <View className="flex-row flex-wrap">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => toggleCategory(category)}
                    className={`m-1 px-3 py-1 rounded-full ${
                      selectedCategories.includes(category)
                        ? isDarkMode ? 'bg-purple-700' : 'bg-purple-500'
                        : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  >
                    <Text className={
                      selectedCategories.includes(category)
                        ? 'text-white'
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TouchableOpacity
              onPress={addWorkout}
              className="bg-purple-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Create Workout</Text>
            </TouchableOpacity>
          </View>
          
          {/* Placeholder for workout progress trackers */}
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-yellow-50'} rounded-xl p-4 mb-6`}>
            <View className="flex-row items-center mb-3">
              <Ionicons 
                name="trending-up-outline" 
                size={24} 
                color={isDarkMode ? "#f3f4f6" : "#f59e0b"} 
              />
              <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} ml-2`}>
                Progress Tracker
              </Text>
            </View>
            
            <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Your workout statistics will appear here once you complete workouts.
            </Text>
            
            <TouchableOpacity
              onPress={() => Alert.alert('Progress Tracker', 'View detailed workout stats and progress')}
              className={`${isDarkMode ? 'bg-gray-700' : 'bg-yellow-100'} py-3 rounded-lg items-center mt-2`}
            >
              <Text className={`${isDarkMode ? 'text-gray-200' : 'text-yellow-800'} font-medium`}>View Stats</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
