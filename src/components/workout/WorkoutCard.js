import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { colors, spacing, typography } from '../../styles';

const levelColors = {
  beginner: colors.success,
  intermediate: colors.warning,
  advanced: colors.danger
};

const WorkoutCard = ({ workout, onSelect, onStart }) => {
  return (
    <Card style={styles.card} onPress={() => onSelect(workout.id)}>
      <Card.Content>
        <Title>{workout.title}</Title>
        <Paragraph>{workout.description}</Paragraph>
        
        <View style={styles.detailsRow}>
          <Chip 
            style={[styles.levelChip, { backgroundColor: levelColors[workout.level] }]}
            textStyle={styles.chipText}
          >
            {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
          </Chip>
          <Chip icon="clock-outline" style={styles.chip}>{workout.duration} min</Chip>
          <Chip icon="fire" style={styles.chip}>{workout.calories} cal</Chip>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => onSelect(workout.id)}>View Details</Button>
        <Button mode="contained" onPress={() => onStart(workout.id)}>
          Start
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.medium,
    elevation: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: spacing.small,
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: spacing.small,
    marginTop: spacing.small,
  },
  levelChip: {
    marginRight: spacing.small,
    marginTop: spacing.small,
  },
  chipText: {
    color: colors.background,
  },
});

export default WorkoutCard; 