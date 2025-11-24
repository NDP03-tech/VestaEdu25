const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserQuizResult = sequelize.define('UserQuizResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quizzes',
      key: 'id'
    }
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  passed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  attemptNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'user_quiz_results',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id', 'quiz_id', 'score']
    }
  ]
});

module.exports = UserQuizResult;