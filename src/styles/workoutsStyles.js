import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius } from './common';

const { height } = Dimensions.get('window');

const workoutsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: spacing.medium,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.xxlarge,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.medium,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  list: {
    padding: spacing.medium,
    minHeight: Platform.OS === 'web' ? undefined : height - 150, // Header height + safe area
  },
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  emptyStateText: {
    fontSize: typography.fontSize.large,
    color: colors.textLight,
    textAlign: 'center',
  },
  // Level colors
  levelColors: {
    beginner: colors.success,
    intermediate: colors.warning,
    advanced: colors.danger,
  },
  // Dev button for database operations
  devButton: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.danger,
  },
});

export default workoutsStyles; 