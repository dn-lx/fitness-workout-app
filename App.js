import React, { useEffect } from 'react';
import { StatusBar, View, Text, LogBox, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

// Suppress specific warnings
if (Platform.OS === 'web') {
  // Suppress useNativeDriver warning on web
  LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  // Suppress shadow style warnings
  LogBox.ignoreLogs(['"shadow*" style props are deprecated']);
  // Suppress wheel event listener warning
  LogBox.ignoreLogs(['Added non-passive event listener to a scroll-blocking']);
  // Suppress props.pointerEvents warning
  LogBox.ignoreLogs(['props.pointerEvents is deprecated']);
}

// Import store
import { store } from './src/store';

// Import navigation
import AppNavigator from './src/navigation/AppNavigator';

// Import theme and context
import { lightTheme, darkTheme } from './src/styles/theme';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { loadTheme } from './src/store/appSlice';

// Import user context
import { UserProvider } from './src/contexts/UserContext';

// Import language context
import { LanguageProvider } from './src/contexts/LanguageContext';

// Main app content with theme and navigation setup
const AppContent = () => {
  const dispatch = useDispatch();
  const { theme: themeMode = 'light' } = useSelector(state => state?.app || { theme: 'light' });
  
  // Load theme from AsyncStorage on app start
  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);
  
  // Determine which theme to use
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  
  // Determine the status bar color with fallbacks
  const statusBarBackgroundColor = themeMode === 'dark' 
    ? (theme.colors.surface || '#000000') 
    : (theme.colors.surface || '#F5F5F5');
  
  return (
    <SafeAreaProvider>
      <ThemeProvider initialTheme={themeMode}>
        <LanguageProvider>
          <PaperProvider theme={theme}>
            <StatusBar 
              barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} 
              backgroundColor={statusBarBackgroundColor}
            />
            <NavigationContainer theme={theme}>
              <UserProvider>
                <AppNavigator />
              </UserProvider>
            </NavigationContainer>
          </PaperProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

// Main App component with Redux provider
export default function App() {
  return (
    <ReduxProvider store={store}>
      <AppContent />
    </ReduxProvider>
  );
}
