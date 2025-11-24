const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Endpoint đăng nhập
router.post('/login', userController.login);

// Endpoint đăng ký người dùng
router.post('/register', userController.register);

// Tạo tài khoản admin
router.post('/create-admin', userController.createAdmin);

// Các route khác (chỉ Admin)
router.get('/users', authenticateToken, userController.getUsers);
router.post('/users', authenticateToken, userController.addUser);
router.put('/users/:id', authenticateToken, userController.updateUser);
router.delete('/users/:id', authenticateToken, userController.deleteUser);

// Lấy quiz cho người dùng cụ thể
router.get('/:userId/quizzes', userController.getQuizzesForUser);

module.exports = router;
