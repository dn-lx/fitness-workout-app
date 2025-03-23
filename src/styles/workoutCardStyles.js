import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius, shadowStyles } from './common';

const workoutCardStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.large,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.cardBackground,
    ...shadowStyles.medium,
    position: 'relative',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  closeButton: {
    margin: 0,
    padding: 0,
  },
  content: {
    padding: spacing.medium,
    paddingTop: spacing.large,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  title: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flex: 1,
  },
  level: {
    fontSize: typography.fontSize.small,
    color: colors.accent,
    opacity: 0.8,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: typography.fontSize.medium,
    color: colors.text,
    opacity: 0.9,
    marginBottom: spacing.medium,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.medium,
  },
  detailText: {
    marginLeft: spacing.xsmall,
    color: colors.text,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.small,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  startButton: {
    marginHorizontal: spacing.xsmall,
    paddingHorizontal: spacing.medium,
    borderRadius: borderRadius.small,
    backgroundColor: colors.accent,
    flex: 0.45,
    marginRight: spacing.small,
  },
  editButton: {
    marginHorizontal: spacing.xsmall,
    paddingHorizontal: spacing.medium,
    borderRadius: borderRadius.small,
    backgroundColor: colors.accent,
    flex: 0.45,
    marginLeft: spacing.small,
  },
  buttonLabel: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  }
});

export default workoutCardStyles; 