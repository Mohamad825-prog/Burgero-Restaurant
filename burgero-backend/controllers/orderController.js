const Order = require('../models/Order');

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get orders by status
exports.getOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const orders = await Order.findAll({ status });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders by status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { customer_name, phone, order_details, order_time } = req.body;

        if (!customer_name || !phone || !order_details || !order_time) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const orderData = { customer_name, phone, order_details, order_time };
        const newOrder = await Order.create(orderData);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: newOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'preparing', 'ready', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const success = await Order.update(id, { status });

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const success = await Order.delete(id);

        if (!success) {
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
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
    try {
        const stats = await Order.getStatistics();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching order stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};