// Export all styles
import commonStyles, { colors, typography, spacing, borderRadius, shadowStyles } from './common';
import userCreationStyles from './userCreationStyles';
import workoutsStyles from './workoutsStyles';
import settingsStyles from './settingsStyles';
import navigationStyles, { tabBarOptions, stackScreenOptions } from './navigationStyles';

export {
  // Common style exports
  colors,
  typography,
  spacing,
  borderRadius,
  commonStyles,
  shadowStyles,
  
  // Screen specific styles
  userCreationStyles,
  workoutsStyles,
  settingsStyles,
  
  // Navigation styles
  navigationStyles,
  tabBarOptions,
  stackScreenOptions,
};

// Default export for importing all at once
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  commonStyles,
  shadowStyles,
  userCreationStyles,
  workoutsStyles,
  settingsStyles,
  navigationStyles,
  tabBarOptions,
  stackScreenOptions,
}; 