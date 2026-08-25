// src/services/questionService.js
import apiClient from "./apiClient";

// Lấy tất cả Question
const getAllQuestions = async () => {
  try {
    const response = await apiClient.get("/api/questions");
    return response.data;
  } catch (error) {
    console.error("Error fetching all questions:", error);
    throw error;
  }
};

// Thêm vào cuối file questionService.js

const getQuestionsByQuizId = async (quizId) => {
  try {
    const response = await apiClient.get(`/api/questions/by-quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions by quiz ID:", error);
    throw error;
  }
};

// Lấy Question theo ID
const getQuestionById = async (id) => {
  try {
    const response = await apiClient.get(`/api/questions/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    throw error;
  }
};

// Tạo Question mới
const createQuestion = async (questionData) => {
  try {
    const response = await apiClient.post("/api/questions", questionData);
    return response.data;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

// Cập nhật Question
const updateQuestion = async (id, questionData) => {
  try {
    const response = await apiClient.put(`/api/questions/${id}`, questionData);
    return response.data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

// Xóa Question
const deleteQuestion = async (id) => {
  try {
    const response = await apiClient.delete(`/api/questions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting question:", error);
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
