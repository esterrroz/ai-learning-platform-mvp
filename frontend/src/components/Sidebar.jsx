import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => {
    return location.pathname === path;
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
          <Link
            to="/upload"
            className={`sidebar-link ${isActive('/upload') ? 'active' : ''}`}
          >
            <span className="link-icon">📤</span>
            <span className="link-text">{t('sidebar.uploadNew')}</span>
          </Link>
          <Link
            to="/library"
            className={`sidebar-link ${isActive('/library') ? 'active' : ''}`}
          >
            <span className="link-icon">📚</span>
            <span className="link-text">{t('sidebar.myLibrary')}</span>
          </Link>
        </div>

        <div className="nav-section">
          <h3 className="section-title">{t('sidebar.tools')}</h3>
          <Link
            to="/dashboard"
            className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span className="link-icon">✨</span>
            <span className="link-text">{t('sidebar.summarizer')}</span>
          </Link>
          <Link
            to="/quiz"
            className={`sidebar-link ${isActive('/quiz') ? 'active' : ''}`}
          >
            <span className="link-icon">🎯</span>
            <span className="link-text">{t('sidebar.lessonGenerator')}</span>
          </Link>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-info">
          <p>v1.0</p>
          <p>{t('navbar.language')}</p>
        </div>
      </div>
    </aside>
  );
}
