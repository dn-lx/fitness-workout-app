import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Appbar, ProgressBar, Button, IconButton, Surface, Divider, Chip, useTheme as usePaperTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage, t } from '../contexts/LanguageContext';
import { colors } from '../styles/common';
import workoutsScreenStyles from '../styles/workoutsScreenStyles';

// Import models
import { workouts as workoutsData } from '../models/workout';

const ActiveWorkoutScreen = ({ navigation, route }) => {
  const paperTheme = usePaperTheme();
  const { currentLanguage } = useLanguage();
  const { id } = route.params;
  
  const [workout, setWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Mock exercises for the selected workout
  const mockExercises = [
    { id: 1, name: 'Push-ups', duration: 60, reps: 12, sets: 3 },
    { id: 2, name: 'Sit-ups', duration: 60, reps: 15, sets: 3 },
    { id: 3, name: 'Squats', duration: 60, reps: 15, sets: 3 },
    { id: 4, name: 'Lunges', duration: 60, reps: 10, sets: 2 },
    { id: 5, name: 'Plank', duration: 30, reps: null, sets: 3 }
  ];
  
  // Load workout data when component mounts
  useEffect(() => {
    const selectedWorkout = workoutsData.find(w => w.id === id);
    
    if (selectedWorkout) {
      // Add mock exercises to the workout
      setWorkout({
        ...selectedWorkout,
        exercises: mockExercises
      });
    } else {
      // Workout not found, go back
      navigation.goBack();
    }
  }, [id]);
  
  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isRunning && !isCompleted) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, isCompleted]);
  
  const handleStart = () => {
    setIsRunning(true);
  };
  
  const handlePause = () => {
    setIsRunning(false);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setTimer(0);
    setCurrentExerciseIndex(0);
    setIsCompleted(false);
  };
  
  const handleNext = () => {
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Workout completed
      setIsCompleted(true);
      setIsRunning(false);
    }
  };
  
  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  if (!workout) {
    return (
      <SafeAreaView style={workoutsScreenStyles.container} edges={['top']}>
        <Appbar.Header style={workoutsScreenStyles.headerContainer}>
          <Appbar.BackAction onPress={() => navigation.goBack()} color={colors.cardBackground} />
          <Appbar.Content 
            title={t('loading', currentLanguage)} 
            titleStyle={workoutsScreenStyles.headerTitle}
            style={workoutsScreenStyles.headerContent} 
          />
        </Appbar.Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{t('loadingWorkout', currentLanguage)}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const currentExercise = workout.exercises[currentExerciseIndex];
  const progress = (currentExerciseIndex) / workout.exercises.length;
  
  return (
    <SafeAreaView style={workoutsScreenStyles.container} edges={['top']}>
      <Appbar.Header style={workoutsScreenStyles.headerContainer}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color={colors.cardBackground} />
        <Appbar.Content 
          title={workout.title} 
          titleStyle={workoutsScreenStyles.headerTitle}
          style={workoutsScreenStyles.headerContent} 
        />
      </Appbar.Header>
      
      <ScrollView>
        <Surface style={styles.timerCard}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
          <Text style={styles.timerLabel}>{t('elapsedTime', currentLanguage)}</Text>
          
          <ProgressBar 
            progress={progress} 
            color={colors.primary}
            style={styles.progressBar}
          />
          
          <Text style={styles.progressText}>
            {t('exercise', currentLanguage)} {currentExerciseIndex + 1}/{workout.exercises.length}
          </Text>
          
          <View style={styles.buttonRow}>
            {!isRunning ? (
              <Button 
                mode="contained" 
                onPress={handleStart}
                style={[styles.button, { backgroundColor: colors.primary }]}
                labelStyle={{ color: colors.cardBackground, fontWeight: 'bold' }}
                icon="play"
              >
                {isCompleted ? t('restart', currentLanguage) : t('start', currentLanguage)}
              </Button>
            ) : (
              <Button 
                mode="contained" 
                onPress={handlePause}
                style={[styles.button, { backgroundColor: colors.accent }]}
                labelStyle={{ color: colors.cardBackground, fontWeight: 'bold' }}
                icon="pause"
              >
                {t('pause', currentLanguage)}
              </Button>
            )}
            
            <Button 
              mode="outlined" 
              onPress={handleReset}
              style={[styles.button, { borderColor: colors.primary }]}
              labelStyle={{ color: colors.primary }}
              icon="refresh"
            >
              {t('reset', currentLanguage)}
            </Button>
          </View>
        </Surface>
        
        {!isCompleted ? (
          <Surface style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            
            <View style={styles.exerciseStats}>
              {currentExercise.reps && (
                <Chip icon="repeat" style={styles.statChip}>
                  {currentExercise.reps} {t('reps', currentLanguage)}
                </Chip>
              )}
              
              <Chip icon="refresh" style={styles.statChip}>
                {currentExercise.sets} {t('sets', currentLanguage)}
              </Chip>
              
              <Chip icon="clock-outline" style={styles.statChip}>
                {currentExercise.duration}s
              </Chip>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.navigationRow}>
              <IconButton 
                icon="arrow-left" 
                onPress={handlePrevious}
                disabled={currentExerciseIndex === 0}
                color={currentExerciseIndex === 0 ? colors.textLight : colors.primary}
                size={30}
              />
              
              <Button 
                mode="contained" 
                onPress={handleNext}
                style={{ backgroundColor: colors.primary }}
                labelStyle={{ color: colors.cardBackground, fontWeight: 'bold' }}
              >
                {currentExerciseIndex === workout.exercises.length - 1 
                  ? t('finish', currentLanguage) 
                  : t('nextExercise', currentLanguage)
                }
              </Button>
              
              <IconButton 
                icon="arrow-right" 
                onPress={handleNext}
                color={colors.primary}
                size={30}
              />
            </View>
          </Surface>
        ) : (
          <Surface style={styles.completionCard}>
            <Text style={styles.completionTitle}>{t('workoutCompleted', currentLanguage)}</Text>
            <Text style={styles.completionText}>{t('workoutCompletedDescription', currentLanguage)}</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatTime(timer)}</Text>
                <Text style={styles.statLabel}>{t('totalTime', currentLanguage)}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{workout.exercises.length}</Text>
                <Text style={styles.statLabel}>{t('exercisesCompleted', currentLanguage)}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{workout.calories}</Text>
                <Text style={styles.statLabel}>{t('caloriesBurned', currentLanguage)}</Text>
              </View>
            </View>
            
            <Button 
              mode="contained" 
              onPress={() => navigation.goBack()}
              style={{ backgroundColor: colors.primary, marginTop: 24 }}
              labelStyle={{ color: colors.cardBackground, fontWeight: 'bold' }}
            >
              {t('backToWorkouts', currentLanguage)}
            </Button>
          </Surface>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  timerCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
  },
  timerLabel: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textLight,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 16,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.textLight,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  exerciseCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: colors.text,
  },
  exerciseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statChip: {
    margin: 4,
    backgroundColor: colors.primaryLight,
  },
  divider: {
    marginVertical: 16,
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completionCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  completionText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textLight,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
});

export default ActiveWorkoutScreen; 