const pool = require('./config/database');

async function checkAdmin() {
    try {
        const [users] = await pool.query('SELECT * FROM admin_users');
        console.log('Admin users in database:', users);

        if (users.length > 0) {
            const user = users[0];
            console.log('Admin user details:');
            console.log('- ID:', user.id);
            console.log('- Username:', user.username);
            console.log('- Password hash length:', user.password_hash.length);
            console.log('- Created at:', user.created_at);
        } else {
            console.log('No admin users found!');
            console.log('Run: node seed-admin.js to create admin user');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error checking admin:', error);
        process.exit(1);
    }
}

checkAdmin();