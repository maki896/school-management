const Mark    = require('../models/Mark');
const Grade   = require('../models/Grade');
const Subject = require('../models/Subject');

/**
 * @desc    Get all students assigned to this teacher's classes
 * @route   GET /api/teacher/students
 * @access  Private (Teacher)
 */
exports.getAssignedStudents = async (req, res) => {
    try {
        const grades = await Grade.find({ teachers: req.user.id })
            .populate('students', 'name email');

        // Flatten and deduplicate students across all grades
        const studentMap = new Map();
        grades.forEach(grade => {
            grade.students.forEach(student => {
                studentMap.set(student._id.toString(), student);
            });
        });

        res.json(Array.from(studentMap.values()));
    } catch (err) {
        console.error('getAssignedStudents error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc    Assign or update marks for a student in a subject
 * @route   POST /api/teacher/marks
 * @access  Private (Teacher)
 */
exports.assignMarks = async (req, res) => {
    const { studentId, subjectId, marks, remarks } = req.body;

    if (!studentId || !subjectId || marks === undefined) {
        return res.status(400).json({ msg: 'studentId, subjectId and marks are required' });
    }

    if (marks < 0 || marks > 100) {
        return res.status(400).json({ msg: 'Marks must be between 0 and 100' });
    }

    try {
        const mark = await Mark.findOneAndUpdate(
            { student: studentId, subject: subjectId },
            { teacher: req.user.id, marks, remarks: remarks || '' },
            { new: true, upsert: true }
        ).populate('student', 'name').populate('subject', 'name');

        res.json(mark);
    } catch (err) {
        console.error('assignMarks error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc    Get all marks assigned by this teacher
 * @route   GET /api/teacher/marks
 * @access  Private (Teacher)
 */
exports.getAssignedMarks = async (req, res) => {
    try {
        const marks = await Mark.find({ teacher: req.user.id })
            .populate('student', 'name email')
            .populate('subject', 'name')
            .sort({ createdAt: -1 });
        res.json(marks);
    } catch (err) {
        console.error('getAssignedMarks error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc    Get all subjects
 * @route   GET /api/teacher/subjects
 * @access  Private (Teacher)
 */
exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ name: 1 });
        res.json(subjects);
    } catch (err) {
        console.error('getSubjects error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
