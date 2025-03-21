import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';

export default function AddExerciseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { workout, selectedExercise, onAddExercise } = route.params;
  const { isDarkMode, formatWeight } = useAppContext();
  
  // Form state
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('8');
  const [weight, setWeight] = useState('');
  const [restTime, setRestTime] = useState('60');
  const [oneRepMax, setOneRepMax] = useState('');
  
  // Calculate One Rep Max when reps and weight change
  useEffect(() => {
    if (reps && weight && !oneRepMax) {
      // Brzycki formula: 1RM = w × (36 / (37 - r))
      const repsVal = parseInt(reps);
      const weightVal = parseFloat(weight);
      
      if (!isNaN(repsVal) && !isNaN(weightVal) && repsVal > 0 && repsVal < 37) {
        const orm = Math.round(weightVal * (36 / (37 - repsVal)) * 10) / 10;
        setOneRepMax(orm.toString());
      }
    }
  }, [reps, weight, oneRepMax]);
  
  const handleSave = () => {
    if (!sets || !reps) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    const newExercise = {
      id: selectedExercise.id,
      name: selectedExercise.name,
      category: selectedExercise.category,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: weight ? parseFloat(weight) : 0,
      restTime: restTime ? parseInt(restTime) : 60,
      oneRepMax: oneRepMax ? parseFloat(oneRepMax) : 0,
      orderPosition: workout.exercises ? workout.exercises.length : 0
    };
    
    if (onAddExercise) {
      onAddExercise(newExercise);
    }
    
    navigation.goBack();
  };
  
  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#f9fafb' : '#1f2937'} />
          </TouchableOpacity>
          <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Add Exercise
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            className="p-2"
          >
            <Ionicons name="checkmark" size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          className="flex-1 p-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Exercise Info */}
          <View 
            className={`p-5 rounded-xl mb-6 ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'}`}
            style={{
              shadowColor: isDarkMode ? '#4F46E5' : '#6366F1',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text className="text-white text-2xl font-bold mb-1">
              {selectedExercise.name}
            </Text>
            <Text className="text-white text-opacity-80">
              {selectedExercise.category}
            </Text>
          </View>
          
          {/* Form Fields */}
          <View className="space-y-5">
            <View>
              <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Sets*
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
                placeholder="Sets (e.g. 3)"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              />
            </View>
            
            <View>
              <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Reps*
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
                placeholder="Reps (e.g. 10)"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              />
            </View>
            
            <View>
              <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Weight
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="Weight (e.g. 135)"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              />
            </View>
            
            <View>
              <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Rest Time (seconds)
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                value={restTime}
                onChangeText={setRestTime}
                keyboardType="numeric"
                placeholder="Rest Time (e.g. 60)"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              />
            </View>
            
            <View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  One Rep Max
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (reps && weight) {
                      const repsVal = parseInt(reps);
                      const weightVal = parseFloat(weight);
                      if (!isNaN(repsVal) && !isNaN(weightVal) && repsVal > 0 && repsVal < 37) {
                        const orm = Math.round(weightVal * (36 / (37 - repsVal)) * 10) / 10;
                        setOneRepMax(orm.toString());
                      }
                    }
                  }}
                  className="bg-indigo-500 px-2 py-1 rounded-lg"
                >
                  <Text className="text-xs text-white">Calculate</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                value={oneRepMax}
                onChangeText={setOneRepMax}
                keyboardType="numeric"
                placeholder="Auto-calculated from weight & reps"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              />
            </View>
          </View>
          
          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className={`mt-8 py-4 rounded-xl ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'}`}
            style={{
              shadowColor: isDarkMode ? '#4F46E5' : '#6366F1',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Add to Workout
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
