import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import adminApiService from '../services/adminApiService';

const EditMenuItemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const itemType = location.state?.type || 'menu'; // 'menu' or 'special'

    const [formData, setFormData] = useState({
        name: "",
        title: "",
        price: "",
        description: "",
        stars: 4.5
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const loadItemData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            let item;
            if (itemType === 'menu') {
                const items = await adminApiService.getMenuItems();
                item = items.find(i => i.id === parseInt(id));
            } else {
                const items = await adminApiService.getSpecialItems();
                item = items.find(i => i.id === parseInt(id));
            }

            if (!item) {
                throw new Error('Item not found');
            }

            // Set form data based on item type
            if (itemType === 'menu') {
                setFormData({
                    name: item.name || '',
                    price: item.price ? (typeof item.price === 'string' ? item.price.replace('$', '') : item.price.toString()) : '',
                    description: item.description || ''
                });
                setCurrentImage(item.image_url || item.image || '');
            } else {
                setFormData({
                    title: item.title || '',
                    price: item.price ? (typeof item.price === 'string' ? item.price.replace('$', '') : item.price.toString()) : '',
                    stars: item.stars || 4.5
                });
                setCurrentImage(item.image_url || item.image || item.img || '');
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error loading item data:', error);
            setError('Failed to load item data');
            setIsLoading(false);
        }
    }, [id, itemType]);

    useEffect(() => {
        loadItemData();
    }, [loadItemData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            setImageFile(file);
            setError(null);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            // Validate form
            if (itemType === 'menu') {
                if (!formData.name || !formData.price) {
                    throw new Error("Name and price are required");
                }
            } else {
                if (!formData.title || !formData.price) {
                    throw new Error("Title and price are required");
                }
            }

            // Prepare update data
            let updateData = {};
            if (itemType === 'menu') {
                updateData = {
                    name: formData.name.trim(),
                    price: parseFloat(formData.price),
                    description: formData.description?.trim() || ''
                };
            } else {
                updateData = {
                    title: formData.title.trim(),
                    price: parseFloat(formData.price),
                    stars: parseFloat(formData.stars) || 4.5
                };
            }

            console.log('Updating item:', updateData);

            // Call update API
            let result;
            if (itemType === 'menu') {
                result = await adminApiService.updateMenuItem(id, updateData, imageFile);
            } else {
                result = await adminApiService.updateSpecialItem(id, updateData, imageFile);
            }

            console.log('Update result:', result);

            if (result.success) {
                setSuccess(`${itemType === 'menu' ? 'Menu item' : 'Special item'} updated successfully!`);

                // Determine which page to redirect back to
                const redirectPath = itemType === 'menu' ? '/menu' : '/special';

                // Redirect after 2 seconds with refresh flag
                setTimeout(() => {
                    navigate(redirectPath, {
                        state: {
                            refresh: true,
                            message: `${itemType === 'menu' ? 'Menu item' : 'Special item'} updated successfully!`
                        }
                    });
                }, 2000);
            } else {
                throw new Error(result.message || 'Failed to update item');
            }
        } catch (err) {
            console.error('Error updating item:', err);
            let errorMessage = err.message || 'Failed to update item. Please try again.';

            // Check for common errors
            if (err.message.includes('Failed to fetch')) {
                errorMessage = 'Cannot connect to backend server. Make sure the backend is running on http://localhost:5000';
            } else if (err.message.includes('401') || err.message.includes('token')) {
                errorMessage = 'Authentication failed. Please log in again.';
            } else if (err.message.includes('404')) {
                errorMessage = 'Update route not found. Please check if backend has PUT /api/menu/items/:id route.';
            } else if (err.message.includes('HTML error page')) {
                errorMessage = 'Backend returned an error page. The update route might not exist.';
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Navigate back to the appropriate page based on item type
        const redirectPath = itemType === 'menu' ? '/menu' : '/special';
        navigate(redirectPath);
    };

    // Create fallback SVG for image errors
    const getFallbackSvg = (text = 'No Image') => {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                <rect width="400" height="300" fill="#f3f4f6"/>
                <rect x="100" y="100" width="200" height="100" fill="#d1d5db" rx="10"/>
                <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#6b7280" text-anchor="middle" dy=".3em">
                    ${text}
                </text>
            </svg>
        `;
        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-tertiary flex justify-center items-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-600">Loading item data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-tertiary px-6 md:px-32 pt-24 pb-10">
            <h1 className="text-5xl font-extrabold text-primary mb-10">
                Edit {itemType === 'menu' ? 'Menu Item' : 'Special Item'}
            </h1>

            <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {itemType === 'menu' ? (
                        <>
                            <div>
                                <label className="block text-gray-700 mb-2">Burger Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                    placeholder="e.g., Classic Burger"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Price *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                    placeholder="e.g., 8"
                                    min="0"
                                    step="0.01"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Describe your burger..."
                                    disabled={isSubmitting}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-gray-700 mb-2">Special Item Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                    placeholder="e.g., Truffle Burger"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Price *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                    placeholder="e.g., 12"
                                    min="0"
                                    step="0.01"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Rating (0-5)</label>
                                <input
                                    type="number"
                                    name="stars"
                                    value={formData.stars}
                                    onChange={handleChange}
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-gray-700 mb-2">
                            Current Image
                        </label>
                        {currentImage && (
                            <div className="mb-4">
                                <img
                                    src={currentImage}
                                    alt="Current"
                                    className="max-h-48 rounded-lg mx-auto"
                                    onError={(e) => {
                                        e.target.src = getFallbackSvg('No Image Available');
                                        e.target.onerror = null;
                                    }}
                                />
                            </div>
                        )}

                        <label className="block text-gray-700 mb-2">
                            Update Image (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                id="image-upload"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                                disabled={isSubmitting}
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                {imagePreview ? (
                                    <div>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="mx-auto max-h-48 rounded-lg mb-4"
                                            onError={(e) => {
                                                e.target.src = getFallbackSvg('Preview Failed');
                                                e.target.onerror = null;
                                            }}
                                        />
                                        <p className="text-green-600">Click to change image</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-4xl mb-2">📁</div>
                                        <p className="text-gray-600">Click to upload new image</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Leave empty to keep current image. Supports: JPG, PNG, GIF, WebP (Max 5MB)
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {imageFile && (
                            <p className="text-sm text-gray-500 mt-2">
                                New image selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h4 className="font-bold text-red-800 mb-2">Error:</h4>
                            <p className="text-red-700">{error}</p>
                            <div className="mt-3 space-y-2">
                                <p className="text-red-600 text-sm">Possible solutions:</p>
                                <ul className="text-red-600 text-sm list-disc pl-5">
                                    <li>Check if backend server is running on http://localhost:5000</li>
                                    <li>Verify PUT routes exist in backend (menu.js routes file)</li>
                                    <li>Restart backend server after adding PUT routes</li>
                                    <li>Check browser console for more details</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 font-bold">{success}</p>
                            <p className="text-green-600 text-sm mt-1">
                                Redirecting to {itemType === 'menu' ? 'Menu' : 'Special Menu'} page...
                            </p>
                        </div>
                    )}

                    <div className="pt-4 flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 font-bold py-3 rounded-md transition text-lg ${isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-opacity-90'
                                }`}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Item'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className={`flex-1 font-bold py-3 rounded-md transition text-lg ${isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gray-500 text-white hover:bg-gray-600'
                                }`}
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold text-blue-800 mb-2">Item Information:</h3>
                    <p className="text-blue-700 text-sm">Item ID: {id}</p>
                    <p className="text-blue-700 text-sm">Item Type: {itemType}</p>
                    <p className="text-blue-700 text-sm">
                        Note: Changes will automatically appear on the user website and refresh the admin page.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EditMenuItemPage;