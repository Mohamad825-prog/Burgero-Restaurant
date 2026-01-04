import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuCard from '../layouts/MenuCard.js';
import adminApiService from '../services/adminApiService';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Menu = () => {
    const [menuData, setMenuData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const loadMenuItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedItems = await adminApiService.getMenuItems();
            console.log('Fetched menu items:', fetchedItems);

            if (fetchedItems && Array.isArray(fetchedItems)) {
                // Transform all items (both default and custom)
                const transformedItems = fetchedItems.map(item => {
                    // Generate fallback SVG if no image
                    const getFallbackSvg = (name) => {
                        const svg = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                                <rect width="400" height="300" fill="#f3f4f6"/>
                                <rect x="100" y="100" width="200" height="100" fill="#d1d5db" rx="10"/>
                                <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#6b7280" text-anchor="middle" dy=".3em">
                                    ${name || 'Burger'}
                                </text>
                            </svg>
                        `;
                        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
                    };

                    // Determine image URL
                    let imageUrl;
                    if (item.image_url) {
                        // If it's a full URL, use it; otherwise prepend backend URL
                        imageUrl = item.image_url.startsWith('http')
                            ? item.image_url
                            : `http://localhost:5000${item.image_url}`;
                    } else if (item.image) {
                        imageUrl = item.image;
                    } else {
                        imageUrl = getFallbackSvg(item.name);
                    }

                    // Check if item is default (id 1-6 are default items)
                    const isDefault = item.id >= 1 && item.id <= 6;

                    return {
                        id: item.id,
                        name: item.name,
                        price: typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price,
                        description: item.description,
                        image: imageUrl,
                        is_default: isDefault
                    };
                });

                // Sort: default items first (id 1-6), then custom items
                const sortedItems = transformedItems.sort((a, b) => {
                    // Both are default items
                    if (a.is_default && b.is_default) {
                        return a.id - b.id; // Sort by ID for defaults
                    }
                    // Only a is default
                    if (a.is_default) return -1;
                    // Only b is default
                    if (b.is_default) return 1;
                    // Both are custom
                    return b.id - a.id; // Newest custom items first
                });

                setMenuData(sortedItems);
            } else {
                setMenuData([]);
            }
        } catch (error) {
            console.error('Error loading menu items:', error);
            setError('Failed to load menu items from server');
            setMenuData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMenuItems();

        // Check for refresh flag from edit page
        if (location.state?.refresh) {
            setSuccess('Item updated successfully!');
            setTimeout(() => setSuccess(null), 3000);
            // Clear the state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleEditItem = (item) => {
        navigate(`/edit-item/${item.id}`, {
            state: {
                type: 'menu',
                item: item
            }
        });
    };

    const handleDeleteItem = async (id, isDefault) => {
        if (isDefault) {
            alert("Cannot delete default items. You can only delete items you added.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            await adminApiService.deleteMenuItem(id);
            setSuccess('Item deleted successfully');
            setTimeout(() => setSuccess(null), 3000);
            loadMenuItems(); // Refresh after delete
        } catch (error) {
            console.error('Error deleting item:', error);
            setError('Failed to delete item. It may have already been removed.');
            loadMenuItems(); // Refresh even on error
        }
    };

    const handleAddItem = () => {
        navigate('/add-item');
    };

    const handleRefresh = () => {
        loadMenuItems();
    };

    const defaultItems = menuData.filter(item => item.is_default);
    const customItems = menuData.filter(item => !item.is_default);

    return (
        <div className="bg-tertiary py-16 min-h-screen">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="font-extrabold text-4xl md:text-5xl text-center md:text-left text-secondary">
                        Menu Management
                    </h1>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleAddItem}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center gap-2"
                        >
                            <FaPlus /> Add New Item
                        </button>
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2"
                        >
                            ↻ Refresh
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700">{success}</p>
                    </div>
                )}

                <div className="mb-6 bg-white rounded-xl shadow-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-700">{menuData.length}</div>
                            <div className="text-gray-600">Total Items</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-700">{defaultItems.length}</div>
                            <div className="text-gray-600">Default Items</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-700">{customItems.length}</div>
                            <div className="text-gray-600">Custom Items</div>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-600">Loading menu items...</p>
                    </div>
                ) : menuData.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No menu items found</p>
                        <p className="text-sm text-gray-400 mt-2">Add your first menu item using the "Add New Item" button</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
                            {menuData.map((item) => (
                                <div key={item.id} className="relative group">
                                    <MenuCard
                                        name={item.name}
                                        price={item.price}
                                        description={item.description}
                                        image={item.image}
                                    />
                                    {/* Action Buttons */}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => handleEditItem(item)}
                                            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition shadow-lg"
                                            title="Edit item"
                                        >
                                            <FaEdit />
                                        </button>
                                        {!item.is_default && (
                                            <button
                                                onClick={() => handleDeleteItem(item.id, item.is_default)}
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                                                title="Delete item"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                    {item.is_default && (
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                                Default
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Info Section */}
                        <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-bold text-secondary mb-3">Menu Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-700">Default Items:</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• IDs 1-6 are default items</li>
                                        <li>• Cannot be deleted</li>
                                        <li>• Can be edited (name, price, description, image)</li>
                                        <li>• Always shown first in the list</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-700">Custom Items:</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• IDs 7+ are custom items</li>
                                        <li>• Can be edited or deleted</li>
                                        <li>• Added via "Add New Item" button</li>
                                        <li>• Shown after default items</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-blue-700 text-sm">
                                    <strong>Note:</strong> All items are fetched from the database.
                                    Changes made to default items will appear here after refresh.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Menu;