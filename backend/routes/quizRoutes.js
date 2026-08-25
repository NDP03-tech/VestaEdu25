const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/QuizController");
const authenticateToken = require("../middleware/authenticateToken"); // ✅ import middleware
const authorizeRoles = require("../middleware/authorizeRoles");

// Định nghĩa các route cho quiz
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  QuizController.createQuiz,
); // ✅ bảo vệ route
router.get("/", QuizController.getQuizzes);
router.get("/category/:category", QuizController.getQuizzesByCategory);
router.get("/:id", QuizController.getQuizById);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  QuizController.updateQuiz,
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  QuizController.deleteQuiz,
);

module.exports = router;
