const mongoose = require('mongoose');

/**
 * Grade schema – represents a class/year group.
 * Holds references to the teachers and students assigned to it.
 */
const GradeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Grade/class name is required'],
            unique: true,
            trim: true,
        },
        teachers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Grade', GradeSchema);
