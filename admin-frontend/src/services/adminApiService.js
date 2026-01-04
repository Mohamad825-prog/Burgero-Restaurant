const API_BASE_URL = process.env.REACT_APP_API_URL;

class AdminApiService {
    constructor() {
        this.token = localStorage.getItem('auth_token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    }

    removeToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('username');
    }

    // Check if token is valid
    async validateToken() {
        if (!this.token) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/check`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    }

    // REAL LOGIN (not test login)
    async login(credentials) {
        try {
            console.log('Attempting REAL login...');

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            console.log('Login response status:', response.status);

            if (!response.ok) {
                let errorMessage = 'Login failed';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Login response data:', data);

            if (data.success && data.token) {
                this.setToken(data.token);
                localStorage.setItem('username', credentials.username);
                console.log('Login successful, token stored');
                return data;
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Get headers for API calls
    getHeaders(isFormData = false) {
        const headers = {};

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        } else if (process.env.NODE_ENV === 'development') {
            headers['X-Test-Token'] = 'test-mode-enabled';
        }

        return headers;
    }

    // ========== MENU ITEMS ==========
    async addMenuItem(formData) {
        try {
            const headers = this.getHeaders(true);
            const response = await fetch(`${API_BASE_URL}/menu/items`, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add menu item');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding menu item:', error);
            throw error;
        }
    }

    async getMenuItems() {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/items`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch menu items');
            }

            return data.data || [];
        } catch (error) {
            console.error('Error fetching menu items:', error);
            throw error;
        }
    }

    async updateMenuItem(id, updateData, imageFile = null) {
        try {
            console.log(`Updating menu item ${id} with data:`, updateData);

            const formData = new FormData();

            // Add update data
            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== undefined && updateData[key] !== null) {
                    formData.append(key, updateData[key]);
                }
            });

            // Add image file if provided
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const headers = this.getHeaders(true);
            const response = await fetch(`${API_BASE_URL}/menu/items/${id}`, {
                method: 'PUT',
                headers: headers,
                body: formData
            });

            // First, check if response is OK
            if (!response.ok) {
                // Try to parse as JSON, but handle HTML errors
                let errorText = await response.text();
                let errorMessage = `HTTP ${response.status}: Failed to update menu item`;

                try {
                    // Try to parse as JSON first
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    // If it's HTML, extract meaningful error
                    if (errorText.includes('<html') || errorText.includes('<!DOCTYPE')) {
                        errorMessage = `Server returned HTML error page. Check backend routes. Status: ${response.status}`;
                    } else if (errorText.trim()) {
                        errorMessage = errorText;
                    }
                }

                throw new Error(errorMessage);
            }

            // If response is OK, parse as JSON
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating menu item:', error);
            throw error;
        }
    }

    async deleteMenuItem(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/items/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete menu item');
            }

            return data;
        } catch (error) {
            console.error('Error deleting menu item:', error);
            throw error;
        }
    }

    // ========== SPECIAL ITEMS ==========
    async addSpecialItem(formData) {
        try {
            const headers = this.getHeaders(true);
            const response = await fetch(`${API_BASE_URL}/menu/special`, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add special item');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding special item:', error);
            throw error;
        }
    }

    async getSpecialItems() {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/special`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch special items');
            }

            return data.data || [];
        } catch (error) {
            console.error('Error fetching special items:', error);
            throw error;
        }
    }

    async updateSpecialItem(id, updateData, imageFile = null) {
        try {
            console.log(`Updating special item ${id} with data:`, updateData);

            const formData = new FormData();

            // Add update data
            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== undefined && updateData[key] !== null) {
                    formData.append(key, updateData[key]);
                }
            });

            // Add image file if provided
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const headers = this.getHeaders(true);
            const response = await fetch(`${API_BASE_URL}/menu/special/${id}`, {
                method: 'PUT',
                headers: headers,
                body: formData
            });

            // First, check if response is OK
            if (!response.ok) {
                // Try to parse as JSON, but handle HTML errors
                let errorText = await response.text();
                let errorMessage = `HTTP ${response.status}: Failed to update special item`;

                try {
                    // Try to parse as JSON first
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    // If it's HTML, extract meaningful error
                    if (errorText.includes('<html') || errorText.includes('<!DOCTYPE')) {
                        errorMessage = `Server returned HTML error page. Check backend routes. Status: ${response.status}`;
                    } else if (errorText.trim()) {
                        errorMessage = errorText;
                    }
                }

                throw new Error(errorMessage);
            }

            // If response is OK, parse as JSON
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating special item:', error);
            throw error;
        }
    }

    async deleteSpecialItem(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/special/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete special item');
            }

            return data;
        } catch (error) {
            console.error('Error deleting special item:', error);
            throw error;
        }
    }

    // ========== ORDERS ==========
    async getOrders() {
        try {
            const data = await this.fetchWithRetry(`${API_BASE_URL}/orders`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return data.data || [];
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Fallback to localStorage
            return JSON.parse(localStorage.getItem('burgero_orders_fallback') || '[]');
        }
    }

    async getOrderById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return data.data || null;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    }

    async updateOrderStatus(id, status) {
        try {
            console.log(`Updating order ${id} status to ${status}`);

            const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ status })
            });

            // First, check if response is OK
            if (!response.ok) {
                let errorText = await response.text();
                let errorMessage = `HTTP ${response.status}: Failed to update order status`;

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    if (errorText.includes('<html') || errorText.includes('<!DOCTYPE')) {
                        errorMessage = `Server returned HTML error page. Status: ${response.status}`;
                    } else if (errorText.trim()) {
                        errorMessage = errorText;
                    }
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }

    async deleteOrder(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete order');
            }

            return data;
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    }

    async getOrderStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/stats/summary`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return data.data || null;
        } catch (error) {
            console.error('Error fetching order stats:', error);
            throw error;
        }
    }

    // ========== MESSAGES ==========
    async getMessages() {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    async getMessageById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return data.data || null;
        } catch (error) {
            console.error('Error fetching message:', error);
            throw error;
        }
    }

    async markMessageAsRead(id) {
        try {
            console.log(`Marking message ${id} as read`);

            const response = await fetch(`${API_BASE_URL}/messages/${id}/read`, {
                method: 'PUT',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                let errorText = await response.text();
                let errorMessage = `HTTP ${response.status}: Failed to mark message as read`;

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    if (errorText.includes('<html') || errorText.includes('<!DOCTYPE')) {
                        errorMessage = `Server returned HTML error page. Status: ${response.status}`;
                    } else if (errorText.trim()) {
                        errorMessage = errorText;
                    }
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error marking message as read:', error);
            throw error;
        }
    }

    async markAllMessagesAsRead() {
        try {
            console.log('Marking all messages as read');

            const response = await fetch(`${API_BASE_URL}/messages/read/all`, {
                method: 'PUT',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                let errorText = await response.text();
                let errorMessage = `HTTP ${response.status}: Failed to mark all messages as read`;

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    if (errorText.includes('<html') || errorText.includes('<!DOCTYPE')) {
                        errorMessage = `Server returned HTML error page. Status: ${response.status}`;
                    } else if (errorText.trim()) {
                        errorMessage = errorText;
                    }
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error marking all messages as read:', error);
            throw error;
        }
    }

    async deleteMessage(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete message');
            }

            return data;
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }

    async deleteAllMessages() {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete all messages');
            }

            return data;
        } catch (error) {
            console.error('Error deleting all messages:', error);
            throw error;
        }
    }

    async getMessageStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/stats`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return data.data || null;
        } catch (error) {
            console.error('Error fetching message stats:', error);
            throw error;
        }
    }

    // ========== AUTH ==========
    async checkAndCreateAdmin() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/ensure-admin`, {
                method: 'POST'
            });

            return await response.json();
        } catch (error) {
            console.error('Failed to ensure admin exists:', error);
            return { success: false, message: error.message };
        }
    }

    async logout() {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: this.getHeaders()
            });
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            this.removeToken();
        }

        return { success: true };
    }

    // Add retry logic for API calls
    async fetchWithRetry(url, options, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                if (i === retries - 1) throw error;
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
    }
}

const adminApiService = new AdminApiService();
export default adminApiService;