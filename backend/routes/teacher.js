const express = require('express');
const router = express.Router();
const { getAssignedStudents, assignMarks, getAssignedMarks, getSubjects } = require('../controllers/teacherController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// All routes require authentication and Teacher role
router.use(auth);
router.use(role('manage_student_marks'));

// Teacher functions
router.get('/students', getAssignedStudents);
router.get('/subjects', getSubjects);
router.post('/marks', assignMarks);
router.get('/marks', getAssignedMarks);

module.exports = router;
