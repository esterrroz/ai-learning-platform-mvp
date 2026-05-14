import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import heTranslations from './locales/he.json';

// קריאת שפה שמורה מ-localStorage, ברירת מחדל: עברית
const savedLanguage = localStorage.getItem('app-language') || 'he';

// הגדרת i18next עם תמיכה בעברית ואנגלית
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      he: { translation: heTranslations },
    },
    lng: savedLanguage,
    fallbackLng: 'he',
    interpolation: { escapeValue: false },
  });

// עדכון כיוון הטקסט (RTL/LTR) ושמירת השפה בעת החלפה
i18n.on('languageChanged', (lang) => {
  document.documentElement.dir  = lang === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  localStorage.setItem('app-language', lang);
});

// הגדרת כיוון ראשוני בטעינה
document.documentElement.dir  = savedLanguage === 'he' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

export default i18n;
