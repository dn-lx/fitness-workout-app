import React, { createContext, useState, useContext, useCallback } from 'react';

// Create the context
const DataContext = createContext(null);

// In-memory sample data
const initialExercises = [
  { id: '1', name: 'Bench Press', category: 'Chest', equipment: 'Barbell', instructions: 'Lie on bench, push barbell upward' },
  { id: '2', name: 'Squat', category: 'Legs', equipment: 'Barbell', instructions: 'Stand with barbell on shoulders, bend knees, return to standing' },
  { id: '3', name: 'Deadlift', category: 'Back', equipment: 'Barbell', instructions: 'Bend at hips and knees, grip bar, stand up straight' },
  { id: '4', name: 'Pull-up', category: 'Back', equipment: 'Body weight', instructions: 'Hang from bar, pull body upward until chin over bar' },
  { id: '5', name: 'Push-up', category: 'Chest', equipment: 'Body weight', instructions: 'Start in plank position, lower body, push back up' }
];

const initialWorkouts = [
  {
    id: '1',
    name: 'Monday Full Body',
    exercises: [
      { id: '1', name: 'Bench Press', sets: 4, reps: 10, weight: 135, restTime: 60, completed: false },
      { id: '2', name: 'Squats', sets: 3, reps: 12, weight: 185, restTime: 90, completed: false },
      { id: '3', name: 'Lat Pulldown', sets: 3, reps: 12, weight: 120, restTime: 60, completed: false }
    ]
  },
  {
    id: '2',
    name: 'Wednesday Upper Body',
    exercises: [
      { id: '1', name: 'Bench Press', sets: 4, reps: 8, weight: 155, restTime: 60, completed: false },
      { id: '4', name: 'Pull-ups', sets: 3, reps: 8, weight: 0, restTime: 60, completed: false },
      { id: '5', name: 'Push-ups', sets: 3, reps: 15, weight: 0, restTime: 45, completed: false }
    ]
  }
];

const initialPreferences = {
  useMetricSystem: false,
  language: 'English',
  darkMode: false
};

// Data provider component
export const DataProvider = ({ children }) => {
  // State for exercises
  const [exercises, setExercises] = useState(initialExercises);
  
  // State for workouts
  const [workouts, setWorkouts] = useState(initialWorkouts);
  
  // State for current workout tracking
  const [currentWorkoutId, setCurrentWorkoutId] = useState(null);
  
  // State for user preferences
  const [preferences, setPreferences] = useState(initialPreferences);

  // Refresh exercises from state - now just a noop since we're using useState directly
  const refreshExercises = useCallback(() => {
    // This now does nothing since we're using in-memory storage
  }, []);

  // Refresh workouts from state - now just a noop since we're using useState directly
  const refreshWorkouts = useCallback(() => {
    // This now does nothing since we're using in-memory storage
  }, []);

  // CRUD operations for exercises
  const addExercise = useCallback((exercise) => {
    const newExercise = { ...exercise, id: Date.now().toString() };
    setExercises(prev => [...prev, newExercise]);
    return newExercise;
  }, []);

  const updateExercise = useCallback((updatedExercise) => {
    setExercises(prev => 
      prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex)
    );
    return updatedExercise;
  }, []);

  const deleteExercise = useCallback((id) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
    return true;
  }, []);

  // CRUD operations for workouts
  const addWorkout = useCallback((workout) => {
    const newWorkout = { ...workout, id: Date.now().toString() };
    setWorkouts(prev => [...prev, newWorkout]);
    return newWorkout;
  }, []);

  const updateWorkout = useCallback((updatedWorkout) => {
    setWorkouts(prev => 
      prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w)
    );
    return updatedWorkout;
  }, []);

  const deleteWorkout = useCallback((id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
    return true;
  }, []);

  // Current workout management
  const startWorkout = useCallback((workoutId) => {
    setCurrentWorkoutId(workoutId);
  }, []);

  const completeCurrentWorkout = useCallback(() => {
    setCurrentWorkoutId(null);
    return true;
  }, []);

  // User preferences management
  const updatePreferences = useCallback((newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
    return true;
  }, []);

  // Combine all values and functions to pass via context
  const contextValue = {
    // Exercise data and operations
    exercises,
    refreshExercises,
    addExercise,
    updateExercise,
    deleteExercise,
    
    // Workout data and operations
    workouts,
    refreshWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    
    // Current workout tracking
    currentWorkoutId,
    startWorkout,
    completeCurrentWorkout,
    
    // User preferences
    preferences,
    updatePreferences,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
