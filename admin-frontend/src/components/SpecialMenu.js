import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SpecialMenuCard from '../layouts/SpecialMenuCard';
import adminApiService from '../services/adminApiService';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const SpecialMenu = () => {
    const [specialMenuData, setSpecialMenuData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const loadSpecialMenuItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedItems = await adminApiService.getSpecialItems();
            console.log('Fetched special items:', fetchedItems);

            if (fetchedItems && Array.isArray(fetchedItems)) {
                // Transform all items (both default and custom)
                const transformedItems = fetchedItems.map(item => {
                    // Generate fallback SVG if no image
                    const getFallbackSvg = (title) => {
                        const svg = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                                <rect width="400" height="300" fill="#fef3c7"/>
                                <circle cx="200" cy="150" r="80" fill="#f59e0b" opacity="0.8"/>
                                <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#92400e" text-anchor="middle" dy=".3em">
                                    ${title || 'Special'}
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
                    } else if (item.image || item.img) {
                        imageUrl = item.image || item.img;
                    } else {
                        imageUrl = getFallbackSvg(item.title);
                    }

                    // Check if item is default (id 1-3 are default items)
                    const isDefault = item.id >= 1 && item.id <= 3;

                    return {
                        id: item.id,
                        title: item.title,
                        price: typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price,
                        stars: item.stars || 4.5,
                        img: imageUrl,
                        is_default: isDefault
                    };
                });

                // Sort: default items first (id 1-3), then custom items
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

                setSpecialMenuData(sortedItems);
            } else {
                setSpecialMenuData([]);
            }
        } catch (error) {
            console.error('Error loading special menu items:', error);
            setError('Failed to load special menu items from server');
            setSpecialMenuData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSpecialMenuItems();

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
                type: 'special',
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
            await adminApiService.deleteSpecialItem(id);
            setSuccess('Item deleted successfully');
            setTimeout(() => setSuccess(null), 3000);
            loadSpecialMenuItems(); // Refresh after delete
        } catch (error) {
            console.error('Error deleting item:', error);
            setError('Failed to delete item. It may have already been removed.');
            loadSpecialMenuItems(); // Refresh even on error
        }
    };

    const handleAddItem = () => {
        navigate('/add-item');
    };

    const handleRefresh = () => {
        loadSpecialMenuItems();
    };

    const defaultItems = specialMenuData.filter(item => item.is_default);
    const customItems = specialMenuData.filter(item => !item.is_default);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-5 md:px-32 pt-24">
            {/* Heading */}
            <div className="w-full text-center mb-10">
                <h1 className="font-extrabold text-5xl text-center text-primary my-10 tracking-wide drop-shadow-md">
                    Special Menu Management
                </h1>

                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="text-lg text-gray-600">
                        <span className="font-bold text-primary">{specialMenuData.length}</span> special items available
                        <span className="ml-4">
                            (Default: <span className="text-green-600">{defaultItems.length}</span>,
                            Added: <span className="text-yellow-600">{customItems.length}</span>)
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleAddItem}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center gap-2"
                        >
                            <FaPlus /> Add Special Item
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
            </div>

            {error && (
                <div className="w-full max-w-6xl mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {success && (
                <div className="w-full max-w-6xl mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700">{success}</p>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-600">Loading special menu items...</p>
                </div>
            ) : specialMenuData.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">No special menu items found</p>
                    <p className="text-sm text-gray-400 mt-2">Add your first special item using the "Add Special Item" button</p>
                </div>
            ) : (
                <>
                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full max-w-6xl">
                        {specialMenuData.map((item) => (
                            <div key={item.id} className="relative group">
                                <SpecialMenuCard
                                    img={item.img}
                                    title={item.title}
                                    price={item.price}
                                    stars={item.stars}
                                />
                                {/* Action Buttons */}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
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
                    <div className="mt-12 p-6 bg-white rounded-lg shadow-md max-w-6xl w-full">
                        <h3 className="text-lg font-bold text-secondary mb-3">Special Menu Management</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Default Special Items:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• IDs 1-3 are default items</li>
                                    <li>• Cannot be deleted</li>
                                    <li>• Can be edited (name, price, rating, image)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Custom Special Items:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• IDs 4+ are custom items</li>
                                    <li>• Added via "Add Special Item" button</li>
                                    <li>• Can be edited or deleted</li>
                                    <li>• Appear after default items</li>
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
    );
};

export default SpecialMenu;