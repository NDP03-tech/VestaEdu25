const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const Quiz = require('../models/Quiz');

// GET tất cả danh mục
router.get('/', categoryController.getAllCategories);

// POST tạo danh mục mới
router.post('/', categoryController.createCategory);

// GET tất cả quiz thuộc một danh mục
router.get('/:categoryId/quizzes', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const quizzes = await Quiz.findAll({ where: { category: categoryId } });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE: Xoá category và tất cả quizzes thuộc category
router.delete('/:categoryId', categoryController.deleteCategoryAndQuizzes);


module.exports = router;
