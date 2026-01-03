const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Login
exports.login = async (req, res) => {
    try {
        console.log('Login attempt:', req.body.username);

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Check if user exists
        const [users] = await pool.query(
            'SELECT * FROM admin_users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            console.log('User not found:', username);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: 'admin'
            },
            process.env.JWT_SECRET || 'burgero-secret-key-2024',
            { expiresIn: '24h' }
        );

        console.log('Login successful for:', username);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Logout
exports.logout = (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
};

// Check authentication
exports.checkAuth = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'burgero-secret-key-2024'
        );
        res.json({
            success: true,
            user: decoded
        });
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};