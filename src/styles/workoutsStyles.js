import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius, shadowStyles } from './common';

const { height } = Dimensions.get('window');

const workoutsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appbar: {
    backgroundColor: colors.headerBackground,
  },
  appbarTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    color: colors.cardBackground,
    textAlign: 'center',
  },
  searchContainer: {
    padding: spacing.medium,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
  },
  searchInput: {
    color: colors.text,
    fontSize: typography.fontSize.medium,
  },
  list: {
    padding: spacing.medium,
    minHeight: Platform.OS === 'web' ? undefined : height - 150, // Header height + safe area
  },
  card: {
    marginBottom: spacing.medium,
    borderRadius: borderRadius.medium,
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
    color: colors.cardBackground,
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
    advanced: colors.error,
  },
  // Dev button for database operations
  devButton: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.error,
  },
});

export default workoutsStyles; 