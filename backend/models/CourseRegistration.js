const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseRegistration = sequelize.define('CourseRegistration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  courseTitle: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'course_registrations',
  timestamps: true
});

module.exports = CourseRegistration;