import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius } from './common';

const { height, width } = Dimensions.get('window');

const userCreationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.medium,
    paddingBottom: spacing.xlarge * 2,
  },
  bottomPadding: {
    height: 100,
  },
  subtitle: {
    fontSize: typography.fontSize.medium,
    marginBottom: spacing.large,
    textAlign: 'center',
    color: colors.textLight,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xlarge,
  },
  photoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: colors.disabled,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.small,
    borderWidth: 2,
    borderColor: colors.primary,
    position: 'relative',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.disabled,
  },
  photoPlaceholderText: {
    color: colors.textLight,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },
  photoHint: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    margin: 0,
  },
  input: {
    marginBottom: spacing.medium,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xsmall,
    marginBottom: spacing.medium,
    marginTop: -spacing.small,
  },
  label: {
    fontSize: typography.fontSize.medium,
    marginTop: spacing.medium,
    marginBottom: spacing.small,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.large,
  },
  optionButton: {
    marginRight: spacing.small,
    marginBottom: spacing.small,
  },
  createButton: {
    marginTop: spacing.large,
    paddingVertical: spacing.small,
  },
  dialogButton: {
    marginVertical: spacing.small,
  },
  removeButton: {
    borderColor: colors.error,
    color: colors.error,
  },
});

export default userCreationStyles; 