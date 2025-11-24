const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/CourseController');
const multer = require('multer');
const authenticateToken = require('../middleware/authenticateToken');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route để tạo khóa học (kèm upload ảnh)
router.post('/create', authenticateToken, upload.single('image'), CourseController.createCourse);

// Route để lấy tất cả khóa học
router.get('/', CourseController.getAllCourses);

// Route để cập nhật khóa học (kèm upload ảnh)
router.put('/:id', authenticateToken, upload.single('image'), CourseController.updateCourse);

// Route để xóa khóa học
router.delete('/:id', authenticateToken, CourseController.deleteCourse);

// Route để lấy chi tiết khóa học theo ID
router.get('/:id', CourseController.getCourseById);

module.exports = router;