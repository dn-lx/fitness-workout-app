import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Modern color palette
export const colors = {
  // Light theme colors
  primary: '#2B87D1',      // Strong Blue - energy, focus, performance
  primaryLight: '#5AA6E0', // Light Blue - freshness, movement
  primaryDark: '#1A5C94',  // Dark Blue - strength, reliability
  accent: '#E67E22',       // Softer Orange - eye-friendly, warm, inviting
  accentLight: '#F39C12',  // Light Orange - gentle, approachable
  accentDark: '#D35400',   // Dark Orange - confidence, impact
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
  
  // Dark theme colors
  backgroundDark: '#121212',   // Very dark gray (almost black)
  cardBackgroundDark: '#1E1E1E', // Dark gray (slightly lighter than background)
  headerBackgroundDark: '#1A5C94', // Dark Blue
  surfaceDark: '#2C2C2C',       // Dark gray for cards and surfaces
  textDark: '#FFFFFF',          // White text
  textLightDark: '#BBBBBB',     // Light gray text
  textMutedDark: '#888888',     // Medium gray (muted text)
  borderDark: '#444444',        // Dark gray for borders
  dividerDark: '#333333',       // Slightly lighter than background
  disabledDark: '#333333',      // Dark gray for disabled elements
  cardShadowDark: '#000000',    // Black shadow for dark mode
  
  // These stay consistent between light and dark modes
  notification: '#FF5722',      // Orange notification color
  statusBarDark: '#000000',     // Status bar color for dark mode
  statusBarLight: '#F5F5F5',    // Status bar color for light mode
  
  // Shadow styles for light theme
  shadowLight1: 'rgba(0, 0, 0, 0.05)',
  shadowLight2: 'rgba(0, 0, 0, 0.08)',
  shadowLight3: 'rgba(0, 0, 0, 0.11)',
  shadowLight4: 'rgba(0, 0, 0, 0.14)',
  shadowLight5: 'rgba(0, 0, 0, 0.17)',
  
  // Light theme variants for dark mode
  primaryLight: '#5BABEC',
  accentLight: '#4CD2E6',
  secondaryLight: '#FFA726',
  errorLight: '#FF8A80',
  notificationLight: '#B3FFC9',
  backdropDark: 'rgba(0, 0, 0, 0.5)',
  surfaceDisabledDark: 'rgba(30, 30, 30, 0.38)',
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
  small: Platform.select({
    ios: {},
    android: {
      elevation: 0,
    },
    web: {},
  }),
  medium: Platform.select({
    ios: {},
    android: {
      elevation: 0,
    },
    web: {},
  }),
  large: Platform.select({
    ios: {},
    android: {
      elevation: 0,
    },
    web: {},
  }),
  extraLarge: Platform.select({
    ios: {},
    android: {
      elevation: 0,
    },
    web: {},
  }),
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
    ...(Platform.OS === 'web' 
      ? {} 
      : shadowStyles.small),
  },
  elevated: {
    borderRadius: borderRadius.medium,
    padding: spacing.medium,
    backgroundColor: colors.surface,
    marginBottom: spacing.medium,
    ...(Platform.OS === 'web' 
      ? {} 
      : shadowStyles.medium),
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
    ...(Platform.OS === 'web' 
      ? {} 
      : shadowStyles.small),
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
  // List and Settings styles
  listItem: {
    borderRadius: borderRadius.small,
    marginVertical: spacing.xsmall,
    paddingVertical: spacing.small,
  },
  listItemIcon: {
    marginRight: spacing.small,
  },
  listDivider: {
    height: 1,
    marginVertical: spacing.xsmall,
  },
  sectionHeader: {
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.bold,
  },
  // Dialog styles
  dialog: {
    borderRadius: borderRadius.large,
    padding: spacing.medium,
    maxWidth: 480,
    width: '90%',
    alignSelf: 'center',
  },
  dialogTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.medium,
  },
  dialogContent: {
    marginBottom: spacing.medium,
  },
  dialogActions: {
    marginTop: spacing.medium,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dialogScrollContent: {
    maxHeight: height * 0.6,
  },
  dialogInput: {
    marginBottom: spacing.medium,
  },
  dialogLabel: {
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.small,
  },
  dialogDescription: {
    fontSize: typography.fontSize.medium,
    marginBottom: spacing.medium,
  },
  textSpacing: {
    marginVertical: spacing.small,
  },
});

export default commonStyles; 