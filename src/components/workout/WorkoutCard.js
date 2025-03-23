import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, useTheme as usePaperTheme, IconButton, Portal, Dialog, Text } from 'react-native-paper';
import { spacing, typography, colors } from '../../styles';
import workoutCardStyles from '../../styles/workoutCardStyles';
import { t } from '../../contexts/LanguageContext';

const WorkoutCard = ({ workout, onSelect, onStart, onEdit, onRemove, theme: propTheme, currentLanguage }) => {
  // Use provided theme or fallback to useTheme hook
  const paperTheme = propTheme || usePaperTheme();
  
  // State for delete confirmation dialog
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  
  // Dynamic level colors that work with theme
  const levelColors = {
    beginner: paperTheme.colors.notification || '#4CAF50',
    intermediate: '#FFA726', // warning color
    advanced: paperTheme.colors.error || '#F44336'
  };
  
  // Helper function to get the translated level
  const getTranslatedLevel = (level) => {
    return t(level, currentLanguage);
  };
  
  // Handlers for the delete confirmation
  const showDeleteDialog = () => setDeleteDialogVisible(true);
  const hideDeleteDialog = () => setDeleteDialogVisible(false);
  const confirmDelete = () => {
    hideDeleteDialog();
    if (onRemove) {
      onRemove(workout.id);
    }
  };

  return (
    <>
      <Card style={workoutCardStyles.card}>
        {onRemove && (
          <IconButton
            icon="delete"
            color={paperTheme.colors.error}
            size={20}
            style={workoutCardStyles.deleteButton}
            onPress={showDeleteDialog}
          />
        )}
        <Card.Content>
          <Title style={workoutCardStyles.title}>{workout.title}</Title>
          <Paragraph style={workoutCardStyles.description}>{workout.description}</Paragraph>
          
          <View style={workoutCardStyles.detailsRow}>
            <Chip 
              style={[workoutCardStyles.levelChip, { backgroundColor: levelColors[workout.level] }]}
              textStyle={workoutCardStyles.chipText}
            >
              {getTranslatedLevel(workout.level)}
            </Chip>
            <Chip 
              icon="clock-outline" 
              style={workoutCardStyles.chip}
              textStyle={workoutCardStyles.chipContent}
            >
              {workout.duration} {t('minutes', currentLanguage)}
            </Chip>
            <Chip 
              icon="fire" 
              style={workoutCardStyles.chip}
              textStyle={workoutCardStyles.chipContent}
            >
              {workout.calories} {t('calories', currentLanguage)}
            </Chip>
          </View>
        </Card.Content>
        <Card.Actions style={workoutCardStyles.cardActions}>
          {onStart && (
            <IconButton 
              icon="play"
              size={22}
              color="#000"
              style={{
                backgroundColor: colors.accent,
              }}
              onPress={() => onStart(workout.id)}
            />
          )}
          <View style={{ flex: 1 }} />
          {onEdit && (
            <IconButton 
              icon="pencil-outline"
              size={22}
              color="#000"
              style={{
                backgroundColor: colors.primary,
              }}
              onPress={() => onEdit(workout.id)}
            />
          )}
        </Card.Actions>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={hideDeleteDialog}
        >
          <Dialog.Title style={workoutCardStyles.dialogTitle}>{t('remove', currentLanguage)}</Dialog.Title>
          <Dialog.Content>
            <Text style={workoutCardStyles.dialogContent}>
              {t('confirmRemoveWorkout', currentLanguage) || 'Are you sure you want to remove this workout?'}
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={workoutCardStyles.dialogActions}>
            <Button 
              onPress={hideDeleteDialog} 
              color={paperTheme.colors.primary}
            >
              {t('cancel', currentLanguage)}
            </Button>
            <Button 
              onPress={confirmDelete} 
              color={paperTheme.colors.error}
            >
              {t('remove', currentLanguage)}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default WorkoutCard; 