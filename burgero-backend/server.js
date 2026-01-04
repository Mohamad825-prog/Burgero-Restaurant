const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
    res.json({ message: 'Burgero API is running!' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mock endpoints for frontend
const mockMenuItems = [
    { id: 1, name: "Classic Burger", price: "$8.00", description: "A timeless favorite", image: "http://localhost:5000/images/ClassicBurger.jpg", is_default: true },
    { id: 2, name: "The Lebanese", price: "$9.00", description: "Featuring a blend of spices", image: "http://localhost:5000/images/TheLebanese.jpg", is_default: true },
    { id: 3, name: "Mushroom Vibes", price: "$10.00", description: "Sauteed mushrooms with Swiss cheese", image: "http://localhost:5000/images/MushroomVibes.jpg", is_default: true }
];

const mockSpecialItems = [
    { id: 1, title: "Pepper Maize", price: "$10.00", stars: 4.5, img: "http://localhost:5000/images/PepperMaize.jpg", is_default: true },
    { id: 2, title: "Truffle Burger", price: "$9.00", stars: 4.5, img: "http://localhost:5000/images/TruffleBurger.jpg", is_default: true }
];

// Menu endpoints
app.get('/api/menu/items', (req, res) => {
    res.json({ success: true, data: mockMenuItems });
});

app.get('/api/menu/special', (req, res) => {
    res.json({ success: true, data: mockSpecialItems });
});

// Order endpoint
app.post('/api/orders', (req, res) => {
    const order = req.body;
    console.log('New order:', order);
    res.json({
        success: true,
        message: 'Order received',
        data: { id: Date.now(), ...order, status: 'pending' }
    });
});

// Message endpoint
app.post('/api/messages', (req, res) => {
    const message = req.body;
    console.log('New message:', message);
    res.json({
        success: true,
        message: 'Message received',
        data: { id: Date.now(), ...message, read: false }
    });
});

// Admin login (mock)
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        res.json({
            success: true,
            message: 'Login successful',
            token: 'mock-token-' + Date.now(),
            user: { id: 1, username: 'admin' }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// Admin endpoints (mock)
app.get('/api/orders', (req, res) => {
    res.json({ success: true, data: [] });
});

app.get('/api/messages', (req, res) => {
    res.json({ success: true, data: [] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📡 Endpoints available:`);
    console.log(`   http://localhost:${PORT}/api/health`);
    console.log(`   http://localhost:${PORT}/api/menu/items`);
    console.log(`   http://localhost:${PORT}/api/menu/special`);
});