const pool = require('../config/database');

class SpecialItem {
    // Create new special item
    static async create(itemData) {
        try {
            const { title, price, stars, image_url } = itemData;

            const [result] = await pool.query(
                `INSERT INTO special_items (title, price, stars, image_url, is_default) 
                 VALUES (?, ?, ?, ?, FALSE)`,
                [title, price, stars || 4.5, image_url]
            );

            return { id: result.insertId, ...itemData };
        } catch (error) {
            throw error;
        }
    }

    // Find all special items
    static async findAll(options = {}) {
        try {
            let query = 'SELECT * FROM special_items';
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

    // Find special item by ID
    static async findById(id) {
        try {
            const [items] = await pool.query(
                'SELECT * FROM special_items WHERE id = ?',
                [id]
            );

            return items[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Update special item
    static async update(id, updateData) {
        try {
            const allowedFields = ['title', 'price', 'stars', 'image_url'];
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
                `UPDATE special_items SET ${setClause} WHERE id = ?`,
                values
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete special item
    static async delete(id) {
        try {
            // Check if it's a default item
            const [item] = await pool.query(
                'SELECT is_default FROM special_items WHERE id = ?',
                [id]
            );

            if (item.length === 0) {
                throw new Error('Item not found');
            }

            if (item[0].is_default) {
                throw new Error('Cannot delete default items');
            }

            const [result] = await pool.query(
                'DELETE FROM special_items WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get special items statistics
    static async getStatistics() {
        try {
            const [stats] = await pool.query(`
                SELECT 
                    COUNT(*) as total_items,
                    SUM(CASE WHEN is_default = TRUE THEN 1 ELSE 0 END) as default_items,
                    SUM(CASE WHEN is_default = FALSE THEN 1 ELSE 0 END) as custom_items,
                    AVG(price) as average_price,
                    AVG(stars) as average_rating,
                    MIN(price) as min_price,
                    MAX(price) as max_price
                FROM special_items
            `);

            return stats[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SpecialItem;