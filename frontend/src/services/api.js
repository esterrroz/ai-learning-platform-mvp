import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const summarizeText = async (text) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials/summarize`, {
      text,
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

export const generateQuiz = async (category, subCategory, prompt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials/generateQuiz`, {
      category,
      subCategory,
      prompt,
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

export const saveMaterial = async (title, original_text, summary, quiz) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials`, {
      title,
      original_text,
      summary,
      quiz,
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
