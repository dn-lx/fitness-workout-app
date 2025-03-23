# UserCreationScreen Firebase Integration Guide

This file contains instructions for integrating the UserCreationScreen with the Firebase database system. Follow these steps to update your UserCreationScreen.js file.

## Step 1: Import the necessary modules

Add these imports to the top of UserCreationScreen.js:

```javascript
import { saveUserToDatabase } from '../utils/userCreationHelper';
import { useUser } from '../contexts/UserContext';
```

## Step 2: Use the UserContext in your component

Inside the UserCreationScreen component, add this line:

```javascript
const { saveUser, loading } = useUser();
```

## Step 3: Update the handleCreateUser function

Replace the existing handleCreateUser function with this one:

```javascript
const handleCreateUser = async () => {
  if (validateForm()) {
    // Show loading state
    setIsLoading(true);
    
    // Calculate age from date of birth
    const today = new Date();
    const birthDate = new Date(userData.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Include photo and age in user data
    const completeUserData = {
      ...userData,
      age,
      photoUri: photo
    };
    
    // Save to database using the context
    const result = await saveUser(completeUserData);
    
    // Hide loading state
    setIsLoading(false);
    
    if (result.success) {
      console.log('User created and saved:', result.user);
      // Navigate to main app
      navigation.replace('MainTabs');
    } else {
      // Handle error - show an alert or error message
      Alert.alert(
        t.errorTitle || 'Error',
        t.userSaveError || 'Failed to save user data. Please try again.',
        [{ text: t.ok || 'OK' }]
      );
      console.error('Failed to save user:', result.error);
    }
  }
};
```

## Alternative Implementation

If you prefer not to use the context directly, you can use the helper function:

```javascript
const handleCreateUserAlternative = async () => {
  if (validateForm()) {
    // Show loading state
    setIsLoading(true);
    
    // Calculate age from date of birth
    const today = new Date();
    const birthDate = new Date(userData.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Include photo and age in user data
    const completeUserData = {
      ...userData,
      age,
      photoUri: photo
    };
    
    // Use the helper function to save the user
    const result = await saveUserToDatabase(completeUserData);
    
    // Hide loading state
    setIsLoading(false);
    
    if (result.success) {
      console.log('User created and saved:', result.user);
      // Navigate to main app
      navigation.replace('MainTabs');
    } else {
      // Handle error - show an alert or error message
      Alert.alert(
        t.errorTitle || 'Error',
        t.userSaveError || 'Failed to save user data. Please try again.',
        [{ text: t.ok || 'OK' }]
      );
      console.error('Failed to save user:', result.error);
    }
  }
};
```

## Step 4: Add loading indicator (optional)

Add this state:

```javascript
const [isLoading, setIsLoading] = useState(false);
```

Then add this loading overlay just before the closing `</View>` tag of the component:

```javascript
{isLoading && (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color={colors.accent} />
    <Text style={styles.loadingText}>{t.saving || 'Saving...'}</Text>
  </View>
)}
```

## Step 5: Add these styles to your StyleSheet

```javascript
// Add to your styles object:
loadingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
},
loadingText: {
  color: colors.surface,
  marginTop: spacing.medium,
  fontSize: typography.fontSize.medium,
  fontFamily: typography.fontFamily.medium,
}
```

## Step 6: Firebase Configuration

Make sure to replace the placeholder values in src/config/firebase.js with your actual Firebase project configuration. You can find this information in your Firebase console under Project Settings > General > Your apps > Firebase SDK snippet > Config.

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
``` 