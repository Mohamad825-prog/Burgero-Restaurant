// burgero-backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { supabase, testConnection } = require('./config/supabase');
require('dotenv').config();

const app = express();

// ========== CORS CONFIGURATION ==========
const allowedOrigins = [
    'http://localhost:3000',  // User frontend (dev)
    'http://localhost:3001',  // Admin frontend (dev)
    'https://mohamad825-prog.github.io',  // Your GitHub Pages
    'https://*.netlify.app',  // Netlify deployments
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('netlify.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files (for image uploads)
app.use('/uploads', express.static(uploadsDir));

// ========== HEALTH CHECK ENDPOINT ==========
app.get('/api/health', async (req, res) => {
    try {
        // Test Supabase connection
        const { data, error } = await supabase
            .from('menu_items')
            .select('count')
            .limit(1);

        if (error) throw error;

        res.json({
            success: true,
            status: 'healthy',
            service: 'Burgero Restaurant API',
            version: '2.0',
            database: 'Supabase',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'unhealthy',
            error: error.message
        });
    }
});

// ========== AUTH ENDPOINTS ==========
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Login attempt for:', username);

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Check admin credentials in Supabase
        const { data: admin, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !admin) {
            console.log('Admin not found or error:', error?.message);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // For now, we'll use simple password check
        // In production, you should use bcrypt to compare hashed passwords
        if (password === 'admin123') {  // Your default password
            // Generate a simple token (replace with JWT in production)
            const token = `burgero-admin-${Date.now()}-${admin.id}`;

            res.json({
                success: true,
                message: 'Login successful',
                token: token,
                user: {
                    id: admin.id,
                    username: admin.username
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// ========== MENU ENDPOINTS ==========
app.get('/api/menu/items', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch menu items'
        });
    }
});

app.get('/api/menu/special', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('special_items')
            .select('*')
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error fetching special items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch special items'
        });
    }
});

// ========== ORDER ENDPOINTS ==========
app.post('/api/orders', async (req, res) => {
    try {
        const { customer_name, phone, order_details, order_time } = req.body;

        if (!customer_name || !phone || !order_details || !order_time) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const { data, error } = await supabase
            .from('orders')
            .insert([{
                customer_name: customer_name.trim(),
                phone: phone.trim(),
                order_details: order_details.trim(),
                order_time: order_time,
                status: 'pending'
            }])
            .select();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Order created successfully',
            data: data[0]
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
});

// ========== MESSAGE ENDPOINTS ==========
app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const { data, error } = await supabase
            .from('contact_messages')
            .insert([{
                name: name.trim(),
                email: email.trim(),
                message: message.trim(),
                is_read: false
            }])
            .select();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Message sent successfully',
            data: data[0]
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
});

// ========== ADMIN ENDPOINTS ==========
// Middleware to check admin authentication
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    const token = authHeader.split(' ')[1];

    // Simple token check (replace with JWT verification in production)
    if (token && token.startsWith('burgero-admin-')) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Get all orders (admin)
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

// Update order status (admin)
app.put('/api/admin/orders/:id/status', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'preparing', 'ready', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order status updated',
            data: data[0]
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
});

// Get all messages (admin)
app.get('/api/admin/messages', authenticateAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages'
        });
    }
});

// Mark message as read (admin)
app.put('/api/admin/messages/:id/read', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('contact_messages')
            .update({ is_read: true })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message marked as read',
            data: data[0]
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark message as read'
        });
    }
});

// ========== SERVER START ==========
const PORT = process.env.PORT || 5000;

async function startServer() {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ Cannot start server without database connection');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
        console.log(`📊 Database: Supabase (PostgreSQL)`);
        console.log(`📁 Uploads directory: ${uploadsDir}`);
    });
}

startServer().catch(console.error);