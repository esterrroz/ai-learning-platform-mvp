import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// מצרף JWT לכל בקשה אם קיים ב-localStorage
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// יציאה אוטומטית בעת קבלת 401 (טוקן פג תוקף או לא תקין)
axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

// התחברות — מחזיר JWT ופרטי משתמש
export const loginUser = async (name, phone) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { name, phone });
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    return user;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// רישום משתמש חדש (ללא JWT)
export const registerUser = async (name, phone) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, { name, phone });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// קבלת היסטוריית פרומפטים של משתמש ספציפי
export const getUserPrompts = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/prompts`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// קבלת כל הפרומפטים (לפאנל ניהול)
export const getPrompts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/prompts`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// קבלת כל המשתמשים (לפאנל ניהול)
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// סיכום טקסט באמצעות AI
export const summarizeText = async (text, userId, categoryId, subCategoryId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials/summarize`, {
      text, userId, categoryId, subCategoryId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// יצירת חידון מסיכום טקסט
export const generateQuizFromSummary = async (summary) => {
  try {
    const lang = localStorage.getItem('app-language') || 'he';
    const response = await axios.post(`${API_BASE_URL}/materials/generate-quiz`, { summary, lang });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// יצירת חידון לחומר שמור (עדכון שדה quiz בטבלת materials)
export const generateQuizForMaterial = async (materialId, summary) => {
  try {
    const lang = localStorage.getItem('app-language') || 'he';
    const response = await axios.post(`${API_BASE_URL}/materials/${materialId}/quiz`, { summary, lang });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// יצירת חידון לחומר שמור ושמירה בטבלת quizzes
export const generateQuizForMaterialById = async (materialId) => {
  try {
    const lang = localStorage.getItem('app-language') || 'he';
    const response = await axios.post(`${API_BASE_URL}/materials/${materialId}/generate-quiz`, { lang });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// יצירת חידון מפרומפט חופשי
export const generateQuiz = async (category, subCategory, prompt, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials/generateQuiz`, {
      category, subCategory, prompt, userId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// יצירת שיעור מפרומפט חופשי
export const generateLessonPrompt = async (category, subCategory, prompt, userId, categoryId, subCategoryId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials/generateLesson`, {
      category, subCategory, prompt, userId, categoryId, subCategoryId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// קבלת כל הקטגוריות
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// קבלת תת-קטגוריות לפי קטגוריה
export const getSubCategories = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/subcategories`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// קבלת כל חומרי הלימוד
export const getMaterials = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/materials`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// קבלת חומר לימוד בודד לפי ID
export const getMaterial = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/materials/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// שמירת חומר לימוד חדש
export const saveMaterial = async (title, original_text, summary, quiz, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials`, {
      title, original_text, summary, quiz, userId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// מחיקת חומר לימוד לפי ID
export const deleteMaterial = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/materials/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
