import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, spacing, typography } from './common';

const { height } = Dimensions.get('window');

const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    minHeight: Platform.OS === 'web' ? undefined : height - 60, // Header height
    paddingBottom: spacing.large,
  },
  buttonContainer: {
    padding: spacing.medium,
    marginBottom: spacing.large,
  },
  button: {
    marginVertical: spacing.small,
  },
  logoutButton: {
    backgroundColor: colors.danger,
  },
  aboutText: {
    lineHeight: 22,
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
});

export default settingsStyles; 