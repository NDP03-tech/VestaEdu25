const Question = require("../models/Question.js");
// Shuffle utility
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const extractFromHTML = require("../utils/extractGaps");

exports.createQuestion = async (req, res) => {
  try {
    const {
      quiz_id,
      questionText,
      questionType,
      points,
      explanation,
      readingContent,
      options = [],
    } = req.body;

    const { gaps, dropdowns, hintWords } = extractFromHTML(questionText);

    const question = await Question.create({
      quiz_id,
      question_text: questionText,
      points,
      explanation,
      gaps,
      dropdowns,
      hintWords,
      question_type: questionType,
      readingContent,
      options: ["checkboxes", "multiple-choice"].includes(questionType)
        ? options
        : [],
    });

    const shuffledOptions = shuffleArray([...question.options]);
    res.status(201).json({ ...question.toJSON(), options: shuffledOptions });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Question
exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByPk(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    const questionText =
      req.body.question_text ?? req.body.questionText ?? question.question_text;
    const questionType =
      req.body.question_type ?? req.body.questionType ?? question.question_type;
    const { gaps, dropdowns, hintWords } = extractFromHTML(questionText);

    // Update fields
    const updated = await question.update({
      question_text: questionText,
      question_type: questionType,
      points: req.body.points ?? question.points,
      explanation: req.body.explanation ?? question.explanation,
      gaps,
      dropdowns,
      hintWords,
      options: ["checkboxes", "multiple-choice"].includes(questionType)
        ? (req.body.options ?? question.options)
        : [],
      quiz_id: req.body.quiz_id ?? question.quiz_id,
      readingContent: req.body.readingContent ?? question.readingContent,
    });

    const shuffledOptions = shuffleArray([...updated.options]);
    res.status(200).json({ ...updated.toJSON(), options: shuffledOptions });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Question
exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    await question.destroy();
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Question by ID
exports.getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get Questions by Quiz ID
exports.getQuestionsByQuizId = async (req, res) => {
  const { quizId } = req.params;
  try {
    const questions = await Question.findAll({
      where: { quiz_id: quizId },
    });
    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
