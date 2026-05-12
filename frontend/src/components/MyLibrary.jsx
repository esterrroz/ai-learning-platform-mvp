import { useState, useEffect } from 'react';
import { getMaterials, deleteMaterial } from '../services/api';
import QuizTaking from './QuizTaking';
import '../styles/MyLibrary.css';

export default function MyLibrary() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [takingQuiz, setTakingQuiz] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMaterials();
      setMaterials(data.materials || []);
    } catch (err) {
      setError(err.toString());
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      await deleteMaterial(id);
      setMaterials(materials.filter((m) => m.id !== id));
      setSelectedMaterial(null);
    } catch (err) {
      setError(err.toString());
    }
  };

  const handleStartQuiz = () => {
    if (selectedMaterial && selectedMaterial.quiz) {
      setTakingQuiz(true);
    }
  };

  const handleExitQuiz = () => {
    setTakingQuiz(false);
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.original_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // If in quiz taking mode, show the interactive quiz
  if (takingQuiz && selectedMaterial && selectedMaterial.quiz) {
    return (
      <QuizTaking
        quiz={selectedMaterial.quiz}
        materialTitle={selectedMaterial.title}
        onBack={handleExitQuiz}
      />
    );
  }

  return (
    <div className="my-library">
      {/* Header */}
      <div className="library-header">
        <div className="header-content">
          <h1>📚 My Library</h1>
          <p>Your saved materials, summaries, and quizzes</p>
        </div>
        <button className="btn btn-refresh" onClick={fetchMaterials} disabled={loading}>
          {loading ? '⟳ Refreshing...' : '⟳ Refresh'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search materials by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="results-count">
          {filteredMaterials.length} result{filteredMaterials.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-box">
          <p>❌ Error: {error}</p>
          <button className="btn btn-small" onClick={fetchMaterials}>
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your materials...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMaterials.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No materials yet</h2>
          <p>
            {searchTerm
              ? 'No materials match your search. Try a different search term.'
              : 'Start by summarizing some text in the Dashboard to create your first material!'}
          </p>
        </div>
      )}

      {/* Materials Grid */}
      {!loading && filteredMaterials.length > 0 && (
        <div className="materials-container">
          {/* Materials List */}
          <div className="materials-grid">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className={`material-card ${
                  selectedMaterial?.id === material.id ? 'active' : ''
                }`}
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
                    {material.quiz && <span className="tag tag-quiz">🎯 Quiz</span>}
                  </div>
                  <button
                    className="btn btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(material.id);
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selectedMaterial && (
            <div className="detail-panel">
              <div className="detail-header">
                <h2>{selectedMaterial.title}</h2>
                <button
                  className="btn btn-close"
                  onClick={() => setSelectedMaterial(null)}
                >
                  ✕
                </button>
              </div>

              <div className="detail-content">
                {/* Original Text */}
                <div className="detail-section">
                  <h3>📄 Original Text</h3>
                  <div className="text-box">
                    <p>{selectedMaterial.original_text}</p>
                  </div>
                </div>

                {/* Summary */}
                {selectedMaterial.summary && (
                  <div className="detail-section">
                    <h3>✨ Summary</h3>
                    <div className="text-box">
                      <p>{selectedMaterial.summary}</p>
                    </div>
                  </div>
                )}

                {/* Quiz */}
                {selectedMaterial.quiz && (
                  <div className="detail-section">
                    <div className="quiz-header-with-button">
                      <h3>🎯 Quiz</h3>
                      <button
                        className="btn btn-primary btn-study-quiz"
                        onClick={handleStartQuiz}
                      >
                        ▶ Study This Quiz
                      </button>
                    </div>
                    <div className="quiz-display">
                      {Array.isArray(selectedMaterial.quiz) &&
                        selectedMaterial.quiz.map((q, index) => (
                          <div key={index} className="quiz-item">
                            <div className="quiz-question">
                              <span className="question-number">Q{index + 1}.</span>
                              <span>{q.question}</span>
                              {q.difficulty && (
                                <span
                                  className={`difficulty difficulty-${q.difficulty.toLowerCase()}`}
                                >
                                  {q.difficulty}
                                </span>
                              )}
                            </div>
                            <div className="quiz-options">
                              {q.options &&
                                q.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`quiz-option ${
                                      optIndex === q.correctAnswer
                                        ? 'correct-answer'
                                        : ''
                                    }`}
                                  >
                                    <span className="option-letter">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    <span>{option}</span>
                                    {optIndex === q.correctAnswer && (
                                      <span className="correct-badge">✓</span>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
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
