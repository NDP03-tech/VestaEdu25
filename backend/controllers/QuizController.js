const Quiz = require('../models/Quiz');
const Question = require ('../models/Question');

// Tạo quiz mới
// Tạo quiz mới (chỉ lưu thông tin quiz, không chứa câu hỏi)
exports.createQuiz = async (req, res) => {
    try {
        const quizData = req.body;

        const newQuiz = await Quiz.create({
            ...quizData,
            createdAt: new Date(),
            questions: [], // Mặc định rỗng, sẽ thêm sau
        });

        res.status(201).json(newQuiz);
    } catch (error) {
        console.error("Lỗi khi tạo quiz:", error);
        res.status(400).json({ message: error.message });
    }
};


// Lấy danh sách quiz
exports.getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.findAll();
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Lấy quiz theo ID
exports.getQuizById = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findByPk(id, {
      include: [
        {
          model: Question,  // Model bạn đã define
          as: "questions",  // alias phải trùng với association bạn đã khai báo
        },
      ],
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("❌ Error in getQuizById:", error);
    res.status(500).json({ message: error.message });
  }
};


// Cập nhật quiz
exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const quizData = req.body;
  try {
    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    await quiz.update(quizData);
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};


// Xoá quiz
exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    await quiz.destroy();
    // Xoá tất cả câu hỏi liên quan
    await Question.destroy({ where: { quiz_id: id } });
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};



// Lấy danh sách quiz theo category
exports.getQuizzesByCategory = async (req, res) => {
  const categoryName = req.params.category;

  try {
    const quizzes = await Quiz.findAll({ where: { category: categoryName } });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
