import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { summarizeText, generateQuizFromSummary, saveMaterial, uploadPDF, getCategories, getSubCategories, generateLessonPrompt } from '../services/api';
import { useToast } from './ToastProvider';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('materials');
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [prompt, setPrompt] = useState('');
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lesson, setLesson] = useState('');
  const [showLessonSection, setShowLessonSection] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const showToast = useToast();
  const userId = localStorage.getItem('userId');

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch sub-categories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubCategories = async () => {
        try {
          const result = await getSubCategories(selectedCategory);
          setSubCategories(result.subCategories || []);
          setSelectedSubCategory(''); // Reset sub-category when category changes
        } catch (err) {
          console.error('Error fetching sub-categories:', err);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
      setSelectedSubCategory('');
    }
  }, [selectedCategory]);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError(t('dashboard.noTextToSummarize'));
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');
    setQuiz(null);

    try {
      const result = await summarizeText(inputText, userId, selectedCategory, selectedSubCategory);
      setSummary(result.summary || result);
    } catch (err) {
      const msg = err.toString();
      setError(msg);
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePDFUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type || !file.type.includes('pdf')) {
      setError(t('dashboard.invalidPDF'));
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError(t('dashboard.fileTooLarge'));
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');
    setQuiz(null);

    try {
      const result = await uploadPDF(file);
      setInputText(result.text);
      setSuccess(
        `✅ ${t('dashboard.pdfUploaded')} ${result.characterCount} ${t('dashboard.charactersFrom')} ${result.pageCount} ${t('dashboard.pages')}`
      );
      setTimeout(() => setSuccess(''), 3000);
      
      // Reset file input
      event.target.value = '';
    } catch (err) {
      const msg = err.toString();
      setError(msg);
      showToast(msg);
      event.target.value = '';
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!summary) {
      setError(t('dashboard.generateSummaryFirst'));
      return;
    }

    setQuizLoading(true);
    setError('');
    setQuiz(null);

    try {
      const result = await generateQuizFromSummary(summary);
      const questions = result.quiz || result;
      setQuiz(questions);
      // Store quiz in sessionStorage and navigate to Quiz Generator tab
      sessionStorage.setItem('pendingQuiz', JSON.stringify(questions));
      sessionStorage.setItem('pendingQuizTitle', inputText.substring(0, 60));
      navigate('/quiz');
    } catch (err) {
      const msg = err.toString();
      setError(msg);
      showToast(msg);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSaveMaterial = async () => {
    if (!inputText.trim() || !summary) {
      setError(t('dashboard.saveSummaryFirst'));
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const title = inputText.substring(0, 50) + (inputText.length > 50 ? '...' : '');
      const result = await saveMaterial(
        title,
        inputText,
        summary,
        quiz || null
      );
      
      setSuccess(`✅ ${t('dashboard.materialSaved')}`);
      // Reset after 2 seconds
      setTimeout(() => {
        handleClear();
        setSuccess('');
      }, 2000);
    } catch (err) {
      const msg = `${t('dashboard.failedToSave')} ` + err.toString();
      setError(msg);
      showToast(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSummary('');
    setQuiz(null);
    setError('');
  };

  const handleQuizClear = () => {
    setQuiz(null);
    setError('');
  };

  const handleGenerateLesson = async () => {
    if (!selectedCategory) {
      setError(t('lessonGenerator.selectCategoryError'));
      return;
    }
    if (!selectedSubCategory) {
      setError(t('lessonGenerator.selectSubCategoryError'));
      return;
    }
    if (!prompt.trim()) {
      setError(t('lessonGenerator.enterPromptError'));
      return;
    }

    setLessonLoading(true);
    setError('');
    setLesson('');

    try {
      // Find category and sub-category names
      const categoryName = categories.find(c => c.id === parseInt(selectedCategory))?.name || '';
      const subCategoryName = subCategories.find(sc => sc.id === parseInt(selectedSubCategory))?.name || '';

      const result = await generateLessonPrompt(categoryName, subCategoryName, prompt, userId, selectedCategory, selectedSubCategory);
      setLesson(result.lesson || result);
      setSuccess('✅ ' + t('common.success'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const msg = err.toString();
      setError(msg);
      showToast(msg);
    } finally {
      setLessonLoading(false);
    }
  };

  const handleClearLesson = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setPrompt('');
    setLesson('');
    setError('');
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>📚 Platform</h3>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => { setActiveTab('materials'); handleQuizClear(); }}
          >
            <span className="nav-icon">📝</span>
            My Materials
          </button>
          <button
            className={`nav-item ${activeTab === 'lesson' ? 'active' : ''}`}
            onClick={() => setActiveTab('lesson')}
          >
            <span className="nav-icon">🎓</span>
            Lesson Generator
          </button>
          <button
            className={`nav-item ${activeTab === 'study' ? 'active' : ''}`}
            onClick={() => setActiveTab('study')}
          >
            <span className="nav-icon">📚</span>
            Study Hub
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === 'materials' && (
          <div className="dashboard">
            <div className="dashboard-header">
              <h1>📚 {t('dashboard.aiLearningPlatform')}</h1>
              <p>{t('dashboard.pasteTextBelowDescription')}</p>
            </div>

            <div className="dashboard-container">
              <div className="input-section">
                <h2>{t('dashboard.inputText')}</h2>
                
                {/* Textarea */}
                <textarea
                  className="textarea"
                  placeholder={t('dashboard.textareaPlaceholder')}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows="8"
                  disabled={loading || quizLoading}
                />

                {/* PDF Upload Section */}
                <div className="pdf-upload-section">
                  <label htmlFor="pdf-input" className="pdf-upload-label">
                    <span className="pdf-icon">📄</span>
                    <span className="pdf-text">{t('dashboard.orUploadPDF')}</span>
                  </label>
                  <input
                    id="pdf-input"
                    type="file"
                    accept=".pdf"
                    onChange={handlePDFUpload}
                    disabled={loading || quizLoading}
                    className="pdf-input"
                  />
                  <span className="pdf-hint">{t('dashboard.maxFileSize')}</span>
                </div>

                {/* Buttons */}
                <div className="button-group">
                  <button
                    className="btn btn-primary"
                    onClick={handleSummarize}
                    disabled={loading || quizLoading}
                  >
                    {loading ? t('common.loading') : '✨ ' + t('dashboard.summarizeButton')}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleClear}
                    disabled={loading || quizLoading}
                  >
                    {t('dashboard.clearButton')}
                  </button>
                </div>
              </div>

              <div className="output-section">
                <h2>{t('dashboard.summary')}</h2>
                {error && (
                  <div className="error-box">
                    <p>❌ {t('common.error')}: {error}</p>
                  </div>
                )}
                {success && (
                  <div className="success-box">
                    <p>{success}</p>
                  </div>
                )}
                {summary && (
                  <div className="summary-box">
                    <p>{summary}</p>
                    <div className="summary-actions">
                      <button
                        className="btn btn-accent"
                        onClick={handleGenerateQuiz}
                        disabled={quizLoading || !summary}
                      >
                        {quizLoading ? t('common.loading') : '🎯 ' + t('dashboard.generateQuiz')}
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={handleSaveMaterial}
                        disabled={saving || !summary}
                      >
                        {saving ? t('common.loading') : '💾 ' + t('dashboard.saveMaterial')}
                      </button>
                    </div>
                  </div>
                )}
                {!summary && !error && (
                  <div className="placeholder">
                    <p>{t('dashboard.summaryPlaceholder')}</p>
                  </div>
                )}
              </div>
            </div>


          </div>
        )}

        {activeTab === 'lesson' && (
          <div className="lesson-generator">
            <div className="lesson-header">
              <h1>🎓 {t('lessonGenerator.lessonGenerator')}</h1>
              <p>{t('lessonGenerator.selectCategoryDescription')}</p>
            </div>

            <div className="lesson-container">
              <div className="lesson-input-section">
                <h2>{t('lessonGenerator.customizeYourLesson')}</h2>

                {/* Category Selection */}
                <div className="form-group">
                  <label htmlFor="category-select">{t('lessonGenerator.category')} *</label>
                  <select
                    id="category-select"
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={lessonLoading}
                  >
                    <option value="">{t('lessonGenerator.selectCategory')}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-Category Selection */}
                <div className="form-group">
                  <label htmlFor="subcategory-select">{t('lessonGenerator.subCategory')} *</label>
                  <select
                    id="subcategory-select"
                    className="form-select"
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    disabled={!selectedCategory || lessonLoading}
                  >
                    <option value="">{t('lessonGenerator.selectSubCategory')}</option>
                    {subCategories.map((subCat) => (
                      <option key={subCat.id} value={subCat.id}>
                        {subCat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prompt Input */}
                <div className="form-group">
                  <label htmlFor="lesson-prompt">{t('lessonGenerator.topicPrompt')} *</label>
                  <textarea
                    id="lesson-prompt"
                    className="textarea"
                    placeholder={t('lessonGenerator.topicPromptPlaceholder')}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows="6"
                    disabled={lessonLoading}
                  />
                  <span className="char-count">{prompt.length}/2000 {t('lessonGenerator.characters')}</span>
                </div>

                {/* Buttons */}
                <div className="button-group">
                  <button
                    className="btn btn-primary"
                    onClick={handleGenerateLesson}
                    disabled={lessonLoading || !selectedCategory || !selectedSubCategory}
                  >
                    {lessonLoading ? t('lessonGenerator.generatingLesson') : '✨ ' + t('lessonGenerator.generateLesson')}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleClearLesson}
                    disabled={lessonLoading}
                  >
                    {t('dashboard.clearButton')}
                  </button>
                </div>
              </div>

              <div className="lesson-output-section">
                <h2>{t('lessonGenerator.yourLesson')}</h2>
                {error && (
                  <div className="error-box">
                    <p>❌ {t('common.error')}: {error}</p>
                  </div>
                )}
                {success && (
                  <div className="success-box">
                    <p>{success}</p>
                  </div>
                )}
                {lesson && (
                  <div className="lesson-box">
                    <div className="lesson-metadata">
                      <span className="badge">{categories.find(c => c.id === parseInt(selectedCategory))?.name}</span>
                      <span className="badge">{subCategories.find(sc => sc.id === parseInt(selectedSubCategory))?.name}</span>
                    </div>
                    <div className="lesson-content">
                      {lesson.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
                {!lesson && !error && (
                  <div className="placeholder">
                    <p>{t('lessonGenerator.lessonPlaceholder')}</p>
                    <p>{t('lessonGenerator.fillAllFields')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'study' && (
          <div className="study-page">
            <div className="study-header">
              <h1>🎓 {t('studyHub.studyHub')}</h1>
              <p>{t('studyHub.reviewMaterialsDescription')}</p>
            </div>
            <div className="study-content">
              <div className="study-placeholder">
                <p>{t('studyHub.studyFeaturesComingSoon')}</p>
                <p>{t('studyHub.manageYourMaterials')}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
