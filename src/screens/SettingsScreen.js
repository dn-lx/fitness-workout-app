import React, { useState } from 'react';
import { View, ScrollView, Linking, Platform } from 'react-native';
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
  Appbar,
  ActivityIndicator
} from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';

// Import styles
import { settingsStyles as styles } from '../styles';

// Current app version - usually from app.json or Constants
const currentAppVersion = Constants.manifest?.version || '1.0.0';

// Update server configuration
const UPDATE_CHECK_URL = 'https://your-update-server.com/api/check-update';
const APK_DOWNLOAD_URL = 'https://your-update-server.com/downloads/latest.apk';

const SettingsScreen = () => {
  // State for settings
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [units, setUnits] = useState('metric');
  const [reminderTime, setReminderTime] = useState('18:00');
  
  // Dialog visibility states
  const [unitsDialogVisible, setUnitsDialogVisible] = useState(false);
  const [aboutDialogVisible, setAboutDialogVisible] = useState(false);
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
  
  // Update checking states
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingUpdate, setDownloadingUpdate] = useState(false);
  
  // Handle toggling for switch components
  const toggleNotifications = () => setNotifications(!notifications);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  // Show/hide dialogs
  const showUnitsDialog = () => setUnitsDialogVisible(true);
  const hideUnitsDialog = () => setUnitsDialogVisible(false);
  const showAboutDialog = () => setAboutDialogVisible(true);
  const hideAboutDialog = () => setAboutDialogVisible(false);
  const showUpdateDialog = () => setUpdateDialogVisible(true);
  const hideUpdateDialog = () => setUpdateDialogVisible(false);

  // Check for updates
  const checkForUpdates = async () => {
    try {
      setCheckingUpdate(true);
      
      // In a real app, you would fetch from your server:
      // const response = await fetch(UPDATE_CHECK_URL);
      // const data = await response.json();
      
      // For demo purposes, we'll simulate an available update
      const mockUpdateResponse = {
        hasUpdate: true,
        latestVersion: '1.1.0',
        releaseNotes: 'Bug fixes and performance improvements',
        downloadUrl: APK_DOWNLOAD_URL,
        forceUpdate: false
      };
      
      // Wait a bit to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Compare versions (in a real app, use proper version comparison)
      if (mockUpdateResponse.hasUpdate) {
        setUpdateAvailable(true);
        setUpdateInfo(mockUpdateResponse);
        showUpdateDialog();
      } else {
        // No update available
        alert('You are using the latest version!');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      alert('Failed to check for updates. Please try again later.');
    } finally {
      setCheckingUpdate(false);
    }
  };
  
  // Download and install update
  const downloadAndInstallUpdate = async () => {
    if (Platform.OS !== 'android') {
      // For iOS, just redirect to App Store
      Linking.openURL('https://apps.apple.com/app/yourappid');
      return;
    }
    
    try {
      setDownloadingUpdate(true);
      
      // Create a directory for the download if it doesn't exist
      const downloadDir = `${FileSystem.documentDirectory}updates/`;
      const dirInfo = await FileSystem.getInfoAsync(downloadDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
      }
      
      // Download the APK
      const downloadResumable = FileSystem.createDownloadResumable(
        APK_DOWNLOAD_URL,
        `${downloadDir}update.apk`,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );
      
      const { uri } = await downloadResumable.downloadAsync();
      
      // Once download is complete, prompt to install
      if (uri) {
        // On Android, attempt to open the APK installer
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: uri,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
          type: 'application/vnd.android.package-archive',
        });
      }
    } catch (error) {
      console.error('Error downloading update:', error);
      alert('Failed to download update. Please try again later.');
    } finally {
      setDownloadingUpdate(false);
      setDownloadProgress(0);
      hideUpdateDialog();
    }
  };

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
          <List.Subheader>App</List.Subheader>
          
          <List.Item
            title="Check for Updates"
            description={`Current version: ${currentAppVersion}`}
            left={props => <List.Icon {...props} icon="update" />}
            onPress={checkingUpdate ? null : checkForUpdates}
            right={props => 
              checkingUpdate ? (
                <ActivityIndicator size={24} animating={true} {...props} />
              ) : null
            }
          />
          
          <Divider />
          
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
              Version: {currentAppVersion}{'\n'}
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
      
      {/* Update Dialog */}
      <Portal>
        <Dialog visible={updateDialogVisible} onDismiss={hideUpdateDialog}>
          <Dialog.Title>Update Available</Dialog.Title>
          <Dialog.Content>
            {updateInfo && (
              <>
                <Text style={styles.updateTitle}>
                  Version {updateInfo.latestVersion}
                </Text>
                <Text style={styles.updateNotes}>
                  {updateInfo.releaseNotes}
                </Text>
                
                {downloadingUpdate && (
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                      Downloading: {Math.round(downloadProgress * 100)}%
                    </Text>
                    <ActivityIndicator 
                      animating={true} 
                      size="large" 
                      style={styles.progressIndicator} 
                    />
                  </View>
                )}
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideUpdateDialog} disabled={downloadingUpdate}>Later</Button>
            <Button 
              onPress={downloadAndInstallUpdate} 
              mode="contained" 
              disabled={downloadingUpdate}
              loading={downloadingUpdate}
            >
              {downloadingUpdate ? 'Downloading...' : 'Update Now'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default SettingsScreen; 