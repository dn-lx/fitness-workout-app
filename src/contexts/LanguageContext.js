import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, getTranslations } from '../languages';

// Map language codes to our language keys and vice versa
const languageCodeMap = {
  english: 'en',
  spanish: 'es',
  french: 'fr',
  german: 'de',
  italian: 'it',
  russian: 'ru',
  hindi: 'hi',
  sinhalese: 'si',
  korean: 'ko',
  japanese: 'ja',
  norwegian: 'no',
  bulgarian: 'bg',
  romanian: 'ro',
  finnish: 'fi'
};

const reverseLanguageCodeMap = {
  en: 'english',
  es: 'spanish',
  fr: 'french',
  de: 'german',
  it: 'italian',
  ru: 'russian',
  hi: 'hindi',
  si: 'sinhalese',
  ko: 'korean',
  ja: 'japanese',
  no: 'norwegian',
  bg: 'bulgarian',
  ro: 'romanian',
  fi: 'finnish'
};

// Supported languages
export const languages = {
  english: {
    code: 'en',
    name: 'English',
  },
  spanish: {
    code: 'es',
    name: 'Español',
  },
  french: {
    code: 'fr',
    name: 'Français',
  },
  german: {
    code: 'de',
    name: 'Deutsch',
  },
  italian: {
    code: 'it',
    name: 'Italiano',
  },
  russian: {
    code: 'ru',
    name: 'Русский',
  },
  hindi: {
    code: 'hi',
    name: 'हिन्दी',
  },
  sinhalese: {
    code: 'si',
    name: 'සිංහල',
  },
  korean: {
    code: 'ko',
    name: '한국어',
  },
  japanese: {
    code: 'ja',
    name: '日本語',
  },
  norwegian: {
    code: 'no',
    name: 'Norsk',
  },
  bulgarian: {
    code: 'bg',
    name: 'Български',
  },
  romanian: {
    code: 'ro',
    name: 'Română',
  },
  finnish: {
    code: 'fi',
    name: 'Suomi',
  }
};

// Create language context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('english');

  // Load saved language preference
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLanguagePreference();
  }, []);

  // Save language preference when it changes
  const changeLanguage = async (language) => {
    try {
      await AsyncStorage.setItem('appLanguage', language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation function - checks if the key exists in the language files
export const t = (key, language = 'english') => {
  // Get the language code for the selected language
  const langCode = languageCodeMap[language];
  
  // Get translations for the language code
  if (langCode && translations[langCode] && translations[langCode][key]) {
    return translations[langCode][key];
  }
  
  // Fallback to English if the key is not found
  if (translations.en && translations.en[key]) {
    return translations.en[key];
  }
  
  // Return the key itself if it doesn't exist in any translation
  return key;
};

export default LanguageContext; 