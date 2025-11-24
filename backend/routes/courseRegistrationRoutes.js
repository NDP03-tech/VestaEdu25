const express = require('express');
const router = express.Router();
const {
  registerCourse,
  getAllRegistrations
} = require('../controllers/courseRegistrationController.js');

// POST: Người dùng đăng ký
router.post('/', registerCourse);

// GET: Admin lấy danh sách đăng ký
router.get('/', getAllRegistrations);

module.exports = router;
