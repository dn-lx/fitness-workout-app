import React from 'react';
import { View } from 'react-native';
import { Surface, Text, IconButton, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage, t } from '../contexts/LanguageContext';
import Dialog from './Dialog';
import CardStyles from '../styles/workoutCardStyles';

const WorkoutCard = ({ workout, onRemove }) => {
  const { currentLanguage } = useLanguage();
  const navigation = useNavigation();
  const [removeDialogVisible, setRemoveDialogVisible] = React.useState(false);

  // Function to handle starting the workout
  const handleStartWorkout = () => {
    navigation.navigate('ActiveWorkout', { id: workout.id });
  };

  // Function to handle editing the workout
  const handleEditWorkout = () => {
    navigation.navigate('EditWorkout', { id: workout.id });
  };

  // Function to handle removing the workout
  const handleRemoveWorkout = () => {
    setRemoveDialogVisible(true);
  };

  // Function to confirm removing the workout
  const confirmRemoveWorkout = () => {
    onRemove(workout.id);
    setRemoveDialogVisible(false);
  };

  return (
    <Surface style={CardStyles.container}>
      <View style={CardStyles.closeButtonContainer}>
        <IconButton
          icon="close"
          color="rgba(255, 70, 70, 1)"
          size={20}
          onPress={handleRemoveWorkout}
          style={CardStyles.closeButton}
        />
      </View>
      
      <Card.Content style={CardStyles.content}>
        <View style={CardStyles.titleContainer}>
          <Text style={CardStyles.title}>{workout.title}</Text>
          <Text style={CardStyles.level}>{workout.level}</Text>
        </View>
        
        <Text style={CardStyles.description}>{workout.description}</Text>
        
        <View style={CardStyles.details}>
          <View style={CardStyles.detailItem}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
            <Text style={CardStyles.detailText}>{workout.duration} min</Text>
          </View>
          
          <View style={CardStyles.detailItem}>
            <MaterialCommunityIcons name="fire" size={16} color="#666" />
            <Text style={CardStyles.detailText}>{workout.calories} cal</Text>
          </View>
        </View>
      </Card.Content>
      
      <View style={CardStyles.actions}>
        <Button
          mode="contained"
          onPress={handleStartWorkout}
          style={CardStyles.startButton}
          labelStyle={CardStyles.buttonLabel}
        >
          {t('startWorkout', currentLanguage)}
        </Button>
        
        <Button
          mode="contained"
          onPress={handleEditWorkout}
          style={CardStyles.editButton}
          labelStyle={CardStyles.buttonLabel}
        >
          {t('edit', currentLanguage)}
        </Button>
      </View>
      
      <Dialog
        visible={removeDialogVisible}
        title={t('confirmRemoveWorkout', currentLanguage)}
        content=""
        onCancel={() => setRemoveDialogVisible(false)}
        onConfirm={confirmRemoveWorkout}
      />
    </Surface>
  );
};

export default WorkoutCard; 