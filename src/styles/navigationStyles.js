import { StyleSheet } from 'react-native';
import { colors, spacing, typography, shadowStyles } from './common';

const navigationStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: spacing.xsmall,
  },
  tabBarLabel: {
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.regular,
    textAlign: 'center',
    margin: 0,
    padding: 0,
  },
  tabBarIcon: {
    marginTop: spacing.xsmall,
  },
  header: {
    backgroundColor: colors.headerBackground,
  },
  headerTitle: {
    color: colors.cardBackground,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.large,
  },
  headerLeft: {
    marginLeft: spacing.small,
  },
  headerRight: {
    marginRight: spacing.small,
  },
});

export const tabBarOptions = {
  activeTintColor: colors.primary,
  inactiveTintColor: colors.textLight,
  style: navigationStyles.tabBar,
  labelStyle: navigationStyles.tabBarLabel,
};

export const stackScreenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: colors.background },
  gestureEnabled: true,
};

export default navigationStyles; 