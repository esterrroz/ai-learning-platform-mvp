import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const registerUser = async (name, phone) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, { name, phone });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getPrompts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/prompts`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const uploadPDF = async (file) => {
  try {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await axios.post(`${API_BASE_URL}/materials/extract-pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const summarizeText = async (text, userId, categoryId, subCategoryId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials/summarize`, {
      text,
      userId,
      categoryId,
      subCategoryId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const generateQuizFromSummary = async (summary) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials/generate-quiz`, {
      summary,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const generateQuizForMaterial = async (materialId, summary) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials/${materialId}/quiz`, {
      summary,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const generateQuizForMaterialById = async (materialId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials/${materialId}/generate-quiz`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const generateQuiz = async (category, subCategory, prompt, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials/generateQuiz`, {
      category,
      subCategory,
      prompt,
      userId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const generateLessonPrompt = async (category, subCategory, prompt, userId, categoryId, subCategoryId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials/generateLesson`, {
      category,
      subCategory,
      prompt,
      userId,
      categoryId,
      subCategoryId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getSubCategories = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/subcategories`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getMaterials = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/materials`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getMaterial = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/materials/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const saveMaterial = async (title, original_text, summary, quiz, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials`, {
      title,
      original_text,
      summary,
      quiz,
      userId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const deleteMaterial = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/materials/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
