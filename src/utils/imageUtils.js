import { Platform } from 'react-native';

/**
 * Utility functions for handling images in the app
 */

/**
 * Get the temp icon image for use in the app
 * @returns {any} The image source object
 */
export const getTempIcon = () => {
  // Use require for static image assets
  return require('../../assets/fitness-icon.png');
};

/**
 * Detect if a string is a valid URI
 * @param {string} uri The URI to check
 * @returns {boolean} Whether the URI is valid
 */
export const isValidImageUri = (uri) => {
  if (!uri) return false;
  return uri.startsWith('http://') || 
         uri.startsWith('https://') || 
         uri.startsWith('file://') || 
         uri.startsWith('data:image');
};

/**
 * Get platform-specific image properties for UI elements
 * @param {object} options Optional styling options
 * @returns {object} Platform-specific image style properties
 */
export const getPlatformImageStyle = (options = {}) => {
  const { width = 40, height = 40 } = options;
  
  return {
    width,
    height,
    resizeMode: 'contain',
    ...Platform.select({
      ios: {
        borderRadius: Math.min(width, height) / 2,
        overflow: 'hidden',
      },
      android: {
        borderRadius: Math.min(width, height) / 2,
      },
      default: {
        borderRadius: Math.min(width, height) / 2,
      },
    }),
  };
}; 