import { useState, useEffect } from 'react';
import { getMaterials, generateQuizFromSummary, generateQuizForMaterialById } from '../services/api';
import QuizTaking from './QuizTaking';
import '../styles/QuizGenerator.css';

export default function QuizGenerator() {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [takingQuiz, setTakingQuiz] = useState(false);

  // Fetch materials on component mount
  useEffect(() => {
    fetchMaterials();
    // Check for a quiz passed from the Dashboard via sessionStorage
    const pending = sessionStorage.getItem('pendingQuiz');
    const pendingTitle = sessionStorage.getItem('pendingQuizTitle');
    if (pending) {
      try {
        const questions = JSON.parse(pending);
        setQuiz(questions);
        setTakingQuiz(true);
        if (pendingTitle) {
          setSelectedMaterial({ title: pendingTitle, summary: null });
        }
      } catch (_) {}
      sessionStorage.removeItem('pendingQuiz');
      sessionStorage.removeItem('pendingQuizTitle');
    }
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

  const handleSelectMaterial = (material) => {
    setSelectedMaterial(material);
    setQuiz(null);
    setTakingQuiz(false);
  };

  const handleGenerateQuiz = async () => {
    if (!selectedMaterial?.summary) {
      setError('This material does not have a summary. Please create one first.');
      return;
    }

    setQuizLoading(true);
    setError('');
    setQuiz(null);
    setTakingQuiz(false);

    try {
      // Use the DB-persisted route if material has an id, otherwise fall back
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
      console.error('Error generating quiz:', err);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setTakingQuiz(true);
  };

  const handleBackToResults = () => {
    setTakingQuiz(false);
  };

  const handleBackToMaterials = () => {
    setSelectedMaterial(null);
    setQuiz(null);
    setTakingQuiz(false);
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show quiz taking interface
  if (takingQuiz && quiz) {
    return (
      <QuizTaking
        quiz={quiz}
        materialTitle={selectedMaterial?.title}
        onBack={handleBackToResults}
      />
    );
  }

  // Show selected material with quiz options
  if (selectedMaterial && !takingQuiz) {
    return (
      <div className="quiz-generator">
        <div className="quiz-header">
          <button className="btn btn-back" onClick={handleBackToMaterials}>
            ← Back to Materials
          </button>
          <h1>📚 {selectedMaterial.title}</h1>
        </div>

        {error && (
          <div className="error-box">
            <p>❌ {error}</p>
          </div>
        )}

        <div className="selected-material-container">
          {/* Material Summary */}
          <div className="material-summary-panel">
            <h2>📝 Summary</h2>
            {selectedMaterial.summary ? (
              <div className="summary-content">
                <p>{selectedMaterial.summary}</p>
              </div>
            ) : (
              <div className="placeholder">
                <p>No summary available for this material</p>
              </div>
            )}
          </div>

          {/* Quiz Generation Panel */}
          <div className="quiz-generation-panel">
            {!quiz ? (
              <div className="generate-section">
                <h2>🎯 Generate Quiz</h2>
                <p className="generate-description">
                  Generate 3 AI-powered multiple choice questions based on the summary
                </p>

                <button
                  className="btn btn-generate"
                  onClick={handleGenerateQuiz}
                  disabled={quizLoading || !selectedMaterial.summary}
                >
                  {quizLoading ? (
                    <>
                      <span className="spinner-small"></span>
                      Generating Questions...
                    </>
                  ) : (
                    '🤖 Generate AI Quiz'
                  )}
                </button>

                {!selectedMaterial.summary && (
                  <p className="warning-text">
                    ⚠️ This material needs a summary to generate a quiz
                  </p>
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

                {/* Quiz Preview */}
                <div className="quiz-preview">
                  <h3>Preview</h3>
                  {Array.isArray(quiz) &&
                    quiz.map((q, index) => (
                      <div key={index} className="preview-item">
                        <div className="preview-question">
                          Q{index + 1}. {q.question}
                        </div>
                        {q.difficulty && (
                          <span className={`difficulty difficulty-${q.difficulty.toLowerCase()}`}>
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                    ))}
                </div>

                <button
                  className="btn btn-start-quiz"
                  onClick={handleStartQuiz}
                >
                  ✅ Start Quiz
                </button>

                <button
                  className="btn btn-regenerate"
                  onClick={handleGenerateQuiz}
                  disabled={quizLoading}
                >
                  🔄 Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show materials list
  return (
    <div className="quiz-generator">
      <div className="quiz-header">
        <h1>🎯 Quiz Generator</h1>
        <p>Select a material to generate an AI-powered quiz</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="results-count">
          {filteredMaterials.length} material{filteredMaterials.length !== 1 ? 's' : ''}
        </span>
      </div>

      {error && (
        <div className="error-box">
          <p>❌ {error}</p>
          <button className="btn btn-small" onClick={fetchMaterials}>
            Try Again
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your materials...</p>
        </div>
      )}

      {!loading && filteredMaterials.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No materials yet</h2>
          <p>
            {searchTerm
              ? 'No materials match your search'
              : 'Create a material in "Upload New" to generate quizzes'}
          </p>
        </div>
      )}

      {!loading && filteredMaterials.length > 0 && (
        <div className="materials-grid">
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="material-card"
              onClick={() => handleSelectMaterial(material)}
            >
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
                {material.summary && (
                  <span className="badge badge-summary">📝 Has Summary</span>
                )}
                {material.quiz && <span className="badge badge-quiz">🎯 Has Quiz</span>}
              </div>

              <div className="card-action">
                <span className="arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
