import ClassicBurger from '../assets/ClassicBurger.jpg';
import TheLebanese from '../assets/TheLebanese.jpg';
import MushroomVibes from '../assets/MushroomVibes.jpg';
import TheBurgero from '../assets/TheBurgero.jpg';
import TheMozz from '../assets/TheMozz.jpg';
import TheSmashBurger from '../assets/TheSmashBurger.jpg';
import PepperMaize from '../assets/PepperMaize.jpg';
import TruffleBurger from '../assets/TruffleBurger.jpg';
import Burgerita from '../assets/Burgerita.jpg';

// Change this line:
// const API_BASE_URL = 'http://localhost:5000/api';
// To this:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.isOnline = true;
        this.checkConnection();
    }

    async checkConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
            this.isOnline = response.ok;
        } catch (error) {
            this.isOnline = false;
            console.warn('Backend is not reachable.');
        }
    }

    // Get full image URL
    getImageUrl(imagePath) {
        if (!imagePath) return null;

        // If it's already a full URL, use it
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        // If it's a local image path (starts with /images/)
        if (imagePath.startsWith('/images/')) {
            // For Vercel deployment - images are served from the frontend
            return imagePath;  // ← Just return the path as-is
        }

        // For backend uploaded images (if you implement uploads later)
        if (imagePath.startsWith('/uploads/')) {
            const baseUrl = process.env.REACT_APP_API_URL ?
                process.env.REACT_APP_API_URL.replace('/api', '') :
                'http://localhost:5000';
            return `${baseUrl}${imagePath}`;
        }

        // Default: return as-is
        return imagePath;
    }

    // ORDERS
    async createOrder(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    customer_name: orderData.name.trim(),
                    phone: orderData.phone.trim(),
                    order_details: orderData.order.trim(),
                    order_time: orderData.time
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Order failed: ${response.status}`);
            }

            const result = await response.json();
            return {
                success: true,
                data: result.data,
                message: result.message
            };

        } catch (error) {
            return await this.handleApiError(
                error,
                'burgero_orders_fallback',
                {
                    customer_name: orderData.name,
                    phone: orderData.phone,
                    order_details: orderData.order,
                    order_time: orderData.time,
                    status: 'pending'
                }
            );
        }
    }

    // MESSAGES
    async sendMessage(messageData) {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: messageData.name.trim(),
                    email: messageData.email.trim(),
                    message: messageData.message.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Message failed: ${response.status}`);
            }

            const result = await response.json();
            return {
                success: true,
                data: result.data,
                message: result.message
            };

        } catch (error) {
            console.error('Error sending message:', error);

            const fallbackMessage = {
                id: Date.now(),
                ...messageData,
                date: new Date().toISOString(),
                read: false
            };

            const existingMessages = JSON.parse(localStorage.getItem('burgero_messages_fallback') || '[]');
            existingMessages.push(fallbackMessage);
            localStorage.setItem('burgero_messages_fallback', JSON.stringify(existingMessages));

            return {
                success: true,
                data: fallbackMessage,
                message: 'Message received (saved locally).'
            };
        }
    }

    // MENU ITEMS
    async getMenuItems() {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/items`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to fetch menu items`);
            }

            const data = await response.json();
            const items = data.data || [];

            // Transform items to include full image URLs
            const transformedItems = items.map(item => ({
                id: item.id,
                name: item.name || 'Unknown Item',
                price: typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price || '$0.00',
                description: item.description || 'Delicious burger',
                image: this.getImageUrl(item.image_url),
                is_default: item.is_default !== undefined ? item.is_default : true
            }));

            return transformedItems;

        } catch (error) {
            console.error('Error fetching menu items:', error.message);
            return this.getFallbackMenuItems();
        }
    }

    // SPECIAL ITEMS
    async getSpecialItems() {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/special`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to fetch special items`);
            }

            const data = await response.json();
            const items = data.data || [];

            // Transform items to include full image URLs
            const transformedItems = items.map(item => ({
                id: item.id,
                title: item.title || 'Special Item',
                price: typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price || '$0.00',
                stars: parseFloat(item.stars) || 4.5,
                image: this.getImageUrl(item.image_url),
                is_default: item.is_default !== undefined ? item.is_default : true
            }));

            return transformedItems;

        } catch (error) {
            console.error('Error fetching special items:', error.message);
            return this.getFallbackSpecialItems();
        }
    }

    // Helper: Get default menu items with local images
    getDefaultMenuItems() {
        return [
            {
                id: 1,
                name: 'Classic Burger',
                price: '$8.00',
                description: 'A timeless favorite with lettuce, tomato, and cheese.',
                image: ClassicBurger,
                is_default: true
            },
            {
                id: 2,
                name: 'The Lebanese',
                price: '$9.00',
                description: 'Featuring a blend of spices and fresh veggies.',
                image: TheLebanese,
                is_default: true
            },
            {
                id: 3,
                name: 'Mushroom Vibes',
                price: '$10.00',
                description: 'Sauteed mushrooms with Swiss cheese and garlic aioli.',
                image: MushroomVibes,
                is_default: true
            },
            {
                id: 4,
                name: 'The Burgero',
                price: '$7.00',
                description: 'Our signature burger with special sauce and pickles.',
                image: TheBurgero,
                is_default: true
            },
            {
                id: 5,
                name: 'The Mozz',
                price: '$10.00',
                description: 'Mozzarella-stuffed patty with marinara sauce.',
                image: TheMozz,
                is_default: true
            },
            {
                id: 6,
                name: 'The Smash Burger',
                price: '$11.00',
                description: 'Double patty smashed to perfection with crispy edges.',
                image: TheSmashBurger,
                is_default: true
            }
        ];
    }

    // Helper: Get default special items with local images
    getDefaultSpecialItems() {
        return [
            {
                id: 1,
                title: 'Pepper Maize',
                price: '$10.00',
                stars: 4.5,
                image: PepperMaize,
                is_default: true
            },
            {
                id: 2,
                title: 'Truffle Burger',
                price: '$9.00',
                stars: 4.5,
                image: TruffleBurger,
                is_default: true
            },
            {
                id: 3,
                title: 'Burgerita',
                price: '$11.00',
                stars: 4.5,
                image: Burgerita,
                is_default: true
            }
        ];
    }

    // Fallback menu items
    getFallbackMenuItems() {
        return this.getDefaultMenuItems();
    }

    // Fallback special items
    getFallbackSpecialItems() {
        return this.getDefaultSpecialItems();
    }

    // Test connection
    async testConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            return {
                success: response.ok,
                status: response.status,
                data: data,
                message: response.ok ? 'Backend is reachable' : 'Backend error'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Cannot connect to backend'
            };
        }
    }

    // Add better error handling in all methods:
    async handleApiError(error, fallbackKey, fallbackData) {
        console.error('API Error:', error.message);

        // Check if it's a network error
        if (error.message.includes('Failed to fetch') ||
            error.message.includes('NetworkError') ||
            error.message.includes('Network request failed')) {

            // Store in localStorage for offline mode
            const existingData = JSON.parse(localStorage.getItem(fallbackKey) || '[]');
            const newData = {
                ...fallbackData,
                id: Date.now(),
                date: new Date().toISOString(),
                offline: true
            };
            existingData.push(newData);
            localStorage.setItem(fallbackKey, JSON.stringify(existingData));

            return {
                success: true,
                data: newData,
                message: 'Data saved locally (offline mode)',
                offline: true
            };
        }

        throw error;
    }
}

// Create singleton instance
const apiService = new ApiService();

// Export both default and named exports
export default apiService;

// Named exports for specific methods
export const {
    getMenuItems,
    getSpecialItems,
    createOrder,
    sendMessage,
    testConnection
} = apiService;