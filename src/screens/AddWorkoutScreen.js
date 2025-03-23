import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, TextInput, Button, HelperText, Text, Surface, Checkbox, useTheme as usePaperTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage, t } from '../contexts/LanguageContext';
import { colors } from '../styles/common';
import workoutsScreenStyles from '../styles/workoutsScreenStyles';

// Import workout model
import { addWorkout } from '../models/workout';

const AddWorkoutScreen = ({ navigation }) => {
  const { currentLanguage } = useLanguage();
  const paperTheme = usePaperTheme();
  
  // Form state
  const [workout, setWorkout] = useState({
    title: '',
    description: '',
    level: 'beginner',
    duration: '',
    calories: '',
    exercises: [] // We'll implement adding exercises in a future update
  });
  
  // Error state
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    duration: '',
    calories: ''
  });
  
  // Handle form field changes
  const handleChange = (field, value) => {
    setWorkout({
      ...workout,
      [field]: value
    });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };
  
  // Validate the form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Check title
    if (!workout.title.trim()) {
      newErrors.title = t('fieldRequired', currentLanguage);
      isValid = false;
    }
    
    // Check description
    if (!workout.description.trim()) {
      newErrors.description = t('fieldRequired', currentLanguage);
      isValid = false;
    }
    
    // Check duration
    if (!workout.duration) {
      newErrors.duration = t('fieldRequired', currentLanguage);
      isValid = false;
    } else if (isNaN(workout.duration) || parseInt(workout.duration) <= 0) {
      newErrors.duration = t('invalidNumber', currentLanguage);
      isValid = false;
    }
    
    // Check calories
    if (!workout.calories) {
      newErrors.calories = t('fieldRequired', currentLanguage);
      isValid = false;
    } else if (isNaN(workout.calories) || parseInt(workout.calories) <= 0) {
      newErrors.calories = t('invalidNumber', currentLanguage);
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Convert string inputs to numbers
      const workoutData = {
        ...workout,
        duration: parseInt(workout.duration),
        calories: parseInt(workout.calories)
      };
      
      // Add the workout
      addWorkout(workoutData);
      
      // Navigate back with success message
      navigation.navigate('WorkoutsList', {
        message: t('workoutAdded', currentLanguage)
      });
    }
  };
  
  // Difficulty levels
  const difficultyLevels = [
    { label: t('beginner', currentLanguage), value: 'beginner' },
    { label: t('intermediate', currentLanguage), value: 'intermediate' },
    { label: t('advanced', currentLanguage), value: 'advanced' }
  ];
  
  return (
    <SafeAreaView style={workoutsScreenStyles.container} edges={['top']}>
      <Appbar.Header style={workoutsScreenStyles.headerContainer}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color={colors.cardBackground} />
        <Appbar.Content 
          title={t('addWorkout', currentLanguage)} 
          titleStyle={workoutsScreenStyles.headerTitle}
          style={workoutsScreenStyles.headerContent} 
        />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        <Surface style={styles.formContainer}>
          {/* Title */}
          <TextInput
            label={t('workoutTitle', currentLanguage)}
            value={workout.title}
            onChangeText={(text) => handleChange('title', text)}
            style={styles.input}
            error={!!errors.title}
            mode="outlined"
          />
          {errors.title ? <HelperText type="error">{errors.title}</HelperText> : null}
          
          {/* Description */}
          <TextInput
            label={t('workoutDescription', currentLanguage)}
            value={workout.description}
            onChangeText={(text) => handleChange('description', text)}
            style={styles.input}
            error={!!errors.description}
            multiline
            numberOfLines={3}
            mode="outlined"
          />
          {errors.description ? <HelperText type="error">{errors.description}</HelperText> : null}
          
          {/* Difficulty Level */}
          <Text style={styles.sectionTitle}>{t('difficultyLevel', currentLanguage)}</Text>
          <View style={styles.difficultyContainer}>
            {difficultyLevels.map((level) => (
              <View key={level.value} style={styles.difficultyOption}>
                <Checkbox
                  status={workout.level === level.value ? 'checked' : 'unchecked'}
                  onPress={() => handleChange('level', level.value)}
                  color={colors.primary}
                />
                <Text onPress={() => handleChange('level', level.value)}>
                  {level.label}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Duration */}
          <TextInput
            label={t('workoutDuration', currentLanguage) + ' (min)'}
            value={workout.duration}
            onChangeText={(text) => handleChange('duration', text)}
            style={styles.input}
            error={!!errors.duration}
            keyboardType="numeric"
            mode="outlined"
          />
          {errors.duration ? <HelperText type="error">{errors.duration}</HelperText> : null}
          
          {/* Calories */}
          <TextInput
            label={t('workoutCalories', currentLanguage) + ' (cal)'}
            value={workout.calories}
            onChangeText={(text) => handleChange('calories', text)}
            style={styles.input}
            error={!!errors.calories}
            keyboardType="numeric"
            mode="outlined"
          />
          {errors.calories ? <HelperText type="error">{errors.calories}</HelperText> : null}
          
          {/* Submit Button */}
          <View style={styles.buttonsContainer}>
            <Button 
              mode="outlined" 
              onPress={() => navigation.goBack()}
              style={styles.button}
              labelStyle={{ color: colors.primary }}
            >
              {t('cancel', currentLanguage)}
            </Button>
            
            <Button 
              mode="contained" 
              onPress={handleSubmit}
              style={[styles.button, { backgroundColor: colors.primary }]}
              labelStyle={{ color: colors.cardBackground }}
            >
              {t('save', currentLanguage)}
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  input: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  difficultyOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  }
});

export default AddWorkoutScreen; 