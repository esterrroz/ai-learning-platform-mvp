import { useState } from 'react';
import { summarizeText } from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const result = await summarizeText(inputText);
      setSummary(result.summary || result);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSummary('');
    setError('');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📚 AI Learning Platform</h1>
        <p>Paste your text below and get an AI-powered summary</p>
      </div>

      <div className="dashboard-container">
        <div className="input-section">
          <h2>Input Text</h2>
          <textarea
            className="textarea"
            placeholder="Paste or type your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows="8"
          />
          <div className="button-group">
            <button
              className="btn btn-primary"
              onClick={handleSummarize}
              disabled={loading}
            >
              {loading ? 'Summarizing...' : '✨ Summarize'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="output-section">
          <h2>Summary</h2>
          {error && (
            <div className="error-box">
              <p>❌ Error: {error}</p>
            </div>
          )}
          {summary && (
            <div className="summary-box">
              <p>{summary}</p>
            </div>
          )}
          {!summary && !error && (
            <div className="placeholder">
              <p>Your summary will appear here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
