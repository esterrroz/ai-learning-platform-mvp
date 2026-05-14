import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ToastProvider } from './components/ToastProvider';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadNew from './components/UploadNew';
import QuizGenerator from './components/QuizGenerator';
import MyLibrary from './components/MyLibrary';
import Register from './components/Register';
import LearningHistory from './components/LearningHistory';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  // בדיקה אם המשתמש כבר מחובר (שמור ב-localStorage)
  const [user, setUser] = useState(() => {
    const id   = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    return id ? { id, name } : null;
  });

  // אם אין משתמש מחובר — הצג מסך הרשמה/התחברות
  if (!user) {
    return (
      <I18nextProvider i18n={i18n}>
        <ToastProvider>
          <Register onRegistered={setUser} />
        </ToastProvider>
      </I18nextProvider>
    );
  }

  // אפליקציה ראשית עם ניווט צדדי ונתיבים
  return (
    <I18nextProvider i18n={i18n}>
      <ToastProvider>
        <Router>
          <div className="App">
            <Sidebar userName={user.name} />
            <main className="app-main">
              <Routes>
                <Route path="/"          element={<UploadNew />} />
                <Route path="/upload"    element={<UploadNew />} />
                <Route path="/library"   element={<MyLibrary />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/quiz"      element={<QuizGenerator />} />
                <Route path="/history"   element={<LearningHistory />} />
                <Route path="/admin"     element={<AdminPanel />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </I18nextProvider>
  );
}

export default App;
