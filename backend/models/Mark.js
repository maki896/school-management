const mongoose = require('mongoose');

/**
 * Mark schema – stores a student's score in a subject, recorded by a teacher.
 * Unique index per (student, subject) prevents duplicate entries.
 */
const MarkSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student reference is required'],
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: [true, 'Subject reference is required'],
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Teacher reference is required'],
        },
        marks: {
            type: Number,
            required: [true, 'Marks value is required'],
            min: [0, 'Marks cannot be negative'],
            max: [100, 'Marks cannot exceed 100'],
        },
        remarks: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

// Prevent duplicate (student, subject) combinations
MarkSchema.index({ student: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Mark', MarkSchema);
