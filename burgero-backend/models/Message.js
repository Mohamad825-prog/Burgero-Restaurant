const pool = require('../config/database');

class Message {
    // Create new message
    static async create(messageData) {
        try {
            const { name, email, message } = messageData;

            const [result] = await pool.query(
                `INSERT INTO contact_messages (name, email, message) 
                 VALUES (?, ?, ?)`,
                [name, email, message]
            );

            return { id: result.insertId, ...messageData };
        } catch (error) {
            throw error;
        }
    }

    // Find all messages
    static async findAll(options = {}) {
        try {
            let query = 'SELECT * FROM contact_messages';
            const params = [];

            // Add filters if provided
            if (options.read !== undefined) {
                query += ' WHERE is_read = ?';
                params.push(options.read);
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

            const [messages] = await pool.query(query, params);
            return messages;
        } catch (error) {
            throw error;
        }
    }

    // Find message by ID
    static async findById(id) {
        try {
            const [messages] = await pool.query(
                'SELECT * FROM contact_messages WHERE id = ?',
                [id]
            );

            return messages[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Mark message as read
    static async markAsRead(id) {
        try {
            const [result] = await pool.query(
                'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Mark all messages as read
    static async markAllAsRead() {
        try {
            const [result] = await pool.query(
                'UPDATE contact_messages SET is_read = TRUE WHERE is_read = FALSE'
            );

            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Delete message
    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM contact_messages WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete all messages
    static async deleteAll() {
        try {
            const [result] = await pool.query(
                'DELETE FROM contact_messages'
            );

            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Get message statistics
    static async getStatistics() {
        try {
            // Daily statistics for last 7 days
            const [dailyStats] = await pool.query(`
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as total_messages,
                    SUM(CASE WHEN is_read = TRUE THEN 1 ELSE 0 END) as read_messages,
                    SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) as unread_messages
                FROM contact_messages
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            `);

            // Total counts
            const [totalStats] = await pool.query(`
                SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN is_read = TRUE THEN 1 END) as read_total,
                    COUNT(CASE WHEN is_read = FALSE THEN 1 END) as unread_total
                FROM contact_messages
            `);

            // Recent messages (last 24 hours)
            const [recentMessages] = await pool.query(`
                SELECT COUNT(*) as recent_count
                FROM contact_messages
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
            `);

            return {
                dailyStats,
                totalStats: totalStats[0],
                recentMessages: recentMessages[0].recent_count
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Message;