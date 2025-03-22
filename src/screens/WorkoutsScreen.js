import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import components
import WorkoutCard from '../components/workout/WorkoutCard';

// Import models
import { workouts as workoutsData } from '../models/workout';

// Import styles
import { workoutsStyles as styles } from '../styles';

const WorkoutsScreen = () => {
  const [workouts, setWorkouts] = useState(workoutsData);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setWorkouts(workoutsData);
      return;
    }
    
    const filteredWorkouts = workoutsData.filter(workout => 
      workout.title.toLowerCase().includes(query.toLowerCase()) || 
      workout.description.toLowerCase().includes(query.toLowerCase()) ||
      workout.level.toLowerCase().includes(query.toLowerCase())
    );
    
    setWorkouts(filteredWorkouts);
  };

  const handleSelectWorkout = (id) => {
    setSelectedWorkout(id);
    console.log('Selected workout:', id);
  };

  const handleStartWorkout = (id) => {
    console.log('Starting workout:', id);
    // Navigate to workout details/start screen
  };

  const renderWorkoutCard = ({ item }) => (
    <WorkoutCard 
      workout={item}
      onSelect={handleSelectWorkout}
      onStart={handleStartWorkout}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        <Searchbar
          placeholder="Search workouts"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <FlatList
        data={workouts}
        renderItem={renderWorkoutCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={true}
        removeClippedSubviews={true}
        initialNumToRender={5}
      />
      
      {workouts.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No workouts found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default WorkoutsScreen; 