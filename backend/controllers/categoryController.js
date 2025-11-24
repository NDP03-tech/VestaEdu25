const Category = require('../models/Category.js');
const Quiz = require('../models/Quiz'); // 👈 Thêm dòng này để dùng được Quiz

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'Category name is required.' });

  try {
    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteCategoryAndQuizzes = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Xoá toàn bộ quiz thuộc danh mục
    await Quiz.destroy({ where: { category: category.name } });

    // Xoá danh mục
    await category.destroy();

    res.json({ message: 'Category and related quizzes deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getQuizzes = async (req, res) => {
  try {
    const { category } = req.query;
    let whereClause = {};

    if (category && category !== "all") {
      whereClause.category = category;
    }

    const quizzes = await Quiz.findAll({ where: whereClause });
    res.json(quizzes);
  } catch (err) {
    console.error("❌ Error in getQuizzes:", err);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};
