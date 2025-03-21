import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  Vibration,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

export default function WorkoutExecutionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { workout } = route.params;
  const { isDarkMode, formatWeight, t, theme } = useAppContext();
  
  // Exercise state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetCount, setCurrentSetCount] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [setStarted, setSetStarted] = useState(false);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [nextExercise, setNextExercise] = useState(null);
  
  // Animation
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerScaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);
  
  // Get current exercise
  const currentExercise = workout?.exercises[currentExerciseIndex];
  
  // Setup timer animation
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const pulseAnimation = Animated.sequence([
        Animated.timing(timerScaleAnim, {
          toValue: 1.05,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(timerScaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
      
      Animated.loop(pulseAnimation).start();
    } else {
      timerScaleAnim.setValue(1);
      Animated.timing(timerScaleAnim).stop();
    }
    
    return () => {
      Animated.timing(timerScaleAnim).stop();
    };
  }, [timerActive, timeLeft]);
  
  // Function to handle starting the current exercise
  const startExercise = () => {
    setExerciseStarted(true);
    setSetStarted(true);
  };
  
  // Function to handle completing the current set
  const completeSet = () => {
    Vibration.vibrate(200);
    
    if (currentSetCount < currentExercise.sets) {
      // More sets to go, start rest timer
      setIsResting(true);
      setTimeLeft(currentExercise.restTime);
      setTimerActive(true);
      setSetStarted(false);
      
      // Start the countdown
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsResting(false);
            setTimerActive(false);
            setCurrentSetCount(prev => prev + 1);
            setSetStarted(true);
            Vibration.vibrate([500, 200, 500]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Last set of this exercise
      const updatedCompletedExercises = [...completedExercises, currentExercise.id];
      setCompletedExercises(updatedCompletedExercises);
      
      if (currentExerciseIndex < workout.exercises.length - 1) {
        // Move to the next exercise
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSetCount(1);
        setExerciseStarted(false);
        setSetStarted(false);
      } else {
        // Workout complete
        setWorkoutComplete(true);
      }
    }
  };
  
  // Function to skip rest
  const skipRest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsResting(false);
    setTimerActive(false);
    setTimeLeft(0);
    setCurrentSetCount(prev => prev + 1);
    setSetStarted(true);
  };
  
  // Function to format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Complete workout
  const finishWorkout = () => {
    Alert.alert(
      t('congratulations'),
      t('workoutCompleteMessage'),
      [
        {
          text: t('ok'),
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };
  
  // Render rest timer
  const renderRestTimer = () => (
    <View style={styles.restTimerContainer}>
      <Animated.View 
        style={[
          styles.timerCircle,
          isDarkMode ? styles.timerCircleDark : styles.timerCircleLight,
          {
            transform: [{ scale: timerScaleAnim }],
          },
        ]}
      >
        <Text style={[styles.timerText, isDarkMode ? styles.textLight : styles.textDark]}>
          {formatTime(timeLeft)}
        </Text>
        <Text style={[styles.timerLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
          {t('restTime')}
        </Text>
      </Animated.View>
      
      <TouchableOpacity
        style={styles.skipButton}
        onPress={skipRest}
      >
        <Text style={styles.skipButtonText}>{t('skipRest')}</Text>
      </TouchableOpacity>
      
      <View style={styles.nextExerciseContainer}>
        <Text style={[styles.nextExerciseLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
          {t('nextExercise')}:
        </Text>
        <Text style={[styles.nextExerciseText, isDarkMode ? styles.textLight : styles.textDark]}>
          {currentExerciseIndex < workout.exercises.length - 1 
            ? workout.exercises[currentExerciseIndex + 1].name
            : t('lastExercise')}
        </Text>
      </View>
    </View>
  );
  
  // Render current exercise
  const renderCurrentExercise = () => (
    <View style={styles.exerciseContainer}>
      <Text style={[styles.exerciseName, isDarkMode ? styles.textLight : styles.textDark]}>
        {currentExercise.name}
      </Text>
      
      <View style={styles.exerciseDetails}>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t('set')}
          </Text>
          <Text style={[styles.detailValue, isDarkMode ? styles.textLight : styles.textDark]}>
            {currentSetCount} / {currentExercise.sets}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t('reps')}
          </Text>
          <Text style={[styles.detailValue, isDarkMode ? styles.textLight : styles.textDark]}>
            {currentExercise.reps}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t('weight')}
          </Text>
          <Text style={[styles.detailValue, isDarkMode ? styles.textLight : styles.textDark]}>
            {formatWeight(currentExercise.weight)}
          </Text>
        </View>
      </View>
      
      {!exerciseStarted ? (
        <TouchableOpacity
          style={styles.startButton}
          onPress={startExercise}
        >
          <Text style={styles.startButtonText}>{t('startExercise')}</Text>
        </TouchableOpacity>
      ) : !isResting ? (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={completeSet}
        >
          <Text style={styles.completeButtonText}>
            {currentSetCount < currentExercise.sets 
              ? t('completeSet') 
              : t('completeExercise')}
          </Text>
        </TouchableOpacity>
      ) : renderRestTimer()}
    </View>
  );
  
  // Render workout progress
  const renderWorkoutProgress = () => (
    <View style={styles.progressContainer}>
      <Text style={[styles.progressTitle, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
        {t('workoutProgress')}
      </Text>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${(currentExerciseIndex / workout.exercises.length) * 100}%` }
          ]} 
        />
      </View>
      
      <Text style={[styles.progressText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
        {currentExerciseIndex} / {workout.exercises.length} {t('exercises')}
      </Text>
    </View>
  );
  
  // Render workout complete
  const renderWorkoutComplete = () => (
    <View style={styles.completeContainer}>
      <Ionicons 
        name="checkmark-circle" 
        size={80} 
        color="#10B981" 
      />
      
      <Text style={[styles.completeTitle, isDarkMode ? styles.textLight : styles.textDark]}>
        {t('workoutComplete')}
      </Text>
      
      <Text style={[styles.completeSubtitle, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
        {t('greatJob')}
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDarkMode ? styles.textLight : styles.textDark]}>
            {workout.exercises.length}
          </Text>
          <Text style={[styles.statLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t('exercises')}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDarkMode ? styles.textLight : styles.textDark]}>
            {workout.exercises.reduce((acc, curr) => acc + curr.sets, 0)}
          </Text>
          <Text style={[styles.statLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t('sets')}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDarkMode ? styles.textLight : styles.textDark]}>
            {workout.exercises.reduce((acc, curr) => acc + (curr.sets * curr.reps), 0)}
          </Text>
          <Text style={[styles.statLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t('totalReps')}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.finishButton}
        onPress={finishWorkout}
      >
        <Text style={styles.finishButtonText}>{t('finishWorkout')}</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]}>
      {workoutComplete ? (
        renderWorkoutComplete()
      ) : (
        <View style={styles.workoutContainer}>
          {renderWorkoutProgress()}
          {renderCurrentExercise()}
          
          <View style={styles.exercisesList}>
            <Text style={[styles.exercisesListTitle, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
              {t('upcomingExercises')}
            </Text>
            
            <FlatList
              data={workout.exercises.slice(currentExerciseIndex + 1)}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <View 
                  style={[
                    styles.exerciseItem,
                    isDarkMode ? styles.exerciseItemDark : styles.exerciseItemLight,
                  ]}
                >
                  <View style={styles.exerciseItemNumber}>
                    <Text style={[styles.exerciseItemNumberText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                      {currentExerciseIndex + index + 2}
                    </Text>
                  </View>
                  
                  <View style={styles.exerciseItemDetails}>
                    <Text style={[styles.exerciseItemName, isDarkMode ? styles.textLight : styles.textDark]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.exerciseItemInfo, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                      {item.sets} × {item.reps} @ {formatWeight(item.weight)}
                    </Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={() => (
                <Text style={[styles.noExercisesText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                  {t('noMoreExercises')}
                </Text>
              )}
              style={styles.exerciseItemsList}
            />
          </View>
        </View>
      )}
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
  workoutContainer: {
    flex: 1,
    padding: 16,
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
  // Progress section styles
  progressContainer: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB', // gray-200
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5', // indigo-600
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  // Exercise section styles
  exerciseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#4F46E5', // indigo-600
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: '#059669', // emerald-600
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // Rest timer styles
  restTimerContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  timerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  timerCircleLight: {
    backgroundColor: '#EFF6FF', // blue-50
    borderWidth: 3,
    borderColor: '#3B82F6', // blue-500
  },
  timerCircleDark: {
    backgroundColor: '#1E3A8A', // blue-900
    borderWidth: 3,
    borderColor: '#60A5FA', // blue-400
  },
  timerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  timerLabel: {
    fontSize: 14,
  },
  skipButton: {
    backgroundColor: '#4B5563', // gray-600
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  nextExerciseContainer: {
    alignItems: 'center',
  },
  nextExerciseLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  nextExerciseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Upcoming exercises list
  exercisesList: {
    flex: 1,
  },
  exercisesListTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  exerciseItemsList: {
    flex: 1,
  },
  exerciseItem: {
    flexDirection: 'row',
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  exerciseItemLight: {
    backgroundColor: '#FFFFFF',
  },
  exerciseItemDark: {
    backgroundColor: '#1F2937', // gray-800
  },
  exerciseItemNumber: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB', // gray-200
  },
  exerciseItemNumberText: {
    fontWeight: 'bold',
  },
  exerciseItemDetails: {
    flex: 1,
    padding: 12,
  },
  exerciseItemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  exerciseItemInfo: {
    fontSize: 14,
  },
  noExercisesText: {
    textAlign: 'center',
    paddingVertical: 16,
    fontStyle: 'italic',
  },
  // Workout complete styles
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  completeSubtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  finishButton: {
    backgroundColor: '#4F46E5', // indigo-600
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
