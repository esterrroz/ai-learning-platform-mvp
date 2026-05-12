import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { summarizeText, generateQuizFromSummary, saveMaterial, uploadPDF } from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('materials');
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');
    setQuiz(null);

    try {
      const result = await summarizeText(inputText);
      setSummary(result.summary || result);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handlePDFUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type || !file.type.includes('pdf')) {
      setError('Please upload a valid PDF file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('PDF file is too large. Maximum size is 10MB');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');
    setQuiz(null);

    try {
      const result = await uploadPDF(file);
      setInputText(result.text);
      setSuccess(
        `✅ PDF uploaded! Extracted ${result.characterCount} characters from ${result.pageCount} page(s).`
      );
      setTimeout(() => setSuccess(''), 3000);
      
      // Reset file input
      event.target.value = '';
    } catch (err) {
      setError(err.toString());
      event.target.value = '';
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!summary) {
      setError('Please generate a summary first');
      return;
    }

    setQuizLoading(true);
    setError('');
    setQuiz(null);

    try {
      const result = await generateQuizFromSummary(summary);
      const questions = result.quiz || result;
      setQuiz(questions);
      // Store quiz in sessionStorage and navigate to Quiz Generator tab
      sessionStorage.setItem('pendingQuiz', JSON.stringify(questions));
      sessionStorage.setItem('pendingQuizTitle', inputText.substring(0, 60));
      navigate('/quiz');
    } catch (err) {
      setError(err.toString());
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSaveMaterial = async () => {
    if (!inputText.trim() || !summary) {
      setError('Please generate a summary first before saving');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const title = inputText.substring(0, 50) + (inputText.length > 50 ? '...' : '');
      const result = await saveMaterial(
        title,
        inputText,
        summary,
        quiz || null
      );
      
      setSuccess('✅ Material saved successfully!');
      // Reset after 2 seconds
      setTimeout(() => {
        handleClear();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('Failed to save material: ' + err.toString());
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSummary('');
    setQuiz(null);
    setError('');
  };

  const handleQuizClear = () => {
    setQuiz(null);
    setError('');
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>📚 Platform</h3>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('materials');
              handleQuizClear();
            }}
          >
            📝 My Materials
          </button>
          <button
            className={`nav-item ${activeTab === 'study' ? 'active' : ''}`}
            onClick={() => setActiveTab('study')}
          >
            🎓 Study
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === 'materials' && (
          <div className="dashboard">
            <div className="dashboard-header">
              <h1>📚 AI Learning Platform</h1>
              <p>Paste your text below and get an AI-powered summary</p>
            </div>

            <div className="dashboard-container">
              <div className="input-section">
                <h2>Input Text</h2>
                
                {/* Textarea */}
                <textarea
                  className="textarea"
                  placeholder="Paste or type your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows="8"
                  disabled={loading || quizLoading}
                />

                {/* PDF Upload Section */}
                <div className="pdf-upload-section">
                  <label htmlFor="pdf-input" className="pdf-upload-label">
                    <span className="pdf-icon">📄</span>
                    <span className="pdf-text">Or upload a PDF file</span>
                  </label>
                  <input
                    id="pdf-input"
                    type="file"
                    accept=".pdf"
                    onChange={handlePDFUpload}
                    disabled={loading || quizLoading}
                    className="pdf-input"
                  />
                  <span className="pdf-hint">Max 10MB</span>
                </div>

                {/* Buttons */}
                <div className="button-group">
                  <button
                    className="btn btn-primary"
                    onClick={handleSummarize}
                    disabled={loading || quizLoading}
                  >
                    {loading ? 'Summarizing...' : '✨ Summarize'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleClear}
                    disabled={loading || quizLoading}
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
                {success && (
                  <div className="success-box">
                    <p>{success}</p>
                  </div>
                )}
                {summary && (
                  <div className="summary-box">
                    <p>{summary}</p>
                    <div className="summary-actions">
                      <button
                        className="btn btn-accent"
                        onClick={handleGenerateQuiz}
                        disabled={quizLoading || !summary}
                      >
                        {quizLoading ? 'Generating Quiz...' : '🎯 Generate Quiz'}
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={handleSaveMaterial}
                        disabled={saving || !summary}
                      >
                        {saving ? 'Saving...' : '💾 Save Material'}
                      </button>
                    </div>
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
        )}

        {activeTab === 'study' && (
          <div className="study-page">
            <div className="study-header">
              <h1>🎓 Study Hub</h1>
              <p>Review your materials and track your progress</p>
            </div>
            <div className="study-content">
              <div className="study-placeholder">
                <p>Study features coming soon...</p>
                <p>You can manage your saved materials and quizzes here.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
