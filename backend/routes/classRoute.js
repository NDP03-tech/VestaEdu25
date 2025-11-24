const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.post('/', classController.createClass);
router.get('/', classController.getAllClasses);
router.get('/:classId', classController.getClassById);

router.post('/:classId/add-user', classController.addUserToClass);
router.post('/:classId/add-quiz', classController.addQuizToClass);

router.get('/:classId/quizzes', classController.getQuizzesOfClass);
router.get('/:classId/students', classController.getStudentsInClass);
router.post('/:classId/students', classController.addStudentsToClass);
router.post('/move-students', classController.moveStudents);

// optional routes
router.delete('/:classId/students/:studentId', classController.removeStudentFromClass);
router.put('/:classId', classController.updateClass);
router.delete('/:classId', classController.deleteClass);

module.exports = router;
