import { useState } from 'react';
import Dashboard from './components/Dashboard';
import QuizGenerator from './components/QuizGenerator';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="App">
      <nav className="app-nav">
        <div className="nav-container">
          <h1 className="nav-logo">📚 AI Learning Platform</h1>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentPage('dashboard')}
              >
                📝 Summarizer
              </button>
            </li>
            <li>
              <button
                className={`nav-btn ${currentPage === 'quiz' ? 'active' : ''}`}
                onClick={() => setCurrentPage('quiz')}
              >
                🎓 Quiz Generator
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="app-main">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'quiz' && <QuizGenerator />}
      </main>
    </div>
  );
}

export default App;