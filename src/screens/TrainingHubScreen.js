import React, { useState, useEffect } from 'react';
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
  FlatList,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';

export default function TrainingHubScreen() {
  const navigation = useNavigation();
  const { isDarkMode, t, formatWeight } = useAppContext();
  
  // One Rep Max Calculator state
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRepMax, setOneRepMax] = useState(null);

  // Add Workout state
  const [workoutName, setWorkoutName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Add Exercise to Workout state
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseSets, setExerciseSets] = useState('');
  const [exerciseReps, setExerciseReps] = useState('');
  const [exerciseIntensity, setExerciseIntensity] = useState('');
  const [exerciseOneRepMax, setExerciseOneRepMax] = useState('');
  const [exerciseRest, setExerciseRest] = useState('');
  
  // Sample workout data for dropdown
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  
  const workouts = [
    { id: '1', name: 'Monday Full Body' },
    { id: '2', name: 'Tuesday Upper Body' },
    { id: '3', name: 'Thursday Lower Body' },
    { id: '4', name: 'Saturday HIIT' },
  ];
  
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
    setExerciseOneRepMax('');
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

  // Navigate to calculator screen
  const goToCalculator = () => {
    navigation.navigate('Calculator');
  };

  // Navigate to preferences screen
  const goToPreferences = () => {
    navigation.navigate('Preferences');
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={[styles.headerText, isDarkMode ? styles.textLight : styles.textDark]}>
              {t('trainingHub')}
            </Text>
          </View>
          
          {/* Preferences button - positioning it in the top right */}
          <TouchableOpacity 
            onPress={goToPreferences}
            style={[styles.preferencesButton, isDarkMode ? styles.preferencesButtonDark : styles.preferencesButtonLight]}
          >
            <Ionicons name="settings-outline" size={24} color={isDarkMode ? "#f3f4f6" : "#374151"} />
          </TouchableOpacity>
          
          {/* One Rep Max Calculator Section */}
          <View style={[styles.sectionCard, isDarkMode ? styles.sectionCardDark : styles.sectionCardLight, styles.sectionBlue]}>
            <View style={styles.sectionHeader}>
              <Ionicons 
                name="barbell-outline" 
                size={24} 
                color={isDarkMode ? "#f3f4f6" : "#3b82f6"} 
              />
              <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>
                One Rep Max Calculator
              </Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                Weight (lbs/kg)
              </Text>
              <TextInput
                style={[
                  styles.textInput, 
                  isDarkMode ? styles.textInputDark : styles.textInputLight,
                  isDarkMode ? styles.textLight : styles.textDark
                ]}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter weight"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                Reps
              </Text>
              <TextInput
                style={[
                  styles.textInput, 
                  isDarkMode ? styles.textInputDark : styles.textInputLight,
                  isDarkMode ? styles.textLight : styles.textDark
                ]}
                keyboardType="numeric"
                value={reps}
                onChangeText={setReps}
                placeholder="Enter reps"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              />
            </View>
            
            <TouchableOpacity
              onPress={calculateOneRepMax}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Calculate</Text>
            </TouchableOpacity>
            
            {oneRepMax !== null && (
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>
                  Your estimated 1RM: {oneRepMax} {formatWeight(oneRepMax).includes('kg') ? 'kg' : 'lbs'}
                </Text>
              </View>
            )}
          </View>
          
          {/* Create New Workout Section */}
          <View style={[styles.sectionCard, isDarkMode ? styles.sectionCardDark : styles.sectionCardLight, styles.sectionPurple]}>
            <View style={styles.sectionHeader}>
              <Ionicons 
                name="add-circle-outline" 
                size={24} 
                color={isDarkMode ? "#f3f4f6" : "#8b5cf6"} 
              />
              <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>
                Create New Workout
              </Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                Workout Name
              </Text>
              <TextInput
                style={[
                  styles.textInput, 
                  isDarkMode ? styles.textInputDark : styles.textInputLight,
                  isDarkMode ? styles.textLight : styles.textDark
                ]}
                value={workoutName}
                onChangeText={setWorkoutName}
                placeholder="e.g. Monday Push Day"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                Categories
              </Text>
              <View style={styles.categoriesContainer}>
                {['Strength', 'Hypertrophy', 'Endurance', 'Power', 'HIIT', 'Full Body', 'Upper Body', 'Lower Body'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => toggleCategory(category)}
                    style={[
                      styles.categoryPill,
                      selectedCategories.includes(category)
                        ? isDarkMode ? styles.activeCategoryDark : styles.activeCategory
                        : isDarkMode ? styles.inactiveCategoryDark : styles.inactiveCategory
                    ]}
                  >
                    <Text style={[
                      selectedCategories.includes(category)
                        ? styles.textLight
                        : isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TouchableOpacity
              onPress={addWorkout}
              style={styles.purpleButton}
            >
              <Text style={styles.primaryButtonText}>Create Workout</Text>
            </TouchableOpacity>
          </View>
          
          {/* Add Exercise to Workout Section */}
          <View style={[styles.sectionCard, isDarkMode ? styles.sectionCardDark : styles.sectionCardLight, styles.sectionGreen]}>
            <View style={styles.sectionHeader}>
              <Ionicons 
                name="add-outline" 
                size={24} 
                color={isDarkMode ? "#f3f4f6" : "#10b981"} 
              />
              <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>
                Add Exercise to Workout
              </Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                Select Workout
              </Text>
              <TouchableOpacity
                style={[
                  styles.selectInput,
                  isDarkMode ? styles.textInputDark : styles.textInputLight
                ]}
                onPress={() => setShowWorkoutModal(true)}
              >
                <Text style={isDarkMode ? styles.textLight : styles.textDark}>
                  {selectedWorkout ? selectedWorkout.name : "Select a workout"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={isDarkMode ? "#f3f4f6" : "#374151"} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                Exercise
              </Text>
              <View style={styles.row}>
                <TextInput
                  style={[
                    styles.textInput, 
                    styles.flex1,
                    isDarkMode ? styles.textInputDark : styles.textInputLight,
                    isDarkMode ? styles.textLight : styles.textDark
                  ]}
                  value={exerciseName}
                  onChangeText={setExerciseName}
                  placeholder="Choose an exercise"
                  placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
                />
                <TouchableOpacity 
                  style={[styles.iconButton, isDarkMode ? styles.iconButtonDark : styles.iconButtonLight]}
                  onPress={openExercisesModal}
                >
                  <Ionicons name="search" size={24} color={isDarkMode ? "#f3f4f6" : "#374151"} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.rowBetween}>
              <View style={[styles.formGroup, styles.columnHalf]}>
                <Text style={[styles.inputLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                  Sets
                </Text>
                <TextInput
                  style={[
                    styles.textInput, 
                    isDarkMode ? styles.textInputDark : styles.textInputLight,
                    isDarkMode ? styles.textLight : styles.textDark
                  ]}
                  keyboardType="numeric"
                  value={exerciseSets}
                  onChangeText={setExerciseSets}
                  placeholder="3-5"
                  placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
                />
              </View>
              
              <View style={[styles.formGroup, styles.columnHalf]}>
                <Text style={[styles.inputLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                  Reps
                </Text>
                <TextInput
                  style={[
                    styles.textInput, 
                    isDarkMode ? styles.textInputDark : styles.textInputLight,
                    isDarkMode ? styles.textLight : styles.textDark
                  ]}
                  keyboardType="numeric"
                  value={exerciseReps}
                  onChangeText={setExerciseReps}
                  placeholder="8-12"
                  placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
                />
              </View>
            </View>
            
            <View style={styles.rowBetween}>
              <View style={[styles.formGroup, styles.columnHalf]}>
                <Text style={[styles.inputLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                  Weight/Intensity
                </Text>
                <TextInput
                  style={[
                    styles.textInput, 
                    isDarkMode ? styles.textInputDark : styles.textInputLight,
                    isDarkMode ? styles.textLight : styles.textDark
                  ]}
                  value={exerciseIntensity}
                  onChangeText={setExerciseIntensity}
                  placeholder="135 lbs"
                  placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
                />
              </View>
              
              <View style={[styles.formGroup, styles.columnHalf]}>
                <Text style={[styles.inputLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                  Rest (seconds)
                </Text>
                <TextInput
                  style={[
                    styles.textInput, 
                    isDarkMode ? styles.textInputDark : styles.textInputLight,
                    isDarkMode ? styles.textLight : styles.textDark
                  ]}
                  keyboardType="numeric"
                  value={exerciseRest}
                  onChangeText={setExerciseRest}
                  placeholder="60-90"
                  placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
                />
              </View>
            </View>
            
            <TouchableOpacity
              onPress={addExerciseToWorkout}
              style={styles.greenButton}
            >
              <Text style={styles.primaryButtonText}>Add to Workout</Text>
            </TouchableOpacity>
          </View>
          
          {/* Workout modal for selecting a workout */}
          <Modal
            visible={showWorkoutModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowWorkoutModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, isDarkMode ? styles.modalContentDark : styles.modalContentLight]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, isDarkMode ? styles.textLight : styles.textDark]}>
                    Select Workout
                  </Text>
                  <TouchableOpacity onPress={() => setShowWorkoutModal(false)}>
                    <Ionicons name="close" size={24} color={isDarkMode ? "#f3f4f6" : "#374151"} />
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={workouts}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalItem,
                        selectedWorkout?.id === item.id && (isDarkMode ? styles.selectedItemDark : styles.selectedItem)
                      ]}
                      onPress={() => {
                        setSelectedWorkout(item);
                        setShowWorkoutModal(false);
                      }}
                    >
                      <Text style={isDarkMode ? styles.textLight : styles.textDark}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: '#111827', // gray-900
  },
  lightBg: {
    backgroundColor: '#F9FAFB', // gray-50
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#1F2937', // gray-800
  },
  textLightSecondary: {
    color: '#E5E7EB', // gray-200
  },
  textDarkSecondary: {
    color: '#4B5563', // gray-600
  },
  preferencesButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
  },
  preferencesButtonDark: {
    backgroundColor: '#1F2937', // gray-800
  },
  preferencesButtonLight: {
    backgroundColor: '#F3F4F6', // gray-100
  },
  sectionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionCardDark: {
    backgroundColor: '#1F2937', // gray-800
  },
  sectionCardLight: {
    backgroundColor: '#FFFFFF',
  },
  sectionBlue: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6', // blue-500
  },
  sectionPurple: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6', // purple-500
  },
  sectionGreen: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981', // emerald-500
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    marginBottom: 4,
  },
  textInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  textInputDark: {
    backgroundColor: '#374151', // gray-700
    borderColor: '#4B5563', // gray-600
  },
  textInputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB', // gray-300
  },
  primaryButton: {
    backgroundColor: '#3B82F6', // blue-500
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  purpleButton: {
    backgroundColor: '#8B5CF6', // purple-500
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  greenButton: {
    backgroundColor: '#10B981', // emerald-500
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  resultCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#D1FAE5', // emerald-100
    borderWidth: 1,
    borderColor: '#10B981', // emerald-500
  },
  resultText: {
    color: '#065F46', // emerald-800
    fontWeight: '500',
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  categoryPill: {
    marginRight: 4,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  activeCategory: {
    backgroundColor: '#8B5CF6', // purple-500
  },
  activeCategoryDark: {
    backgroundColor: '#6D28D9', // purple-700
  },
  inactiveCategory: {
    backgroundColor: '#E5E7EB', // gray-200
  },
  inactiveCategoryDark: {
    backgroundColor: '#374151', // gray-700
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  iconButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
  },
  iconButtonDark: {
    backgroundColor: '#374151', // gray-700
  },
  iconButtonLight: {
    backgroundColor: '#E5E7EB', // gray-200
  },
  columnHalf: {
    width: '48%',
  },
  selectInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 12,
    padding: 16,
  },
  modalContentDark: {
    backgroundColor: '#1F2937', // gray-800
  },
  modalContentLight: {
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // gray-200
  },
  selectedItem: {
    backgroundColor: '#EFF6FF', // blue-50
  },
  selectedItemDark: {
    backgroundColor: '#1E3A8A', // blue-900
  },
});
