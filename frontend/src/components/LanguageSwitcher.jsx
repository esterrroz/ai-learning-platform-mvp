import { useTranslation } from 'react-i18next';
import '../styles/LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

  const toggle = () => i18n.changeLanguage(isHebrew ? 'en' : 'he');

  return (
    <button className="lang-toggle" onClick={toggle} title={isHebrew ? 'Switch to English' : 'עבור לעברית'}>
      <span className="lang-flag">{isHebrew ? '🇺🇸' : '🇮🇱'}</span>
      <span className="lang-label">{isHebrew ? 'English' : 'עברית'}</span>
    </button>
  );
}
