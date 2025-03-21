import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { DataProvider } from './src/context/DataContext';

// Import the AppNavigator that contains all our navigation structure
import AppNavigator from './src/navigation/AppNavigator';

// Main app component
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <DataProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </DataProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
