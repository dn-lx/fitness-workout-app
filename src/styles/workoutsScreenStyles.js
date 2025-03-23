import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius, shadowStyles } from './common';

const { height } = Dimensions.get('window');

const workoutsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.headerBackground,
  },
  headerTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    color: colors.cardBackground,
  },
  headerContent: {
    alignItems: 'center',
  },
  searchAndFilterContainer: {
    position: 'absolute',
    top: 70, // Adjust as needed based on header height
    left: 0,
    right: 0,
    zIndex: 10, // To make sure it floats above the workout cards
    backgroundColor: 'transparent',
  },
  searchContainer: {
    padding: spacing.medium,
    paddingBottom: spacing.small,
    backgroundColor: 'transparent',
  },
  searchBar: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: borderRadius.medium,
  },
  searchInput: {
    color: colors.text,
    fontSize: typography.fontSize.medium,
  },
  searchIcon: {
    color: colors.accent,
  },
  filterContainer: {
    paddingHorizontal: spacing.small,
    paddingBottom: spacing.medium,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    gap: spacing.xsmall,
  },
  filterChip: {
    margin: spacing.xsmall / 2,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    height: 36,
  },
  selectedFilterChip: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  filterChipText: {
    color: colors.white,
    fontSize: typography.fontSize.small,
  },
  selectedFilterChipText: {
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingIndicator: {
    color: colors.accent,
  },
  listContainer: {
    flex: 1,
    padding: spacing.medium,
    paddingTop: spacing.medium + 180, // Increase padding at the top to move the first card lower
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
    backgroundColor: colors.background,
    marginTop: 180, // Also increase this value to match
  },
  emptyText: {
    fontSize: typography.fontSize.large,
    color: colors.textLight,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: spacing.medium,
    right: 0,
    bottom: 0,
    backgroundColor: colors.accent,
  }
});

export default workoutsScreenStyles; 