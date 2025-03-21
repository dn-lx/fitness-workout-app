import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { useDataContext } from '../context/DataContext';
import { useAppContext } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExerciseManagementScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { workout } = route.params || {};
  const { exercises, refreshExercises, updateWorkout } = useDataContext();
  const { isDarkMode, t } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [workoutExercises, setWorkoutExercises] = useState(workout?.exercises || []);

  // Refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        refreshExercises();
        setLoading(false);
      };
      
      loadData();
      
      return () => {
        // Cleanup if needed
      };
    }, [refreshExercises])
  );

  // Extract categories from exercises
  useEffect(() => {
    if (exercises && exercises.length > 0) {
      const uniqueCategories = ['All', ...new Set(exercises.map(ex => ex.category))];
      setCategories(uniqueCategories);
    }
  }, [exercises]);

  // Filter exercises based on search query and selected category
  useEffect(() => {
    if (!exercises) return;
    
    let filtered = [...exercises];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(query) || 
        exercise.bodyPart.toLowerCase().includes(query)
      );
    }
    
    setFilteredExercises(filtered);
  }, [exercises, searchQuery, selectedCategory]);

  // Add exercise to workout
  const addExerciseToWorkout = (exercise) => {
    // Check if already in workout
    const isAlreadyAdded = workoutExercises.some(ex => ex.id === exercise.id);
    
    if (isAlreadyAdded) {
      Alert.alert(
        t('alreadyAdded'),
        t('exerciseAlreadyInWorkout'),
        [{ text: t('ok') }]
      );
      return;
    }
    
    const newExercise = {
      ...exercise,
      sets: 3,
      reps: 10,
      weight: 0,
      restTime: 60,
    };
    
    setWorkoutExercises([...workoutExercises, newExercise]);
  };

  // Remove exercise from workout
  const removeExercise = (exerciseId) => {
    Alert.alert(
      t('removeExercise'),
      t('removeExerciseConfirm'),
      [
        { 
          text: t('cancel'), 
          style: 'cancel' 
        },
        { 
          text: t('remove'), 
          style: 'destructive',
          onPress: () => {
            const updatedExercises = workoutExercises.filter(ex => ex.id !== exerciseId);
            setWorkoutExercises(updatedExercises);
          }
        }
      ]
    );
  };

  // Move exercise up in the list
  const moveExerciseUp = (index) => {
    if (index <= 0) return;
    
    const updatedExercises = [...workoutExercises];
    const temp = updatedExercises[index];
    updatedExercises[index] = updatedExercises[index - 1];
    updatedExercises[index - 1] = temp;
    
    setWorkoutExercises(updatedExercises);
  };

  // Move exercise down in the list
  const moveExerciseDown = (index) => {
    if (index >= workoutExercises.length - 1) return;
    
    const updatedExercises = [...workoutExercises];
    const temp = updatedExercises[index];
    updatedExercises[index] = updatedExercises[index + 1];
    updatedExercises[index + 1] = temp;
    
    setWorkoutExercises(updatedExercises);
  };

  // Save workout changes
  const saveWorkout = () => {
    if (!workout) return;
    
    const updatedWorkout = {
      ...workout,
      exercises: workoutExercises,
      lastUpdated: new Date().toISOString()
    };
    
    updateWorkout(updatedWorkout);
    
    Alert.alert(
      t('workoutSaved'),
      t('workoutUpdatedSuccessfully'),
      [
        { 
          text: t('ok'), 
          onPress: () => navigation.goBack() 
        }
      ]
    );
  };

  // Render exercise item
  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.exerciseItem,
        isDarkMode ? styles.exerciseItemDark : styles.exerciseItemLight
      ]}
      onPress={() => addExerciseToWorkout(item)}
    >
      <View style={styles.exerciseItemContent}>
        <Text style={[styles.exerciseName, isDarkMode ? styles.textLight : styles.textDark]}>
          {item.name}
        </Text>
        <Text style={[styles.exerciseDetails, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
          {item.bodyPart} | {item.category}
        </Text>
      </View>
      <Ionicons 
        name="add-circle" 
        size={24} 
        color={isDarkMode ? "#6366F1" : "#4F46E5"} 
      />
    </TouchableOpacity>
  );

  // Render workout exercise item
  const renderWorkoutExerciseItem = ({ item, index }) => (
    <View 
      style={[
        styles.workoutExerciseItem,
        isDarkMode ? styles.workoutExerciseItemDark : styles.workoutExerciseItemLight
      ]}
    >
      <View style={styles.workoutExerciseHeader}>
        <Text style={[styles.workoutExerciseName, isDarkMode ? styles.textLight : styles.textDark]}>
          {item.name}
        </Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => moveExerciseUp(index)}
            disabled={index === 0}
          >
            <Ionicons 
              name="chevron-up" 
              size={20} 
              color={index === 0 ? (isDarkMode ? "#4B5563" : "#9CA3AF") : (isDarkMode ? "#D1D5DB" : "#4B5563")} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => moveExerciseDown(index)}
            disabled={index === workoutExercises.length - 1}
          >
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={index === workoutExercises.length - 1 ? (isDarkMode ? "#4B5563" : "#9CA3AF") : (isDarkMode ? "#D1D5DB" : "#4B5563")} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => removeExercise(item.id)}
          >
            <Ionicons 
              name="trash" 
              size={20} 
              color={isDarkMode ? "#F87171" : "#EF4444"} 
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.workoutExerciseDetails}>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t('sets')}
          </Text>
          <View style={styles.detailValueContainer}>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => {
                if (item.sets > 1) {
                  const updatedExercises = [...workoutExercises];
                  const exerciseIndex = updatedExercises.findIndex(ex => ex.id === item.id);
                  updatedExercises[exerciseIndex] = {
                    ...updatedExercises[exerciseIndex],
                    sets: updatedExercises[exerciseIndex].sets - 1
                  };
                  setWorkoutExercises(updatedExercises);
                }
              }}
            >
              <Ionicons name="remove" size={16} color={isDarkMode ? "#D1D5DB" : "#4B5563"} />
            </TouchableOpacity>
            <Text style={[styles.detailValue, isDarkMode ? styles.textLight : styles.textDark]}>
              {item.sets}
            </Text>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => {
                const updatedExercises = [...workoutExercises];
                const exerciseIndex = updatedExercises.findIndex(ex => ex.id === item.id);
                updatedExercises[exerciseIndex] = {
                  ...updatedExercises[exerciseIndex],
                  sets: updatedExercises[exerciseIndex].sets + 1
                };
                setWorkoutExercises(updatedExercises);
              }}
            >
              <Ionicons name="add" size={16} color={isDarkMode ? "#D1D5DB" : "#4B5563"} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t('reps')}
          </Text>
          <View style={styles.detailValueContainer}>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => {
                if (item.reps > 1) {
                  const updatedExercises = [...workoutExercises];
                  const exerciseIndex = updatedExercises.findIndex(ex => ex.id === item.id);
                  updatedExercises[exerciseIndex] = {
                    ...updatedExercises[exerciseIndex],
                    reps: updatedExercises[exerciseIndex].reps - 1
                  };
                  setWorkoutExercises(updatedExercises);
                }
              }}
            >
              <Ionicons name="remove" size={16} color={isDarkMode ? "#D1D5DB" : "#4B5563"} />
            </TouchableOpacity>
            <Text style={[styles.detailValue, isDarkMode ? styles.textLight : styles.textDark]}>
              {item.reps}
            </Text>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => {
                const updatedExercises = [...workoutExercises];
                const exerciseIndex = updatedExercises.findIndex(ex => ex.id === item.id);
                updatedExercises[exerciseIndex] = {
                  ...updatedExercises[exerciseIndex],
                  reps: updatedExercises[exerciseIndex].reps + 1
                };
                setWorkoutExercises(updatedExercises);
              }}
            >
              <Ionicons name="add" size={16} color={isDarkMode ? "#D1D5DB" : "#4B5563"} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t('rest')}
          </Text>
          <View style={styles.detailValueContainer}>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => {
                if (item.restTime > 15) {
                  const updatedExercises = [...workoutExercises];
                  const exerciseIndex = updatedExercises.findIndex(ex => ex.id === item.id);
                  updatedExercises[exerciseIndex] = {
                    ...updatedExercises[exerciseIndex],
                    restTime: updatedExercises[exerciseIndex].restTime - 15
                  };
                  setWorkoutExercises(updatedExercises);
                }
              }}
            >
              <Ionicons name="remove" size={16} color={isDarkMode ? "#D1D5DB" : "#4B5563"} />
            </TouchableOpacity>
            <Text style={[styles.detailValue, isDarkMode ? styles.textLight : styles.textDark]}>
              {item.restTime}s
            </Text>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => {
                const updatedExercises = [...workoutExercises];
                const exerciseIndex = updatedExercises.findIndex(ex => ex.id === item.id);
                updatedExercises[exerciseIndex] = {
                  ...updatedExercises[exerciseIndex],
                  restTime: updatedExercises[exerciseIndex].restTime + 15
                };
                setWorkoutExercises(updatedExercises);
              }}
            >
              <Ionicons name="add" size={16} color={isDarkMode ? "#D1D5DB" : "#4B5563"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDarkMode ? styles.textLight : styles.textDark]}>
          {workout ? t('editWorkout') : t('createWorkout')}
        </Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveWorkout}
        >
          <Text style={styles.saveButtonText}>{t('save')}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.workoutSection}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>
          {t('workoutExercises')}
        </Text>
        {workoutExercises.length > 0 ? (
          <FlatList
            data={workoutExercises}
            keyExtractor={(item, index) => `workout-${item.id}-${index}`}
            renderItem={renderWorkoutExerciseItem}
            style={styles.workoutList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons 
              name="barbell-outline" 
              size={48} 
              color={isDarkMode ? "#4B5563" : "#9CA3AF"} 
            />
            <Text style={[styles.emptyStateText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
              {t('noExercisesYet')}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.exercisesSection}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>
          {t('addExercises')}
        </Text>
        
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchInputContainer,
            isDarkMode ? styles.searchInputContainerDark : styles.searchInputContainerLight
          ]}>
            <Ionicons 
              name="search" 
              size={20} 
              color={isDarkMode ? "#6B7280" : "#9CA3AF"} 
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, isDarkMode ? styles.searchInputDark : styles.searchInputLight]}
              placeholder={t('searchExercises')}
              placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContent}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category ? 
                    (isDarkMode ? styles.categoryButtonActiveDark : styles.categoryButtonActiveLight) : 
                    (isDarkMode ? styles.categoryButtonDark : styles.categoryButtonLight)
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text 
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category ? 
                      styles.categoryButtonTextActive : 
                      (isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary)
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDarkMode ? "#6366F1" : "#4F46E5"} />
            <Text style={[styles.loadingText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
              {t('loadingExercises')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredExercises}
            keyExtractor={item => `exercise-${item.id}`}
            renderItem={renderExerciseItem}
            style={styles.exercisesList}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                  {t('noExercisesFound')}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // gray-200
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4F46E5', // indigo-600
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
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
    color: '#6B7280', // gray-500
  },
  workoutSection: {
    padding: 16,
    flex: 1,
    maxHeight: '45%',
  },
  exercisesSection: {
    padding: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  divider: {
    height: 8,
    backgroundColor: '#E5E7EB', // gray-200
  },
  workoutList: {
    flex: 1,
  },
  workoutExerciseItem: {
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  workoutExerciseItemLight: {
    backgroundColor: '#FFFFFF',
  },
  workoutExerciseItemDark: {
    backgroundColor: '#1F2937', // gray-800
  },
  workoutExerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutExerciseName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  workoutExerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  counterButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 114, 128, 0.2)', // gray-500 with opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInputContainerLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
  },
  searchInputContainerDark: {
    backgroundColor: '#1F2937', // gray-800
    borderWidth: 1,
    borderColor: '#374151', // gray-700
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  searchInputLight: {
    color: '#1F2937', // gray-800
  },
  searchInputDark: {
    color: '#F9FAFB', // gray-50
  },
  categoriesContainer: {
    marginBottom: 12,
  },
  categoriesScrollContent: {
    paddingBottom: 4,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryButtonLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
  },
  categoryButtonDark: {
    backgroundColor: '#1F2937', // gray-800
    borderWidth: 1,
    borderColor: '#374151', // gray-700
  },
  categoryButtonActiveLight: {
    backgroundColor: '#4F46E5', // indigo-600
  },
  categoryButtonActiveDark: {
    backgroundColor: '#4F46E5', // indigo-600
  },
  categoryButtonText: {
    fontSize: 13,
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  exercisesList: {
    flex: 1,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseItemLight: {
    backgroundColor: '#FFFFFF',
  },
  exerciseItemDark: {
    backgroundColor: '#1F2937', // gray-800
  },
  exerciseItemContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    marginTop: 12,
    textAlign: 'center',
  },
  ScrollView: {
    width: '100%',
  }
});
