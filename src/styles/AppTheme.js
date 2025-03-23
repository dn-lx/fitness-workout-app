import { colors } from './common';

export const createAppTheme = (themeType) => {
  const isDark = themeType === 'dark';
  
  return {
    color: {
      primary: isDark ? colors.primaryLight : colors.primary,
      secondary: isDark ? colors.secondaryLight : colors.secondary,
      accent: isDark ? colors.accentLight : colors.accent,
      background: isDark ? colors.backgroundDark : colors.background,
      surface: isDark ? colors.surfaceDark : colors.surface,
      card: isDark ? colors.cardBackgroundDark : colors.cardBackground,
      text: isDark ? colors.textDark : colors.text,
      textLight: isDark ? colors.textLightDark : colors.textLight,
      textMuted: isDark ? colors.textMutedDark : colors.textMuted,
      border: isDark ? colors.borderDark : colors.border,
      error: isDark ? colors.errorLight : colors.error,
      success: colors.success,
      warning: colors.warning,
      headerBackground: isDark ? colors.headerBackgroundDark : colors.headerBackground,
      blue: colors.primary,
      orange: colors.accent
    }
  };
};

export default { createAppTheme }; 