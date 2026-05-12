import { useState } from 'react';
import { registerUser } from '../services/api';
import '../styles/Register.css';

export default function Register({ onRegistered }) {
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { user } = await registerUser(name.trim(), phone.trim() || null);
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
      <div className="register-card">
        <div className="register-logo">📚</div>
        <h1 className="register-title">AI Learning Platform</h1>
        <p className="register-subtitle">Enter your details to get started</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="reg-name">Full Name *</label>
            <input
              id="reg-name"
              type="text"
              placeholder="e.g. Sarah Cohen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="register-field">
            <label htmlFor="reg-phone">Phone (optional)</label>
            <input
              id="reg-phone"
              type="tel"
              placeholder="e.g. 050-1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="register-error">❌ {error}</p>}

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? 'Registering...' : "Let's Start Learning 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
