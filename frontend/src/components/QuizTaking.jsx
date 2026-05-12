import { useState } from 'react';
import '../styles/QuizTaking.css';

export default function QuizTaking({ quiz, materialTitle, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(quiz.length).fill(null));
  const [showScore, setShowScore] = useState(false);

  const handleAnswerClick = (answerIndex) => {
    if (showScore) return; // Disable clicking after quiz is finished

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    // Auto-advance to next question
    if (currentQuestion < quiz.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    setShowScore(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getScorePercentage = () => {
    const score = calculateScore();
    return Math.round((score / quiz.length) * 100);
  };

  const getScoreFeedback = (percentage) => {
    if (percentage === 100) return '🏆 Perfect Score!';
    if (percentage >= 80) return '⭐ Excellent!';
    if (percentage >= 60) return '👍 Good Job!';
    if (percentage >= 40) return '💪 Keep Practicing!';
    return '📚 Study More!';
  };

  const currentQ = quiz[currentQuestion];
  const isAnswered = answers[currentQuestion] !== null;
  const isCorrect = isAnswered && answers[currentQuestion] === currentQ.correctAnswer;

  if (showScore) {
    const score = calculateScore();
    const percentage = getScorePercentage();

    return (
      <div className="quiz-taking">
        <div className="quiz-header">
          <button className="btn btn-back" onClick={onBack}>
            ← Back to Quiz
          </button>
        </div>

        <div className="score-container">
          <div className="score-card">
            <div className="score-icon">📊</div>
            <h1>Quiz Complete!</h1>

            <div className="score-display">
              <div className="score-circle">
                <div className="score-percentage">{percentage}%</div>
              </div>
            </div>

            <div className="score-feedback">
              <p className="feedback-text">{getScoreFeedback(percentage)}</p>
            </div>

            <div className="score-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Correct:</span>
                <span className="breakdown-value correct">{score}/{quiz.length}</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Accuracy:</span>
                <span className="breakdown-value">{percentage}%</span>
              </div>
            </div>

            {/* Results Table */}
            <div className="results-table">
              <h2>Results Summary</h2>
              <div className="table-container">
                {quiz.map((q, index) => {
                  const isQuestionCorrect = answers[index] === q.correctAnswer;
                  return (
                    <div key={index} className="result-item">
                      <div className="result-header">
                        <span className="result-number">Q{index + 1}</span>
                        <span className={`result-status ${isQuestionCorrect ? 'correct' : 'incorrect'}`}>
                          {isQuestionCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                      <div className="result-question">{q.question}</div>
                      <div className="result-answer">
                        <span className="label">Your answer:</span>
                        <span>{q.options[answers[index]] || 'Not answered'}</span>
                      </div>
                      {!isQuestionCorrect && (
                        <div className="result-correct">
                          <span className="label">Correct answer:</span>
                          <span>{q.options[q.correctAnswer]}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="btn btn-back-home" onClick={onBack}>
              ← Back to Quiz Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-taking">
      <div className="quiz-header">
        <div className="header-info">
          <h1>📚 {materialTitle}</h1>
          <p>Question {currentQuestion + 1} of {quiz.length}</p>
        </div>
        <button className="btn btn-back" onClick={onBack}>
          ← Exit Quiz
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
          ></div>
        </div>
        <span className="progress-text">
          {currentQuestion + 1} / {quiz.length}
        </span>
      </div>

      {/* Question */}
      <div className="question-container">
        <div className="question-card">
          <div className="question-header">
            <h2>Q{currentQuestion + 1}. {currentQ.question}</h2>
            {currentQ.difficulty && (
              <span className={`difficulty difficulty-${currentQ.difficulty.toLowerCase()}`}>
                {currentQ.difficulty}
              </span>
            )}
          </div>

          {/* Options */}
          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  answers[currentQuestion] === index ? 'selected' : ''
                } ${
                  showScore && index === currentQ.correctAnswer ? 'correct' : ''
                } ${
                  showScore &&
                  answers[currentQuestion] === index &&
                  index !== currentQ.correctAnswer
                    ? 'incorrect'
                    : ''
                }`}
                onClick={() => handleAnswerClick(index)}
                disabled={showScore}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {answers[currentQuestion] === index && (
                  <span className="option-indicator">
                    {index === currentQ.correctAnswer ? '✓' : '○'}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Question Status */}
          {isAnswered && (
            <div className={`question-status ${isCorrect ? 'correct' : 'incorrect'}`}>
              <p>
                {isCorrect ? '✓ Correct Answer!' : '✗ That\'s not correct. The right answer is above.'}
              </p>
            </div>
          )}

          {!isAnswered && (
            <div className="question-status unanswered">
              <p>Please select an answer to continue</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation-section">
        <button
          className="btn btn-nav"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          ← Previous
        </button>

        <div className="question-indicators">
          {quiz.map((_, index) => (
            <button
              key={index}
              className={`indicator ${
                index === currentQuestion ? 'active' : ''
              } ${answers[index] !== null ? 'answered' : ''}`}
              onClick={() => setCurrentQuestion(index)}
              title={`Question ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quiz.length - 1 ? (
          <button
            className="btn btn-finish"
            onClick={handleFinish}
            disabled={answers.some((a) => a === null)}
          >
            Finish → 
          </button>
        ) : (
          <button
            className="btn btn-nav"
            onClick={handleNext}
            disabled={currentQuestion === quiz.length - 1}
          >
            Next →
          </button>
        )}
      </div>

      {/* Answer Summary on the Side */}
      <div className="answer-summary">
        <h3>Progress</h3>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-icon">✓</span>
            <span className="stat-text">
              {answers.filter((a) => a !== null).length} answered
            </span>
          </div>
          <div className="stat">
            <span className="stat-icon">○</span>
            <span className="stat-text">
              {answers.filter((a) => a === null).length} remaining
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
