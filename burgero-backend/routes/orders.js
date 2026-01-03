const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', orderController.getAllOrders);

// GET single order
router.get('/:id', orderController.getOrderById);

// GET orders by status
router.get('/status/:status', orderController.getOrdersByStatus);

// POST create new order
router.post('/', orderController.createOrder);

// PUT update order status
router.put('/:id/status', orderController.updateOrderStatus);

// DELETE order
router.delete('/:id', orderController.deleteOrder);

// GET order statistics
router.get('/stats/summary', orderController.getOrderStats);

module.exports = router;