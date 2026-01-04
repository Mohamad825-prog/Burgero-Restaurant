const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pool = require('./config/database'); // Use MySQL instead of Supabase
require('dotenv').config();

const app = express();

// ========== CORS CONFIGURATION ==========
const allowedOrigins = [
    'http://localhost:3000',                      // User frontend (dev)
    'http://localhost:3001',                      // Admin frontend (dev)
    process.env.CORS_ORIGIN_USER,                 // User frontend (production)
    process.env.CORS_ORIGIN_ADMIN,                // Admin frontend (production)
    'https://mohamad825-prog.github.io',          // GitHub Pages backup
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.includes('.netlify.app')) {
            callback(null, true);
        } else {
            console.log('🚫 CORS blocked origin:', origin);
            callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ========== HEALTH CHECK ==========
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        const connection = await pool.getConnection();
        connection.release();

        res.json({
            success: true,
            status: 'healthy',
            service: 'Burgero Restaurant API',
            version: '2.0',
            database: 'MySQL',
            cors: {
                allowedOrigins: allowedOrigins,
                userFrontend: process.env.CORS_ORIGIN_USER || 'Not configured',
                adminFrontend: process.env.CORS_ORIGIN_ADMIN || 'Not configured',
                environment: process.env.NODE_ENV || 'development'
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========== TEST ENDPOINT ==========
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        endpoints: {
            health: '/api/health',
            menu: '/api/menu/items',
            special: '/api/menu/special',
            orders: '/api/orders',
            messages: '/api/messages',
            admin: {
                orders: '/api/admin/orders',
                messages: '/api/admin/messages'
            }
        },
        cors: {
            origin: req.headers.origin || 'No origin header',
            allowed: allowedOrigins.includes(req.headers.origin) || req.headers.origin?.includes('.netlify.app') || false
        },
        environment: {
            node_env: process.env.NODE_ENV,
            cors_user: process.env.CORS_ORIGIN_USER || 'Not set',
            cors_admin: process.env.CORS_ORIGIN_ADMIN || 'Not set'
        }
    });
});

// ========== AUTH ENDPOINTS ==========
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Check admin in MySQL
        const [users] = await pool.query(
            'SELECT * FROM admin_users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const admin = users[0];

        // Simple password check
        if (password === 'admin123') {
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
        const [items] = await pool.query(
            'SELECT * FROM menu_items ORDER BY is_default DESC, created_at DESC'
        );

        // Transform data to match your frontend expectations
        const transformedData = items.map(item => ({
            id: item.id,
            name: item.name,
            price: typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price,
            description: item.description || '',
            image_url: item.image_url,
            image: item.image_url,
            is_default: item.is_default
        }));

        res.json({
            success: true,
            data: transformedData
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
        const [items] = await pool.query(
            'SELECT * FROM special_items ORDER BY is_default DESC, created_at DESC'
        );

        // Transform data
        const transformedData = items.map(item => ({
            id: item.id,
            title: item.title,
            price: typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price,
            stars: parseFloat(item.stars) || 4.5,
            image_url: item.image_url,
            img: item.image_url,
            is_default: item.is_default
        }));

        res.json({
            success: true,
            data: transformedData
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

        const [result] = await pool.query(
            `INSERT INTO orders (customer_name, phone, order_details, order_time, status) 
             VALUES (?, ?, ?, ?, 'pending')`,
            [customer_name.trim(), phone.trim(), order_details.trim(), order_time]
        );

        res.json({
            success: true,
            message: 'Order created successfully',
            data: {
                id: result.insertId,
                customer_name,
                phone,
                order_details,
                order_time,
                status: 'pending'
            }
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

        const [result] = await pool.query(
            `INSERT INTO contact_messages (name, email, message, is_read) 
             VALUES (?, ?, ?, FALSE)`,
            [name.trim(), email.trim(), message.trim()]
        );

        res.json({
            success: true,
            message: 'Message sent successfully',
            data: {
                id: result.insertId,
                name,
                email,
                message,
                is_read: false
            }
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
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    const token = authHeader.split(' ')[1];

    if (token && token.startsWith('burgero-admin-')) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// GET all orders (admin)
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

// UPDATE order status (admin)
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

        const [result] = await pool.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order status updated'
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
});

// DELETE order (admin)
app.delete('/api/admin/orders/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            'DELETE FROM orders WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete order'
        });
    }
});

// GET all messages (admin)
app.get('/api/admin/messages', authenticateAdmin, async (req, res) => {
    try {
        const [messages] = await pool.query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages'
        });
    }
});

// MARK message as read (admin)
app.put('/api/admin/messages/:id/read', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark message as read'
        });
    }
});

// DELETE message (admin)
app.delete('/api/admin/messages/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            'DELETE FROM contact_messages WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete message'
        });
    }
});

// ========== ERROR HANDLING ==========
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// ========== SERVER START ==========
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Test database connection
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database');
        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 CORS User Frontend: ${process.env.CORS_ORIGIN_USER || 'Not configured'}`);
            console.log(`🔗 CORS Admin Frontend: ${process.env.CORS_ORIGIN_ADMIN || 'Not configured'}`);
            console.log(`📊 Database: MySQL connected`);
            console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌ Cannot start server without database connection:', error.message);
        process.exit(1);
    }
}

startServer().catch(console.error);