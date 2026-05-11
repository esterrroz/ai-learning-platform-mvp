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
