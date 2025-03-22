import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  List, 
  Switch, 
  Divider, 
  Text, 
  Button, 
  Dialog, 
  Portal, 
  RadioButton,
  Appbar
} from 'react-native-paper';

// Import styles
import { settingsStyles as styles } from '../styles';

const SettingsScreen = () => {
  // State for settings
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [units, setUnits] = useState('metric');
  const [reminderTime, setReminderTime] = useState('18:00');
  
  // Dialog visibility states
  const [unitsDialogVisible, setUnitsDialogVisible] = useState(false);
  const [aboutDialogVisible, setAboutDialogVisible] = useState(false);
  
  // Handle toggling for switch components
  const toggleNotifications = () => setNotifications(!notifications);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  // Show/hide dialogs
  const showUnitsDialog = () => setUnitsDialogVisible(true);
  const hideUnitsDialog = () => setUnitsDialogVisible(false);
  const showAboutDialog = () => setAboutDialogVisible(true);
  const hideAboutDialog = () => setAboutDialogVisible(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      
      <ScrollView 
        showsVerticalScrollIndicator={true}
        bounces={true}
        contentContainerStyle={styles.scrollContent}
      >
        <List.Section>
          <List.Subheader>App Preferences</List.Subheader>
          
          <List.Item
            title="Notifications"
            description="Receive workout reminders and updates"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => <Switch value={notifications} onValueChange={toggleNotifications} />}
          />
          
          <Divider />
          
          <List.Item
            title="Dark Mode"
            description="Enable dark theme throughout the app"
            left={props => <List.Icon {...props} icon="brightness-4" />}
            right={props => <Switch value={darkMode} onValueChange={toggleDarkMode} />}
          />
          
          <Divider />
          
          <List.Item
            title="Measurement Units"
            description={units === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lb, ft)'}
            left={props => <List.Icon {...props} icon="scale" />}
            onPress={showUnitsDialog}
          />
        </List.Section>
        
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          
          <List.Item
            title="Edit Profile"
            description="Change your personal information"
            left={props => <List.Icon {...props} icon="account-edit" />}
            onPress={() => console.log('Navigate to edit profile')}
          />
          
          <Divider />
          
          <List.Item
            title="Workout History"
            description="View your past workout sessions"
            left={props => <List.Icon {...props} icon="history" />}
            onPress={() => console.log('Navigate to workout history')}
          />
        </List.Section>
        
        <List.Section>
          <List.Subheader>About</List.Subheader>
          
          <List.Item
            title="App Information"
            description="Version 1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
            onPress={showAboutDialog}
          />
          
          <Divider />
          
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            onPress={() => console.log('Navigate to privacy policy')}
          />
          
          <Divider />
          
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => console.log('Navigate to terms of service')}
          />
        </List.Section>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            style={styles.button}
            onPress={() => console.log('Reset settings')}
          >
            Reset Settings
          </Button>
          
          <Button 
            mode="contained" 
            style={[styles.button, styles.logoutButton]}
            onPress={() => console.log('Logout')}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
      
      {/* Units Selection Dialog */}
      <Portal>
        <Dialog visible={unitsDialogVisible} onDismiss={hideUnitsDialog}>
          <Dialog.Title>Measurement Units</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => setUnits(value)} value={units}>
              <RadioButton.Item label="Metric (kg, cm)" value="metric" />
              <RadioButton.Item label="Imperial (lb, ft)" value="imperial" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideUnitsDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* About Dialog */}
      <Portal>
        <Dialog visible={aboutDialogVisible} onDismiss={hideAboutDialog}>
          <Dialog.Title>About Fitness App</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.aboutText}>
              Version: 1.0.0{'\n'}
              Developed by: Your Company{'\n'}
              © 2023 All Rights Reserved{'\n\n'}
              This fitness app helps you track your workouts and achieve your fitness goals.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideAboutDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default SettingsScreen; 