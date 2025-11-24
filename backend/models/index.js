const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Import all models
const User = require('./User');
const Quiz = require('./Quiz');
const Question = require('./Question');
const Course = require('./Course');
const Class = require('./Class');
const Blog = require('./Blog');
const Event = require('./Event');
const Category = require('./Category');
const CourseRegistration = require('./CourseRegistration');
const EventRegistration = require('./EventRegistration');
const UserQuizResult = require('./UserQuizResult');
const AttemptCounter = require('./AttemptCounter');

// Define associations

// User associations
User.hasMany(Class, { foreignKey: 'teacher_id', as: 'taughtClasses' });
User.hasMany(UserQuizResult, { foreignKey: 'user_id', as: 'quizResults' });
User.hasMany(AttemptCounter, { foreignKey: 'user_id', as: 'attemptCounters' });

// Quiz associations
Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions' });
Quiz.hasMany(UserQuizResult, { foreignKey: 'quiz_id', as: 'results' });
Quiz.hasMany(AttemptCounter, { foreignKey: 'quiz_id', as: 'attemptCounters' });

// Question associations
Question.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// Class associations
Class.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

// Course associations
Course.hasMany(CourseRegistration, { foreignKey: 'courseId', as: 'registrations' });

// Event associations
Event.hasMany(EventRegistration, { foreignKey: 'eventId', as: 'registrations' });

// CourseRegistration associations
CourseRegistration.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Many-to-many relationships for Class-User (students)
Class.belongsToMany(User, {
  through: 'class_students',
  as: 'students',
  foreignKey: 'class_id',
  otherKey: 'user_id'
});
User.belongsToMany(Class, {
  through: 'class_students',
  as: 'classes',
  foreignKey: 'user_id',
  otherKey: 'class_id'
});


// Many-to-many relationships for Class-Quiz
Class.belongsToMany(Quiz, {
  through: 'class_quizzes',
  as: 'quizzes',
  foreignKey: 'class_id',
  otherKey: 'quiz_id'
});
Quiz.belongsToMany(Class, {
  through: 'class_quizzes',
  as: 'classes',
  foreignKey: 'quiz_id',
  otherKey: 'class_id'
});

// Fix: UserQuizResult belongsTo Quiz (for include: 'quiz' in controller)
UserQuizResult.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// ✅ Thêm dòng này để include User từ UserQuizResult
UserQuizResult.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
module.exports = {
  sequelize,
  User,
  Quiz,
  Question,
  Course,
  Class,
  Blog,
  Event,
  Category,
  CourseRegistration,
  EventRegistration,
  UserQuizResult,
  AttemptCounter
};
