import { useState, useEffect } from 'react';
import { generateQuiz, getCategories, getSubCategories } from '../services/api';
import '../styles/QuizGenerator.css';

export default function QuizGenerator() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [quiz, setQuiz] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubCategories = async () => {
        try {
          const data = await getSubCategories(selectedCategory);
          setSubCategories(data.subCategories || data);
          setSelectedSubCategory('');
        } catch (err) {
          console.error('Error fetching subcategories:', err);
          setError('Failed to load subcategories');
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  const handleGenerateQuiz = async () => {
    if (!selectedCategory || !selectedSubCategory) {
      setError('Please select both category and subcategory');
      return;
    }

    if (!customPrompt.trim()) {
      setError('Please enter a custom prompt/question');
      return;
    }

    setLoading(true);
    setError('');
    setQuiz('');

    try {
      const result = await generateQuiz(selectedCategory, selectedSubCategory, customPrompt);
      setQuiz(result.quiz || result);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setCustomPrompt('');
    setQuiz('');
    setError('');
  };

  return (
    <div className="quiz-generator">
      <div className="quiz-header">
        <h1>🎓 Quiz Generator</h1>
        <p>Select a category and create custom quiz questions</p>
      </div>

      <div className="quiz-container">
        <div className="quiz-input-section">
          <h2>Configure Your Quiz</h2>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="select-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subcategory">Subcategory</label>
            <select
              id="subcategory"
              className="select-input"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              disabled={!selectedCategory || loading}
            >
              <option value="">Select a subcategory...</option>
              {subCategories.map((subCat) => (
                <option key={subCat.id} value={subCat.id}>
                  {subCat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="prompt">Custom Question/Prompt</label>
            <textarea
              id="prompt"
              className="textarea"
              placeholder="e.g., 'Generate 5 multiple choice questions about React hooks'"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={loading}
              rows="4"
            />
          </div>

          <div className="button-group">
            <button
              className="btn btn-primary"
              onClick={handleGenerateQuiz}
              disabled={loading || !selectedCategory || !selectedSubCategory}
            >
              {loading ? 'Generating...' : '✨ Generate Quiz'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="quiz-output-section">
          <h2>Generated Quiz</h2>
          {error && (
            <div className="error-box">
              <p>❌ Error: {error}</p>
            </div>
          )}
          {quiz && (
            <div className="quiz-box">
              <p>{quiz}</p>
            </div>
          )}
          {!quiz && !error && (
            <div className="placeholder">
              <p>Your generated quiz will appear here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
