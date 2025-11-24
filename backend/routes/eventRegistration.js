// routes/eventRegistration.js
const express = require('express');
const router = express.Router();
const {
  registerEvent,
  getAllEventRegistrations
} = require('../controllers/eventRegistrationController');

// POST: Đăng ký sự kiện
router.post('/', registerEvent);

// GET: Lấy tất cả đăng ký sự kiện
router.get('/', getAllEventRegistrations);

module.exports = router;
