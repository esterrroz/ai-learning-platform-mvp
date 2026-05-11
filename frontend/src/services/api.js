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
