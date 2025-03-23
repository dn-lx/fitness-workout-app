import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius, shadowStyles } from './common';

const { height } = Dimensions.get('window');

// Create a function that takes isDarkMode as a parameter
const createSettingsStyles = (isDarkMode) => StyleSheet.create({
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
  appbarContent: {
    alignItems: 'center',
  },
  scrollContent: {
    padding: spacing.medium,
    minHeight: Platform.OS === 'web' ? undefined : height - 60, // Header height
  },
  headerTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.accent,
    marginVertical: spacing.medium,
  },
  section: {
    marginBottom: spacing.medium,
    paddingHorizontal: spacing.small,
  },
  sectionHeader: {
    backgroundColor: colors.background,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    color: colors.primary,
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.bold,
  },
  listItem: {
    paddingVertical: spacing.medium,
  },
  // Dialog styles
  dialog: {
    borderRadius: borderRadius.large,
    maxWidth: 500,
    alignSelf: 'center',
    width: '90%',
    backgroundColor: colors.surface,
    padding: spacing.medium,
  },
  dialogTitle: {
    fontSize: typography.fontSize.xlarge,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.medium,
  },
  dialogDescription: {
    fontSize: typography.fontSize.medium,
    color: colors.textLight,
    marginBottom: spacing.medium,
  },
  dialogContent: {
    paddingVertical: spacing.small,
  },
  scrollableDialogContent: {
    maxHeight: height * 0.6,
  },
  dialogText: {
    fontSize: typography.fontSize.medium,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  dialogSubtitle: {
    fontSize: typography.fontSize.medium,
    fontWeight: 'bold',
    marginTop: spacing.medium,
    marginBottom: spacing.small,
    color: colors.text,
  },
  dialogList: {
    fontSize: typography.fontSize.medium,
    color: colors.text,
    marginLeft: spacing.small,
  },
  dialogButton: {
    marginTop: spacing.medium,
    borderRadius: borderRadius.medium,
  },
  dialogActionButton: {
    marginHorizontal: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: borderRadius.small,
    backgroundColor: colors.primary,
  },
  dialogActionButtonText: {
    fontWeight: typography.fontWeight.bold,
    color: isDarkMode ? colors.black : colors.white,
  },
  // Input styles
  input: {
    marginBottom: spacing.medium,
    backgroundColor: colors.surface,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: spacing.xsmall,
  },
  rowInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Profile styles
  photoContainer: {
    alignItems: 'center',
    marginVertical: spacing.medium,
  },
  changePhotoText: {
    marginTop: spacing.small,
    color: colors.primary,
    fontSize: typography.fontSize.medium,
  },
  photoOption: {
    paddingVertical: spacing.xSmall,
    borderRadius: borderRadius.small,
    marginBottom: spacing.small,
  },
  sectionLabel: {
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.medium,
    marginVertical: spacing.small,
    color: colors.text,
  },
  // Notification settings
  indentedSetting: {
    marginLeft: spacing.medium,
    marginBottom: spacing.small,
  },
  timePickerContainer: {
    alignItems: 'center',
    paddingVertical: spacing.medium,
  },
  // Card styles for workout history
  workoutCard: {
    marginBottom: spacing.medium,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.small,
  },
  statLabel: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
  },
  // Version info
  versionText: {
    fontSize: typography.fontSize.medium,
    marginTop: spacing.medium,
    color: colors.textLight,
  },
  copyText: {
    fontSize: typography.fontSize.small,
    marginTop: spacing.small,
    color: colors.textLight,
  },
  lastUpdatedText: {
    fontSize: typography.fontSize.small,
    marginTop: spacing.large,
    fontStyle: 'italic',
    color: colors.textLight,
  },
  // Update dialog specific styles
  updateNote: {
    fontSize: typography.fontSize.small,
    fontStyle: 'italic',
    marginTop: spacing.medium,
    color: colors.textLight,
  },
  downloadProgress: {
    alignItems: 'center',
    marginTop: spacing.medium,
  },
  // Radio buttons group
  radioGroup: {
    maxHeight: 300,
  },
  // Snackbar
  snackbar: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
  },
  button: {
    marginVertical: spacing.small,
    borderRadius: borderRadius.medium,
  },
});

// Export a function that creates the styles with the current theme
export default createSettingsStyles; 