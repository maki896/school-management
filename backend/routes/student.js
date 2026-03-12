const express = require('express');
const router = express.Router();
const { getMyMarks, getMyGrade } = require('../controllers/studentController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// All routes require authentication and Student role
router.use(auth);
router.use(role('view_own_grades'));

// Student functions
router.get('/marks', getMyMarks);
router.get('/grade', getMyGrade);

module.exports = router;
