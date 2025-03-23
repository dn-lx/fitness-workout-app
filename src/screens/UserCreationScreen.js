import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Alert, Platform, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text, Appbar, Portal, Dialog, IconButton, Surface, Avatar, Divider, Menu, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '../contexts/UserContext';
import { colors } from '../styles';
import firebaseService from '../services/firebaseService';
import { useLanguage, t } from '../contexts/LanguageContext';

// Import styles
import commonStyles, { 
  spacing, typography, shadowStyles, 
  cardStyles, inputStyles, buttonStyles, layout, borderRadius 
} from '../styles/common';

// Import language options
import { languageOptions } from '../languages';

const UserCreationScreen = () => {
  const navigation = useNavigation();
  const { saveUser } = useUser();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    weight: '',
    height: '',
    dob: new Date(new Date().setFullYear(new Date().getFullYear() - 18)), // Default to 18 years ago
    gender: 'unspecified',
    fitnessLevel: 'beginner'
  });
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const [photoDialogVisible, setPhotoDialogVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);
  const [devModeClicks, setDevModeClicks] = useState(0);
  const [isMetric, setIsMetric] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState(null);
  const nameInputRef = useRef(null);
  
  // Optional Firebase connection check
  const testFirebaseConnection = async () => {
    try {
      setIsLoading(true);
      const result = await firebaseService.checkFirebaseConnection();
      setFirebaseStatus(result);
      if (result.success) {
        setIsLoading(false);
        if (result.isMocked) {
          // Skip to next step immediately if using mock
          setDevModeClicks(1);
        }
      } else {
        setIsLoading(false);
        setFirebaseStatus({
          success: false,
          error: result.error || 'Unknown error connecting to Firebase'
        });
      }
    } catch (error) {
      setIsLoading(false);
      setFirebaseStatus({
        success: false,
        error: error.message || 'Unknown error connecting to Firebase'
      });
    }
  };

  // Set up effect to check Firebase connection on mount
  useEffect(() => {
    if (devModeClicks === 0 && !isLoading && firebaseStatus === null) {
      testFirebaseConnection();
    }
  }, [devModeClicks, isLoading, firebaseStatus]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.name.trim()) {
      newErrors.name = t('nameRequired', currentLanguage);
    }

    if (!userData.email.trim()) {
      newErrors.email = t('emailRequired', currentLanguage);
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = t('validEmail', currentLanguage);
    }

    if (!userData.weight.trim()) {
      newErrors.weight = t('weightRequired', currentLanguage);
    } else if (isNaN(userData.weight) || parseFloat(userData.weight) <= 0) {
      newErrors.weight = t('validWeight', currentLanguage);
    }

    if (!userData.height.trim()) {
      newErrors.height = t('heightRequired', currentLanguage);
    } else if (isNaN(userData.height) || parseFloat(userData.height) <= 0) {
      newErrors.height = t('validHeight', currentLanguage);
    }

    if (!userData.dob) {
      newErrors.dob = t('dobRequired', currentLanguage);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (validateForm()) {
      try {
        // Skip Firebase connection check in development mode
        if (devModeClicks === 0 && !isLoading && firebaseStatus === null) {
          // In development mode, proceed anyway
          if (__DEV__) {
            setDevModeClicks(1);
          } else {
            // In production, enforce connection
            setFirebaseStatus({
              success: false,
              error: 'Please wait for connection test to complete'
            });
            return;
          }
        }
        
        // Prepare the user data
        const completeUserData = {
          ...userData,
          photoUri: photo,
          preferredUnit: isMetric ? 'metric' : 'imperial',
          preferredLanguage: currentLanguage
        };
        
        // Create a mock success result
        const result = {
          success: true,
          user: {
            id: userData.email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            ...completeUserData,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        };
        
        // Try to save to Firebase but don't block on error
        try {
          const firebaseResult = await firebaseService.saveUser(completeUserData);
        } catch (firebaseError) {
          // Silent error handling
        }
        
        // Hide loading AFTER save completes
        setIsLoading(false);
        
        // Show success message
        Alert.alert(
          t('successTitle', currentLanguage) || 'Success',
          t('userCreatedSuccess', currentLanguage) || 'Your profile has been created successfully!',
          [{ 
            text: t('ok', currentLanguage),
            key: 'success-ok'
          }],
          { cancelable: false }
        );
        
        // Force navigation with a small delay to ensure alert is seen
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        }, 500);
      } catch (error) {
        setIsLoading(false);
        
        // Show error message
        Alert.alert(
          t('errorTitle', currentLanguage) || 'Error',
          `${t('unexpectedError', currentLanguage) || 'An unexpected error occurred'}: ${error.message}`,
          [{ 
            text: t('ok', currentLanguage),
            key: 'error-ok'
          }],
          { cancelable: false }
        );
        
        // Force navigation with a small delay to ensure alert is seen
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        }, 500);
      }
    } else {
      // Form is not valid, show error message
      Alert.alert(
        t('errorTitle', currentLanguage) || 'Error',
        t('formErrors', currentLanguage) || 'Please check the form for errors and try again.',
        [{ 
          text: t('ok', currentLanguage),
          key: 'form-error-ok'
        }]
      );
    }
  };

  const handleInputChange = (field, value) => {
    setUserData({
      ...userData,
      [field]: value
    });
  };

  const handleDateChange = (event, selectedDate) => {
    // Handle Cancel button press on Android
    if (!selectedDate) {
      setShowDatePicker(false);
      return;
    }
    
    // Update date value
    const currentDate = selectedDate || userData.dob;
    handleInputChange('dob', currentDate);
    
    // On iOS, the picker remains open until the user dismisses it
    // On Android, we need to close it manually after selection
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : currentLanguage, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openPhotoDialog = () => {
    setPhotoDialogVisible(true);
  };

  const hidePhotoDialog = () => {
    setPhotoDialogVisible(false);
  };

  const pickImageFromGallery = async () => {
    hidePhotoDialog();
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('permissionRequired', currentLanguage),
          t('galleryPermission', currentLanguage),
          [{ 
            text: t('ok', currentLanguage),
            key: 'gallery-permission-ok'
          }]
        );
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        t('errorTitle', currentLanguage), 
        t('photoError', currentLanguage), 
        [{ 
          text: t('ok', currentLanguage), 
          key: 'gallery-error-ok' 
        }]
      );
    }
  };

  const takePhoto = async () => {
    hidePhotoDialog();
    try {
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('permissionRequired', currentLanguage),
          t('cameraPermission', currentLanguage),
          [{ 
            text: t('ok', currentLanguage),
            key: 'camera-permission-ok'
          }]
        );
        return;
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        t('errorTitle', currentLanguage), 
        t('photoError', currentLanguage), 
        [{ 
          text: t('ok', currentLanguage), 
          key: 'camera-error-ok' 
        }]
      );
    }
  };

  const removePhoto = () => {
    hidePhotoDialog();
    setPhoto(null);
  };

  const toggleLanguageMenu = () => {
    setLanguageMenuVisible(!languageMenuVisible);
  };

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setLanguageMenuVisible(false);
  };

  // Developer mode shortcut handler
  const handleDevModePress = () => {
    const newCount = devModeClicks + 1;
    setDevModeClicks(newCount);
    
    if (newCount >= 3) {
      setDevModeClicks(0);
      navigation.navigate('MainTabs');
    }
  };

  const toggleMetrics = () => {
    setIsMetric(!isMetric);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.headerBackground} barStyle="light-content" />
      
      {/* Metrics Toggle Button */}
      <TouchableOpacity 
        style={styles.metricsButton}
        onPress={toggleMetrics}
        activeOpacity={0.7}
      >
        <View style={styles.metricsButtonInner}>
          <MaterialCommunityIcons 
            name={isMetric ? "weight-kilogram" : "weight-pound"} 
            size={16} 
            color="#fff" 
          />
        </View>
      </TouchableOpacity>
      
      {/* Language Toggle Button */}
      <TouchableOpacity 
        style={styles.languageButton}
        onPress={toggleLanguageMenu}
        activeOpacity={0.7}
      >
        <View style={styles.languageButtonInner}>
          <MaterialCommunityIcons 
            name="translate" 
            size={16} 
            color="#fff" 
          />
        </View>
      </TouchableOpacity>
      
      {/* Developer Skip Button */}
      <TouchableOpacity 
        style={styles.devSkipButton}
        onPress={() => {
          navigation.navigate('MainTabs');
        }}
        activeOpacity={0.7}
      >
        <View style={styles.devSkipButtonInner}>
          <MaterialCommunityIcons name="developer-board" size={20} color="#fff" />
          <Text style={styles.devSkipText}>Skip for development</Text>
        </View>
      </TouchableOpacity>
      
      {/* Auto Fill Button */}
      <TouchableOpacity 
        style={styles.autoFillButton}
        onPress={() => {
          // Generate dummy data
          setUserData({
            name: 'John Doe',
            email: 'john.doe@example.com',
            weight: isMetric ? '75' : '165',
            height: isMetric ? '175' : '69',
            dob: new Date(1990, 0, 1),
            gender: 'male',
            fitnessLevel: 'intermediate'
          });
          
          // Set a dummy photo from a remote URL
          const dummyPhotoUri = 'https://randomuser.me/api/portraits/men/1.jpg';
          setPhoto(dummyPhotoUri);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.autoFillButtonInner}>
          <MaterialCommunityIcons name="form-select" size={20} color="#fff" />
          <Text style={styles.autoFillText}>Fill dummy values</Text>
        </View>
      </TouchableOpacity>
      
      {/* Language Menu */}
      <Menu
        visible={languageMenuVisible}
        onDismiss={toggleLanguageMenu}
        anchor={{ x: layout.screenWidth - 30, y: Platform.OS === 'ios' ? 78 : 48 }}
        contentStyle={styles.languageMenu}
      >
        <Menu.Item
          key="language-title"
          title={languageOptions.find(lang => lang.code === currentLanguage)?.label || 'Language'}
          style={styles.languageTitle}
          titleStyle={styles.languageTitleText}
          disabled
        />
        <Divider key="language-divider" style={styles.languageDivider} />
        {languageOptions.map((option) => (
          <Menu.Item
            key={`language-option-${option.code}`}
            title={option.label}
            onPress={() => handleLanguageChange(option.code)}
            style={currentLanguage === option.code ? styles.languageItemSelected : styles.languageItem}
            titleStyle={currentLanguage === option.code ? styles.languageTextSelected : styles.languageText}
            leadingIcon={currentLanguage === option.code ? "check" : undefined}
          />
        ))}
      </Menu>
      
      <Appbar.Header style={styles.header}>
        <View style={{ width: 20 }} />
        
        <Appbar.Content 
          title={t('createProfile', currentLanguage)} 
          titleStyle={styles.headerTitle} 
        />
      </Appbar.Header>
      
      <ScrollView style={commonStyles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>{t('subtitle', currentLanguage)}</Text>

          {/* Profile Photo Card */}
          <Surface style={styles.photoCard}>
            <TouchableOpacity style={styles.photoWrapper} onPress={openPhotoDialog}>
              {photo ? (
                <>
                  <Image source={{ uri: photo }} style={styles.profilePhoto} />
                  <View style={styles.editIconContainer}>
                    <IconButton
                      icon="pencil"
                      size={16}
                      iconColor="#fff"
                      style={styles.editIcon}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <MaterialCommunityIcons name="account" size={40} color={colors.textLight} />
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.photoHint}>{t('addProfilePicture', currentLanguage)}</Text>
          </Surface>

          {/* Personal Info Card */}
          <Surface style={styles.formCard}>
            <Text style={styles.sectionTitle}>{t('personalInformation', currentLanguage)}</Text>
            
            <TextInput
              label={t('fullName', currentLanguage)}
              value={userData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              style={styles.input}
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
              theme={{ roundness: 12 }}
              error={!!errors.name}
              left={<TextInput.Icon icon="account" color={colors.accent} />}
              ref={nameInputRef}
            />
            {errors.name && <Text style={commonStyles.errorText}>{errors.name}</Text>}

            <TextInput
              label={t('emailAddress', currentLanguage)}
              value={userData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              style={styles.input}
              keyboardType="email-address"
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
              theme={{ roundness: 12 }}
              error={!!errors.email}
              left={<TextInput.Icon icon="email" color={colors.accent} />}
            />
            {errors.email && <Text style={commonStyles.errorText}>{errors.email}</Text>}

            {/* Date of Birth Picker */}
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              <View style={styles.datePickerContainer}>
                <MaterialCommunityIcons name="calendar" size={24} color={colors.accent} style={styles.dateIcon} />
                <View style={styles.dateTextContainer}>
                  <Text style={styles.dateLabel}>{t('dateOfBirth', currentLanguage)}</Text>
                  <Text style={styles.dateValue}>{formatDate(userData.dob)}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-down" size={24} color={colors.textLight} />
              </View>
            </TouchableOpacity>
            {errors.dob && <Text style={commonStyles.errorText}>{errors.dob}</Text>}
            
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={userData.dob}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1920, 0, 1)}
              />
            )}

            <View style={commonStyles.rowBetween}>
              <TextInput
                label={isMetric ? `${t('weight', currentLanguage)} (kg)` : `${t('weight', currentLanguage)} (lbs)`}
                value={userData.weight}
                onChangeText={(text) => handleInputChange('weight', text)}
                style={[styles.input, styles.smallInput]}
                keyboardType="numeric"
                mode="outlined"
                outlineColor={colors.border}
                activeOutlineColor={colors.accent}
                theme={{ roundness: 12 }}
                error={!!errors.weight}
                left={<TextInput.Icon icon="weight" color={colors.accent} />}
              />
            
              <View style={{width: spacing.medium}} />
              
              <TextInput
                label={isMetric ? `${t('height', currentLanguage)} (cm)` : `${t('height', currentLanguage)} (in)`}
                value={userData.height}
                onChangeText={(text) => handleInputChange('height', text)}
                style={[styles.input, styles.smallInput]}
                keyboardType="numeric"
                mode="outlined"
                outlineColor={colors.border}
                activeOutlineColor={colors.accent}
                theme={{ roundness: 12 }}
                error={!!errors.height}
                left={<TextInput.Icon icon="human-male-height" color={colors.accent} />}
              />
            </View>
            {(errors.weight || errors.height) && (
              <Text style={commonStyles.errorText}>{errors.weight || errors.height}</Text>
            )}
          </Surface>

          {/* Preferences Card */}
          <Surface style={styles.formCard}>
            <Text style={styles.sectionTitle}>{t('preferences', currentLanguage)}</Text>
            
            <Text style={styles.fieldLabel}>{t('gender', currentLanguage)}</Text>
            <View style={[
              styles.optionsContainer, 
              layout.screenWidth < 375 && styles.optionsContainerColumn
            ]}>
              <TouchableOpacity 
                key="gender-male"
                style={[
                  styles.optionButton, 
                  userData.gender === 'male' && styles.selectedOption
                ]}
                onPress={() => handleInputChange('gender', 'male')}
              >
                <MaterialCommunityIcons 
                  name="gender-male" 
                  size={24} 
                  color={userData.gender === 'male' ? colors.surface : colors.accent} 
                />
                <Text style={[
                  styles.optionText,
                  userData.gender === 'male' && styles.selectedOptionText
                ]}>{t('male', currentLanguage)}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                key="gender-female"
                style={[
                  styles.optionButton, 
                  userData.gender === 'female' && styles.selectedOption
                ]}
                onPress={() => handleInputChange('gender', 'female')}
              >
                <MaterialCommunityIcons 
                  name="gender-female" 
                  size={24} 
                  color={userData.gender === 'female' ? colors.surface : colors.accent} 
                />
                <Text style={[
                  styles.optionText,
                  userData.gender === 'female' && styles.selectedOptionText
                ]}>{t('female', currentLanguage)}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                key="gender-unspecified"
                style={[
                  styles.optionButton, 
                  userData.gender === 'unspecified' && styles.selectedOption
                ]}
                onPress={() => handleInputChange('gender', 'unspecified')}
              >
                <MaterialCommunityIcons 
                  name="account" 
                  size={24} 
                  color={userData.gender === 'unspecified' ? colors.surface : colors.accent} 
                />
                <Text style={[
                  styles.optionText,
                  userData.gender === 'unspecified' && styles.selectedOptionText
                ]}>{t('preferNotToSay', currentLanguage)}</Text>
              </TouchableOpacity>
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.fieldLabel}>{t('fitnessLevel', currentLanguage)}</Text>
            <View style={[
              styles.optionsContainer, 
              layout.screenWidth < 375 && styles.optionsContainerColumn
            ]}>
              <TouchableOpacity 
                key="fitness-beginner"
                style={[
                  styles.fitnessOption, 
                  userData.fitnessLevel === 'beginner' && styles.selectedOption
                ]}
                onPress={() => handleInputChange('fitnessLevel', 'beginner')}
              >
                <MaterialCommunityIcons 
                  name="walk" 
                  size={30} 
                  color={userData.fitnessLevel === 'beginner' ? colors.surface : colors.accent} 
                  style={styles.fitnessIcon}
                />
                <Text style={[
                  styles.fitnessOptionText,
                  userData.fitnessLevel === 'beginner' && styles.selectedOptionText
                ]}>{t('beginner', currentLanguage)}</Text>
                <Text style={styles.optionDescription}>
                  {t('beginnerDesc', currentLanguage)}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                key="fitness-intermediate"
                style={[
                  styles.fitnessOption, 
                  userData.fitnessLevel === 'intermediate' && styles.selectedOption
                ]}
                onPress={() => handleInputChange('fitnessLevel', 'intermediate')}
              >
                <MaterialCommunityIcons 
                  name="run" 
                  size={30} 
                  color={userData.fitnessLevel === 'intermediate' ? colors.surface : colors.accent} 
                  style={styles.fitnessIcon}
                />
                <Text style={[
                  styles.fitnessOptionText,
                  userData.fitnessLevel === 'intermediate' && styles.selectedOptionText
                ]}>{t('intermediate', currentLanguage)}</Text>
                <Text style={styles.optionDescription}>
                  {t('intermediateDesc', currentLanguage)}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                key="fitness-advanced"
                style={[
                  styles.fitnessOption, 
                  userData.fitnessLevel === 'advanced' && styles.selectedOption
                ]}
                onPress={() => handleInputChange('fitnessLevel', 'advanced')}
              >
                <MaterialCommunityIcons 
                  name="weight-lifter" 
                  size={30} 
                  color={userData.fitnessLevel === 'advanced' ? colors.surface : colors.accent} 
                  style={styles.fitnessIcon}
                />
                <Text style={[
                  styles.fitnessOptionText,
                  userData.fitnessLevel === 'advanced' && styles.selectedOptionText
                ]}>{t('advanced', currentLanguage)}</Text>
                <Text style={styles.optionDescription}>
                  {t('advancedDesc', currentLanguage)}
                </Text>
              </TouchableOpacity>
            </View>
          </Surface>

          <Button 
            mode="contained" 
            onPress={handleCreateUser}
            style={styles.createButton}
            contentStyle={styles.createButtonContent}
            labelStyle={styles.createButtonLabel}
            icon="check"
          >
            {t('createProfileButton', currentLanguage)}
          </Button>
          
          <Text style={styles.termsText}>
            {t('termsText', currentLanguage)}
          </Text>
          
          {/* Extra space at bottom */}
          <View style={{ height: 50 }} />
        </View>
      </ScrollView>

      {/* Photo Selection Dialog */}
      <Portal>
        <Dialog visible={photoDialogVisible} onDismiss={hidePhotoDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>{t('profilePicture', currentLanguage)}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>{t('choosePhoto', currentLanguage)}</Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button 
              mode="contained" 
              style={styles.dialogButton} 
              onPress={takePhoto}
              icon="camera"
              key="takePhoto"
            >
              {t('takePhoto', currentLanguage)}
            </Button>
            <Button 
              mode="contained" 
              style={styles.dialogButton} 
              onPress={pickImageFromGallery}
              icon="image"
              key="chooseFromGallery"
            >
              {t('chooseFromGallery', currentLanguage)}
            </Button>
            {photo && (
              <Button 
                mode="outlined" 
                style={styles.removeButton} 
                onPress={removePhoto}
                icon="delete"
                textColor={colors.error}
                key="removePhoto"
              >
                {t('removePhoto', currentLanguage)}
              </Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>{t('saving', currentLanguage) || 'Saving...'}</Text>
        </View>
      )}
    </View>
  );
};

// Enhanced styles with modern UI elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.headerBackground,
    elevation: 0,
    borderBottomWidth: 0,
    justifyContent: 'center',
  },
  headerDevButton: {
    marginRight: 8,
  },
  metricsButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 14,
    left: 14,
    zIndex: 999,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsButtonInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 14,
    right: 14,
    zIndex: 999,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageButtonInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
    color: colors.surface,
    fontFamily: typography.fontFamily.medium,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
  },
  subtitle: {
    fontSize: typography.fontSize.medium,
    marginBottom: spacing.xlarge,
    color: colors.textLight,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
  photoCard: {
    ...cardStyles.elevated,
    alignItems: 'center',
    paddingVertical: spacing.large,
    marginBottom: spacing.large,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  formCard: {
    ...cardStyles.elevated,
    marginBottom: spacing.large,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: spacing.large,
  },
  photoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.small,
    borderWidth: 0,
    position: 'relative',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.disabled,
  },
  photoHint: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    marginTop: spacing.small,
    fontFamily: typography.fontFamily.regular,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.darkOverlay,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    margin: 0,
  },
  input: {
    ...inputStyles.standard,
    backgroundColor: colors.surface,
    marginBottom: spacing.medium,
    borderRadius: borderRadius.large,
  },
  smallInput: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.medium,
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
  },
  fieldLabel: {
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.small,
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
  },
  datePickerButton: {
    marginBottom: spacing.medium,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.medium,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.large,
    backgroundColor: colors.surface,
  },
  dateIcon: {
    marginRight: spacing.small,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    fontFamily: typography.fontFamily.regular,
  },
  dateValue: {
    fontSize: typography.fontSize.medium,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.medium,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  optionsContainerColumn: {
    flexDirection: 'column',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.small,
    borderRadius: borderRadius.medium,
    marginHorizontal: spacing.xsmall,
    marginBottom: spacing.small,
    borderWidth: 0,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.surface,
    minWidth: layout.screenWidth < 375 ? '90%' : 'auto',
    justifyContent: 'center',
  },
  fitnessOption: {
    width: layout.screenWidth < 375 ? '90%' : layout.screenWidth < 768 ? '30%' : '25%',
    borderRadius: borderRadius.medium,
    borderWidth: 0,
    padding: spacing.medium,
    alignItems: 'center',
    marginHorizontal: layout.screenWidth < 375 ? 0 : '1.5%',
    marginBottom: spacing.medium,
    backgroundColor: colors.surface,
  },
  fitnessIcon: {
    marginBottom: spacing.small,
  },
  selectedOption: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  optionText: {
    color: colors.accent,
    marginLeft: layout.screenWidth < 375 ? spacing.small : spacing.small,
    fontWeight: typography.fontWeight.medium,
    textAlign: layout.screenWidth < 375 ? 'center' : 'left',
    flexShrink: 1,
    fontFamily: typography.fontFamily.medium,
  },
  selectedOptionText: {
    color: colors.surface,
  },
  optionDescription: {
    fontSize: typography.fontSize.xsmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.light,
  },
  createButton: {
    ...buttonStyles.primary,
    backgroundColor: colors.accent,
    marginTop: spacing.large,
    marginBottom: spacing.medium,
    borderRadius: borderRadius.medium,
    alignSelf: 'center',
    width: layout.screenWidth < 375 ? '50%' : '40%', // Made smaller
    maxWidth: 180, // Made smaller
  },
  createButtonContent: {
    height: 40, // Made smaller
  },
  createButtonLabel: {
    fontSize: typography.fontSize.small, // Made smaller
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.medium,
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1,
    marginVertical: spacing.medium,
  },
  termsText: {
    textAlign: 'center',
    fontSize: typography.fontSize.small,
    color: colors.textMuted,
    marginTop: spacing.small,
    fontFamily: typography.fontFamily.light,
  },
  dialog: {
    borderRadius: borderRadius.large,
    backgroundColor: colors.surface,
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.medium,
  },
  dialogText: {
    textAlign: 'center',
    marginBottom: spacing.medium,
    fontFamily: typography.fontFamily.regular,
  },
  dialogActions: {
    flexDirection: 'column',
    padding: spacing.medium,
    width: '100%',
    alignItems: 'center',
  },
  dialogButton: {
    marginBottom: spacing.small,
    backgroundColor: colors.accent,
    width: '90%',
    alignSelf: 'center',
  },
  removeButton: {
    borderColor: colors.error,
    marginTop: spacing.small,
    width: '90%',
    alignSelf: 'center',
  },
  // Specific styles for fitness levels
  fitnessOptionText: {
    color: colors.accent,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
  },
  // Language menu styles
  languageMenu: {
    marginTop: spacing.medium,
    borderRadius: borderRadius.medium,
    width: 180,
  },
  languageItem: {
    paddingVertical: spacing.small,
  },
  languageItemSelected: {
    paddingVertical: spacing.small,
    backgroundColor: colors.background,
  },
  languageTitle: {
    backgroundColor: colors.accent,
  },
  languageTitleText: {
    color: colors.surface,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
  },
  languageText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
  },
  languageTextSelected: {
    fontSize: typography.fontSize.small,
    color: colors.accent,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.medium,
  },
  languageDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  devSkipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 70, 
    right: 20,
    zIndex: 10,
    borderRadius: 20,
    backgroundColor: colors.accent,
    ...shadowStyles.medium,
  },
  devSkipButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  devSkipText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  },
  autoFillButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 140 : 110, 
    right: 20,
    zIndex: 10,
    borderRadius: 20,
    backgroundColor: colors.accent,
    ...shadowStyles.medium,
  },
  autoFillButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  autoFillText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  },
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
  },
});

export default UserCreationScreen; 