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
  Switch,
  Modal,
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TrainingHubScreen() {
  const navigation = useNavigation();
  // One Rep Max Calculator state
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRepMax, setOneRepMax] = useState(null);

  // Add Workout state
  const [workoutName, setWorkoutName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Add Exercise state
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseSets, setExerciseSets] = useState('');
  const [exerciseReps, setExerciseReps] = useState('');
  const [exerciseIntensity, setExerciseIntensity] = useState('');
  const [exerciseRest, setExerciseRest] = useState('');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  
  // Theme and Language settings
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  // Sample data for workout selection
  const workouts = [
    { id: '1', name: 'Monday Full Body' },
    { id: '2', name: 'Tuesday Upper Body' },
    { id: '3', name: 'Thursday Lower Body' },
    { id: '4', name: 'Saturday HIIT' },
    { id: '5', name: 'Custom Workout 1' },
    { id: '6', name: 'Custom Workout 2' },
  ];

  // Sample categories for workouts
  const workoutCategories = [
    'Full Body', 'Upper Body', 'Lower Body', 'Push', 'Pull', 'Legs', 'Cardio', 'HIIT', 'Strength', 'Flexibility'
  ];

  // Sample exercises data for dropdown
  const exercisesList = [
    'Bench Press', 'Squats', 'Deadlift', 'Pull-ups', 'Push-ups', 'Shoulder Press', 
    'Lunges', 'Bicep Curls', 'Tricep Extensions', 'Lat Pulldown', 'Leg Press', 
    'Crunches', 'Plank', 'Russian Twists', 'Burpees', 'Jumping Jacks'
  ];

  // Calculate One Rep Max using Brzycki formula
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

    if (repsValue <= 0) {
      Alert.alert('Error', 'Reps must be greater than 0');
      return;
    }

    // Brzycki formula: 1RM = Weight × (36 / (37 - Reps))
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

  // Add a new exercise to workout
  const addExerciseToWorkout = () => {
    if (!exerciseName || !exerciseSets || !exerciseReps || !exerciseIntensity || !exerciseRest || !selectedWorkout) {
      Alert.alert('Error', 'Please fill in all exercise fields and select a workout');
      return;
    }

    // In a real app, this would save to a database or state management
    Alert.alert('Success', `Exercise "${exerciseName}" added to "${selectedWorkout.name}" workout!`);
    setExerciseName('');
    setExerciseSets('');
    setExerciseReps('');
    setExerciseIntensity('');
    setExerciseRest('');
  };

  // Open ExercisesList modal to select an exercise
  const openExercisesModal = () => {
    navigation.navigate('ExercisesList', {
      onSelectExercise: (name) => {
        setExerciseName(name);
      }
    });
  };

  // Navigate to preferences screen
  const goToPreferences = () => {
    navigation.navigate('Preferences');
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 pt-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Training Hub
            </Text>
            
            {/* Preferences button */}
            <TouchableOpacity 
              onPress={goToPreferences}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <Ionicons name="settings-outline" size={24} color={isDarkMode ? "#f3f4f6" : "#374151"} />
            </TouchableOpacity>
          </View>
          
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
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
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
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>
            
            <TouchableOpacity
              onPress={calculateOneRepMax}
              className="bg-blue-500 py-3 rounded-lg items-center mb-3"
            >
              <Text className="text-white font-semibold">Calculate</Text>
            </TouchableOpacity>
            
            {oneRepMax !== null && (
              <View className={`${isDarkMode ? 'bg-gray-700 border-blue-900' : 'bg-white border-blue-200'} p-3 rounded-lg border`}>
                <Text className={`text-center font-semibold text-lg ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  Your One Rep Max: {oneRepMax} {weight ? 'lbs/kg' : ''}
                </Text>
              </View>
            )}
          </View>
          
          {/* Add Workout Section */}
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'} rounded-xl p-4 mb-6`}>
            <View className="flex-row items-center mb-3">
              <Ionicons 
                name="add-circle-outline" 
                size={24} 
                color={isDarkMode ? "#f3f4f6" : "#8b5cf6"} 
              />
              <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} ml-2`}>
                Add Workout
              </Text>
            </View>
            
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Workout Name</Text>
              <TextInput
                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} px-3 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                value={workoutName}
                onChangeText={setWorkoutName}
                placeholder="Enter workout name"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>
            
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Categories</Text>
              <TouchableOpacity 
                className={`flex-row items-center justify-between py-2 px-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {selectedCategories.length > 0 
                    ? selectedCategories.join(', ') 
                    : 'Select categories'}
                </Text>
                <Ionicons 
                  name="chevron-down" 
                  size={20} 
                  color={isDarkMode ? "#f3f4f6" : "#6b7280"} 
                />
              </TouchableOpacity>

              {/* Category Selection Modal */}
              <Modal
                visible={showCategoryModal}
                transparent={true}
                animationType="slide"
              >
                <View className="flex-1 justify-end">
                  <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-xl pt-4 pb-6`}>
                    <View className="flex-row justify-between items-center px-4 mb-4">
                      <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Select Categories
                      </Text>
                      <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                        <Ionicons 
                          name="close" 
                          size={24} 
                          color={isDarkMode ? "#f3f4f6" : "#6b7280"} 
                        />
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      data={workoutCategories}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                          className="flex-row items-center py-3 px-4"
                          onPress={() => toggleCategory(item)}
                        >
                          <View className={`w-6 h-6 mr-2 border rounded flex items-center justify-center ${isDarkMode ? 'border-gray-500' : 'border-gray-400'} ${selectedCategories.includes(item) ? (isDarkMode ? 'bg-purple-700' : 'bg-purple-500') : 'bg-transparent'}`}>
                            {selectedCategories.includes(item) && (
                              <Ionicons name="checkmark" size={16} color="#ffffff" />
                            )}
                          </View>
                          <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                    <TouchableOpacity 
                      className="mt-4 mx-4 bg-purple-500 py-3 rounded-lg items-center"
                      onPress={() => setShowCategoryModal(false)}
                    >
                      <Text className="text-white font-semibold">Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            
            <TouchableOpacity
              onPress={addWorkout}
              className="bg-purple-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Add Workout</Text>
            </TouchableOpacity>
          </View>
          
          {/* Add Exercise to Workout Section */}
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-green-50'} rounded-xl p-4 mb-6`}>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Ionicons 
                  name="add-circle-outline" 
                  size={24} 
                  color={isDarkMode ? "#f3f4f6" : "#10b981"} 
                />
                <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} ml-2`}>
                  Add Exercise to Workout
                </Text>
              </View>
              
              {/* Exercise list button */}
              <TouchableOpacity 
                onPress={openExercisesModal}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-green-100'}`}
              >
                <Ionicons name="list-outline" size={20} color={isDarkMode ? "#f3f4f6" : "#10b981"} />
              </TouchableOpacity>
            </View>

            {/* Workout selection buttons - Wrapped in a flexbox layout */}
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Select Workout:</Text>
              <View className="flex-row flex-wrap">
                {workouts.map(workout => (
                  <TouchableOpacity
                    key={workout.id}
                    onPress={() => setSelectedWorkout(workout)}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                      selectedWorkout?.id === workout.id 
                        ? (isDarkMode ? 'bg-green-700' : 'bg-green-500') 
                        : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                    }`}
                  >
                    <Text className={`${
                      selectedWorkout?.id === workout.id ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-800')
                    }`}>
                      {workout.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Exercise Name</Text>
              <TouchableOpacity
                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} px-3 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} flex-row justify-between items-center`}
                onPress={openExercisesModal}
              >
                <Text className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                  {exerciseName || 'Select an exercise'}
                </Text>
                <Ionicons name="search" size={20} color={isDarkMode ? "#f3f4f6" : "#6b7280"} />
              </TouchableOpacity>
            </View>
            
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Sets</Text>
              <TextInput
                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} px-3 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                keyboardType="numeric"
                value={exerciseSets}
                onChangeText={setExerciseSets}
                placeholder="Number of sets"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>
            
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Reps</Text>
              <TextInput
                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} px-3 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                keyboardType="numeric"
                value={exerciseReps}
                onChangeText={setExerciseReps}
                placeholder="Number of reps"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>
            
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Intensity (weight/level)</Text>
              <TextInput
                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} px-3 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                value={exerciseIntensity}
                onChangeText={setExerciseIntensity}
                placeholder="E.g., 50kg, Level 5"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>
            
            <View className="mb-3">
              <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Rest Period (seconds)</Text>
              <TextInput
                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} px-3 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                keyboardType="numeric"
                value={exerciseRest}
                onChangeText={setExerciseRest}
                placeholder="Rest between sets (seconds)"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>
            
            <TouchableOpacity
              onPress={addExerciseToWorkout}
              className="bg-green-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Add to Workout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
