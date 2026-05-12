import { useTranslation } from 'react-i18next';
import '../styles/LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className="language-switcher">
      <button
        className="language-toggle-btn"
        onClick={toggleLanguage}
        title={i18n.language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
      >
        <span className="lang-icon">
          {i18n.language === 'en' ? '🇮🇱' : '🇺🇸'}
        </span>
        <span className="lang-text">
          {i18n.language === 'en' ? 'עברית' : 'English'}
        </span>
      </button>
    </div>
  );
}
