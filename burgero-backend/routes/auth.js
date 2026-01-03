const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Check authentication
router.get('/check', authController.checkAuth);

// Ensure admin user exists (for development/testing)
router.post('/ensure-admin', async (req, res) => {
    try {
        console.log('Ensuring admin user exists...');

        const username = 'admin';
        const password = 'admin123';

        // Check if admin already exists
        const [users] = await pool.query(
            'SELECT * FROM admin_users WHERE username = ?',
            [username]
        );

        if (users.length > 0) {
            console.log('Admin user already exists');
            return res.json({
                success: true,
                message: 'Admin user already exists',
                username: username
            });
        }

        // Create admin user
        console.log('Creating admin user...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
            [username, passwordHash]
        );

        console.log('Admin user created with ID:', result.insertId);

        res.json({
            success: true,
            message: 'Admin user created successfully',
            username: username,
            password: password
        });
    } catch (error) {
        console.error('Error ensuring admin exists:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to ensure admin exists',
            error: error.message
        });
    }
});

module.exports = router;