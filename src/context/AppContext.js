import React, { createContext, useState, useContext } from 'react';

// Create the context
const AppContext = createContext();

// Themes
const themes = {
  light: {
    primary: '#4F46E5',        // Indigo-600 (primary brand color)
    secondary: '#EC4899',      // Pink-500 (accent color)
    success: '#10B981',        // Emerald-500
    danger: '#EF4444',         // Red-500
    warning: '#F59E0B',        // Amber-500
    info: '#3B82F6',           // Blue-500
    background: '#F9FAFB',     // Gray-50
    card: '#FFFFFF',           // White
    text: '#1F2937',           // Gray-800
    border: '#E5E7EB',         // Gray-200
    notification: '#EC4899',   // Pink-500
    inactive: '#9CA3AF',       // Gray-400
    gradientStart: '#4F46E5',  // Indigo-600
    gradientEnd: '#8B5CF6',    // Violet-500
  },
  dark: {
    primary: '#6366F1',        // Indigo-500
    secondary: '#F472B6',      // Pink-400
    success: '#34D399',        // Emerald-400
    danger: '#F87171',         // Red-400
    warning: '#FBBF24',        // Amber-400
    info: '#60A5FA',           // Blue-400
    background: '#111827',     // Gray-900
    card: '#1F2937',           // Gray-800
    text: '#F9FAFB',           // Gray-50
    border: '#374151',         // Gray-700
    notification: '#F472B6',   // Pink-400
    inactive: '#6B7280',       // Gray-500
    gradientStart: '#6366F1',  // Indigo-500
    gradientEnd: '#A78BFA',    // Violet-400
  }
};

// Create a provider component
export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [metricSystem, setMetricSystem] = useState(false); // false = imperial, true = metric
  const [theme, setTheme] = useState(themes.light);
  
  // Language translations (basic implementation)
  const translations = {
    English: {
      workouts: 'Workouts',
      trainingHub: 'Training Hub',
      workoutLibrary: 'Workout Library',
      selectWorkout: 'Select a workout to begin',
      startWorkout: 'Start Workout',
      exercises: 'exercises',
      preferences: 'Preferences',
      theme: 'Theme',
      language: 'Language',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      more: 'more',
      editWorkout: 'Edit Workout',
      createWorkout: 'Create Workout',
      save: 'Save',
      workoutExercises: 'Workout Exercises',
      noExercisesYet: 'No exercises added yet',
      addExercises: 'Add Exercises',
      searchExercises: 'Search exercises...',
      loadingExercises: 'Loading exercises...',
      noExercisesFound: 'No exercises found',
      alreadyAdded: 'Already Added',
      exerciseAlreadyInWorkout: 'This exercise is already in your workout',
      ok: 'OK',
      removeExercise: 'Remove Exercise',
      removeExerciseConfirm: 'Are you sure you want to remove this exercise?',
      cancel: 'Cancel',
      remove: 'Remove',
      workoutSaved: 'Workout Saved',
      workoutUpdatedSuccessfully: 'Workout updated successfully',
      sets: 'Sets',
      reps: 'Reps',
      rest: 'Rest',
    },
    Spanish: {
      workouts: 'Entrenamientos',
      trainingHub: 'Centro de Entrenamiento',
      workoutLibrary: 'Biblioteca de Entrenamientos',
      selectWorkout: 'Selecciona un entrenamiento para comenzar',
      startWorkout: 'Iniciar Entrenamiento',
      exercises: 'ejercicios',
      preferences: 'Preferencias',
      theme: 'Tema',
      language: 'Idioma',
      darkMode: 'Modo Oscuro',
      lightMode: 'Modo Claro',
      more: 'más',
      editWorkout: 'Editar Entrenamiento',
      createWorkout: 'Crear Entrenamiento',
      save: 'Guardar',
      workoutExercises: 'Ejercicios del Entrenamiento',
      noExercisesYet: 'Aún no hay ejercicios añadidos',
      addExercises: 'Añadir Ejercicios',
      searchExercises: 'Buscar ejercicios...',
      loadingExercises: 'Cargando ejercicios...',
      noExercisesFound: 'No se encontraron ejercicios',
      alreadyAdded: 'Ya Añadido',
      exerciseAlreadyInWorkout: 'Este ejercicio ya está en tu entrenamiento',
      ok: 'OK',
      removeExercise: 'Eliminar Ejercicio',
      removeExerciseConfirm: '¿Estás seguro de que quieres eliminar este ejercicio?',
      cancel: 'Cancelar',
      remove: 'Eliminar',
      workoutSaved: 'Entrenamiento Guardado',
      workoutUpdatedSuccessfully: 'Entrenamiento actualizado con éxito',
      sets: 'Series',
      reps: 'Repeticiones',
      rest: 'Descanso',
    },
    French: {
      workouts: 'Entraînements',
      trainingHub: 'Centre d\'Entraînement',
      workoutLibrary: 'Bibliothèque d\'Entraînements',
      selectWorkout: 'Sélectionnez un entraînement pour commencer',
      startWorkout: 'Commencer l\'Entraînement',
      exercises: 'exercices',
      preferences: 'Préférences',
      theme: 'Thème',
      language: 'Langue',
      darkMode: 'Mode Sombre',
      lightMode: 'Mode Clair',
      more: 'plus',
      editWorkout: 'Modifier l\'Entraînement',
      createWorkout: 'Créer un Entraînement',
      save: 'Enregistrer',
      workoutExercises: 'Exercices d\'Entraînement',
      noExercisesYet: 'Pas encore d\'exercices ajoutés',
      addExercises: 'Ajouter des Exercices',
      searchExercises: 'Rechercher des exercices...',
      loadingExercises: 'Chargement des exercices...',
      noExercisesFound: 'Aucun exercice trouvé',
      alreadyAdded: 'Déjà Ajouté',
      exerciseAlreadyInWorkout: 'Cet exercice est déjà dans votre entraînement',
      ok: 'OK',
      removeExercise: 'Supprimer l\'Exercice',
      removeExerciseConfirm: 'Êtes-vous sûr de vouloir supprimer cet exercice?',
      cancel: 'Annuler',
      remove: 'Supprimer',
      workoutSaved: 'Entraînement Enregistré',
      workoutUpdatedSuccessfully: 'Entraînement mis à jour avec succès',
      sets: 'Séries',
      reps: 'Répétitions',
      rest: 'Repos',
    },
    German: {
      workouts: 'Workouts',
      trainingHub: 'Trainingszentrum',
      workoutLibrary: 'Workout-Bibliothek',
      selectWorkout: 'Wähle ein Workout, um zu beginnen',
      startWorkout: 'Workout Starten',
      exercises: 'Übungen',
      preferences: 'Einstellungen',
      theme: 'Thema',
      language: 'Sprache',
      darkMode: 'Dunkelmodus',
      lightMode: 'Hellmodus',
      more: 'mehr',
      editWorkout: 'Workout bearbeiten',
      createWorkout: 'Workout erstellen',
      save: 'Speichern',
      workoutExercises: 'Workout-Übungen',
      noExercisesYet: 'Noch keine Übungen hinzugefügt',
      addExercises: 'Übungen hinzufügen',
      searchExercises: 'Übungen suchen...',
      loadingExercises: 'Übungen werden geladen...',
      noExercisesFound: 'Keine Übungen gefunden',
      alreadyAdded: 'Bereits hinzugefügt',
      exerciseAlreadyInWorkout: 'Diese Übung ist bereits in Ihrem Workout',
      ok: 'OK',
      removeExercise: 'Übung entfernen',
      removeExerciseConfirm: 'Sind Sie sicher, dass Sie diese Übung entfernen möchten?',
      cancel: 'Abbrechen',
      remove: 'Entfernen',
      workoutSaved: 'Workout gespeichert',
      workoutUpdatedSuccessfully: 'Workout erfolgreich aktualisiert',
      sets: 'Sätze',
      reps: 'Wiederholungen',
      rest: 'Pause',
    },
    // Add more languages as needed
  };
  
  // Get translation
  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to English
    return translations.English[key] || key;
  };
  
  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(isDarkMode ? themes.light : themes.dark);
  };
  
  // Change language
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };
  
  // Toggle metric/imperial system
  const toggleMetricSystem = () => {
    setMetricSystem(!metricSystem);
  };
  
  // Format weight based on metric/imperial system
  const formatWeight = (weight) => {
    if (weight === 0) return 'BW'; // Body weight
    
    if (metricSystem) {
      // Convert from lbs to kg if needed (assuming weight is stored in lbs)
      const kg = weight * 0.453592;
      return `${kg.toFixed(1)} kg`;
    } else {
      return `${weight} lbs`;
    }
  };
  
  // Context value
  const contextValue = {
    isDarkMode,
    toggleTheme,
    language,
    changeLanguage,
    metricSystem,
    toggleMetricSystem,
    theme,
    t,
    formatWeight,
  };
  
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppContext;
