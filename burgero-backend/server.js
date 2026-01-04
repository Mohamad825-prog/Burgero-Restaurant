const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { supabase, testConnection } = require('./config/supabase');
require('dotenv').config();

const app = express();

// ========== CORS CONFIGURATION WITH ENVIRONMENT VARIABLES ==========
const allowedOrigins = [
    'http://localhost:3000',                      // User frontend (dev)
    'http://localhost:3001',                      // Admin frontend (dev)
    process.env.CORS_ORIGIN_USER,                 // User frontend (production)
    process.env.CORS_ORIGIN_ADMIN,                // Admin frontend (production)
    'https://*.vercel.app',                       // Vercel deployments
    'https://burgero-user.vercel.app',            // Specific user Vercel
    'https://burgero-admin.vercel.app',           // Specific admin Vercel
    'https://mohamad825-prog.github.io',          // GitHub Pages backup
].filter(Boolean); // Remove any undefined values

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Check if the origin is allowed
        if (allowedOrigins.includes(origin) ||
            origin.includes('.vercel.app') ||
            origin.includes('.netlify.app') ||
            origin.includes('localhost')) {
            callback(null, true);
        } else {
            console.log('🚫 CORS blocked origin:', origin);
            callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Test-Token']
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

// ========== HEALTH CHECK ==========
app.get('/api/health', async (req, res) => {
    try {
        const { data, error } = await supabase.from('menu_items').select('count').limit(1);
        if (error) throw error;

        res.json({
            success: true,
            status: 'healthy',
            service: 'Burgero Restaurant API',
            version: '2.0',
            database: 'Supabase (PostgreSQL)',
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

        // Check admin in Supabase
        const { data: admin, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Simple password check (use bcrypt in production)
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
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match your frontend expectations
        const transformedData = data.map(item => ({
            id: item.id,
            name: item.name,
            price: typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price,
            description: item.description || '',
            image_url: item.image_url,
            image: item.image_url, // For compatibility with your frontend
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
        const { data, error } = await supabase
            .from('special_items')
            .select('*')
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data
        const transformedData = data.map(item => ({
            id: item.id,
            title: item.title,
            price: typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price,
            stars: parseFloat(item.stars) || 4.5,
            image_url: item.image_url,
            img: item.image_url, // For compatibility
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

        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
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

// DELETE order (admin)
app.delete('/api/admin/orders/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) throw error;

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

// MARK message as read (admin)
app.put('/api/admin/messages/:id/read', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('contact_messages')
            .update({ is_read: true })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
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

// DELETE message (admin)
app.delete('/api/admin/messages/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', id);

        if (error) throw error;

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

// ========== SERVER START ==========
const PORT = process.env.PORT || 5000;

async function startServer() {
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ Cannot start server without database connection');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 CORS User Frontend: ${process.env.CORS_ORIGIN_USER || 'Not configured'}`);
        console.log(`🔗 CORS Admin Frontend: ${process.env.CORS_ORIGIN_ADMIN || 'Not configured'}`);
        console.log(`📊 Database: Supabase connected`);
        console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    });
}

startServer().catch(console.error);