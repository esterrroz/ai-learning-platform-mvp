import { useState } from 'react';
import { summarizeText, generateQuizFromSummary, saveMaterial } from '../services/api';
import '../styles/UploadNew.css';

export default function UploadNew() {
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setQuiz(result.quiz || result);
    } catch (err) {
      setError(err.toString());
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!title.trim()) {
      setError('Please enter a title for this material');
      return;
    }

    if (!inputText.trim()) {
      setError('No content to save');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await saveMaterial(title, inputText, summary || null, quiz || null);
      setSuccess('✅ Material saved to library successfully!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setTitle('');
        setInputText('');
        setSummary('');
        setQuiz(null);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setTitle('');
    setSummary('');
    setQuiz(null);
    setError('');
    setSuccess('');
  };

  const handleQuizClear = () => {
    setQuiz(null);
    setError('');
  };

  return (
    <div className="upload-new">
      <div className="upload-header">
        <h1>📤 Upload New Material</h1>
        <p>Create and save new learning materials with summaries and quizzes</p>
      </div>

      <div className="upload-container">
        {/* Left Panel - Input */}
        <div className="upload-panel input-panel">
          <div className="panel-header">
            <h2>Material Details</h2>
          </div>

          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="title">Material Title</label>
            <input
              type="text"
              id="title"
              className="title-input"
              placeholder="e.g., 'React Hooks Guide', 'Python Basics'..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading || quizLoading}
            />
          </div>

          {/* Content Input */}
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              className="textarea"
              placeholder="Paste or type your learning material here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows="12"
              disabled={loading || quizLoading}
            />
            <span className="char-count">
              {inputText.length} / 5000 characters
            </span>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button
              className="btn btn-primary"
              onClick={handleSummarize}
              disabled={loading || quizLoading || !inputText.trim()}
            >
              {loading ? '⟳ Summarizing...' : '✨ Summarize'}
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

        {/* Right Panel - Output */}
        <div className="upload-panel output-panel">
          <div className="panel-header">
            <h2>Preview & Results</h2>
          </div>

          {/* Messages */}
          {error && (
            <div className="message error-box">
              <p>❌ {error}</p>
            </div>
          )}

          {success && (
            <div className="message success-box">
              <p>{success}</p>
            </div>
          )}

          {/* Summary Section */}
          {summary && (
            <div className="output-section">
              <h3>📝 Summary</h3>
              <div className="summary-box">
                <p>{summary}</p>
                <div className="section-actions">
                  <button
                    className="btn btn-accent"
                    onClick={handleGenerateQuiz}
                    disabled={quizLoading}
                  >
                    {quizLoading ? '⟳ Generating Quiz...' : '🎯 Generate Quiz'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Section */}
          {quiz && (
            <div className="output-section quiz-section">
              <div className="section-header">
                <h3>📋 Generated Quiz</h3>
                <button className="btn btn-close" onClick={handleQuizClear}>
                  ✕
                </button>
              </div>
              <div className="quiz-content">
                {Array.isArray(quiz) && quiz.map((q, index) => (
                  <div key={index} className="quiz-item">
                    <div className="quiz-question">
                      <span className="question-number">Q{index + 1}.</span>
                      <span>{q.question}</span>
                      {q.difficulty && (
                        <span className={`difficulty difficulty-${q.difficulty.toLowerCase()}`}>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="quiz-options">
                      {q.options && q.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`quiz-option ${
                            optIndex === q.correctAnswer ? 'correct-answer' : ''
                          }`}
                        >
                          <span className="option-letter">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span>{option}</span>
                          {optIndex === q.correctAnswer && (
                            <span className="correct-badge">✓ Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!summary && !error && (
            <div className="placeholder">
              <div className="placeholder-icon">📥</div>
              <p>Your summary will appear here...</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                Start by entering content and clicking "Summarize"
              </p>
            </div>
          )}

          {/* Save Button */}
          {(summary || quiz) && (
            <div className="save-section">
              <button
                className="btn btn-save"
                onClick={handleSaveToLibrary}
                disabled={loading || !title.trim()}
              >
                {loading ? '💾 Saving...' : '💾 Save to Library'}
              </button>
              <p className="save-hint">
                {!title.trim() ? '⚠️ Please enter a title to save' : '✓ Ready to save'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
