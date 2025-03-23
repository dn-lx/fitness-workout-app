import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, ScrollView } from 'react-native';
import { Text, Searchbar, FAB, Portal, Dialog, Button, Appbar, ActivityIndicator, Chip, useTheme as usePaperTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

// Import components
import WorkoutCard from '../components/WorkoutCard';

// Import user context
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, t } from '../contexts/LanguageContext';

// Import models
import { workouts as workoutsData, removeWorkout } from '../models/workout';

// Import styles
import { colors, spacing, typography, shadowStyles } from '../styles/common';
import workoutsScreenStyles from '../styles/workoutsScreenStyles';
import ShowToast from '../components/Toast';

const WorkoutsScreen = ({ navigation }) => {
  const route = useRoute();
  const { isDarkMode } = useTheme();
  const paperTheme = usePaperTheme();
  const { currentLanguage } = useLanguage();
  
  const [workouts, setWorkouts] = useState(workoutsData);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '' });
  
  // Selected filters
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Filter categories
  const filterCategories = [
    { id: 'beginner', label: t('beginner', currentLanguage) },
    { id: 'intermediate', label: t('intermediate', currentLanguage) },
    { id: 'advanced', label: t('advanced', currentLanguage) },
    { id: 'short', label: '< 30 min' },
    { id: 'medium', label: '30-45 min' },
    { id: 'long', label: '> 45 min' }
  ];

  // Check for messages from other screens
  useEffect(() => {
    if (route.params?.message) {
      setToast({ visible: true, message: route.params.message });
      // Clear the message
      navigation.setParams({ message: null });
    }
  }, [route.params?.message]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, selectedFilters);
  };
  
  const toggleFilter = (filterId) => {
    const updatedFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    
    setSelectedFilters(updatedFilters);
    applyFilters(searchQuery, updatedFilters);
  };
  
  const applyFilters = (query, filters) => {
    let filteredWorkouts = [...workoutsData];
    
    // Apply text search if query exists
    if (query.trim()) {
      filteredWorkouts = filteredWorkouts.filter(workout => 
        workout.title.toLowerCase().includes(query.toLowerCase()) || 
        workout.description.toLowerCase().includes(query.toLowerCase()) ||
        workout.level.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply selected filters
    if (filters.length > 0) {
      // Group filters by type
      const difficultyFilters = filters.filter(f => ['beginner', 'intermediate', 'advanced'].includes(f));
      const durationFilters = filters.filter(f => ['short', 'medium', 'long'].includes(f));
      
      filteredWorkouts = filteredWorkouts.filter(workout => {
        // If no filters of a specific type, don't filter by that type
        const matchesDifficulty = difficultyFilters.length === 0 || difficultyFilters.includes(workout.level);
        
        let matchesDuration = true;
        if (durationFilters.length > 0) {
          matchesDuration = false;
          if (durationFilters.includes('short') && workout.duration < 30) {
            matchesDuration = true;
          } else if (durationFilters.includes('medium') && workout.duration >= 30 && workout.duration <= 45) {
            matchesDuration = true;
          } else if (durationFilters.includes('long') && workout.duration > 45) {
            matchesDuration = true;
          }
        }
        
        return matchesDifficulty && matchesDuration;
      });
    }
    
    setWorkouts(filteredWorkouts);
  };

  const handleRemoveWorkout = (id) => {
    // Remove workout from the data
    removeWorkout(id);
    
    // Update local state
    setWorkouts(workouts.filter(workout => workout.id !== id));
    
    // Show success message
    setToast({ visible: true, message: t('workoutRemoved', currentLanguage) });
  };

  const handleAddWorkout = () => {
    navigation.navigate('AddWorkout');
  };

  const renderWorkoutCard = ({ item }) => (
    <WorkoutCard 
      workout={item}
      onRemove={handleRemoveWorkout}
    />
  );

  // Load workouts on component mount
  useEffect(() => {
    // Simulate API call or data loading
    const loadWorkouts = () => {
      setTimeout(() => {
        setWorkouts(workoutsData);
        setLoading(false);
      }, 1000);
    };

    loadWorkouts();
  }, []);

  return (
    <SafeAreaView style={workoutsScreenStyles.container} edges={['top']}>
      <Appbar.Header style={workoutsScreenStyles.headerContainer}>
        <Appbar.Content 
          title={t('workouts', currentLanguage)} 
          titleStyle={workoutsScreenStyles.headerTitle} 
          style={workoutsScreenStyles.headerContent} 
        />
      </Appbar.Header>
      
      <View style={workoutsScreenStyles.searchAndFilterContainer}>
        <View style={workoutsScreenStyles.searchContainer}>
          <Searchbar
            placeholder={t('searchForWorkout', currentLanguage) || "Search for Workout"}
            onChangeText={handleSearch}
            value={searchQuery}
            style={workoutsScreenStyles.searchBar}
            iconColor={colors.accent}
            inputStyle={workoutsScreenStyles.searchInput}
          />
        </View>
        
        <View style={workoutsScreenStyles.filterContainer}>
          {filterCategories.map((category) => (
            <Chip
              key={category.id}
              selected={selectedFilters.includes(category.id)}
              onPress={() => toggleFilter(category.id)}
              style={[
                {
                  backgroundColor: colors.primary, 
                  borderColor: colors.primary,
                  margin: 4,
                  height: 36,
                  ...shadowStyles.small
                },
                selectedFilters.includes(category.id) && {
                  backgroundColor: colors.primaryDark,
                  borderColor: colors.primaryDark
                }
              ]}
              textStyle={{
                color: '#FFFFFF',
                fontSize: typography.fontSize.small,
                fontWeight: 'bold'
              }}
            >
              {category.label}
            </Chip>
          ))}
        </View>
      </View>
      
      {loading ? (
        <View style={workoutsScreenStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <>
          <FlatList
            contentContainerStyle={workoutsScreenStyles.listContainer}
            data={workouts}
            renderItem={renderWorkoutCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={workoutsScreenStyles.emptyContainer}>
                <Text style={workoutsScreenStyles.emptyText}>
                  {t('noWorkoutsFound', currentLanguage) || 'No workouts found'}
                </Text>
              </View>
            }
          />
          
          <FAB 
            style={workoutsScreenStyles.fab}
            icon="plus"
            onPress={handleAddWorkout}
            color={isDarkMode ? colors.black : colors.white}
          />
        </>
      )}
      
      <ShowToast
        visible={toast.visible}
        message={toast.message}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />
    </SafeAreaView>
  );
};

export default WorkoutsScreen; 