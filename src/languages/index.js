// Import all translations
import en from './en';
import es from './es';
import fr from './fr';
import de from './de';
import it from './it';
import ru from './ru';

// Export translations with language codes
export const translations = {
  en,
  es,
  fr,
  de,
  it,
  ru,
};

// Export language options for dropdown
export const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'ru', label: 'Русский' },
];

// Default language
export const defaultLanguage = 'en';

// Get translation based on language code
export const getTranslation = (langCode) => {
  return translations[langCode] || translations[defaultLanguage];
};

export default {
  translations,
  languageOptions,
  defaultLanguage,
  getTranslation,
}; 