const Mark  = require('../models/Mark');
const Grade = require('../models/Grade');

/**
 * @desc    Get all marks for the current student
 * @route   GET /api/student/marks
 * @access  Private (Student)
 */
exports.getMyMarks = async (req, res) => {
    try {
        const marks = await Mark.find({ student: req.user.id })
            .populate('subject', 'name description')
            .populate('teacher', 'name')
            .sort({ createdAt: -1 });
        res.json(marks);
    } catch (err) {
        console.error('getMyMarks error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc    Get the grade/class that the current student belongs to
 * @route   GET /api/student/grade
 * @access  Private (Student)
 */
exports.getMyGrade = async (req, res) => {
    try {
        const grade = await Grade.findOne({ students: req.user.id })
            .populate('teachers', 'name email');
        res.json(grade || null);
    } catch (err) {
        console.error('getMyGrade error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
