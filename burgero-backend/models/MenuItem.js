const pool = require('../config/database');

class MenuItem {
    // Create new menu item
    static async create(itemData) {
        try {
            const { name, price, description, image_url } = itemData;

            const [result] = await pool.query(
                `INSERT INTO menu_items (name, price, description, image_url, is_default) 
                 VALUES (?, ?, ?, ?, FALSE)`,
                [name, price, description, image_url]
            );

            return { id: result.insertId, ...itemData };
        } catch (error) {
            throw error;
        }
    }

    // Find all menu items
    static async findAll(options = {}) {
        try {
            let query = 'SELECT * FROM menu_items';
            const params = [];

            // Add filters if provided
            if (options.is_default !== undefined) {
                query += ' WHERE is_default = ?';
                params.push(options.is_default);
            }

            // Add sorting
            query += ' ORDER BY is_default DESC, created_at DESC';

            // Add pagination
            if (options.limit) {
                query += ' LIMIT ?';
                params.push(options.limit);
            }

            if (options.offset) {
                query += ' OFFSET ?';
                params.push(options.offset);
            }

            const [items] = await pool.query(query, params);
            return items;
        } catch (error) {
            throw error;
        }
    }

    // Find menu item by ID
    static async findById(id) {
        try {
            const [items] = await pool.query(
                'SELECT * FROM menu_items WHERE id = ?',
                [id]
            );

            return items[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Update menu item
    static async update(id, updateData) {
        try {
            const allowedFields = ['name', 'price', 'description', 'image_url'];
            const fieldsToUpdate = {};

            // Filter only allowed fields
            Object.keys(updateData).forEach(key => {
                if (allowedFields.includes(key)) {
                    fieldsToUpdate[key] = updateData[key];
                }
            });

            if (Object.keys(fieldsToUpdate).length === 0) {
                throw new Error('No valid fields to update');
            }

            const setClause = Object.keys(fieldsToUpdate)
                .map(field => `${field} = ?`)
                .join(', ');

            const values = [...Object.values(fieldsToUpdate), id];

            const [result] = await pool.query(
                `UPDATE menu_items SET ${setClause} WHERE id = ?`,
                values
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete menu item
    static async delete(id) {
        try {
            // Check if it's a default item
            const [item] = await pool.query(
                'SELECT is_default FROM menu_items WHERE id = ?',
                [id]
            );

            if (item.length === 0) {
                throw new Error('Item not found');
            }

            if (item[0].is_default) {
                throw new Error('Cannot delete default items');
            }

            const [result] = await pool.query(
                'DELETE FROM menu_items WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get menu statistics
    static async getStatistics() {
        try {
            const [stats] = await pool.query(`
                SELECT 
                    COUNT(*) as total_items,
                    SUM(CASE WHEN is_default = TRUE THEN 1 ELSE 0 END) as default_items,
                    SUM(CASE WHEN is_default = FALSE THEN 1 ELSE 0 END) as custom_items,
                    AVG(price) as average_price,
                    MIN(price) as min_price,
                    MAX(price) as max_price
                FROM menu_items
            `);

            return stats[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MenuItem;