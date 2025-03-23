import React, { useState, useEffect } from 'react';
import { View, ScrollView, Linking, Platform, Image, TouchableOpacity } from 'react-native';
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
  ActivityIndicator,
  TouchableRipple,
  Snackbar,
  TextInput,
  Avatar,
  IconButton,
  Card,
  useTheme as usePaperTheme
} from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, t } from '../contexts/LanguageContext';
import CustomTimePicker from '../components/CustomTimePicker';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';

// Import styles
import { commonStyles, spacing, typography } from '../styles';
import createSettingsStyles from '../styles/settingsStyles';
import settingsScreenStyles from '../styles/settingsScreenStyles';
import { colors } from '../styles/common';

// Import Notification Service
import NotificationService from '../services/NotificationService';

// Get app version info with both version name and platform-specific build number
const appVersion = Constants.manifest?.version || '1.0.0';
const isIOS = Platform.OS === 'ios';
const appBuildNumber = isIOS 
  ? (Constants.manifest?.ios?.buildNumber || '1') 
  : (Constants.manifest?.android?.versionCode || 1);
const formattedAppVersion = `${appVersion} (${appBuildNumber})`;

// Update server configuration
const UPDATE_CHECK_URL = 'https://your-update-server.com/api/check-update';
const APK_DOWNLOAD_URL = 'https://your-update-server.com/downloads/latest.apk';

const SettingsScreen = ({ navigation }) => {
  // Theme context
  const { isDarkMode, toggleTheme } = useTheme();
  const paperTheme = usePaperTheme();
  // Language context
  const { currentLanguage, changeLanguage } = useLanguage();
  
  // Create styles with current theme
  const settingsStyles = createSettingsStyles(isDarkMode);
  
  // State for settings
  const [notifications, setNotifications] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [announcementsEnabled, setAnnouncementsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(isDarkMode);
  const [units, setUnits] = useState('metric');
  const [language, setLanguage] = useState(currentLanguage);
  const [reminderTime, setReminderTime] = useState('18:00');
  
  // Sync dark mode state with context
  useEffect(() => {
    setDarkMode(isDarkMode);
  }, [isDarkMode]);
  
  // Sync language state with context
  useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage]);
  
  // Dialog visibility states
  const [unitsDialogVisible, setUnitsDialogVisible] = useState(false);
  const [languageDialogVisible, setLanguageDialogVisible] = useState(false);
  const [aboutDialogVisible, setAboutDialogVisible] = useState(false);
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [notificationSettingsVisible, setNotificationSettingsVisible] = useState(false);
  const [privacyPolicyDialogVisible, setPrivacyPolicyDialogVisible] = useState(false);
  const [termsOfServiceDialogVisible, setTermsOfServiceDialogVisible] = useState(false);
  const [workoutHistoryDialogVisible, setWorkoutHistoryDialogVisible] = useState(false);
  const [editProfileDialogVisible, setEditProfileDialogVisible] = useState(false);
  const [photoDialogVisible, setPhotoDialogVisible] = useState(false);
  
  // Profile edit state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    age: "28",
    weight: "75",
    height: "180",
    fitnessLevel: "Intermediate",
    profileImage: null,
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  
  // Snackbar for feedback instead of console logs
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Update checking states
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingUpdate, setDownloadingUpdate] = useState(false);
  
  // Show snackbar message
  const showMessage = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };
  
  // Hide snackbar
  const hideSnackbar = () => setSnackbarVisible(false);
  
  // Load notification settings on component mount
  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const settings = await NotificationService.getNotificationSettings();
        if (settings) {
          setNotifications(settings.enabled);
          setWorkoutReminders(settings.workoutReminders);
          setReminderTime(settings.reminderTime);
          setAnnouncementsEnabled(settings.announcements);
        }
      } catch (error) {
        // Silent error handling or show a user-friendly message
        showMessage('Could not load notification settings');
      }
    };
    
    loadNotificationSettings();
    
    // Initialize the original profile for comparison
    setOriginalProfile({...profile});
  }, []);
  
  // Check for profile changes
  useEffect(() => {
    const hasChanges = JSON.stringify(profile) !== JSON.stringify(originalProfile);
    setHasProfileChanges(hasChanges);
  }, [profile, originalProfile]);
  
  // Handle toggling for switch components
  const toggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    
    try {
      // Save settings and handle notifications accordingly
      await NotificationService.saveNotificationSettings({
        enabled: newValue,
        workoutReminders,
        reminderTime,
        announcements: announcementsEnabled
      });
    } catch (error) {
      // Silent error handling
      showMessage('Could not save notification settings');
    }
  };
  
  const toggleWorkoutReminders = async () => {
    const newValue = !workoutReminders;
    setWorkoutReminders(newValue);
    
    // No need to save settings yet, will be saved when dialog is closed
  };
  
  const toggleAnnouncements = async () => {
    const newValue = !announcementsEnabled;
    setAnnouncementsEnabled(newValue);
    
    // No need to save settings yet, will be saved when dialog is closed
  };
  
  const saveReminderTime = async (time) => {
    try {
      setReminderTime(time);
      
      // Only schedule the reminder if notifications and workout reminders are enabled
      if (notifications && workoutReminders) {
        await NotificationService.saveNotificationSettings({
          enabled: notifications,
          workoutReminders,
          reminderTime: time,
          announcements: announcementsEnabled
        });
        
        // Schedule the workout reminder with the new time
        await NotificationService.scheduleWorkoutReminder(
          time,
          t('workoutReminderTitle', currentLanguage),
          t('workoutReminderBody', currentLanguage)
        );
        
        showMessage(t('reminderTime', currentLanguage) + ' ' + t('scheduledFor', currentLanguage) + ' ' + formatTime(time));
      }
      
      hideTimePicker();
    } catch (error) {
      showMessage('Failed to save reminder time: ' + error.message);
      hideTimePicker();
    }
  };
  
  const toggleDarkMode = () => {
    // Using toggleTheme from context which will update Redux and AsyncStorage
    toggleTheme();
    
    // Note: We don't need to update local state here as it will
    // be updated by the useEffect hook when isDarkMode changes in context
  };
  
  // Send a test notification
  const sendTestNotification = async () => {
    try {
      // Request notification permissions first
      const permissionResult = await NotificationService.checkNotificationPermissions();
      
      if (!permissionResult.granted) {
        showMessage(t('notificationPermissionDesc', currentLanguage));
        return;
      }
      
      // Schedule a test notification with localized strings
      await NotificationService.scheduleLocalNotification(
        t('testNotificationTitle', currentLanguage),
        t('testNotificationBody', currentLanguage),
        null, // Send immediately
        { type: 'test' }
      );
      
      showMessage(t('sendTestNotification', currentLanguage) + ' ✓');
    } catch (error) {
      showMessage('Failed to send test notification: ' + error.message);
    }
  };
  
  // Save all notification settings and close dialog
  const saveNotificationSettings = async () => {
    try {
      // Save all notification settings
      const result = await NotificationService.saveNotificationSettings({
        enabled: notifications,
        workoutReminders,
        reminderTime,
        announcements: announcementsEnabled
      });
      
      if (result.success) {
        // If workout reminders are enabled, also schedule them with localized content
        if (notifications && workoutReminders) {
          await NotificationService.scheduleWorkoutReminder(
            reminderTime,
            t('workoutReminderTitle', currentLanguage),
            t('workoutReminderBody', currentLanguage)
          );
        }
        
        showMessage(t('notificationSettings', currentLanguage) + ' ' + t('save', currentLanguage) + ' ✓');
      } else {
        showMessage('Failed to save notification settings: ' + result.error);
      }
      
      // Close the dialog
      hideNotificationSettings();
    } catch (error) {
      showMessage('Failed to save notification settings: ' + error.message);
    }
  };
  
  // Show/hide dialogs
  const showUnitsDialog = () => setUnitsDialogVisible(true);
  const hideUnitsDialog = () => setUnitsDialogVisible(false);
  const showLanguageDialog = () => setLanguageDialogVisible(true);
  const hideLanguageDialog = () => setLanguageDialogVisible(false);
  const showAboutDialog = () => setAboutDialogVisible(true);
  const hideAboutDialog = () => setAboutDialogVisible(false);
  const showUpdateDialog = () => setUpdateDialogVisible(true);
  const hideUpdateDialog = () => setUpdateDialogVisible(false);
  const showTimePicker = () => setTimePickerVisible(true);
  const hideTimePicker = () => setTimePickerVisible(false);
  const showNotificationSettings = () => {
    if (notifications) {
      setNotificationSettingsVisible(true);
    }
  };
  const hideNotificationSettings = () => setNotificationSettingsVisible(false);
  
  // New dialog functions
  const showPrivacyPolicyDialog = () => setPrivacyPolicyDialogVisible(true);
  const hidePrivacyPolicyDialog = () => setPrivacyPolicyDialogVisible(false);
  const showTermsOfServiceDialog = () => setTermsOfServiceDialogVisible(true);
  const hideTermsOfServiceDialog = () => setTermsOfServiceDialogVisible(false);
  const showWorkoutHistoryDialog = () => setWorkoutHistoryDialogVisible(true);
  const hideWorkoutHistoryDialog = () => setWorkoutHistoryDialogVisible(false);
  
  // Edit profile functions
  const showEditProfileDialog = () => {
    setOriginalProfile({...profile}); // Store the original state for comparison
    setEditProfileDialogVisible(true);
  };
  
  const hideEditProfileDialog = () => {
    setEditProfileDialogVisible(false);
  };
  
  const saveProfileChanges = () => {
    // In a real app, you would save to backend/storage here
    setOriginalProfile({...profile});
    showMessage('Profile updated successfully');
    hideEditProfileDialog();
  };
  
  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const cancelProfileChanges = () => {
    setProfile({...originalProfile}); // Revert to original state
    hideEditProfileDialog();
  };
  
  // Handle profile photo upload
  const uploadPhoto = async () => {
    try {
      // Show options dialog with Camera and Gallery options
      setPhotoDialogVisible(true);
    } catch (error) {
      showMessage(t('photoError', currentLanguage) || 'Failed to choose photo. Please try again.');
    }
  };
  
  // Hide photo dialog
  const hidePhotoDialog = () => {
    setPhotoDialogVisible(false);
  };
  
  // Open camera for photo
  const takePicture = async () => {
    try {
      hidePhotoDialog();
      
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        showMessage(t('cameraPermission', currentLanguage));
        return;
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleProfileChange('profileImage', result.assets[0].uri);
      }
    } catch (error) {
      showMessage(t('cameraError', currentLanguage) || 'Failed to take photo. Please try again.');
    }
  };
  
  // Choose from gallery
  const chooseFromGallery = async () => {
    try {
      hidePhotoDialog();
      
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showMessage(t('galleryPermission', currentLanguage));
        return;
      }
      
      // Launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleProfileChange('profileImage', result.assets[0].uri);
      }
    } catch (error) {
      showMessage(t('photoError', currentLanguage) || 'Failed to choose photo. Please try again.');
    }
  };
  
  // Remove profile photo
  const removePhoto = () => {
    hidePhotoDialog();
    handleProfileChange('profileImage', null);
  };
  
  // Navigation placeholders (now showing dialogs instead)
  const navigateToEditProfile = () => {
    showEditProfileDialog();
  };
  
  const navigateToWorkoutHistory = () => {
    showWorkoutHistoryDialog();
  };
  
  const navigateToPrivacyPolicy = () => {
    showPrivacyPolicyDialog();
  };
  
  const navigateToTermsOfService = () => {
    showTermsOfServiceDialog();
  };
  
  // Check for updates
  const checkForUpdates = async () => {
    try {
      setCheckingUpdate(true);
      
      // In a real app, you would fetch from your server:
      // const response = await fetch(UPDATE_CHECK_URL);
      // const data = await response.json();
      
      // For demo purposes, we'll simulate an available update
      const mockUpdateResponse = isIOS 
        ? {
            hasUpdate: true,
            latestVersion: '1.1.0',
            latestBuildNumber: String(parseInt(appBuildNumber) + 1),
            releaseNotes: 'Bug fixes and performance improvements for iOS',
            appStoreUrl: 'https://apps.apple.com/app/yourappid',
            forceUpdate: false
          }
        : {
            hasUpdate: true,
            latestVersion: '1.1.0',
            latestVersionCode: parseInt(appBuildNumber) + 1,
            releaseNotes: 'Bug fixes and performance improvements for Android',
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
        showMessage('You are using the latest version!');
      }
    } catch (error) {
      showMessage('Failed to check for updates. Please try again later.');
    } finally {
      setCheckingUpdate(false);
    }
  };
  
  // Download and install update
  const downloadAndInstallUpdate = async () => {
    if (isIOS) {
      // For iOS, just redirect to App Store
      Linking.openURL(updateInfo?.appStoreUrl || 'https://apps.apple.com/app/yourappid');
      hideUpdateDialog();
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
      showMessage('Failed to download update. Please try again later.');
    } finally {
      setDownloadingUpdate(false);
      setDownloadProgress(0);
      hideUpdateDialog();
    }
  };

  // Format time from HH:MM to a more user-friendly format
  const formatTime = (timeString) => {
    try {
      // Parse the time string (format: HH:MM)
      const [hours, minutes] = timeString.split(':').map(Number);
      
      // Create a Date object with the time
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      
      // Format as localized time string (e.g., "6:00 PM" or "18:00" depending on locale)
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: Platform.OS === 'ios' // Use 12-hour format on iOS, 24-hour on Android
      });
    } catch (error) {
      // Return the original string if parsing fails
      return timeString;
    }
  };

  // Save language and update context
  const saveLanguage = async (selectedLanguage) => {
    if (selectedLanguage !== currentLanguage) {
      await changeLanguage(selectedLanguage);
      showMessage(t('languageChanged', selectedLanguage));
    }
    hideLanguageDialog();
  };

  // Apply unit change and close the dialog
  const applyUnitChange = () => {
    // Here you would save the units preference to storage
    showMessage(t('unitsChanged', currentLanguage));
    hideUnitsDialog();
  };

  // For all dialogs
  const renderDialogContent = (content) => {
  return (
      <View style={settingsStyles.dialogContent}>
        {content}
      </View>
    );
  };

  const renderDialogActions = (onCancel, onConfirm, cancelText = t('close', currentLanguage), confirmText = t('apply', currentLanguage)) => {
    return (
      <Dialog.Actions>
        <Button 
          onPress={onCancel} 
          color={colors.accent}
          style={settingsStyles.dialogActionButton}
          labelStyle={settingsStyles.dialogActionButtonText}
          mode="contained"
        >
          {cancelText}
        </Button>
        <Button 
          onPress={onConfirm} 
          color={colors.accent}
          style={settingsStyles.dialogActionButton}
          labelStyle={settingsStyles.dialogActionButtonText}
          mode="contained"
        >
          {confirmText}
        </Button>
      </Dialog.Actions>
    );
  };

  // Units Dialog
  const renderUnitsDialog = () => {
    return (
      <Dialog visible={unitsDialogVisible} onDismiss={hideUnitsDialog} style={settingsStyles.dialog}>
        <Dialog.Title style={settingsStyles.dialogTitle}>{t('measurementUnits', currentLanguage)}</Dialog.Title>
        {renderDialogContent(
          <View>
            <Text style={settingsStyles.dialogText}>
              {t('chooseUnits', currentLanguage)}
              </Text>
              <RadioButton.Group onValueChange={value => setUnits(value)} value={units}>
                <RadioButton.Item 
                label={t('metricUnits', currentLanguage)}
                  value="metric" 
                color={colors.primary}
                />
                <RadioButton.Item 
                label={t('imperialUnits', currentLanguage)}
                  value="imperial" 
                color={colors.primary}
                />
              </RadioButton.Group>
          </View>
        )}
        {renderDialogActions(hideUnitsDialog, applyUnitChange)}
          </Dialog>
    );
  };

  // Notification Settings Dialog
  const renderNotificationDialog = () => {
    return (
      <Dialog visible={notificationSettingsVisible} onDismiss={hideNotificationSettings} style={settingsStyles.dialog}>
        <Dialog.Title style={settingsStyles.dialogTitle}>{t('notificationSettings', currentLanguage)}</Dialog.Title>
        {renderDialogContent(
          <View>
            <Text style={settingsStyles.dialogText}>
              {t('configureNotifications', currentLanguage)}
                </Text>
                <List.Item
              title={t('workoutReminders', currentLanguage)}
              description={t('workoutRemindersDesc', currentLanguage)}
              left={props => <List.Icon {...props} icon="calendar-clock" color={colors.primary} />}
              right={props => <Switch {...props} value={workoutReminders} onValueChange={toggleWorkoutReminders} color={colors.primary} />}
            />
                {workoutReminders && (
              <View style={settingsStyles.indentedSetting}>
                    <List.Item
                  title={t('reminderTime', currentLanguage)}
                  description={`${t('scheduledFor', currentLanguage)} ${formatTime(reminderTime)}`}
                  left={props => <List.Icon {...props} icon="clock-outline" color={colors.primary} />}
                  onPress={showTimePicker}
                />
              </View>
            )}
                <List.Item
              title={t('announcements', currentLanguage)}
              description={t('announcementsDesc', currentLanguage)}
              left={props => <List.Icon {...props} icon="bullhorn" color={colors.primary} />}
              right={props => <Switch {...props} value={announcementsEnabled} onValueChange={toggleAnnouncements} color={colors.primary} />}
            />
                <Button 
              mode="outlined" 
                  onPress={sendTestNotification}
              color={colors.primary}
              style={settingsStyles.dialogButton}
                >
              {t('sendTestNotification', currentLanguage)}
                </Button>
              </View>
        )}
        {renderDialogActions(hideNotificationSettings, saveNotificationSettings)}
          </Dialog>
    );
  };

  // Time Picker Dialog
  const renderTimePicker = () => {
    return (
      <Dialog visible={timePickerVisible} onDismiss={hideTimePicker} style={settingsStyles.dialog}>
        <Dialog.Title style={settingsStyles.dialogTitle}>{t('setReminderTime', currentLanguage)}</Dialog.Title>
        {renderDialogContent(
          <View style={settingsStyles.timePickerContainer}>
            <CustomTimePicker
              value={reminderTime}
              onChange={(time) => setReminderTime(time)}
            />
            <Text style={settingsStyles.dialogText}>
              {t('scheduledFor', currentLanguage)}: {formatTime(reminderTime)}
            </Text>
          </View>
        )}
        {renderDialogActions(
          hideTimePicker, 
          () => saveReminderTime(reminderTime),
          t('cancel', currentLanguage),
          t('save', currentLanguage)
        )}
      </Dialog>
    );
  };

  // About Dialog
  const renderAboutDialog = () => {
    return (
      <Dialog visible={aboutDialogVisible} onDismiss={hideAboutDialog} style={settingsStyles.dialog}>
        <Dialog.Title style={settingsStyles.dialogTitle}>{t('about', currentLanguage)}</Dialog.Title>
        {renderDialogContent(
          <View>
            <Text style={settingsStyles.dialogText}>
              {t('aboutDescription', currentLanguage)}
              </Text>
            <Text style={settingsStyles.versionText}>
              {t('version', currentLanguage)}: {formattedAppVersion}
              </Text>
            <Text style={settingsStyles.copyText}>
              {t('copyright', currentLanguage)}
            </Text>
          </View>
        )}
        {renderDialogActions(hideAboutDialog, hideAboutDialog)}
          </Dialog>
    );
  };

  // Update Dialog
  const renderUpdateDialog = () => {
    return (
      <Dialog visible={updateDialogVisible} onDismiss={hideUpdateDialog} style={settingsStyles.dialog}>
        <Dialog.Title style={settingsStyles.dialogTitle}>{t('updateAvailable', currentLanguage)}</Dialog.Title>
        {renderDialogContent(
          <View>
            <Text style={settingsStyles.dialogText}>
              {t('newVersion', currentLanguage)}: {updateInfo?.latestVersion} ({isIOS ? updateInfo?.latestBuildNumber : updateInfo?.latestVersionCode})
            </Text>
            <Text style={settingsStyles.dialogSubtitle}>
              {t('releaseNotes', currentLanguage)}:
            </Text>
            <Text style={settingsStyles.dialogText}>
              {updateInfo?.releaseNotes}
            </Text>
                  {isIOS ? (
              <Text style={settingsStyles.updateNote}>
                {t('updateAvailableOnAppStore', currentLanguage)}
                    </Text>
                  ) : downloadingUpdate && (
              <View style={settingsStyles.downloadProgress}>
                <Text>{t('downloading', currentLanguage)} {Math.round(downloadProgress * 100)}%</Text>
                <ActivityIndicator color={colors.primary} />
                    </View>
                  )}
          </View>
              )}
        {!downloadingUpdate ? (
          <Dialog.Actions>
            <Button 
              onPress={hideUpdateDialog} 
              color={colors.accent}
              style={settingsStyles.dialogActionButton}
              labelStyle={settingsStyles.dialogActionButtonText}
              mode="contained"
            >
              {t('later', currentLanguage)}
            </Button>
            <Button 
              onPress={downloadAndInstallUpdate} 
              color={colors.accent}
              style={settingsStyles.dialogActionButton}
              labelStyle={settingsStyles.dialogActionButtonText}
              mode="contained"
            >
              {isIOS ? t('goToAppStore', currentLanguage) : t('updateNow', currentLanguage)}
            </Button>
          </Dialog.Actions>
        ) : (
          <Dialog.Actions>
            <Button 
              onPress={hideUpdateDialog} 
              color={colors.accent}
              style={settingsStyles.dialogActionButton}
              labelStyle={settingsStyles.dialogActionButtonText}
              mode="contained"
            >
              {t('cancel', currentLanguage)}
            </Button>
          </Dialog.Actions>
        )}
          </Dialog>
    );
  };

  // Privacy Policy Dialog
  const renderPrivacyDialog = () => {
    return (
      <Dialog visible={privacyPolicyDialogVisible} onDismiss={hidePrivacyPolicyDialog} style={settingsStyles.dialog}>
        <Dialog.Title style={settingsStyles.dialogTitle}>{t('privacyPolicy', currentLanguage)}</Dialog.Title>
        {renderDialogContent(
          <ScrollView style={settingsStyles.scrollableDialogContent}>
            <Text style={settingsStyles.dialogText}>
              {t('privacyPolicyDescription', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogText}>
              {t('privacyPolicyApplies', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogSubtitle}>
              {t('informationWeCollect', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogText}>
              {t('informationCollected', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogList}>
              • {t('personalData', currentLanguage)}{'\n'}
              • {t('healthAndFitnessData', currentLanguage)}{'\n'}
              • {t('usageData', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogSubtitle}>
              {t('howWeUseYourInformation', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogText}>
              {t('howWeUseInformation', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogList}>
              • {t('personalizeWorkoutExperience', currentLanguage)}{'\n'}
              • {t('processAndCompleteTransactions', currentLanguage)}{'\n'}
              • {t('sendAdministrativeInformation', currentLanguage)}{'\n'}
              • {t('respondToInquiriesAndOfferSupport', currentLanguage)}{'\n'}
              • {t('monitorAndAnalyzeUsageTrends', currentLanguage)}
                </Text>
            <Text style={settingsStyles.lastUpdatedText}>
              {t('lastUpdated', currentLanguage)}: {t('januaryDate', currentLanguage)}
                </Text>
              </ScrollView>
        )}
        {renderDialogActions(hidePrivacyPolicyDialog, hidePrivacyPolicyDialog)}
          </Dialog>
    );
  };

  // Terms of Service Dialog
  const renderTermsDialog = () => {
    return (
      <Dialog visible={termsOfServiceDialogVisible} onDismiss={hideTermsOfServiceDialog} style={settingsStyles.dialog}>
        <Dialog.Title style={settingsStyles.dialogTitle}>{t('termsOfService', currentLanguage)}</Dialog.Title>
        {renderDialogContent(
          <ScrollView style={settingsStyles.scrollableDialogContent}>
            <Text style={settingsStyles.dialogText}>
              {t('termsOfServiceDescription', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogSubtitle}>
              {t('useOfService', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogText}>
              {t('useOfServiceDescription', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogSubtitle}>
              {t('content', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogText}>
              {t('contentDescription', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogSubtitle}>
              {t('limitations', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogText}>
              {t('limitationsDescription', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogSubtitle}>
              {t('changes', currentLanguage)}
                </Text>
            <Text style={settingsStyles.dialogText}>
              {t('changesDescription', currentLanguage)}
                </Text>
            <Text style={settingsStyles.lastUpdatedText}>
              {t('lastUpdated', currentLanguage)}: {t('januaryDate', currentLanguage)}
                </Text>
              </ScrollView>
        )}
        {renderDialogActions(hideTermsOfServiceDialog, hideTermsOfServiceDialog)}
          </Dialog>
    );
  };

  // Workout History Dialog
  const renderWorkoutHistoryDialog = () => {
    return (
      <Dialog visible={workoutHistoryDialogVisible} onDismiss={hideWorkoutHistoryDialog} style={settingsStyles.dialog}>
        <Dialog.Title style={settingsStyles.dialogTitle}>{t('workoutHistory', currentLanguage)}</Dialog.Title>
        {renderDialogContent(
          <ScrollView style={settingsStyles.scrollableDialogContent}>
            <Text style={settingsStyles.dialogText}>
              {t('viewPastWorkoutSessions', currentLanguage)}
                </Text>
            <Card style={settingsStyles.workoutCard}>
              <Card.Title
                title={t('upperBodyStrength', currentLanguage)}
                subtitle={`${t('june15', currentLanguage)}`}
                left={(props) => <Avatar.Icon {...props} icon="arm-flex" color="#fff" style={{ backgroundColor: colors.primary }} />}
              />
              <Card.Content>
                <View style={settingsStyles.workoutStats}>
                  <Text style={settingsStyles.statLabel}>{t('duration', currentLanguage)}: 45 {t('minutes', currentLanguage)}</Text>
                  <Text style={settingsStyles.statLabel}>{t('calories', currentLanguage)}: 320</Text>
                </View>
              </Card.Content>
            </Card>
            <Card style={settingsStyles.workoutCard}>
              <Card.Title
                title={t('hiitCardio', currentLanguage)}
                subtitle={`${t('june13', currentLanguage)}`}
                left={(props) => <Avatar.Icon {...props} icon="run-fast" color="#fff" style={{ backgroundColor: colors.primary }} />}
              />
              <Card.Content>
                <View style={settingsStyles.workoutStats}>
                  <Text style={settingsStyles.statLabel}>{t('duration', currentLanguage)}: 30 {t('minutes', currentLanguage)}</Text>
                  <Text style={settingsStyles.statLabel}>{t('calories', currentLanguage)}: 420</Text>
                </View>
              </Card.Content>
            </Card>
            <Card style={settingsStyles.workoutCard}>
              <Card.Title
                title={t('lowerBodyFocus', currentLanguage)}
                subtitle={`${t('june10', currentLanguage)}`}
                left={(props) => <Avatar.Icon {...props} icon="human-handsdown" color="#fff" style={{ backgroundColor: colors.primary }} />}
              />
              <Card.Content>
                <View style={settingsStyles.workoutStats}>
                  <Text style={settingsStyles.statLabel}>{t('duration', currentLanguage)}: 50 {t('minutes', currentLanguage)}</Text>
                  <Text style={settingsStyles.statLabel}>{t('calories', currentLanguage)}: 380</Text>
                </View>
              </Card.Content>
            </Card>
            <Card style={settingsStyles.workoutCard}>
              <Card.Title
                title={t('fullBodyWorkout', currentLanguage)}
                subtitle={`${t('june8', currentLanguage)}`}
                left={(props) => <Avatar.Icon {...props} icon="human" color="#fff" style={{ backgroundColor: colors.primary }} />}
              />
              <Card.Content>
                <View style={settingsStyles.workoutStats}>
                  <Text style={settingsStyles.statLabel}>{t('duration', currentLanguage)}: 60 {t('minutes', currentLanguage)}</Text>
                  <Text style={settingsStyles.statLabel}>{t('calories', currentLanguage)}: 450</Text>
                </View>
              </Card.Content>
            </Card>
              </ScrollView>
        )}
        {renderDialogActions(hideWorkoutHistoryDialog, hideWorkoutHistoryDialog)}
          </Dialog>
    );
  };

  // Edit Profile Dialog
  const renderEditProfileDialog = () => {
    return (
      <Dialog visible={editProfileDialogVisible} onDismiss={hideEditProfileDialog} style={settingsStyles.dialog}>
        <Dialog.Title style={[settingsStyles.dialogTitle, { textAlign: 'center' }]}>{t('editProfile', currentLanguage)}</Dialog.Title>
        {renderDialogContent(
          <ScrollView style={settingsStyles.scrollableDialogContent}>
            <TouchableOpacity style={settingsStyles.photoContainer} onPress={uploadPhoto}>
              {profile.profileImage ? (
                <Avatar.Image 
                  size={100} 
                  source={{ uri: profile.profileImage }} 
                  style={{ backgroundColor: colors.primary }}
                />
              ) : (
                <Avatar.Icon 
                  size={100} 
                  icon="account" 
                  color="#fff" 
                  style={{ backgroundColor: colors.primary }} 
                />
              )}
              <Text style={settingsStyles.changePhotoText}>{t('changePhoto', currentLanguage)}</Text>
            </TouchableOpacity>
            <TextInput
              label={t('name', currentLanguage)}
              value={profile.name}
              onChangeText={(text) => handleProfileChange('name', text)}
              style={settingsStyles.input}
            />
            <TextInput
              label={t('email', currentLanguage)}
              value={profile.email}
              onChangeText={(text) => handleProfileChange('email', text)}
              keyboardType="email-address"
              style={settingsStyles.input}
            />
            <TextInput
              label={t('phone', currentLanguage)}
              value={profile.phone}
              onChangeText={(text) => handleProfileChange('phone', text)}
              keyboardType="phone-pad"
              style={settingsStyles.input}
            />
            <View style={settingsStyles.rowInput}>
              <TextInput
                label={t('age', currentLanguage)}
                value={profile.age}
                onChangeText={(text) => handleProfileChange('age', text)}
                keyboardType="number-pad"
                style={[settingsStyles.input, settingsStyles.halfInput]}
              />
              <TextInput
                label={t('weight', currentLanguage)}
                value={profile.weight}
                onChangeText={(text) => handleProfileChange('weight', text)}
                keyboardType="decimal-pad"
                style={[settingsStyles.input, settingsStyles.halfInput]}
              />
            </View>
            <TextInput
              label={t('height', currentLanguage)}
              value={profile.height}
              onChangeText={(text) => handleProfileChange('height', text)}
              keyboardType="decimal-pad"
              style={settingsStyles.input}
            />
          </ScrollView>
        )}
        {renderDialogActions(hideEditProfileDialog, saveProfileChanges)}
      </Dialog>
    );
  };

  // Language Dialog
  const languages = [
    { label: t('english', currentLanguage), value: 'english' },
    { label: t('spanish', currentLanguage), value: 'spanish' },
    { label: t('french', currentLanguage), value: 'french' },
    { label: t('german', currentLanguage), value: 'german' },
    { label: t('italian', currentLanguage), value: 'italian' },
    { label: t('russian', currentLanguage), value: 'russian' },
    { label: t('hindi', currentLanguage), value: 'hindi' },
    { label: t('sinhalese', currentLanguage), value: 'sinhalese' },
    { label: t('korean', currentLanguage), value: 'korean' },
    { label: t('japanese', currentLanguage), value: 'japanese' },
    { label: t('norwegian', currentLanguage), value: 'norwegian' },
    { label: t('bulgarian', currentLanguage), value: 'bulgarian' },
    { label: t('romanian', currentLanguage), value: 'romanian' },
    { label: t('finnish', currentLanguage), value: 'finnish' },
  ];

  const renderLanguageDialog = () => {
    return (
      <Portal>
        <Dialog
          visible={languageDialogVisible}
          onDismiss={hideLanguageDialog}
          style={settingsStyles.dialog}
        >
          <Dialog.Title style={settingsStyles.dialogTitle}>{t('selectLanguage', currentLanguage)}</Dialog.Title>
          <Dialog.Content>
            <Text style={settingsStyles.dialogDescription}>
              {t('chooseLanguage', currentLanguage)}
            </Text>
            <ScrollView style={settingsStyles.radioGroup}>
              {languages.map((lang) => (
                <RadioButton.Item
                  key={lang.value}
                  label={lang.label}
                  value={lang.value}
                  status={language === lang.value ? 'checked' : 'unchecked'}
                  onPress={() => setLanguage(lang.value)}
                  color={colors.primary}
                />
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => saveLanguage(language)} 
              style={settingsStyles.dialogActionButton}
              color={colors.accent}
              labelStyle={settingsStyles.dialogActionButtonText}
              mode="contained"
            >
              {t('apply', currentLanguage)}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  // Add Photo Dialog
  const renderPhotoDialog = () => {
    return (
      <Portal>
        <Dialog
          visible={photoDialogVisible}
          onDismiss={hidePhotoDialog}
          style={settingsStyles.dialog}
        >
          <Dialog.Title style={settingsStyles.dialogTitle}>{t('profilePicture', currentLanguage)}</Dialog.Title>
          <Dialog.Content>
            <Text style={settingsStyles.dialogDescription}>
              {t('choosePhoto', currentLanguage)}
            </Text>
            <List.Item
              title={t('takePhoto', currentLanguage)}
              left={props => <List.Icon {...props} icon="camera" color={colors.primary} />}
              onPress={takePicture}
              style={settingsStyles.photoOption}
            />
            <List.Item
              title={t('chooseFromGallery', currentLanguage)}
              left={props => <List.Icon {...props} icon="image" color={colors.primary} />}
              onPress={chooseFromGallery}
              style={settingsStyles.photoOption}
            />
            {profile.profileImage && (
              <List.Item
                title={t('removePhoto', currentLanguage)}
                left={props => <List.Icon {...props} icon="delete" color={colors.error || '#F44336'} />}
                onPress={removePhoto}
                style={settingsStyles.photoOption}
              />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={hidePhotoDialog}
              style={settingsStyles.dialogActionButton}
              color={colors.accent}
              labelStyle={settingsStyles.dialogActionButtonText}
              mode="contained"
            >
              {t('cancel', currentLanguage)}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  return (
    <SafeAreaView style={[settingsStyles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={[settingsScreenStyles.headerContainer, { elevation: 0 }]}>
        <Appbar.Content 
          title={t('settings', currentLanguage)} 
          titleStyle={settingsScreenStyles.headerTitle}
          style={settingsScreenStyles.headerContent} 
        />
      </Appbar.Header>
      <ScrollView style={settingsStyles.scrollContent}>
        <View style={settingsStyles.section}>
          <Text style={[settingsStyles.sectionHeader, { color: colors.accent }]}>{t('appPreferences', currentLanguage)}</Text>
          <List.Item
            title={t('notifications', currentLanguage)}
            description={t('notificationsDesc', currentLanguage)}
            left={props => <List.Icon {...props} icon="bell" color={colors.primary} />}
            onPress={showNotificationSettings}
            style={settingsStyles.listItem}
          />
          <List.Item
            title={t('darkMode', currentLanguage)}
            description={t('darkModeDesc', currentLanguage)}
            left={props => <List.Icon {...props} icon="brightness-4" color={colors.primary} />}
            right={props => <Switch value={isDarkMode} onValueChange={toggleDarkMode} color={colors.primary} />}
            style={settingsStyles.listItem}
          />
          <List.Item
            title={t('measurementUnits', currentLanguage)}
            description={units === 'metric' ? t('metricUnits', currentLanguage) : t('imperialUnits', currentLanguage)}
            left={props => <List.Icon {...props} icon="scale" color={colors.primary} />}
            onPress={showUnitsDialog}
            style={settingsStyles.listItem}
          />
          <List.Item
            title={t('language', currentLanguage)}
            description={language.charAt(0).toUpperCase() + language.slice(1)}
            left={props => <List.Icon {...props} icon="translate" color={colors.primary} />}
            onPress={showLanguageDialog}
            style={settingsStyles.listItem}
          />
        </View>

        <View style={settingsStyles.section}>
          <Text style={[settingsStyles.sectionHeader, { color: colors.accent }]}>{t('account', currentLanguage)}</Text>
          <List.Item
            title={t('editProfile', currentLanguage)}
            description={t('editProfileDesc', currentLanguage)}
            left={props => <List.Icon {...props} icon="account-edit" color={colors.primary} />}
            onPress={showEditProfileDialog}
            style={settingsStyles.listItem}
          />
          <List.Item
            title={t('workoutHistory', currentLanguage)}
            description={t('workoutHistoryDesc', currentLanguage)}
            left={props => <List.Icon {...props} icon="history" color={colors.primary} />}
            onPress={showWorkoutHistoryDialog}
            style={settingsStyles.listItem}
          />
        </View>

        <View style={settingsStyles.section}>
          <Text style={[settingsStyles.sectionHeader, { color: colors.accent }]}>{t('app', currentLanguage)}</Text>
          <List.Item
            title={t('checkForUpdates', currentLanguage)}
            description={`${t('currentVersion', currentLanguage)}: ${formattedAppVersion}`}
            left={props => <List.Icon {...props} icon="update" color={colors.primary} />}
            onPress={showUpdateDialog}
            style={settingsStyles.listItem}
          />
          <List.Item
            title={t('appInformation', currentLanguage)}
            description={`${t('version', currentLanguage)}: ${formattedAppVersion}`}
            left={props => <List.Icon {...props} icon="information" color={colors.primary} />}
            onPress={showAboutDialog}
            style={settingsStyles.listItem}
          />
          <List.Item
            title={t('privacyPolicy', currentLanguage)}
            left={props => <List.Icon {...props} icon="shield-account" color={colors.primary} />}
            onPress={showPrivacyPolicyDialog}
            style={settingsStyles.listItem}
          />
          <List.Item
            title={t('termsOfService', currentLanguage)}
            left={props => <List.Icon {...props} icon="file-document" color={colors.primary} />}
            onPress={showTermsOfServiceDialog}
            style={settingsStyles.listItem}
          />
        </View>
      </ScrollView>

      {renderUnitsDialog()}
      {renderNotificationDialog()}
      {renderTimePicker()}
      {renderAboutDialog()}
      {renderUpdateDialog()}
      {renderPrivacyDialog()}
      {renderTermsDialog()}
      {renderWorkoutHistoryDialog()}
      {renderEditProfileDialog()}
      {renderPhotoDialog()}
      {renderLanguageDialog()}

        <Snackbar
          visible={snackbarVisible}
          onDismiss={hideSnackbar}
          duration={3000}
          style={settingsStyles.snackbar}
          theme={paperTheme}
        >
          {snackbarMessage}
        </Snackbar>
    </SafeAreaView>
  );
};

export default SettingsScreen; 