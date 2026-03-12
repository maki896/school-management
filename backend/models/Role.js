const mongoose = require('mongoose');

/**
 * Role schema – maps a role name to a list of permission strings.
 * Used by the `requirePermission` middleware for RBAC enforcement.
 */
const RoleSchema = new mongoose.Schema(
    {
        roleName: {
            type: String,
            required: [true, 'Role name is required'],
            unique: true,
            enum: {
                values: ['Admin', 'Teacher', 'Student'],
                message: 'Role must be Admin, Teacher, or Student',
            },
        },
        permissions: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Role', RoleSchema);
