const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // ...existing code...
  visibleTo: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'everyone' // hoặc giá trị mặc định bạn muốn
  },
// ...existing code...
  // UI Settings stored as JSON
  uiSettings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      oneQuestionPerPage: false,
      showQuestionNumbers: true,
      shuffle: 'none',
      timeLimit: 0,
      maxAttempts: 'Unlimited',
      showFeedback: true,
      displayScore: true,
      specialChars: '',
      headerText: '',
      instructionText: '',
      quizCompleteMessage: '',
      showHeaderInput: false,
      showCompletionInput: false,
      showInstructionInput: false
    }
  }
}, {
  tableName: 'quizzes',
  timestamps: true
});

module.exports = Quiz;