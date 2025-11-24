const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/QuizController');
const authenticateToken = require('../middleware/authenticateToken'); // ✅ import middleware

// Định nghĩa các route cho quiz
router.post('/', authenticateToken, QuizController.createQuiz); // ✅ bảo vệ route
router.get('/', QuizController.getQuizzes);
router.get('/category/:category', QuizController.getQuizzesByCategory);
router.get('/:id', QuizController.getQuizById);
router.put('/:id', QuizController.updateQuiz);
router.delete('/:id', QuizController.deleteQuiz);

module.exports = router;
