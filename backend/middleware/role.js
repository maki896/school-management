const Role = require('../models/Role');

/**
 * Role-based access control middleware.
 * Usage: router.get('/route', auth, requirePermission('manage_all'), handler)
 *
 * @param {string} requiredPermission - The permission string to check against the user's role.
 */
module.exports = function requirePermission(requiredPermission) {
    return async (req, res, next) => {
        try {
            const roleDoc = await Role.findOne({ roleName: req.user.role });

            if (!roleDoc) {
                return res.status(403).json({ msg: `Role "${req.user.role}" is not defined in the system` });
            }

            if (!roleDoc.permissions.includes(requiredPermission)) {
                return res.status(403).json({
                    msg: `Access denied – requires the "${requiredPermission}" permission`
                });
            }

            next();
        } catch (err) {
            console.error('Permission middleware error:', err.message);
            res.status(500).json({ msg: 'Server error during permission check' });
        }
    };
};
