const MenuItem = require('../models/MenuItem');
const SpecialItem = require('../models/SpecialItem');
const fs = require('fs');
const path = require('path');

// Get all menu items
exports.getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.findAll();
        res.json({ success: true, data: items });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all special items
exports.getSpecialItems = async (req, res) => {
    try {
        const items = await SpecialItem.findAll();
        res.json({ success: true, data: items });
    } catch (error) {
        console.error('Error fetching special items:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add menu item
exports.addMenuItem = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const image = req.file;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Name and price are required'
            });
        }

        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'Image is required'
            });
        }

        const imagePath = `/uploads/${image.filename}`;

        const itemData = {
            name,
            price: parseFloat(price),
            description: description || '',
            image_url: imagePath,
            is_default: false
        };

        const newItem = await MenuItem.create(itemData);

        res.status(201).json({
            success: true,
            message: 'Menu item added successfully',
            data: newItem
        });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add special item
exports.addSpecialItem = async (req, res) => {
    try {
        const { title, price, stars } = req.body;
        const image = req.file;

        if (!title || !price) {
            return res.status(400).json({
                success: false,
                message: 'Title and price are required'
            });
        }

        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'Image is required'
            });
        }

        const imagePath = `/uploads/${image.filename}`;

        const itemData = {
            title,
            price: parseFloat(price),
            stars: stars ? parseFloat(stars) : 4.5,
            image_url: imagePath,
            is_default: false
        };

        const newItem = await SpecialItem.create(itemData);

        res.status(201).json({
            success: true,
            message: 'Special item added successfully',
            data: newItem
        });
    } catch (error) {
        console.error('Error adding special item:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Get item first to delete the image file
        const item = await MenuItem.findById(id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        // Delete image file if it's not a default item
        if (!item.is_default && item.image_url) {
            const imagePath = path.join(__dirname, '..', 'public', item.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        const success = await MenuItem.delete(id);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete menu item'
            });
        }

        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete special item
exports.deleteSpecialItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Get item first to delete the image file
        const item = await SpecialItem.findById(id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Special item not found'
            });
        }

        // Delete image file if it's not a default item
        if (!item.is_default && item.image_url) {
            const imagePath = path.join(__dirname, '..', 'public', item.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        const success = await SpecialItem.delete(id);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete special item'
            });
        }

        res.json({
            success: true,
            message: 'Special item deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting special item:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const image = req.file;

        if (image) {
            // Get old item to delete old image
            const oldItem = await MenuItem.findById(id);
            if (oldItem && !oldItem.is_default && oldItem.image_url) {
                const oldImagePath = path.join(__dirname, '..', 'public', oldItem.image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.image_url = `/uploads/${image.filename}`;
        }

        const success = await MenuItem.update(id, updateData);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item updated successfully'
        });
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update special item
exports.updateSpecialItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const image = req.file;

        if (image) {
            // Get old item to delete old image
            const oldItem = await SpecialItem.findById(id);
            if (oldItem && !oldItem.is_default && oldItem.image_url) {
                const oldImagePath = path.join(__dirname, '..', 'public', oldItem.image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.image_url = `/uploads/${image.filename}`;
        }

        const success = await SpecialItem.update(id, updateData);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Special item not found'
            });
        }

        res.json({
            success: true,
            message: 'Special item updated successfully'
        });
    } catch (error) {
        console.error('Error updating special item:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get statistics
exports.getMenuStats = async (req, res) => {
    try {
        const stats = await MenuItem.getStatistics();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error fetching menu stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getSpecialStats = async (req, res) => {
    try {
        const stats = await SpecialItem.getStatistics();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error fetching special stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};