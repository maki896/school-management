const jwt = require('jsonwebtoken');

/**
 * Authentication middleware – validates JWT from `x-auth-token` header
 * and attaches the decoded user payload to `req.user`.
 */
module.exports = function authenticate(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'Access denied – no authentication token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch {
        return res.status(401).json({ msg: 'Invalid or expired authentication token' });
    }
};
