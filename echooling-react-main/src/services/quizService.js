import axios from 'axios';

const API_URL = '/api'; // URL của API (thay đổi theo đúng địa chỉ của bạn)

const getQuizzes = async () => {
  try {
    const response = await axios.get(`${API_URL}/quizzes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${API_URL}/quizzes`, quizData);  // quizData sẽ bao gồm tất cả dữ liệu quiz
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

const updateQuiz = async (id, quizData) => {
  try {
    const response = await axios.put(`${API_URL}/quizzes/${id}`, quizData);  // quizData sẽ bao gồm tất cả dữ liệu quiz
    return response.data;
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

const deleteQuiz = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/quizzes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};

const getQuizById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

export default {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizById
};
