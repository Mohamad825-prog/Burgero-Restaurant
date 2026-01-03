const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();

// ========== FIXED CORS CONFIGURATION ==========
// Allow all origins for development
const corsOptions = {
    origin: '*', // Allow all origins for now
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'X-Access-Token'
    ],
    exposedHeaders: [
        'Content-Range',
        'X-Content-Range',
        'Access-Control-Expose-Headers'
    ],
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Apply CORS middleware BEFORE other middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// ========== MULTER CONFIGURATION ==========
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// Make upload middleware available to routes
app.locals.upload = upload;

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ========== ROUTES ==========
const orderRoutes = require('./routes/orders');
const messageRoutes = require('./routes/messages');
const menuRoutes = require('./routes/menu');
const authRoutes = require('./routes/auth');

app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);

// ========== FILE UPLOAD ROUTE ==========
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                path: imageUrl,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'File upload failed'
        });
    }
});

// ========== TEST ENDPOINTS ==========
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Burgero API',
        version: '2.0',
        cors: 'enabled'
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        cors: 'enabled',
        headers: req.headers
    });
});

// Simple test login endpoint (no auth required for testing)
app.post('/api/test-login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        res.json({
            success: true,
            message: 'Login successful (test mode)',
            token: 'test-jwt-token-' + Date.now(),
            user: { id: 1, username: 'admin' }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// ========== ROOT ROUTE ==========
app.get('/', (req, res) => {
    res.json({
        message: 'Burgero Restaurant API',
        version: '2.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth/login',
            menu: '/api/menu/items',
            orders: '/api/orders',
            messages: '/api/messages'
        }
    });
});

// ========== ERROR HANDLING ==========
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    console.error('Stack:', err.stack);

    // Handle CORS errors
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            message: 'CORS Error',
            allowedOrigins: ['*']
        });
    }

    // Handle file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB'
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Uploads directory: ${path.join(__dirname, 'public/uploads')}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`🔐 Test login: http://localhost:${PORT}/api/test-login`);
    console.log(`✅ CORS enabled for all origins`);
});