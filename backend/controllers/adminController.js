const User    = require('../models/User');
const Subject = require('../models/Subject');
const Grade   = require('../models/Grade');
const Mark    = require('../models/Mark');

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Get all non-admin users (Teachers & Students)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'Admin' } }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error('getUsers error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc    Create a new user (Teacher or Student)
 * @route   POST /api/admin/users
 * @access  Private (Admin)
 */
exports.addUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: 'User with this email already exists' });

        const user = new User({ name, email, password, role });
        await user.save();

        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json(userObj);
    } catch (err) {
        console.error('addUser error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc    Delete a user and cascade-remove their data (marks, grade memberships)
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Remove from any grades
        await Grade.updateMany(
            { $or: [{ teachers: id }, { students: id }] },
            { $pull: { teachers: id, students: id } }
        );

        // Remove marks associated with this student
        await Mark.deleteMany({ student: id });

        await User.findByIdAndDelete(id);
        res.json({ msg: 'User and all associated data removed successfully' });
    } catch (err) {
        console.error('deleteUser error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Get all subjects
 * @route   GET /api/admin/subjects
 * @access  Private (Admin)
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

/**
 * @desc    Create a new subject
 * @route   POST /api/admin/subjects
 * @access  Private (Admin)
 */
exports.addSubject = async (req, res) => {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ msg: 'Subject name is required' });

    try {
        const existing = await Subject.findOne({ name });
        if (existing) return res.status(400).json({ msg: 'Subject already exists' });

        const subject = new Subject({ name, description });
        await subject.save();
        res.status(201).json(subject);
    } catch (err) {
        console.error('addSubject error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GRADES / CLASSES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Get all grades with populated teachers and students
 * @route   GET /api/admin/grades
 * @access  Private (Admin)
 */
exports.getGrades = async (req, res) => {
    try {
        const grades = await Grade.find()
            .populate('teachers', 'name email')
            .populate('students', 'name email')
            .sort({ name: 1 });
        res.json(grades);
    } catch (err) {
        console.error('getGrades error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc    Create a new grade/class
 * @route   POST /api/admin/grades
 * @access  Private (Admin)
 */
exports.addGrade = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: 'Grade name is required' });

    try {
        const existing = await Grade.findOne({ name });
        if (existing) return res.status(400).json({ msg: 'A class with this name already exists' });

        const grade = new Grade({ name });
        await grade.save();
        res.status(201).json(grade);
    } catch (err) {
        console.error('addGrade error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc    Assign a user (Teacher or Student) to a grade
 * @route   PUT /api/admin/grades/:id/assign
 * @access  Private (Admin)
 */
exports.assignToGrade = async (req, res) => {
    const { userId, type } = req.body;
    if (!userId || !type) return res.status(400).json({ msg: 'userId and type are required' });

    try {
        const grade = await Grade.findById(req.params.id);
        if (!grade) return res.status(404).json({ msg: 'Grade not found' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (type === 'Teacher') {
            if (!grade.teachers.map(id => id.toString()).includes(userId)) {
                grade.teachers.push(userId);
            }
        } else if (type === 'Student') {
            if (!grade.students.map(id => id.toString()).includes(userId)) {
                grade.students.push(userId);
            }
        } else {
            return res.status(400).json({ msg: 'Type must be "Teacher" or "Student"' });
        }

        await grade.save();

        const updated = await Grade.findById(grade._id)
            .populate('teachers', 'name email')
            .populate('students', 'name email');
        res.json(updated);
    } catch (err) {
        console.error('assignToGrade error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
