import React, { useState } from 'react';
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

export default function CreateExerciseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { onCreateExercise } = route.params || {};
  const { isDarkMode } = useAppContext();
  
  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  
  // Available categories
  const categories = [
    'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body', 'Other'
  ];
  
  const handleSave = () => {
    if (!name || !category) {
      Alert.alert('Missing Information', 'Please enter an exercise name and select a category');
      return;
    }
    
    const db = require('../data/database').default;
    const newExercise = db.addExercise({
      name,
      category,
      notes
    });
    
    if (onCreateExercise) {
      onCreateExercise(newExercise);
    }
    
    Alert.alert('Success', 'Exercise added successfully');
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
            Create New Exercise
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
            <View className="flex-row items-center mb-2">
              <Ionicons name="barbell" size={24} color="white" />
              <Text className="text-white text-xl font-bold ml-2">New Exercise Details</Text>
            </View>
            <Text className="text-white text-opacity-80">
              Fill in the details to create a new exercise in your database
            </Text>
          </View>
          
          {/* Form Fields */}
          <View className="space-y-5">
            <View>
              <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Exercise Name*
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                value={name}
                onChangeText={setName}
                placeholder="Enter exercise name"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              />
            </View>
            
            <View>
              <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Category*
              </Text>
              <TouchableOpacity
                onPress={() => setCategoryModalVisible(true)}
                className={`px-4 py-3 rounded-xl flex-row justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
              >
                <Text className={category ? (isDarkMode ? 'text-white' : 'text-gray-800') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                  {category || 'Select a category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>
            
            <View>
              <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Notes (Optional)
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any additional notes about the exercise"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={{ height: 100 }}
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
              Create Exercise
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Category Selection Modal */}
      {categoryModalVisible && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
          <View 
            className={`w-4/5 rounded-xl p-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Select Category
              </Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>
            
            <ScrollView className="max-h-80">
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setCategory(cat);
                    setCategoryModalVisible(false);
                  }}
                  className={`py-3 ${index < categories.length - 1 ? (isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''}`}
                >
                  <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} ${cat === category ? 'font-bold text-indigo-500' : ''}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
