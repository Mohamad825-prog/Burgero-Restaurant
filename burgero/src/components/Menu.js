import React, { useState, useEffect } from 'react';
import MenuCard from '../layouts/MenuCard.js';
import apiService from '../services/apiService';

const Menu = () => {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('checking');

    useEffect(() => {
        loadMenuItems();
        checkConnection();
    }, []);

    const checkConnection = async () => {
        const result = await apiService.testConnection();
        setConnectionStatus(result.success ? 'online' : 'offline');
    };

    const loadMenuItems = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Loading menu items...');
            const items = await apiService.getMenuItems();

            if (!items || items.length === 0) {
                throw new Error('No menu items received');
            }

            console.log('Menu items loaded:', items.length, 'items');

            // Debug: Check what image URLs we're getting
            items.forEach(item => {
                console.log(`Item: ${item.name}, Image: ${item.image}`);
            });

            setMenuData(items);
            setConnectionStatus('online');
        } catch (error) {
            console.error('Error in loadMenuItems:', error);
            setError('Failed to load menu items. Using cached data.');
            setConnectionStatus('offline');

            // Try to load from fallback
            const fallbackItems = apiService.getFallbackMenuItems();
            setMenuData(fallbackItems);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        loadMenuItems();
        checkConnection();
    };

    // Connection status display
    const ConnectionStatusBadge = () => {
        if (connectionStatus === 'checking') {
            return (
                <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                    Checking connection...
                </span>
            );
        }

        if (connectionStatus === 'online') {
            return (
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Connected
                </span>
            );
        }

        return (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Using cached data
            </span>
        );
    };

    if (loading && menuData.length === 0) {
        return (
            <div className="bg-tertiary py-16 min-h-screen">
                <div className="container mx-auto">
                    <h1 className="font-extrabold text-4xl md:text-5xl text-center text-secondary mb-12">
                        Our Menu
                    </h1>
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-600">Loading menu items...</p>
                        <div className="mt-4">
                            <ConnectionStatusBadge />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const defaultItems = menuData.filter(item => item.is_default);
    const customItems = menuData.filter(item => !item.is_default);

    // Sort: defaults first, then custom items
    const sortedMenuData = [...defaultItems, ...customItems];

    return (
        <div className="bg-tertiary py-16 min-h-screen">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="font-extrabold text-4xl md:text-5xl text-center md:text-left text-secondary">
                        Our Menu
                    </h1>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="text-sm text-gray-500">
                            <span className="font-bold text-primary">{menuData.length}</span> items available
                            {customItems.length > 0 && (
                                <span className="ml-2 text-green-600">
                                    (+{customItems.length} custom)
                                </span>
                            )}
                        </div>
                        <ConnectionStatusBadge />
                        <button
                            onClick={handleRefresh}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition text-sm"
                        >
                            ↻ Refresh
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-700">{error}</p>
                        {connectionStatus === 'offline' && (
                            <p className="text-yellow-600 text-sm mt-1">
                                You can still browse the menu. Orders will be saved locally and synced when connection is restored.
                            </p>
                        )}
                    </div>
                )}

                {customItems.length > 0 && (
                    <div className="mb-6 text-center">
                        <p className="text-primary font-semibold">
                            ✨ {customItems.length} custom items available
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
                    {sortedMenuData.map((item) => (
                        <MenuCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            price={item.price}
                            description={item.description}
                            image={item.image}
                            isDefault={item.is_default}
                        />
                    ))}
                </div>

                {/* Info Section */}
                <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-secondary mb-3">About Our Menu</h3>
                    <p className="text-gray-600 mb-3">
                        We offer {menuData.length} delicious burger options, including {defaultItems.length} classic favorites
                        {customItems.length > 0 ? ` and ${customItems.length} special additions` : ''}.
                    </p>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            <span className="text-sm text-gray-600">Default Items: {defaultItems.length}</span>
                        </div>
                        {customItems.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Custom Items: {customItems.length}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Connection: {connectionStatus}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;