import { useTranslation } from 'react-i18next';
import '../styles/LanguageSwitcher.css';

// כפתור החלפת שפה בין עברית לאנגלית
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const isHebrew = i18n.language === 'he';

  const toggle = () => i18n.changeLanguage(isHebrew ? 'en' : 'he');

  return (
    <button
      className="lang-toggle"
      onClick={toggle}
      title={isHebrew ? t('common.switchEnglish') : t('common.switchHebrew')}
    >
      <span className="lang-flag">{isHebrew ? '🇺🇸' : '🇮🇱'}</span>
      <span className="lang-label">{isHebrew ? t('navbar.english') : t('navbar.hebrew')}</span>
    </button>
  );
}
