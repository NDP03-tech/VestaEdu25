// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const questionController = require("../controllers/QuestionController.js");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

router.use(authenticateToken);
router.use(authorizeRoles("admin", "teacher"));

// Đúng chuẩn RESTful theo prefix `/api/questions`
router.post("/", questionController.createQuestion);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);
router.get("/by-quiz/:quizId", questionController.getQuestionsByQuizId); // ⬅ Đặt trước
router.get("/:id", questionController.getQuestionById);
router.get("/", questionController.getAllQuestions);

module.exports = router;
