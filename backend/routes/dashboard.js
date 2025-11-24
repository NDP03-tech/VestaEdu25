const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/authenticateToken');

// GET /api/dashboard/stats
router.get('/stats', authenticateToken, dashboardController.getDashboardStats);

module.exports = router;
