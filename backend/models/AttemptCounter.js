const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AttemptCounter = sequelize.define('AttemptCounter', {
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
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'attempt_counters',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'quiz_id']
    }
  ]
});

module.exports = AttemptCounter;