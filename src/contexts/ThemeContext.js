import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme, saveTheme, loadTheme } from '../store/appSlice';
import { lightTheme, darkTheme } from '../styles/theme';

// Create context
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  setDarkMode: () => {},
  theme: lightTheme,
});

// Provider component
export const ThemeProvider = ({ children, initialTheme = 'light' }) => {
  const dispatch = useDispatch();
  const { theme: themeMode = initialTheme } = useSelector(state => state?.app || { theme: initialTheme });
  const [isDarkMode, setIsDarkMode] = useState(themeMode === 'dark');
  
  // Effect to load theme on mount
  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);
  
  // Effect to update isDarkMode when Redux state changes
  useEffect(() => {
    setIsDarkMode(themeMode === 'dark');
  }, [themeMode]);
  
  // Toggle theme function
  const handleToggleTheme = () => {
    const newMode = !isDarkMode;
    
    // Direct set theme instead of toggle to avoid race conditions
    dispatch(setTheme(newMode ? 'dark' : 'light'));
    
    // Save after setting to ensure correct state is saved
    setTimeout(() => {
      dispatch(saveTheme());
    }, 100);
  };
  
  // Set dark mode function (for direct control)
  const handleSetDarkMode = (value) => {
    dispatch(setTheme(value ? 'dark' : 'light'));
    
    // Save after setting
    setTimeout(() => {
      dispatch(saveTheme());
    }, 100);
  };
  
  // Determine current theme object
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  // Return provider with context value
  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme: handleToggleTheme,
        setDarkMode: handleSetDarkMode,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 