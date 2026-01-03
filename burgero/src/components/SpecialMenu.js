import React, { useState, useEffect } from 'react';
import SpecialMenuCard from '../layouts/SpecialMenuCard';
import apiService from '../services/apiService';

// Import default images (fallback)
import img1 from '../assets/PepperMaize.jpg';
import img2 from '../assets/TruffleBurger.jpg';
import img3 from '../assets/Burgerita.jpg';

// Default special menu items
const defaultSpecialMenuData = [
    { id: 1, img: img1, title: "Pepper Maize", price: "$10", stars: 4.5 },
    { id: 2, img: img2, title: "Truffle Burger", price: "$9", stars: 4.5 },
    { id: 3, img: img3, title: "Burgerita", price: "$11", stars: 4.5 },
];

const SpecialMenu = () => {
    const [specialMenuData, setSpecialMenuData] = useState(defaultSpecialMenuData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSpecialMenuItems();
    }, []);

    const loadSpecialMenuItems = async () => {
        try {
            setLoading(true);
            setError(null);

            // Try to fetch special items from backend API
            const items = await apiService.getSpecialItems();

            if (items && items.length > 0) {
                // Combine defaults and API items
                const allItems = [...defaultSpecialMenuData];

                // Add only non-default items from API
                items.forEach(apiItem => {
                    if (!apiItem.is_default) {
                        allItems.push({
                            id: apiItem.id,
                            img: apiItem.image || `http://localhost:5000/images/placeholder.jpg`,
                            title: apiItem.title,
                            price: typeof apiItem.price === 'string' ? apiItem.price : `$${apiItem.price}`,
                            stars: parseFloat(apiItem.stars) || 4.5
                        });
                    }
                });

                setSpecialMenuData(allItems);
            } else {
                setSpecialMenuData(defaultSpecialMenuData);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to load special menu items');
            setLoading(false);
            console.error('Error loading special menu items:', err);
            setSpecialMenuData(defaultSpecialMenuData);
        }
    };

    const handleRefresh = () => {
        loadSpecialMenuItems();
    };

    if (loading) {
        return (
            <div>
                <div className="min-h-screen flex flex-col justify-center items-center px-5 md:px-32 pt-24">
                    <h1 className="font-extrabold text-5xl text-center text-primary my-10 tracking-wide drop-shadow-md">
                        Special Menu
                    </h1>
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-600">Loading special menu items...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="min-h-screen flex flex-col justify-center items-center px-5 md:px-32 pt-24">
                    <h1 className="font-extrabold text-5xl text-center text-primary my-10 tracking-wide drop-shadow-md">
                        Special Menu
                    </h1>
                    <div className="text-center py-10">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="min-h-screen flex flex-col justify-center items-center px-5 md:px-32 pt-24">
                {/* Heading */}
                <div className="w-full text-center mb-10">
                    <h1 className="font-extrabold text-5xl text-center text-primary my-10 tracking-wide drop-shadow-md">
                        Special Menu
                    </h1>

                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div className="text-lg text-gray-600 mb-4 md:mb-0">
                            <span className="font-bold text-primary">{specialMenuData.length}</span> special items available
                        </div>

                        {specialMenuData.length > defaultSpecialMenuData.length && (
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
                                ✨ {specialMenuData.length - defaultSpecialMenuData.length} custom items
                            </div>
                        )}

                        <button
                            onClick={handleRefresh}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition text-sm"
                        >
                            ↻ Refresh
                        </button>
                    </div>
                </div>

                {/* Info Banner */}
                {specialMenuData.length === defaultSpecialMenuData.length ? (
                    <div className="w-full max-w-3xl bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <p className="text-blue-700 text-center">
                            Showing our standard special menu items. New items added by admin will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                        <p className="text-green-700 text-center">
                            ✨ Enjoy our expanded special menu! {specialMenuData.length - defaultSpecialMenuData.length} custom items have been added.
                        </p>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full">
                    {specialMenuData.map((item) => (
                        <SpecialMenuCard
                            key={item.id}
                            img={item.img}
                            title={item.title}
                            price={item.price}
                            stars={item.stars}
                        />
                    ))}
                </div>

                {/* Refresh Button */}
                <div className="mt-8">
                    <button
                        onClick={handleRefresh}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition"
                    >
                        ↻ Refresh Menu
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SpecialMenu;