import React, { useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Text, Searchbar, FAB, Portal, Dialog, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import components
import WorkoutCard from '../components/workout/WorkoutCard';

// Import user context
import { useUser } from '../contexts/UserContext';

// Import models
import { workouts as workoutsData } from '../models/workout';

// Import styles
import { workoutsStyles as styles, colors } from '../styles';

const WorkoutsScreen = () => {
  const [workouts, setWorkouts] = useState(workoutsData);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const { deleteAllLocalUsers } = useUser();

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

  const handleDeleteLocalUsers = async () => {
    try {
      const result = await deleteAllLocalUsers();
      if (result.success) {
        Alert.alert(
          'Success',
          `Local users deleted successfully. ${result.message}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          `Failed to delete local users: ${result.error || 'Unknown error'}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        `An unexpected error occurred: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setConfirmDialogVisible(false);
    }
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

      <FAB
        style={styles.devButton}
        small
        icon="database-remove"
        color="#fff"
        onPress={() => setConfirmDialogVisible(true)}
      />

      <Portal>
        <Dialog visible={confirmDialogVisible} onDismiss={() => setConfirmDialogVisible(false)}>
          <Dialog.Title>Delete Local Users</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete all users from the local database? This action cannot be undone!</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteLocalUsers} mode="contained" color={colors.error}>Delete Local Users</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default WorkoutsScreen; 