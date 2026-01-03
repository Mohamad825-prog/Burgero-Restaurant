const Message = require('../models/Message');

// Get all messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.findAll();
        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get unread messages
exports.getUnreadMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({ read: false });
        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('Error fetching unread messages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get message by ID
exports.getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.json({ success: true, data: message });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create new message
exports.createMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const messageData = { name, email, message };
        const newMessage = await Message.create(messageData);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const success = await Message.markAsRead(id);

        if (!success) {
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
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Mark all messages as read
exports.markAllAsRead = async (req, res) => {
    try {
        const count = await Message.markAllAsRead();

        res.json({
            success: true,
            message: 'All messages marked as read',
            data: { markedCount: count }
        });
    } catch (error) {
        console.error('Error marking all messages as read:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete message
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const success = await Message.delete(id);

        if (!success) {
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
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete all messages
exports.deleteAllMessages = async (req, res) => {
    try {
        const count = await Message.deleteAll();

        res.json({
            success: true,
            message: 'All messages deleted successfully',
            data: { deletedCount: count }
        });
    } catch (error) {
        console.error('Error deleting all messages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get message statistics
exports.getMessageStats = async (req, res) => {
    try {
        const stats = await Message.getStatistics();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching message stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};