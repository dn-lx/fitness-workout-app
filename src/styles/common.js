import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Modern color palette
export const colors = {
  primary: '#2B87D1',      // Strong Blue - energy, focus, performance
  primaryLight: '#5AA6E0', // Light Blue - freshness, movement
  primaryDark: '#1A5C94',  // Dark Blue - strength, reliability
  accent: '#FF5722',       // Vibrant Orange - energy, power, dynamism
  accentLight: '#FF8A65',  // Light Orange - vitality, action
  accentDark: '#E64A19',   // Dark Orange - intensity, drive
  secondary: '#00BCD4',    // Cyan - refreshment, hydration
  secondaryDark: '#0097A7', // Dark Cyan - deepness, focus
  background: '#F5F5F5',   // Light Gray - clean, minimal
  cardBackground: '#FFFFFF', // White - clean, fresh
  headerBackground: '#2B87D1', // Strong Blue - consistency with primary
  surface: '#ffffff',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FFC107',
  text: '#212121',         // Almost Black - crisp readability
  textLight: '#616161',    // Medium Gray - balanced contrast
  textMuted: '#9E9E9E',    // Light Gray - subtle information
  border: '#E0E0E0',
  divider: '#EEEEEE',
  disabled: '#F5F5F5',
  darkOverlay: 'rgba(0,0,0,0.5)',
  lightOverlay: 'rgba(255,255,255,0.5)',
  cardShadow: '#d0d0d0',
};

// Typography scales
export const typography = {
  fontSize: {
    xs: 10,
    xsmall: 12,
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 24,
    xxxlarge: 32,
    huge: 40,
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    small: 1.2,
    medium: 1.5,
    large: 1.8,
  },
  fontFamily: {
    regular: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
      default: 'System'
    }),
    medium: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto Medium',
      default: 'System'
    }),
    light: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto Light',
      default: 'System'
    }),
    thin: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto Thin',
      default: 'System'
    }),
    bold: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto Bold',
      default: 'System'
    }),
  },
};

// Spacing scale
export const spacing = {
  xs: 4,
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48,
  xxxlarge: 64,
  huge: 80,
};

// Border radius scale
export const borderRadius = {
  xs: 2,
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  pill: 50,
  circle: 9999,
};

// Modern shadows
export const shadowStyles = {
  small: {
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  extraLarge: {
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
};

// Layout helpers
export const layout = {
  screenWidth: width,
  screenHeight: height,
  contentPadding: spacing.medium,
  contentPaddingBottom: spacing.xxxlarge,
};

// Common button styles
export const buttonStyles = {
  primary: {
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.small,
    marginVertical: spacing.small,
  },
  outlined: {
    borderRadius: borderRadius.medium, 
    borderWidth: 1,
    paddingVertical: spacing.small,
    marginVertical: spacing.small,
  },
  text: {
    paddingVertical: spacing.small,
    marginVertical: spacing.small,
  },
  icon: {
    borderRadius: borderRadius.circle,
    padding: spacing.xsmall,
  },
};

// Common input styles
export const inputStyles = {
  standard: {
    marginBottom: spacing.medium,
    backgroundColor: 'transparent',
    borderRadius: borderRadius.small,
  },
  rounded: {
    marginBottom: spacing.medium,
    backgroundColor: 'transparent',
    borderRadius: borderRadius.large,
  },
  pill: {
    marginBottom: spacing.medium,
    backgroundColor: 'transparent',
    borderRadius: borderRadius.pill,
  },
};

// Common card styles
export const cardStyles = {
  standard: {
    borderRadius: borderRadius.medium,
    padding: spacing.medium,
    backgroundColor: colors.surface,
    marginBottom: spacing.medium,
    ...shadowStyles.small,
  },
  elevated: {
    borderRadius: borderRadius.medium,
    padding: spacing.medium,
    backgroundColor: colors.surface,
    marginBottom: spacing.medium,
    ...shadowStyles.medium,
  },
  flat: {
    borderRadius: borderRadius.medium,
    padding: spacing.medium,
    backgroundColor: colors.surface,
    marginBottom: spacing.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
};

// Responsive design helpers
export const responsive = {
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
  isTablet: width >= 768 && width < 1024,
  isDesktop: width >= 1024,
};

// Animation timing
export const animation = {
  timing: {
    short: 150,
    medium: 300,
    long: 500,
  },
};

// Common styles
const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.medium,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xsmall,
    marginTop: -spacing.xsmall,
    marginBottom: spacing.small,
  },
  sectionTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.large,
    marginBottom: spacing.small,
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.medium,
    marginBottom: spacing.large,
    textAlign: 'center',
    color: colors.textLight,
  },
  headerTitle: {
    fontSize: typography.fontSize.xlarge,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  header: {
    backgroundColor: colors.surface,
    ...shadowStyles.small,
  },
  card: cardStyles.standard,
  cardElevated: cardStyles.elevated,
  cardFlat: cardStyles.flat,
  badge: {
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primaryLight,
  },
  badgeText: {
    color: colors.surface,
    fontSize: typography.fontSize.xsmall,
    fontWeight: typography.fontWeight.medium,
  },
  roundedImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.circle,
  },
});

export default commonStyles; 