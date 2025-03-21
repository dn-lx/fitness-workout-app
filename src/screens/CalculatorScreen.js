import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  // One Rep Max Calculator state
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRepMax, setOneRepMax] = useState(null);

  // Add Workout state
  const [workoutName, setWorkoutName] = useState('');
  const [workoutCategory, setWorkoutCategory] = useState('');

  // Add Exercise state
  const [exerciseName, setExerciseName] = useState('');
  const [category, setCategory] = useState('');
  const [equipment, setEquipment] = useState('');

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
    if (!workoutName || !workoutCategory) {
      Alert.alert('Error', 'Please fill in all workout fields');
      return;
    }

    // In a real app, this would save to a database or state management
    Alert.alert('Success', `Workout "${workoutName}" added successfully!`);
    setWorkoutName('');
    setWorkoutCategory('');
  };

  // Add a new exercise to current workout
  const addExerciseToWorkout = () => {
    if (!exerciseName || !category || !equipment) {
      Alert.alert('Error', 'Please fill in all exercise fields');
      return;
    }

    // In a real app, this would save to a database or state management
    Alert.alert('Success', `Exercise "${exerciseName}" added to current workout!`);
    setExerciseName('');
    setCategory('');
    setEquipment('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 pt-4">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Fitness Settings</Text>
          
          {/* One Rep Max Calculator Section */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="barbell-outline" size={24} color="#3b82f6" />
              <Text className="text-xl font-semibold text-gray-800 ml-2">One Rep Max Calculator</Text>
            </View>
            
            <View className="mb-3">
              <Text className="text-gray-700 mb-1">Weight (lbs/kg)</Text>
              <TextInput
                className="bg-white px-3 py-2 rounded-lg border border-gray-300"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter weight"
              />
            </View>
            
            <View className="mb-3">
              <Text className="text-gray-700 mb-1">Reps</Text>
              <TextInput
                className="bg-white px-3 py-2 rounded-lg border border-gray-300"
                keyboardType="numeric"
                value={reps}
                onChangeText={setReps}
                placeholder="Enter reps"
              />
            </View>
            
            <TouchableOpacity
              onPress={calculateOneRepMax}
              className="bg-blue-500 py-3 rounded-lg items-center mb-3"
            >
              <Text className="text-white font-semibold">Calculate</Text>
            </TouchableOpacity>
            
            {oneRepMax !== null && (
              <View className="bg-white p-3 rounded-lg border border-blue-200">
                <Text className="text-center font-semibold text-lg text-blue-800">
                  Your One Rep Max: {oneRepMax} {weight ? 'lbs/kg' : ''}
                </Text>
              </View>
            )}
          </View>
          
          {/* Add Workout Section */}
          <View className="bg-purple-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="add-circle-outline" size={24} color="#8b5cf6" />
              <Text className="text-xl font-semibold text-gray-800 ml-2">Add Workout</Text>
            </View>
            
            <View className="mb-3">
              <Text className="text-gray-700 mb-1">Workout Name</Text>
              <TextInput
                className="bg-white px-3 py-2 rounded-lg border border-gray-300"
                value={workoutName}
                onChangeText={setWorkoutName}
                placeholder="Enter workout name"
              />
            </View>
            
            <View className="mb-3">
              <Text className="text-gray-700 mb-1">Category</Text>
              <TextInput
                className="bg-white px-3 py-2 rounded-lg border border-gray-300"
                value={workoutCategory}
                onChangeText={setWorkoutCategory}
                placeholder="E.g., Full Body, Upper Body, Lower Body"
              />
            </View>
            
            <TouchableOpacity
              onPress={addWorkout}
              className="bg-purple-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Add Workout</Text>
            </TouchableOpacity>
          </View>
          
          {/* Add Exercise to Current Workout Section */}
          <View className="bg-green-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="add-circle-outline" size={24} color="#10b981" />
              <Text className="text-xl font-semibold text-gray-800 ml-2">Add Exercise to Current Workout</Text>
            </View>
            
            <View className="mb-3">
              <Text className="text-gray-700 mb-1">Exercise Name</Text>
              <TextInput
                className="bg-white px-3 py-2 rounded-lg border border-gray-300"
                value={exerciseName}
                onChangeText={setExerciseName}
                placeholder="Enter exercise name"
              />
            </View>
            
            <View className="mb-3">
              <Text className="text-gray-700 mb-1">Category</Text>
              <TextInput
                className="bg-white px-3 py-2 rounded-lg border border-gray-300"
                value={category}
                onChangeText={setCategory}
                placeholder="E.g., Chest, Back, Legs"
              />
            </View>
            
            <View className="mb-3">
              <Text className="text-gray-700 mb-1">Equipment</Text>
              <TextInput
                className="bg-white px-3 py-2 rounded-lg border border-gray-300"
                value={equipment}
                onChangeText={setEquipment}
                placeholder="E.g., Barbell, Dumbbell, Machine"
              />
            </View>
            
            <TouchableOpacity
              onPress={addExerciseToWorkout}
              className="bg-green-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Add to Current Workout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
