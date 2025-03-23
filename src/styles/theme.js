import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { merge } from 'lodash';

// Import our color palettes
import * as commonColors from './common';

// Define our custom Light Theme
export const CustomLightTheme = {
  ...MD3LightTheme,
  dark: false,
  mode: 'exact', // Ensure exact colors are used
  colors: {
    ...MD3LightTheme.colors,
    primary: commonColors.colors.primary,
    accent: commonColors.colors.accent,
    secondary: commonColors.colors.secondary,
    background: commonColors.colors.background,
    surface: commonColors.colors.surface,
    text: commonColors.colors.text,
    error: commonColors.colors.error,
    disabled: commonColors.colors.disabled,
    placeholder: commonColors.colors.textMuted,
    backdrop: commonColors.colors.backdrop,
    notification: commonColors.colors.notification,
    card: commonColors.colors.cardBackground,
    border: commonColors.colors.border,
    surfaceDisabled: commonColors.colors.surfaceDisabled,
    onSurface: commonColors.colors.text,
    onSurfaceVariant: commonColors.colors.textMuted,
    elevation: {
      level0: 'transparent',
      level1: 'transparent',
      level2: 'transparent',
      level3: 'transparent',
      level4: 'transparent',
      level5: 'transparent',
    }
  },
};

// Define our custom Dark Theme
export const CustomDarkTheme = {
  ...MD3DarkTheme,
  dark: true,  // Ensure dark mode is set to true
  mode: 'exact', // Ensure exact colors are used
  colors: {
    ...MD3DarkTheme.colors,
    primary: commonColors.colors.primaryLight,
    accent: commonColors.colors.accentLight,
    secondary: commonColors.colors.secondaryLight,
    background: commonColors.colors.backgroundDark,
    surface: commonColors.colors.surfaceDark,
    text: commonColors.colors.textDark,
    error: commonColors.colors.errorLight,
    disabled: commonColors.colors.disabledDark,
    placeholder: commonColors.colors.textMutedDark,
    backdrop: commonColors.colors.backdropDark,
    notification: commonColors.colors.notificationLight,
    card: commonColors.colors.cardBackgroundDark,
    border: commonColors.colors.borderDark,
    surfaceDisabled: commonColors.colors.surfaceDisabledDark,
    onSurface: commonColors.colors.textDark,
    onSurfaceVariant: commonColors.colors.textMutedDark,
    elevation: {
      level0: 'transparent',
      level1: 'transparent',
      level2: 'transparent',
      level3: 'transparent',
      level4: 'transparent',
      level5: 'transparent',
    }
  },
};

// Merge with React Navigation themes to ensure all necessary properties
export const lightTheme = merge(
  {},
  NavigationDefaultTheme,
  CustomLightTheme
);

export const darkTheme = merge(
  {},
  NavigationDarkTheme,
  CustomDarkTheme
);

// Use the common colors directly to avoid circular dependencies
export const themeColors = commonColors.colors;

// Export the default theme (light theme)
export const theme = lightTheme;

// Support for dark mode switching
export const getTheme = (isDarkMode) => {
  return isDarkMode ? darkTheme : lightTheme;
};

export default theme; 