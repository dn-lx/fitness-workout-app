import { StyleSheet } from 'react-native';
import { colors, spacing } from './common';

const navigationStyles = StyleSheet.create({
  tabBar: {
    elevation: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: spacing.xsmall,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabBarIcon: {
    marginTop: spacing.xsmall,
  },
  header: {
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    color: colors.text,
    fontWeight: 'bold',
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