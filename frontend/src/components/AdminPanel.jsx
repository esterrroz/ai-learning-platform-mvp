import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsers, getPrompts } from '../services/api';
import '../styles/AdminPanel.css';

// פאנל ניהול — טבלאות משתמשים ופרומפטים
export default function AdminPanel() {
  const { t } = useTranslation();
  const [users, setUsers]           = useState([]);
  const [prompts, setPrompts]       = useState([]);
  const [usersError, setUsersError]     = useState('');
  const [promptsError, setPromptsError] = useState('');
  const [loading, setLoading]       = useState(true);

// טעינת נתונים במקביל — משתמשים ופרומפטים
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        getUsers()
          .then((d) => setUsers(d.users || []))
          .catch(() => setUsersError(t('admin.errorUsers'))),
        getPrompts()
          .then((d) => setPrompts(d.prompts || []))
          .catch(() => setPromptsError(t('admin.errorPrompts'))),
      ]);
      setLoading(false);
    };
    fetchAll();
  }, [t]);

  const formatDate = (iso) => iso ? new Date(iso).toLocaleString() : '—';

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
        <p>{t('admin.loading')}</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🛡️ {t('admin.title')}</h1>
        <p>{t('admin.subtitle')}</p>
        <div className="admin-stats">
          <div className="stat-badge">
            <span className="stat-num">{users.length}</span>
            <span className="stat-lbl">{t('admin.totalUsers')}</span>
          </div>
          <div className="stat-badge">
            <span className="stat-num">{prompts.length}</span>
            <span className="stat-lbl">{t('admin.totalPrompts')}</span>
          </div>
        </div>
      </div>

      {/* טבלת משתמשים */}
      <section className="admin-section">
        <h2>👥 {t('admin.usersTable')}</h2>
        {usersError ? (
          <p className="admin-error">{usersError}</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.id')}</th>
                  <th>{t('admin.name')}</th>
                  <th>{t('admin.phone')}</th>
                  <th>{t('admin.registeredAt')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.phone || t('admin.noPhone')}</td>
                    <td>{formatDate(u.created_at)}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="empty-row">—</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* טבלת פרומפטים */}
      <section className="admin-section">
        <h2>📋 {t('admin.promptsTable')}</h2>
        {promptsError ? (
          <p className="admin-error">{promptsError}</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.id')}</th>
                  <th>{t('admin.user')}</th>
                  <th>{t('admin.category')}</th>
                  <th>{t('admin.subCategory')}</th>
                  <th>{t('admin.prompt')}</th>
                  <th>{t('admin.response')}</th>
                  <th>{t('admin.date')}</th>
                </tr>
              </thead>
              <tbody>
                {prompts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.user_name || '—'}</td>
                    <td>{p.category_name || '—'}</td>
                    <td>{p.sub_category_name || '—'}</td>
                    <td className="cell-truncate" title={p.prompt}>{p.prompt}</td>
                    <td className="cell-truncate" title={p.response}>
                      {p.response || t('admin.noResponse')}
                    </td>
                    <td>{formatDate(p.created_at)}</td>
                  </tr>
                ))}
                {prompts.length === 0 && (
                  <tr><td colSpan={7} className="empty-row">—</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
