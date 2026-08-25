const express = require("express");
const router = express.Router();
const {
  registerCourse,
  getAllRegistrations,
} = require("../controllers/courseRegistrationController.js");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// POST: Người dùng đăng ký
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "teacher", "student"),
  registerCourse,
);

// GET: Admin lấy danh sách đăng ký
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  getAllRegistrations,
);

module.exports = router;
