import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';

export default function WorkoutLibraryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { updatedWorkout } = route.params || {};
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

  // Update workout if we receive an updated one from exercise management
  useEffect(() => {
    if (updatedWorkout) {
      setWorkouts(workouts.map(w => 
        w.id === updatedWorkout.id ? updatedWorkout : w
      ));
    }
  }, [updatedWorkout]);

  // Start a workout
  const startWorkout = (workout) => {
    navigation.navigate('WorkoutExecution', { workout });
  };
  
  // Manage exercises
  const manageExercises = (workout) => {
    navigation.navigate('ExerciseManagement', { workout });
  };
  
  // Function to render each workout card
  const renderWorkoutItem = ({ item }) => (
    <View style={[styles.workoutCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
      <View style={styles.cardContent}>
        <Text style={[styles.workoutTitle, isDarkMode ? styles.textLight : styles.textDark]}>
          {item.name}
        </Text>
        
        <Text style={[styles.exerciseCount, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
          {item.exercises.length} {t('exercises')}
        </Text>
        
        {/* Exercise list preview */}
        <View style={styles.exerciseList}>
          {item.exercises.slice(0, 3).map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <View style={styles.exerciseDot}>
                <View style={[styles.dot, isDarkMode ? styles.dotDark : styles.dotLight]} />
              </View>
              <Text numberOfLines={1} style={[styles.exerciseName, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                {exercise.name}
              </Text>
              <Text style={[styles.exerciseDetails, isDarkMode ? styles.textLightTertiary : styles.textDarkTertiary]}>
                {exercise.sets} × {exercise.reps} ({formatWeight(exercise.weight)})
              </Text>
            </View>
          ))}
          
          {item.exercises.length > 3 && (
            <Text style={[styles.moreExercises, isDarkMode ? styles.textLightTertiary : styles.textDarkTertiary]}>
              +{item.exercises.length - 3} more exercises
            </Text>
          )}
        </View>
        
        {/* Button row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => startWorkout(item)}
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>{t('startWorkout')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => manageExercises(item)}
            style={[styles.editButton, isDarkMode ? styles.editButtonDark : styles.editButtonLight]}
          >
            <Ionicons name="list" size={20} color={isDarkMode ? '#f3f4f6' : '#374151'} />
            <Text style={[styles.editButtonText, isDarkMode ? styles.textLight : styles.textDark]}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]}>
      <View style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.headerText, isDarkMode ? styles.textLight : styles.textDark]}>
            {t('workoutLibrary')}
          </Text>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t('selectWorkout')}
          </Text>
        </View>
        
        {workouts.length > 0 ? (
          <FlatList
            data={workouts}
            renderItem={renderWorkoutItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        ) : (
          <View style={styles.noWorkouts}>
            <Ionicons 
              name="fitness-outline" 
              size={80} 
              color={isDarkMode ? "#4B5563" : "#D1D5DB"} 
            />
            <Text style={[styles.noWorkoutsText, isDarkMode ? styles.textLight : styles.textDark]}>
              No workouts yet
            </Text>
            <Text style={[styles.noWorkoutsDescription, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
              Start by adding your first workout
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TrainingHub')}
              style={[styles.addButton, isDarkMode ? styles.addButtonDark : styles.addButtonLight]}
            >
              <Text style={[styles.addButtonText, isDarkMode ? styles.textLight : styles.textDark]}>
                Add Workout
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// Styles
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
  textLightTertiary: {
    color: '#9CA3AF', // gray-400
  },
  textDarkTertiary: {
    color: '#6B7280', // gray-500
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonLight: {
    backgroundColor: '#EFF6FF', // blue-50
  },
  addButtonDark: {
    backgroundColor: '#1F2937', // gray-800
  },
  addButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  workoutCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB', // gray-200
  },
  darkCard: {
    backgroundColor: '#1F2937', // gray-800
    borderColor: '#374151', // gray-700
  },
  cardContent: {
    padding: 16,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseCount: {
    marginBottom: 12,
  },
  exerciseList: {
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  exerciseDot: {
    width: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotLight: {
    backgroundColor: '#3B82F6', // blue-500
  },
  dotDark: {
    backgroundColor: '#60A5FA', // blue-400
  },
  exerciseName: {
    flex: 1,
  },
  exerciseDetails: {
    marginLeft: 8,
  },
  moreExercises: {
    marginTop: 4,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#4F46E5', // indigo-600
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  editButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  editButtonLight: {
    backgroundColor: '#E5E7EB', // gray-200
  },
  editButtonDark: {
    backgroundColor: '#374151', // gray-700
  },
  editButtonText: {
    marginLeft: 4,
  },
  noWorkouts: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noWorkoutsText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noWorkoutsDescription: {
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
});
