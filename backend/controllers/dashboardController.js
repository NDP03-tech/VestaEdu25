const User = require('../models/User');
const Quiz = require('../models/Quiz');
const UserQuizResult = require('../models/UserQuizResult');

// Lấy thống kê Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // Tổng số người dùng
    const totalUsers = await User.count();

    // Tổng số bài quiz
    const totalQuizzes = await Quiz.count();

    // Tổng số bài được passed trong hôm nay
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const passedToday = await UserQuizResult.count({
      where: {
        passed: true,
        submittedAt: {
          [require('sequelize').Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    return res.json({
      totalUsers,
      totalQuizzes,
      passedToday
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
