import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMaterials, generateQuizFromSummary, generateQuizForMaterialById } from '../services/api';
import QuizTaking from './QuizTaking';
import '../styles/QuizGenerator.css';

// מחולל חידונים — בחירת חומר שמור ויצירת חידון AI
export default function QuizGenerator() {
  const { t } = useTranslation();
  const [materials, setMaterials]           = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quiz, setQuiz]                     = useState(null);
  const [loading, setLoading]               = useState(true);
  const [quizLoading, setQuizLoading]       = useState(false);
  const [error, setError]                   = useState('');
  const [searchTerm, setSearchTerm]         = useState('');
  const [takingQuiz, setTakingQuiz]         = useState(false);

  useEffect(() => {
    fetchMaterials();

    // בדיקה אם הגיע חידון מה-Dashboard דרך sessionStorage
    const pending      = sessionStorage.getItem('pendingQuiz');
    const pendingTitle = sessionStorage.getItem('pendingQuizTitle');
    if (pending) {
      try {
        const questions = JSON.parse(pending);
        setQuiz(questions);
        setTakingQuiz(true);
        if (pendingTitle) setSelectedMaterial({ title: pendingTitle, summary: null });
      } catch (_) {}
      sessionStorage.removeItem('pendingQuiz');
      sessionStorage.removeItem('pendingQuizTitle');
    }
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true); setError('');
      const data = await getMaterials();
      setMaterials(data.materials || []);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMaterial = (material) => {
    setSelectedMaterial(material); setQuiz(null); setTakingQuiz(false);
  };

  // יצירת חידון — משתמש בנתיב DB אם יש ID, אחרת fallback לסיכום
  const handleGenerateQuiz = async () => {
    if (!selectedMaterial?.summary) { setError(t('quizGenerator.noSummaryError')); return; }
    setQuizLoading(true); setError(''); setQuiz(null); setTakingQuiz(false);
    try {
      let questions;
      if (selectedMaterial.id) {
        const result = await generateQuizForMaterialById(selectedMaterial.id);
        questions = result.quiz || result;
      } else {
        const result = await generateQuizFromSummary(selectedMaterial.summary);
        questions = result.quiz || result;
      }
      setQuiz(questions);
    } catch (err) {
      setError(err.toString());
    } finally {
      setQuizLoading(false);
    }
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // מצב לקיחת חידון
  if (takingQuiz && quiz) {
    return (
      <QuizTaking
        quiz={quiz}
        materialTitle={selectedMaterial?.title}
        onBack={() => setTakingQuiz(false)}
      />
    );
  }

  // מצב חומר נבחר — הצגת סיכום ואפשרות יצירת חידון
  if (selectedMaterial && !takingQuiz) {
    return (
      <div className="quiz-generator">
        <div className="quiz-header">
          <button className="btn btn-back" onClick={() => { setSelectedMaterial(null); setQuiz(null); }}>
            ← Back to Materials
          </button>
          <h1>📚 {selectedMaterial.title}</h1>
        </div>

        {error && <div className="error-box"><p>❌ {error}</p></div>}

        <div className="selected-material-container">
          {/* פאנל סיכום */}
          <div className="material-summary-panel">
            <h2>📝 Summary</h2>
            {selectedMaterial.summary ? (
              <div className="summary-content"><p>{selectedMaterial.summary}</p></div>
            ) : (
              <div className="placeholder"><p>No summary available for this material</p></div>
            )}
          </div>

          {/* פאנל יצירת חידון */}
          <div className="quiz-generation-panel">
            {!quiz ? (
              <div className="generate-section">
                <h2>🎯 Generate Quiz</h2>
                <p className="generate-description">Generate 3 AI-powered multiple choice questions based on the summary</p>
                <button className="btn btn-generate" onClick={handleGenerateQuiz}
                  disabled={quizLoading || !selectedMaterial.summary}>
                  {quizLoading ? <><span className="spinner-small"></span>Generating Questions...</> : '🤖 Generate AI Quiz'}
                </button>
                {!selectedMaterial.summary && (
                  <p className="warning-text">⚠️ This material needs a summary to generate a quiz</p>
                )}
              </div>
            ) : (
              <div className="quiz-preview-section">
                <h2>🎯 Quiz Ready!</h2>
                <div className="quiz-summary">
                  <div className="summary-stat">
                    <span className="stat-label">Questions:</span>
                    <span className="stat-value">{quiz.length}</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-label">Format:</span>
                    <span className="stat-value">Multiple Choice</span>
                  </div>
                </div>

                {/* תצוגה מקדימה של שאלות */}
                <div className="quiz-preview">
                  <h3>Preview</h3>
                  {Array.isArray(quiz) && quiz.map((q, index) => (
                    <div key={index} className="preview-item">
                      <div className="preview-question">Q{index + 1}. {q.question}</div>
                      {q.difficulty && (
                        <span className={`difficulty difficulty-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                      )}
                    </div>
                  ))}
                </div>

                <button className="btn btn-start-quiz" onClick={() => setTakingQuiz(true)}>✅ Start Quiz</button>
                <button className="btn btn-regenerate" onClick={handleGenerateQuiz} disabled={quizLoading}>🔄 Regenerate</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // מצב רשימת חומרים
  return (
    <div className="quiz-generator">
      <div className="quiz-header">
        <h1>🎯 {t('quizGenerator.quizGenerator')}</h1>
        <p>{t('quizGenerator.selectMaterial')}</p>
      </div>

      <div className="search-section">
        <input type="text" className="search-input"
          placeholder={t('quizGenerator.searchPlaceholder')}
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <span className="results-count">
          {filteredMaterials.length} {filteredMaterials.length === 1 ? t('quizGenerator.material') : t('quizGenerator.materials')}
        </span>
      </div>

      {error && (
        <div className="error-box">
          <p>❌ {error}</p>
          <button className="btn btn-small" onClick={fetchMaterials}>{t('quizGenerator.tryAgain')}</button>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>{t('quizGenerator.loadingMaterials')}</p>
        </div>
      )}

      {!loading && filteredMaterials.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>{t('quizGenerator.noMaterialsYet')}</h2>
          <p>{searchTerm ? t('quizGenerator.noSearchResults') : t('quizGenerator.createMaterial')}</p>
        </div>
      )}

      {!loading && filteredMaterials.length > 0 && (
        <div className="materials-grid">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="material-card" onClick={() => handleSelectMaterial(material)}>
              <div className="card-header">
                <h3 className="card-title">{material.title}</h3>
              </div>
              <div className="card-body">
                <p className="card-preview">
                  {material.summary
                    ? material.summary.substring(0, 80) + '...'
                    : material.original_text.substring(0, 80) + '...'}
                </p>
              </div>
              <div className="card-footer">
                {material.summary && <span className="badge badge-summary">📝 Has Summary</span>}
                {material.quiz    && <span className="badge badge-quiz">🎯 Has Quiz</span>}
              </div>
              <div className="card-action"><span className="arrow">→</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
