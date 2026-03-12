const mongoose = require('mongoose');

/**
 * Subject schema – represents a course/subject in the curriculum.
 */
const SubjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Subject name is required'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Subject', SubjectSchema);
