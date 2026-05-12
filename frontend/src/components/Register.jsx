import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../services/api';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Register.css';

export default function Register({ onRegistered }) {
  const { t } = useTranslation();
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('register.nameRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await loginUser(name.trim(), phone.trim() || null);
      localStorage.setItem('userId',   String(user.id));
      localStorage.setItem('userName', user.name);
      onRegistered(user);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-overlay">
      <div className="register-lang-switcher">
        <LanguageSwitcher />
      </div>
      <div className="register-card">
        <div className="register-logo">📚</div>
        <h1 className="register-title">{t('register.title')}</h1>
        <p className="register-subtitle">{t('register.subtitle')}</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="reg-name">{t('register.fullName')} *</label>
            <input
              id="reg-name"
              type="text"
              placeholder={t('register.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="register-field">
            <label htmlFor="reg-phone">{t('register.phone')}</label>
            <input
              id="reg-phone"
              type="tel"
              placeholder={t('register.phonePlaceholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="register-error">❌ {error}</p>}

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? t('register.submitting') : t('register.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
