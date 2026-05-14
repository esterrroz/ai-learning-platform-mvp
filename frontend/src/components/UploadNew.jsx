import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { summarizeText, generateQuizFromSummary, saveMaterial } from '../services/api';
import '../styles/UploadNew.css';

// העלאת חומר חדש — הזנת טקסט, סיכום AI, יצירת חידון ושמירה לספרייה
export default function UploadNew() {
  const { t }  = useTranslation();
  const userId = localStorage.getItem('userId');

  const [inputText, setInputText] = useState('');
  const [title, setTitle]         = useState('');
  const [summary, setSummary]     = useState('');
  const [quiz, setQuiz]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  // סיכום הטקסט
  const handleSummarize = async () => {
    if (!inputText.trim()) { setError(t('uploadNew.noTextError')); return; }
    setLoading(true); setError(''); setSummary(''); setQuiz(null);
    try {
      const result = await summarizeText(inputText, userId);
      setSummary(result.summary || result);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  // יצירת חידון מהסיכום
  const handleGenerateQuiz = async () => {
    if (!summary) { setError(t('dashboard.generateSummaryFirst')); return; }
    setQuizLoading(true); setError(''); setQuiz(null);
    try {
      const result = await generateQuizFromSummary(summary);
      setQuiz(result.quiz || result);
    } catch (err) {
      setError(err.toString());
    } finally {
      setQuizLoading(false);
    }
  };

  // שמירת החומר לספרייה
  const handleSaveToLibrary = async () => {
    if (!title.trim())     { setError(t('uploadNew.noTitleError'));   return; }
    if (!inputText.trim()) { setError(t('uploadNew.noContentError')); return; }

    setLoading(true); setError(''); setSuccess('');
    try {
      await saveMaterial(title, inputText, summary || null, quiz || null, userId);
      setSuccess(t('uploadNew.savedSuccess'));
      // איפוס הטופס לאחר 2 שניות
      setTimeout(() => {
        setTitle(''); setInputText(''); setSummary(''); setQuiz(null); setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleClear     = () => { setInputText(''); setTitle(''); setSummary(''); setQuiz(null); setError(''); setSuccess(''); };
  const handleQuizClear = () => { setQuiz(null); setError(''); };

  return (
    <div className="upload-new">
      <div className="upload-header">
        <h1>📤 {t('uploadNew.uploadNew')}</h1>
        <p>{t('uploadNew.pasteOrUpload')}</p>
      </div>

      <div className="upload-container">
        {/* פאנל שמאלי — קלט */}
        <div className="upload-panel input-panel">
          <div className="panel-header">
            <h2>{t('uploadNew.inputText')}</h2>
          </div>

          {/* שדה כותרת */}
          <div className="form-group">
            <label htmlFor="title">{t('common.save')}</label>
            <input type="text" id="title" className="title-input"
              placeholder="e.g., 'React Hooks Guide', 'Python Basics'..."
              value={title} onChange={(e) => setTitle(e.target.value)}
              disabled={loading || quizLoading} />
          </div>

          {/* שדה תוכן */}
          <div className="form-group">
            <label htmlFor="content">{t('uploadNew.inputText')}</label>
            <textarea id="content" className="textarea"
              placeholder={t('dashboard.textareaPlaceholder')}
              value={inputText} onChange={(e) => setInputText(e.target.value)}
              rows="12" disabled={loading || quizLoading} />
            <span className="char-count">{inputText.length} / 5000 {t('lessonGenerator.characters')}</span>
          </div>

          <div className="button-group">
            <button className="btn btn-primary" onClick={handleSummarize}
              disabled={loading || quizLoading || !inputText.trim()}>
              {loading ? '⟳ ...' : '✨ ' + t('dashboard.summarizeButton')}
            </button>
            <button className="btn btn-secondary" onClick={handleClear} disabled={loading || quizLoading}>
              {t('dashboard.clearButton')}
            </button>
          </div>
        </div>

        {/* פאנל ימני — פלט */}
        <div className="upload-panel output-panel">
          <div className="panel-header">
            <h2>{t('dashboard.summary')}</h2>
          </div>

          {error   && <div className="message error-box"><p>❌ {error}</p></div>}
          {success && <div className="message success-box"><p>{success}</p></div>}

          {/* סיכום */}
          {summary && (
            <div className="output-section">
              <h3>📏 {t('dashboard.summary')}</h3>
              <div className="summary-box">
                <p>{summary}</p>
                <div className="section-actions">
                  <button className="btn btn-accent" onClick={handleGenerateQuiz} disabled={quizLoading}>
                    {quizLoading ? '⟳ ...' : '🎯 ' + t('quizGenerator.generateQuiz')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* חידון */}
          {quiz && (
            <div className="output-section quiz-section">
              <div className="section-header">
                <h3>📋 {t('quizTaking.generatedQuiz')}</h3>
                <button className="btn btn-close" onClick={handleQuizClear}>✕</button>
              </div>
              <div className="quiz-content">
                {Array.isArray(quiz) && quiz.map((q, index) => (
                  <div key={index} className="quiz-item">
                    <div className="quiz-question">
                      <span className="question-number">Q{index + 1}.</span>
                      <span>{q.question}</span>
                      {q.difficulty && (
                        <span className={`difficulty difficulty-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                      )}
                    </div>
                    <div className="quiz-options">
                      {q.options && q.options.map((option, optIndex) => (
                        <div key={optIndex}
                          className={`quiz-option ${optIndex === q.correctAnswer ? 'correct-answer' : ''}`}>
                          <span className="option-letter">{String.fromCharCode(65 + optIndex)}.</span>
                          <span>{option}</span>
                          {optIndex === q.correctAnswer && (
                            <span className="correct-badge">✓ {t('quizTaking.correct')}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* מצב ריק */}
          {!summary && !error && (
            <div className="placeholder">
              <div className="placeholder-icon">📥</div>
              <p>{t('dashboard.summaryPlaceholder')}</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{t('dashboard.summaryHint')}</p>
            </div>
          )}

          {/* כפתור שמירה — מופיע רק כשיש סיכום או חידון */}
          {(summary || quiz) && (
            <div className="save-section">
              <button className="btn btn-save" onClick={handleSaveToLibrary}
                disabled={loading || !title.trim()}>
                {loading ? '💾 ...' : '💾 ' + t('dashboard.saveToLibrary')}
              </button>
              <p className="save-hint">
                {!title.trim() ? '⚠️ ' + t('uploadNew.noTitleError') : '✓ ' + t('dashboard.readyToSave')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
