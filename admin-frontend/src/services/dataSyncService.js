// dataSyncService.js
class DataSyncService {
    constructor() {
        // Common storage keys
        this.ordersKey = 'burgero_orders';
        this.messagesKey = 'burgero_messages';
        this.menuItemsKey = 'burgero_menu_items';
        this.specialItemsKey = 'burgero_special_items';

        // For cross-port communication
        this.isAdmin = window.location.port === '3001';
        this.isUser = window.location.port === '3000';
    }

    // ORDERS
    getOrders() {
        try {
            const orders = JSON.parse(localStorage.getItem(this.ordersKey)) || [];
            return orders;
        } catch (error) {
            console.error('Error getting orders:', error);
            return [];
        }
    }

    addOrder(order) {
        try {
            const orders = this.getOrders();
            const newOrder = {
                ...order,
                id: Date.now(),
                date: new Date().toISOString(),
                status: 'pending'
            };

            orders.push(newOrder);
            localStorage.setItem(this.ordersKey, JSON.stringify(orders));

            // Notify admin if this is user website
            if (this.isUser) {
                this.notifyAdmin('order', newOrder);
            }

            return newOrder;
        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        }
    }

    updateOrderStatus(orderId, status) {
        try {
            const orders = this.getOrders();
            const updatedOrders = orders.map(order =>
                order.id === orderId ? { ...order, status } : order
            );
            localStorage.setItem(this.ordersKey, JSON.stringify(updatedOrders));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    }

    deleteOrder(orderId) {
        try {
            const orders = this.getOrders();
            const filteredOrders = orders.filter(order => order.id !== orderId);
            localStorage.setItem(this.ordersKey, JSON.stringify(filteredOrders));
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    }

    // MESSAGES
    getMessages() {
        try {
            const messages = JSON.parse(localStorage.getItem(this.messagesKey)) || [];
            return messages;
        } catch (error) {
            console.error('Error getting messages:', error);
            return [];
        }
    }

    addMessage(message) {
        try {
            const messages = this.getMessages();
            const newMessage = {
                ...message,
                id: Date.now(),
                date: new Date().toISOString(),
                read: false
            };

            messages.push(newMessage);
            localStorage.setItem(this.messagesKey, JSON.stringify(messages));

            // Notify admin if this is user website
            if (this.isUser) {
                this.notifyAdmin('message', newMessage);
            }

            return newMessage;
        } catch (error) {
            console.error('Error adding message:', error);
            throw error;
        }
    }

    markMessageAsRead(messageId) {
        try {
            const messages = this.getMessages();
            const updatedMessages = messages.map(msg =>
                msg.id === messageId ? { ...msg, read: true } : msg
            );
            localStorage.setItem(this.messagesKey, JSON.stringify(updatedMessages));
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    }

    deleteMessage(messageId) {
        try {
            const messages = this.getMessages();
            const filteredMessages = messages.filter(msg => msg.id !== messageId);
            localStorage.setItem(this.messagesKey, JSON.stringify(filteredMessages));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }

    // For cross-port communication (development only)
    notifyAdmin(type, data) {
        try {
            // This is a trick to simulate data sharing between ports
            // In production, this would be an API call

            // Save to a special key that admin can check
            const syncKey = `burgero_sync_${type}`;
            const syncData = {
                type,
                data,
                timestamp: Date.now(),
                from: 'user'
            };
            localStorage.setItem(syncKey, JSON.stringify(syncData));

            // Trigger storage event (works across tabs on same origin)
            window.dispatchEvent(new StorageEvent('storage', {
                key: syncKey,
                newValue: JSON.stringify(syncData)
            }));

            console.log(`[SYNC] ${type} data prepared for admin`);
        } catch (error) {
            console.error('Error notifying admin:', error);
        }
    }

    // For admin to check for new data
    checkForNewData(type) {
        const syncKey = `burgero_sync_${type}`;
        const syncData = JSON.parse(localStorage.getItem(syncKey));

        if (syncData && syncData.from === 'user') {
            // Clear the sync flag
            localStorage.removeItem(syncKey);
            return syncData;
        }
        return null;
    }
}

// Create singleton instance
const dataSyncService = new DataSyncService();
export default dataSyncService;