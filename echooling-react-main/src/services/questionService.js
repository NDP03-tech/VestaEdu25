// src/services/questionService.js
import axios from 'axios';

const API_URL = '/api'; // Địa chỉ API của bạn

// Lấy tất cả Question
const getAllQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/questions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all questions:', error);
    throw error;
  }
};

// Thêm vào cuối file questionService.js

const getQuestionsByQuizId = async (quizId) => {
  try {
    const response = await axios.get(`${API_URL}/questions?quiz_id=${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions by quiz ID:', error);
    throw error;
  }
};


// Lấy Question theo ID
const getQuestionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/questions/${id}`);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    throw error;
  }
};

// Tạo Question mới
const createQuestion = async (questionData) => {
  try {
    const response = await axios.post(`${API_URL}/questions`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

// Cập nhật Question
const updateQuestion = async (id, questionData) => {
  try {
    const response = await axios.put(`${API_URL}/questions/${id}`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

// Xóa Question
const deleteQuestion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/questions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

export default {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByQuizId,
};
