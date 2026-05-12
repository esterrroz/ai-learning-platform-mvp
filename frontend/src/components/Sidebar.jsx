import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Sidebar.css';

export default function Sidebar({ userName }) {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.reload();
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">{t('sidebar.logo')}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="section-title">{t('sidebar.main')}</h3>
          <Link to="/upload"  className={`sidebar-link ${isActive('/upload')  ? 'active' : ''}`}>
            <span className="link-icon">📤</span>
            <span className="link-text">{t('sidebar.uploadNew')}</span>
          </Link>
          <Link to="/library" className={`sidebar-link ${isActive('/library') ? 'active' : ''}`}>
            <span className="link-icon">📚</span>
            <span className="link-text">{t('sidebar.myLibrary')}</span>
          </Link>
        </div>

        <div className="nav-section">
          <h3 className="section-title">{t('sidebar.tools')}</h3>
          <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
            <span className="link-icon">✨</span>
            <span className="link-text">{t('sidebar.summarizer')}</span>
          </Link>
          <Link to="/quiz" className={`sidebar-link ${isActive('/quiz') ? 'active' : ''}`}>
            <span className="link-icon">🎯</span>
            <span className="link-text">{t('sidebar.lessonGenerator')}</span>
          </Link>
        </div>
      </nav>

      <div className="sidebar-footer">
        {/* Language toggle lives here — always visible */}
        <LanguageSwitcher />

        <div className="sidebar-user">
          <span className="user-icon">👤</span>
          <span className="user-name">{userName}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          {t('common.signOut', 'Sign Out')}
        </button>
      </div>
    </aside>
  );
}
