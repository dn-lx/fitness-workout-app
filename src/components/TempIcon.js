import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { getPlatformImageStyle, getTempIcon } from '../utils/imageUtils';
import { useTheme } from '../contexts/ThemeContext';
import { colors } from '../styles/common';

/**
 * A reusable component for displaying the app's temp icon
 * @param {object} props Component props
 * @param {number} props.size Size of the icon (width and height)
 * @param {string} props.color Optional color to tint the icon
 * @param {object} props.style Additional style props
 * @returns {React.Component} The temp icon component
 */
const TempIcon = ({ size = 24, color, style }) => {
  const { isDarkMode } = useTheme();
  
  // Default color based on theme
  const defaultColor = isDarkMode ? colors.white : colors.primary;
  
  return (
    <Image
      source={getTempIcon()}
      style={[
        getPlatformImageStyle({ width: size, height: size }),
        { tintColor: color || defaultColor },
        style
      ]}
    />
  );
};

export default TempIcon; 