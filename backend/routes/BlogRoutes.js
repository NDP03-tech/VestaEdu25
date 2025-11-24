const express = require('express');
const router = express.Router();
const PostController = require('../controllers/BlogControllers');
const authenticateToken = require('../middleware/authenticateToken');

// Tạo bài viết (chỉ nhận dữ liệu JSON, không cần multer)
router.post('/create', authenticateToken, PostController.createPost);

// Lấy tất cả bài viết
router.get('/', PostController.getAllPosts);

// Lấy bài viết theo ID
router.get('/:id', PostController.getPostById);

// Cập nhật bài viết
router.put('/:id', authenticateToken, PostController.updatePost);

// Xóa bài viết
router.delete('/:id', authenticateToken, PostController.deletePost);

module.exports = router;
