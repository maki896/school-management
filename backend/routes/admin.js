const express = require('express');
const router = express.Router();
const { getUsers, addUser, deleteUser, getSubjects, addSubject, getGrades, addGrade, assignToGrade } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// All routes require authentication and Admin role
router.use(auth);
router.use(role('manage_all'));

// User management
router.get('/users', getUsers);
router.post('/users', addUser);
router.delete('/users/:id', deleteUser);

// Subject management
router.get('/subjects', getSubjects);
router.post('/subjects', addSubject);

// Grade management
router.get('/grades', getGrades);
router.post('/grades', addGrade);
router.put('/grades/:id/assign', assignToGrade);

module.exports = router;
