const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

/**
 * User schema – represents Admins, Teachers, and Students.
 * Passwords are automatically hashed via a pre-save hook.
 */
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        role: {
            type: String,
            enum: ['Admin', 'Teacher', 'Student'],
            default: 'Student',
        },
    },
    { timestamps: true }
);

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Hash plain-text password before saving */
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ─── Instance Methods ────────────────────────────────────────────────────────

/** Compare a plain-text password with the stored hash */
UserSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
