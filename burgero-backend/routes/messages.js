const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

// Public routes (create message doesn't require auth)
router.post('/', messageController.createMessage);

// Protected routes (admin only)
router.get('/', authMiddleware, adminOnly, messageController.getAllMessages);
router.get('/unread', authMiddleware, adminOnly, messageController.getUnreadMessages);
router.get('/stats', authMiddleware, adminOnly, messageController.getMessageStats);
router.get('/:id', authMiddleware, adminOnly, messageController.getMessageById);
router.put('/:id/read', authMiddleware, adminOnly, messageController.markAsRead);
router.put('/read/all', authMiddleware, adminOnly, messageController.markAllAsRead);
router.delete('/:id', authMiddleware, adminOnly, messageController.deleteMessage);
router.delete('/', authMiddleware, adminOnly, messageController.deleteAllMessages);

module.exports = router;