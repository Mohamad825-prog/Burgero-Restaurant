# Backend Setup & Admin User Creation

## The Issue
The backend auth controller is looking for an admin user in the `admin_users` table, but the table is empty. That's why you're getting "Invalid credentials" error.

## Solution

### Step 1: Run the Seed Script
In the `burgero-backend` folder, run:

```bash
npm run seed:admin
```

**Expected Output:**
```
🌱 Seeding admin user...

✅ Admin user created successfully!

📋 Login Credentials:
   Username: admin
   Password: admin123

💡 Use these credentials to login to the admin panel
```

### Step 2: Start the Backend Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

You should see:
```
✅ Connected to MySQL database
🔧 Server running on port 5000
```

### Step 3: Login to Admin Panel
1. Start the admin frontend: `npm start` (from admin-frontend folder)
2. You'll be redirected to login page
3. Enter credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
4. Click Login ✓

---

## What the Seed Script Does

The `seed-admin.js` file:
- ✅ Checks if admin user already exists
- ✅ If not, creates one with:
  - Username: `admin`
  - Password: `admin123` (hashed with bcrypt)
- ✅ Stores in `admin_users` table
- ✅ Shows login credentials in console

---

## Database Requirements

Make sure these tables exist in your MySQL database:

```sql
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

If the table doesn't exist, run your migration script first:
```bash
npm run migrate
```

---

## Troubleshooting

### "Error: connect ECONNREFUSED"
- MySQL server is not running
- Start MySQL service and verify connection in `.env`

### "Error: ER_TABLE_EXISTS_ERROR"
- Table already exists (this is fine)
- Run the seed script anyway

### "Error: ER_NO_SUCH_TABLE"
- The `admin_users` table doesn't exist
- Run: `npm run migrate` first

### Still getting "Invalid credentials"
- Clear browser storage: DevTools → Application → Clear storage
- Make sure backend is running on port 5000
- Check backend console for errors

---

## Change Admin Password (Optional)

To create a new admin account or change password, either:

1. **Edit seed script** and run again:
   - Modify username/password in `seed-admin.js`
   - Run `npm run seed:admin`

2. **Direct database update:**
   ```bash
   node -e "
   const bcrypt = require('bcryptjs');
   const salt = bcrypt.genSaltSync(10);
   const hash = bcrypt.hashSync('newpassword', salt);
   console.log(hash);
   "
   ```
   Then update MySQL directly with the hash

---

## Next Steps
✅ Run seed script
✅ Start backend server
✅ Try logging in with `admin` / `admin123`
✅ Access admin dashboard
