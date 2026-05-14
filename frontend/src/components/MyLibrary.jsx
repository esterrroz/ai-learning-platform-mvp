import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMaterials, deleteMaterial } from '../services/api';
import QuizTaking from './QuizTaking';
import '../styles/MyLibrary.css';

// ספריית חומרי לימוד — צפייה, חיפוש, מחיקה ולקיחת חידון
export default function MyLibrary() {
  const { t } = useTranslation();
  const [materials, setMaterials]               = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm]             = useState('');
  const [takingQuiz, setTakingQuiz]             = useState(false);

  useEffect(() => { fetchMaterials(); }, []);

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

  // מחיקת חומר עם אישור
  const handleDelete = async (id) => {
    if (!window.confirm(t('myLibrary.deleteConfirm'))) return;
    try {
      await deleteMaterial(id);
      setMaterials(materials.filter((m) => m.id !== id));
      setSelectedMaterial(null);
    } catch (err) {
      setError(err.toString());
    }
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.original_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  // מצב לקיחת חידון
  if (takingQuiz && selectedMaterial?.quiz) {
    return (
      <QuizTaking
        quiz={selectedMaterial.quiz}
        materialTitle={selectedMaterial.title}
        onBack={() => setTakingQuiz(false)}
      />
    );
  }

  return (
    <div className="my-library">
      <div className="library-header">
        <div className="header-content">
          <h1>📚 {t('myLibrary.myLibrary')}</h1>
          <p>{t('myLibrary.viewYourMaterials')}</p>
        </div>
        <button className="btn btn-refresh" onClick={fetchMaterials} disabled={loading}>
          {loading ? t('myLibrary.refreshing') : t('myLibrary.refresh')}
        </button>
      </div>

      {/* חיפוש */}
      <div className="search-section">
        <input type="text" className="search-input"
          placeholder={t('myLibrary.searchPlaceholder')}
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <span className="results-count">
          {filteredMaterials.length} {filteredMaterials.length === 1 ? t('myLibrary.result') : t('myLibrary.results')}
        </span>
      </div>

      {error && (
        <div className="error-box">
          <p>❌ Error: {error}</p>
          <button className="btn btn-small" onClick={fetchMaterials}>{t('myLibrary.tryAgain')}</button>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>{t('myLibrary.loadingMaterials')}</p>
        </div>
      )}

      {!loading && filteredMaterials.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>{t('myLibrary.noMaterialsYet')}</h2>
          <p>{searchTerm ? t('myLibrary.noSearchResults') : t('myLibrary.startBySummarizing')}</p>
        </div>
      )}

      {!loading && filteredMaterials.length > 0 && (
        <div className="materials-container">
          {/* רשת כרטיסי חומרים */}
          <div className="materials-grid">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className={`material-card ${selectedMaterial?.id === material.id ? 'active' : ''}`}
                onClick={() => setSelectedMaterial(material)}
              >
                <div className="card-header">
                  <h3 className="card-title">{material.title}</h3>
                  <span className="card-date">{formatDate(material.created_at)}</span>
                </div>
                <div className="card-body">
                  <p className="card-preview">
                    {material.original_text.substring(0, 100)}
                    {material.original_text.length > 100 ? '...' : ''}
                  </p>
                </div>
                <div className="card-footer">
                  <div className="card-tags">
                    {material.summary && <span className="tag tag-summary">📝 Summary</span>}
                    {material.quiz    && <span className="tag tag-quiz">🎯 Quiz</span>}
                  </div>
                  <button className="btn btn-delete"
                    onClick={(e) => { e.stopPropagation(); handleDelete(material.id); }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* פאנל פרטים */}
          {selectedMaterial && (
            <div className="detail-panel">
              <div className="detail-header">
                <h2>{selectedMaterial.title}</h2>
                <button className="btn btn-close" onClick={() => setSelectedMaterial(null)}>✕</button>
              </div>

              <div className="detail-content">
                {/* טקסט מקורי */}
                <div className="detail-section">
                  <h3>📄 Original Text</h3>
                  <div className="text-box"><p>{selectedMaterial.original_text}</p></div>
                </div>

                {/* סיכום */}
                {selectedMaterial.summary && (
                  <div className="detail-section">
                    <h3>✨ Summary</h3>
                    <div className="text-box"><p>{selectedMaterial.summary}</p></div>
                  </div>
                )}

                {/* חידון */}
                {selectedMaterial.quiz && (
                  <div className="detail-section">
                    <div className="quiz-header-with-button">
                      <h3>🎯 Quiz</h3>
                      <button className="btn btn-primary btn-study-quiz"
                        onClick={() => setTakingQuiz(true)}>
                        ▶ Study This Quiz
                      </button>
                    </div>
                    <div className="quiz-display">
                      {Array.isArray(selectedMaterial.quiz) && selectedMaterial.quiz.map((q, index) => (
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
                                {optIndex === q.correctAnswer && <span className="correct-badge">✓</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* מטא-דאטה */}
                <div className="detail-section detail-meta">
                  <h3>ℹ️ Information</h3>
                  <div className="meta-grid">
                    <div className="meta-item">
                      <label>Created:</label>
                      <span>{formatDate(selectedMaterial.created_at)}</span>
                    </div>
                    <div className="meta-item">
                      <label>Last Updated:</label>
                      <span>{formatDate(selectedMaterial.updated_at)}</span>
                    </div>
                    <div className="meta-item">
                      <label>Text Length:</label>
                      <span>{selectedMaterial.original_text.length} characters</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
