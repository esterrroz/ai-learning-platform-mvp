import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadNew from './components/UploadNew';
import QuizGenerator from './components/QuizGenerator';
import MyLibrary from './components/MyLibrary';
import './App.css';

function App() {
  return (
    <Router>
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
  );
}

export default App;