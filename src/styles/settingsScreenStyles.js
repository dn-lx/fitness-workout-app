import { StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from './common';

const settingsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.headerBackground,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    color: colors.cardBackground,
  },
  headerContent: {
    alignItems: 'center',
  }
});

export default settingsScreenStyles; 