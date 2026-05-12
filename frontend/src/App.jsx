import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadNew from './components/UploadNew';
import QuizGenerator from './components/QuizGenerator';
import MyLibrary from './components/MyLibrary';
import Register from './components/Register';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const id   = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    return id ? { id, name } : null;
  });

  if (!user) {
    return <Register onRegistered={setUser} />;
  }

  return (
    <Router>
      <div className="App">
        <Sidebar userName={user.name} />
        <main className="app-main">
          <Routes>
            <Route path="/"         element={<UploadNew />} />
            <Route path="/upload"   element={<UploadNew />} />
            <Route path="/library"  element={<MyLibrary />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz"     element={<QuizGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
