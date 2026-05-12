import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/QuizTaking.css';

export default function QuizTaking({ quiz, materialTitle, onBack }) {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(quiz.length).fill(null));
  const [showScore, setShowScore] = useState(false);

  const handleAnswerClick = (answerIndex) => {
    if (showScore) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    if (currentQuestion < quiz.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleFinish = () => setShowScore(true);

  const calculateScore = () =>
    quiz.reduce((acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0), 0);

  const getScorePercentage = () => Math.round((calculateScore() / quiz.length) * 100);

  const getScoreFeedback = (pct) => {
    if (pct === 100) return '🏆 Perfect Score!';
    if (pct >= 80)  return '⭐ Excellent!';
    if (pct >= 60)  return '👍 Good Job!';
    if (pct >= 40)  return '💪 Keep Practicing!';
    return '📚 Study More!';
  };

  const currentQ = quiz[currentQuestion];
  const isAnswered = answers[currentQuestion] !== null;
  const isCorrect  = isAnswered && answers[currentQuestion] === currentQ.correctAnswer;

  if (showScore) {
    const score      = calculateScore();
    const percentage = getScorePercentage();

    return (
      <div className="quiz-taking">
        <div className="quiz-header">
          <button className="btn btn-back" onClick={onBack}>
            {t('quizTaking.backToQuiz')}
          </button>
        </div>

        <div className="score-container">
          <div className="score-card">
            <div className="score-icon">📊</div>
            <h1>{t('quizTaking.quizComplete')}</h1>

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
                <span className="breakdown-label">{t('quizTaking.correct')}</span>
                <span className="breakdown-value correct">{score}/{quiz.length}</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">{t('quizTaking.accuracy')}</span>
                <span className="breakdown-value">{percentage}%</span>
              </div>
            </div>

            <div className="results-table">
              <h2>{t('quizTaking.resultsSummary')}</h2>
              <div className="table-container">
                {quiz.map((q, index) => {
                  const ok = answers[index] === q.correctAnswer;
                  return (
                    <div key={index} className="result-item">
                      <div className="result-header">
                        <span className="result-number">Q{index + 1}</span>
                        <span className={`result-status ${ok ? 'correct' : 'incorrect'}`}>
                          {ok ? t('quizTaking.correctStatus') : t('quizTaking.incorrectStatus')}
                        </span>
                      </div>
                      <div className="result-question">{q.question}</div>
                      <div className="result-answer">
                        <span className="label">{t('quizTaking.yourAnswer')}</span>
                        <span>{q.options[answers[index]] || t('quizTaking.notAnswered')}</span>
                      </div>
                      {!ok && (
                        <div className="result-correct">
                          <span className="label">{t('quizTaking.correctAnswer')}</span>
                          <span>{q.options[q.correctAnswer]}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="btn btn-back-home" onClick={onBack}>
              {t('quizTaking.backToSelection')}
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
          <p>{t('quizTaking.question')} {currentQuestion + 1} {t('quizTaking.of')} {quiz.length}</p>
        </div>
        <button className="btn btn-back" onClick={onBack}>
          {t('quizTaking.exitQuiz')}
        </button>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
          />
        </div>
        <span className="progress-text">{currentQuestion + 1} / {quiz.length}</span>
      </div>

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

          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${answers[currentQuestion] === index ? 'selected' : ''} ${
                  showScore && index === currentQ.correctAnswer ? 'correct' : ''
                } ${
                  showScore && answers[currentQuestion] === index && index !== currentQ.correctAnswer
                    ? 'incorrect'
                    : ''
                }`}
                onClick={() => handleAnswerClick(index)}
                disabled={showScore}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {answers[currentQuestion] === index && (
                  <span className="option-indicator">
                    {index === currentQ.correctAnswer ? '✓' : '○'}
                  </span>
                )}
              </button>
            ))}
          </div>

          {isAnswered && (
            <div className={`question-status ${isCorrect ? 'correct' : 'incorrect'}`}>
              <p>{isCorrect ? t('quizTaking.correctFeedback') : t('quizTaking.incorrectFeedback')}</p>
            </div>
          )}

          {!isAnswered && (
            <div className="question-status unanswered">
              <p>{t('quizTaking.selectAnswer')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="navigation-section">
        <button className="btn btn-nav" onClick={handlePrev} disabled={currentQuestion === 0}>
          {t('quizTaking.previous')}
        </button>

        <div className="question-indicators">
          {quiz.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentQuestion ? 'active' : ''} ${
                answers[index] !== null ? 'answered' : ''
              }`}
              onClick={() => setCurrentQuestion(index)}
              title={`${t('quizTaking.question')} ${index + 1}`}
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
            {t('quizTaking.finish')}
          </button>
        ) : (
          <button
            className="btn btn-nav"
            onClick={handleNext}
            disabled={currentQuestion === quiz.length - 1}
          >
            {t('quizTaking.next')}
          </button>
        )}
      </div>

      <div className="answer-summary">
        <h3>{t('quizTaking.progress')}</h3>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-icon">✓</span>
            <span className="stat-text">
              {answers.filter((a) => a !== null).length} {t('quizTaking.answered')}
            </span>
          </div>
          <div className="stat">
            <span className="stat-icon">○</span>
            <span className="stat-text">
              {answers.filter((a) => a === null).length} {t('quizTaking.remaining')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
