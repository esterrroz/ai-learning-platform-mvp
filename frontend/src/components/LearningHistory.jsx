import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserPrompts } from '../services/api';
import '../styles/LearningHistory.css';

export default function LearningHistory() {
  const { t } = useTranslation();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getUserPrompts(userId)
      .then((d) => setPrompts(d.prompts || []))
      .catch(() => setError(t('history.error')))
      .finally(() => setLoading(false));
  }, [userId, t]);

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleString() : '—';

  if (loading) return (
    <div className="lh-loading">
      <div className="spinner" />
      <p>{t('common.loading')}</p>
    </div>
  );

  return (
    <div className="lh-page">
      <div className="lh-header">
        <h1>📖 {t('history.title')}</h1>
        <p>{t('history.subtitle')}</p>
        <div className="lh-stat">
          <span className="lh-stat-num">{prompts.length}</span>
          <span className="lh-stat-lbl">{t('history.totalSessions')}</span>
        </div>
      </div>

      {error && <div className="lh-error">{error}</div>}

      {!error && prompts.length === 0 && (
        <div className="lh-empty">
          <span className="lh-empty-icon">📭</span>
          <p>{t('history.empty')}</p>
        </div>
      )}

      {prompts.length > 0 && (
        <div className="lh-list">
          {prompts.map((p) => (
            <div key={p.id} className="lh-card">
              <div className="lh-card-top">
                <div className="lh-badges">
                  {p.category_name && <span className="lh-badge lh-badge-cat">{p.category_name}</span>}
                  {p.sub_category_name && <span className="lh-badge lh-badge-sub">{p.sub_category_name}</span>}
                </div>
                <span className="lh-date">{formatDate(p.created_at)}</span>
              </div>

              <p className="lh-prompt-text">💬 {p.prompt}</p>

              {p.response && (
                <div className="lh-response-wrap">
                  <button
                    className="lh-toggle"
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                  >
                    {expanded === p.id ? t('history.hideResponse') : t('history.showResponse')}
                  </button>
                  {expanded === p.id && (
                    <div className="lh-response">{p.response}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
