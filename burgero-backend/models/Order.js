const pool = require('../config/database');

class Order {
    // Create new order
    static async create(orderData) {
        try {
            const { customer_name, phone, order_details, order_time } = orderData;

            const [result] = await pool.query(
                `INSERT INTO orders 
                 (customer_name, phone, order_details, order_time) 
                 VALUES (?, ?, ?, ?)`,
                [customer_name, phone, order_details, order_time]
            );

            return { id: result.insertId, ...orderData };
        } catch (error) {
            throw error;
        }
    }

    // Find all orders
    static async findAll(options = {}) {
        try {
            let query = 'SELECT * FROM orders';
            const params = [];

            // Add filters if provided
            if (options.status) {
                query += ' WHERE status = ?';
                params.push(options.status);
            }

            // Add sorting
            query += ' ORDER BY created_at DESC';

            // Add pagination
            if (options.limit) {
                query += ' LIMIT ?';
                params.push(options.limit);
            }

            if (options.offset) {
                query += ' OFFSET ?';
                params.push(options.offset);
            }

            const [orders] = await pool.query(query, params);
            return orders;
        } catch (error) {
            throw error;
        }
    }

    // Find order by ID
    static async findById(id) {
        try {
            const [orders] = await pool.query(
                'SELECT * FROM orders WHERE id = ?',
                [id]
            );

            return orders[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Update order
    static async update(id, updateData) {
        try {
            const allowedFields = ['status', 'customer_name', 'phone', 'order_details', 'order_time'];
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
                `UPDATE orders SET ${setClause} WHERE id = ?`,
                values
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete order
    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM orders WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get order statistics
    static async getStatistics() {
        try {
            // Daily statistics for last 7 days
            const [dailyStats] = await pool.query(`
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as total_orders,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'preparing' THEN 1 ELSE 0 END) as preparing,
                    SUM(CASE WHEN status = 'ready' THEN 1 ELSE 0 END) as ready,
                    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
                FROM orders
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            `);

            // Status distribution
            const [statusStats] = await pool.query(`
                SELECT status, COUNT(*) as count
                FROM orders
                GROUP BY status
            `);

            // Total counts
            const [totalStats] = await pool.query(`
                SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_total,
                    COUNT(CASE WHEN status = 'preparing' THEN 1 END) as preparing_total,
                    COUNT(CASE WHEN status = 'ready' THEN 1 END) as ready_total,
                    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_total
                FROM orders
            `);

            return {
                dailyStats,
                statusStats,
                totalStats: totalStats[0]
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Order;