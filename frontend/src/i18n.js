import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import heTranslations from './locales/he.json';

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('app-language') || 'en';

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      he: {
        translation: heTranslations,
      },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Update HTML dir attribute and localStorage when language changes
i18n.on('languageChanged', (lang) => {
  document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  localStorage.setItem('app-language', lang);
});

// Set initial dir attribute
document.documentElement.dir = savedLanguage === 'he' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

export default i18n;
