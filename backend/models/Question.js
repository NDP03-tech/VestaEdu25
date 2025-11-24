const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quizzes',
      key: 'id'
    }
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  readingContent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  question_type: {
    type: DataTypes.ENUM(
      'blank-boxes',
      'generated-dropdowns',
      'drag-drop-matching',
      'find-highlight',
      'multiple-choice',
      'checkboxes',
      'essay',
      'description',
      'reading',
      'speaking'
    ),
    allowNull: false
  },
  // Store complex data as JSON
  gaps: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  dropdowns: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  hintWords: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'questions',
  timestamps: true
});

module.exports = Question;