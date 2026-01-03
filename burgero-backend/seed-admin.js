const bcrypt = require('bcryptjs');
const pool = require('./config/database');
require('dotenv').config();

async function seedAdmin() {
    try {
        console.log('🌱 Seeding admin user...\n');

        // Admin credentials
        const username = 'admin';
        const password = 'admin123';

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Check if admin already exists
        const [users] = await pool.query(
            'SELECT * FROM admin_users WHERE username = ?',
            [username]
        );

        if (users.length > 0) {
            console.log('✅ Admin user already exists');
            console.log('   Username:', username);
            console.log('   Password:', password);
            process.exit(0);
        }

        // Insert admin user
        const [result] = await pool.query(
            'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
            [username, passwordHash]
        );

        console.log('✅ Admin user created successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   Username: ' + username);
        console.log('   Password: ' + password);
        console.log('\n💡 Use these credentials to login to the admin panel\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin user:', error.message);
        process.exit(1);
    }
}

seedAdmin();
