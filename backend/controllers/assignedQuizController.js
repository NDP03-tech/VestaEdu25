const { Sequelize, Op } = require('sequelize');
const Class = require('../models/Class');
const Quiz = require('../models/Quiz');

// ✅ Lấy tất cả quiz được gán cho user đang đăng nhập
exports.getAssignedQuizzesForUser = async (req, res) => {
  const userId = req.user.id; // user đang đăng nhập (đã qua middleware authenticateToken)

  try {
    // 🧩 1. Tìm tất cả các lớp có chứa userId trong studentIds (JSON)
    const classes = await Class.findAll({
      where: Sequelize.literal(`JSON_CONTAINS(studentIds, '[${userId}]')`),
      include: [
        {
          model: Quiz,
          as: 'quizzes', // alias phải trùng với trong association Class.belongsToMany(Quiz, { as: 'quizzes' })
          through: { attributes: [] } // ẩn cột trung gian
        }
      ]
    });

    if (!classes || classes.length === 0) {
      return res.status(200).json([]); // user không thuộc lớp nào
    }

    // 🧩 2. Gộp tất cả quiz của các lớp đó
    const allQuizzes = classes.flatMap(cls => cls.quizzes || []);

    // 🧩 3. Loại bỏ quiz trùng ID (nếu quiz thuộc nhiều class)
    const uniqueQuizzes = Array.from(new Map(allQuizzes.map(q => [q.id, q])).values());

    return res.status(200).json(uniqueQuizzes);
  } catch (err) {
    console.error('❌ Error fetching assigned quizzes:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
