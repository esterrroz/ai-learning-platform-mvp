import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Sidebar.css';

export default function Sidebar({ userName }) {
  const location = useLocation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.reload();
  };

  const close = () => setOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="hamburger-btn" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
        <span className="logo-icon">📚</span>
        <span className="logo-text">{t('sidebar.logo')}</span>
      </div>

      {/* Backdrop */}
      <div className={`sidebar-backdrop ${open ? 'visible' : ''}`} onClick={close} />

      <aside className={`app-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">{t('sidebar.logo')}</span>
          </div>
          <button className="sidebar-toggle" onClick={close} aria-label="Close menu">✕</button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="section-title">{t('sidebar.main')}</h3>
            <Link to="/upload"  className={`sidebar-link ${isActive('/upload')  ? 'active' : ''}`} onClick={close}>
              <span className="link-icon">📤</span>
              <span className="link-text">{t('sidebar.uploadNew')}</span>
            </Link>
            <Link to="/library" className={`sidebar-link ${isActive('/library') ? 'active' : ''}`} onClick={close}>
              <span className="link-icon">📚</span>
              <span className="link-text">{t('sidebar.myLibrary')}</span>
            </Link>
          </div>

          <div className="nav-section">
            <h3 className="section-title">{t('sidebar.tools')}</h3>
            <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={close}>
              <span className="link-icon">✨</span>
              <span className="link-text">{t('sidebar.summarizer')}</span>
            </Link>
            <Link to="/quiz" className={`sidebar-link ${isActive('/quiz') ? 'active' : ''}`} onClick={close}>
              <span className="link-icon">🎯</span>
              <span className="link-text">{t('sidebar.lessonGenerator')}</span>
            </Link>
            <Link to="/history" className={`sidebar-link ${isActive('/history') ? 'active' : ''}`} onClick={close}>
              <span className="link-icon">📖</span>
              <span className="link-text">{t('sidebar.learningHistory')}</span>
            </Link>
            <Link to="/admin" className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`} onClick={close}>
              <span className="link-icon">🛡️</span>
              <span className="link-text">{t('sidebar.adminPanel')}</span>
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
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
    </>
  );
}
