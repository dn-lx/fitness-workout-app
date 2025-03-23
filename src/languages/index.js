// Import translations
import english from './en';
import spanish from './es';
import french from './fr';
import german from './de';
import italian from './it';
import russian from './ru';
import hindi from './hi';
import sinhalese from './si';
import korean from './ko';
import japanese from './ja';
import norwegian from './no';
import bulgarian from './bg';
import romanian from './ro';
import finnish from './fi';

// Export translations
export const translations = {
  en: english,
  es: spanish,
  fr: french,
  de: german,
  it: italian,
  ru: russian,
  hi: hindi,
  si: sinhalese,
  ko: korean,
  ja: japanese,
  no: norwegian,
  bg: bulgarian,
  ro: romanian,
  fi: finnish,
};

// Export language options
export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'ru', label: 'Русский' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'si', label: 'සිංහල' },
  { value: 'ko', label: '한국어' },
  { value: 'ja', label: '日本語' },
  { value: 'no', label: 'Norsk' },
  { value: 'bg', label: 'Български' },
  { value: 'ro', label: 'Română' },
  { value: 'fi', label: 'Suomi' },
];

// Function to get translations based on language code
export const getTranslations = (languageCode) => {
  return translations[languageCode] || english; // Default to English if language not found
};

export default {
  translations,
  languageOptions,
  getTranslations,
}; 