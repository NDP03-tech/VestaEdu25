// routes/assignedQuizRoutes.js
const express = require('express');
const router = express.Router();
const  getAssignedQuizzes  = require('../controllers/assignedQuizController');
const  authenticateToken  = require('../middleware/authenticateToken');

router.get('/', authenticateToken, getAssignedQuizzes.getAssignedQuizzesForUser);

module.exports = router;
