const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;

    // FOR TESTING: Allow bypass with test token
    if (process.env.NODE_ENV === 'development') {
        const testToken = req.headers['x-test-token'];
        if (testToken === 'test-mode-enabled') {
            console.log('⚠️ Using test mode - authentication bypassed');
            req.user = { id: 1, username: 'admin', role: 'admin', test: true };
            return next();
        }
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No token provided or invalid format'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'burgero-secret-key-2024'
        );

        // Add user to request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Admin-only middleware (simplified for now)
const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Authentication required.'
        });
    }

    // For testing mode, always allow
    if (req.user.test) {
        return next();
    }

    // In production, check for admin role
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin privileges required'
        });
    }

    next();
};

module.exports = { authMiddleware, adminOnly };