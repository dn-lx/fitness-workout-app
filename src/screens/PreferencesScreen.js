import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Switch,
  Modal,
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';

export default function PreferencesScreen() {
  const navigation = useNavigation();
  const { 
    isDarkMode, 
    toggleTheme, 
    language, 
    changeLanguage, 
    metricSystem, 
    toggleMetricSystem,
    t 
  } = useAppContext();
  
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  
  // Language options
  const languages = ['English', 'Spanish', 'French', 'German'];

  // Change language and close modal
  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    setShowLanguageModal(false);
  };

  // Additional preference options
  const preferences = [
    {
      id: 'metric',
      title: 'Measurement System',
      description: metricSystem ? 'Metric (kg, cm)' : 'Imperial (lb, in)',
      icon: 'scale-outline',
      toggle: (
        <Switch
          trackColor={{ false: "#767577", true: "#3b82f6" }}
          thumbColor={metricSystem ? "#f3f4f6" : "#f3f4f6"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleMetricSystem}
          value={metricSystem}
        />
      )
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: notificationsEnabled ? 'Enabled' : 'Disabled',
      icon: 'notifications-outline',
      toggle: (
        <Switch
          trackColor={{ false: "#767577", true: "#3b82f6" }}
          thumbColor={notificationsEnabled ? "#f3f4f6" : "#f3f4f6"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
          value={notificationsEnabled}
        />
      )
    },
    {
      id: 'sound',
      title: 'Sound Effects',
      description: soundEffects ? 'Enabled' : 'Disabled',
      icon: 'volume-high-outline',
      toggle: (
        <Switch
          trackColor={{ false: "#767577", true: "#3b82f6" }}
          thumbColor={soundEffects ? "#f3f4f6" : "#f3f4f6"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setSoundEffects(!soundEffects)}
          value={soundEffects}
        />
      )
    }
  ];
  
  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <View className="px-4 pt-2 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? "#f3f4f6" : "#374151"} 
          />
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('preferences')}
        </Text>
      </View>
      
      <View className="flex-1 px-4">
        {/* Theme Toggle */}
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-4 mb-6`}>
          <View className="flex-row items-center mb-3">
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={24} 
              color={isDarkMode ? "#f3f4f6" : "#6b7280"} 
              className="mr-2"
            />
            <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('theme')}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {isDarkMode ? t('darkMode') : t('lightMode')}
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#3b82f6" }}
              thumbColor={isDarkMode ? "#f3f4f6" : "#f3f4f6"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>
        </View>

        {/* Language Selection */}
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-4 mb-6`}>
          <View className="flex-row items-center mb-3">
            <Ionicons 
              name="language" 
              size={24} 
              color={isDarkMode ? "#f3f4f6" : "#6b7280"} 
              className="mr-2"
            />
            <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('language')}
            </Text>
          </View>
          <TouchableOpacity 
            className={`flex-row items-center justify-between py-2 px-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
            onPress={() => setShowLanguageModal(true)}
          >
            <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{language}</Text>
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={isDarkMode ? "#f3f4f6" : "#6b7280"} 
            />
          </TouchableOpacity>

          {/* Language Modal */}
          <Modal
            visible={showLanguageModal}
            transparent={true}
            animationType="slide"
          >
            <View className="flex-1 justify-end">
              <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-xl pt-4 pb-6`}>
                <View className="flex-row justify-between items-center px-4 mb-4">
                  <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Select Language
                  </Text>
                  <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                    <Ionicons 
                      name="close" 
                      size={24} 
                      color={isDarkMode ? "#f3f4f6" : "#6b7280"} 
                    />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={languages}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      className={`py-3 px-4 ${language === item ? (isDarkMode ? 'bg-blue-900' : 'bg-blue-50') : ''}`}
                      onPress={() => handleLanguageChange(item)}
                    >
                      <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} ${language === item ? 'font-bold' : ''}`}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </View>
        
        {/* Additional preferences */}
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl mb-6`}>
          {preferences.map((preference, index) => (
            <View 
              key={preference.id}
              className={`p-4 ${index < preferences.length - 1 ? 'border-b' : ''} ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <View className="flex-row items-center mb-1">
                <Ionicons 
                  name={preference.icon} 
                  size={24} 
                  color={isDarkMode ? "#f3f4f6" : "#6b7280"} 
                  className="mr-2"
                />
                <Text className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {preference.title}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mt-2">
                <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {preference.description}
                </Text>
                {preference.toggle}
              </View>
            </View>
          ))}
        </View>
        
        {/* About Section */}
        <TouchableOpacity 
          className={`flex-row items-center p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl mb-2`}
          onPress={() => {/* Open about screen or show info */}}
        >
          <Ionicons 
            name="information-circle-outline" 
            size={24} 
            color={isDarkMode ? "#f3f4f6" : "#6b7280"} 
            className="mr-2"
          />
          <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            About
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDarkMode ? "#9ca3af" : "#6b7280"} 
            className="ml-auto"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
