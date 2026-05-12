import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadNew from './components/UploadNew';
import QuizGenerator from './components/QuizGenerator';
import MyLibrary from './components/MyLibrary';
import LanguageSwitcher from './components/LanguageSwitcher';
import './App.css';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <LanguageSwitcher />
        <div className="App">
          <Sidebar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<UploadNew />} />
              <Route path="/upload" element={<UploadNew />} />
              <Route path="/library" element={<MyLibrary />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quiz" element={<QuizGenerator />} />
            </Routes>
          </main>
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;