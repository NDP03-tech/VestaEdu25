const express = require('express');
const router = express.Router();
const EventController = require ('../controllers/EventController');
const multer = require('multer');
const authenticateToken = require('../middleware/authenticateToken'); // Middleware xác thực người dùng

const storage = multer.memoryStorage(); // Sử dụng bộ nhớ để lưu trữ file tạm thời
const upload = multer({ storage }); // Khởi tạo multer với cấu hình lưu trữ

// Route để tạo sự kiện (kèm upload ảnh chính)
router.post('/create', authenticateToken, upload.single('image'), EventController.createEvent);

// Route để lấy tất cả sự kiện
router.get('/', EventController.getAllEvents);

// Route để cập nhật sự kiện (kèm upload ảnh mới nếu cần)
router.put('/:id', authenticateToken, EventController.updateEvent);

// Route để xóa sự kiện
router.delete('/:id', authenticateToken, EventController.deleteEvent);

// Route để lấy chi tiết sự kiện theo ID
router.get('/:id', EventController.getEventById);

module.exports = router;