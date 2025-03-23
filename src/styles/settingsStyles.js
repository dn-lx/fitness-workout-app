import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius } from './common';

const { height } = Dimensions.get('window');

const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.medium,
    minHeight: Platform.OS === 'web' ? undefined : height - 60, // Header height
  },
  buttonContainer: {
    marginTop: spacing.large,
    marginBottom: spacing.large,
  },
  button: {
    marginVertical: spacing.small,
  },
  logoutButton: {
    backgroundColor: colors.accent,
  },
  aboutText: {
    fontSize: typography.fontSize.medium,
    lineHeight: typography.lineHeight.large,
    color: colors.textDark,
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
  },
  sectionHeaderText: {
    color: colors.textLight,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },
  listItem: {
    paddingVertical: spacing.medium,
  },
  dialogContent: {
    paddingVertical: spacing.small,
  },
  radioItem: {
    paddingVertical: spacing.small,
  },
  // Update dialog styles
  updateTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.medium,
    color: colors.primary,
  },
  updateNotes: {
    fontSize: typography.fontSize.medium,
    lineHeight: typography.lineHeight.large,
    marginBottom: spacing.large,
  },
  progressContainer: {
    marginTop: spacing.medium,
    alignItems: 'center',
  },
  progressText: {
    fontSize: typography.fontSize.medium,
    marginBottom: spacing.small,
  },
  progressIndicator: {
    marginTop: spacing.small,
  },
});

export default settingsStyles; 