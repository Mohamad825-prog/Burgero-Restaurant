import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApiService from '../services/adminApiService';

const AddItemPage = () => {
    const [itemType, setItemType] = useState("menu");
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        title: "",
        stars: 4.5
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

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
            if (itemType === "menu") {
                if (!formData.name || !formData.price) {
                    throw new Error("Name and price are required");
                }
            } else {
                if (!formData.title || !formData.price) {
                    throw new Error("Title and price are required");
                }
            }

            if (!imageFile) {
                throw new Error("Please select an image file");
            }

            // Check if user is authenticated
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error("You are not logged in. Please log in first.");
            }

            // Create FormData for file upload
            const formDataToSend = new FormData();

            if (itemType === "menu") {
                formDataToSend.append('name', formData.name);
                formDataToSend.append('price', parseFloat(formData.price));
                formDataToSend.append('description', formData.description || '');
            } else {
                formDataToSend.append('title', formData.title);
                formDataToSend.append('price', parseFloat(formData.price));
                formDataToSend.append('stars', formData.stars || 4.5);
            }

            formDataToSend.append('image', imageFile);

            console.log('Submitting form data...');
            let result;
            if (itemType === "menu") {
                result = await adminApiService.addMenuItem(formDataToSend);
            } else {
                result = await adminApiService.addSpecialItem(formDataToSend);
            }

            console.log('Result:', result);

            if (result.success) {
                setSuccess(`${itemType === "menu" ? "Menu item" : "Special item"} added successfully!`);

                // Reset form
                setFormData({
                    name: "",
                    price: "",
                    description: "",
                    title: "",
                    stars: 4.5
                });
                setImageFile(null);
                setImagePreview(null);
                document.getElementById('image-upload').value = '';

                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/menu');
                }, 2000);
            } else {
                throw new Error(result.message || 'Failed to add item');
            }
        } catch (err) {
            console.error('Error adding item:', err);
            let errorMessage = err.message || 'Failed to add item. Please try again.';

            // Check for common errors
            if (err.message.includes('Failed to fetch')) {
                errorMessage = 'Cannot connect to backend server. Make sure the backend is running on http://localhost:5000';
            } else if (err.message.includes('401') || err.message.includes('token')) {
                errorMessage = 'Authentication failed. Please log in again.';
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-tertiary px-6 md:px-32 pt-24 pb-10">
            <h1 className="text-5xl font-extrabold text-primary mb-10">Add New Item</h1>

            <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-secondary mb-4">Select Item Type</h2>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setItemType("menu")}
                            className={`px-6 py-3 rounded-lg font-semibold transition ${itemType === "menu"
                                ? "bg-primary text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            Menu Item
                        </button>
                        <button
                            type="button"
                            onClick={() => setItemType("special")}
                            className={`px-6 py-3 rounded-lg font-semibold transition ${itemType === "special"
                                ? "bg-primary text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            Special Menu Item
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {itemType === "menu" ? (
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
                            Image Upload *
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
                                        />
                                        <p className="text-green-600">Click to change image</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-4xl mb-2">📁</div>
                                        <p className="text-gray-600">Click to upload image</p>
                                        <p className="text-sm text-gray-500 mt-1">Supports: JPG, PNG, GIF, WebP (Max 5MB)</p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {imageFile && (
                            <p className="text-sm text-gray-500 mt-2">
                                Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h4 className="font-bold text-red-800 mb-2">Error:</h4>
                            <p className="text-red-700">{error}</p>
                            <p className="text-red-600 text-sm mt-2">
                                Check:
                                <a href="http://localhost:5000/api/health" target="_blank" rel="noopener noreferrer" className="ml-1 underline">
                                    Is backend running?
                                </a>
                            </p>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 font-bold">{success}</p>
                            <p className="text-green-600 text-sm mt-1">Redirecting to menu page...</p>
                        </div>
                    )}

                    <div className="pt-4 flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting || !imageFile}
                            className={`w-full font-bold py-3 rounded-md transition text-lg ${isSubmitting || !imageFile
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-opacity-90'
                                }`}
                        >
                            {isSubmitting ? 'Adding...' : `Add ${itemType === "menu" ? "Menu Item" : "Special Menu Item"}`}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className={`w-full font-bold py-3 rounded-md transition text-lg ${isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gray-500 text-white hover:bg-gray-600'
                                }`}
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                <div className="mt-8 space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <h3 className="font-bold text-yellow-800 mb-2">Debug Info:</h3>
                        <p className="text-yellow-700 text-sm">Backend URL: http://localhost:5000</p>
                        <p className="text-yellow-700 text-sm">Auth Token: {localStorage.getItem('auth_token') ? 'Present' : 'Missing'}</p>
                        <p className="text-yellow-700 text-sm">Item Type: {itemType}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddItemPage;