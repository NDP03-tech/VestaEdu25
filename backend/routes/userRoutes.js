const express = require("express");
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

// Endpoint đăng nhập
router.post("/login", userController.login);

// Endpoint đăng ký người dùng
router.post("/register", userController.register);

// Tạo tài khoản admin
router.post(
  "/create-admin",
  authenticateToken,
  authorizeRoles("admin"),
  userController.createAdmin,
);

// Các route khác (chỉ Admin)
router.get(
  "/users",
  authenticateToken,
  authorizeRoles("admin"),
  userController.getUsers,
);
router.post(
  "/users",
  authenticateToken,
  authorizeRoles("admin"),
  userController.addUser,
);
router.put(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"),
  userController.updateUser,
);
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"),
  userController.deleteUser,
);

router.post("/refresh", userController.refresh);
router.post("/logout", userController.logout);
router.get("/me", authenticateToken, userController.me);

// Lấy quiz cho người dùng cụ thể
router.get("/:userId/quizzes", userController.getQuizzesForUser);

module.exports = router;
