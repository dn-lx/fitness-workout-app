import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import 'react-native-gesture-handler';

// Import UserProvider
import { UserProvider } from './src/contexts/UserContext';

// Import AppNavigator
import AppNavigator from './src/navigation/AppNavigator';

// Define custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32',
    accent: '#00BFA5',
    background: '#F5F9F6',
  },
};

// Define navigation theme to match app theme
const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
  },
};

// Ignore specific warnings to clean up the console
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested',
  'Sending `onAnimatedValueUpdate` with no listeners registered'
]);

export default function App() {
  // Log navigation state for debugging
  const onNavigationStateChange = (state) => {
    if (__DEV__) {
      console.log('Navigation State:', JSON.stringify(state, null, 2));
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <UserProvider>
          <NavigationContainer
            theme={navigationTheme}
            onStateChange={onNavigationStateChange}
            onReady={() => {
              console.log('Navigation Container Ready');
            }}
          >
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </UserProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
