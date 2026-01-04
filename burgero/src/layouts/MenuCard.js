import React from 'react';

const MenuCard = ({ id, name, price, description, image, isDefault = true }) => {
    // Create LOCAL SVG fallback (no external dependencies)
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

    // Handle image error
    const handleImageError = (e) => {
        console.log('Image loading failed for:', image);
        // Use LOCAL SVG fallback instead of external placeholder.com
        e.target.src = getFallbackSvg(name);
        e.target.onerror = null; // Prevent infinite loop
    };

    return (
        <div
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            key={id}
        >
            {/* Custom item indicator */}
            {!isDefault && (
                <div className="absolute top-2 left-2 z-10">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                    </span>
                </div>
            )}

            <img
                className="w-full h-64 object-cover rounded-t-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
                src={image}
                alt={name}
                onError={handleImageError}
                loading="lazy"
            />
            <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl md:text-2xl font-bold text-primary group-hover:text-secondary transition-colors">
                        {name}
                    </h2>
                    {!isDefault && (
                        <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                            New
                        </span>
                    )}
                </div>
                <p className="text-gray-600 text-sm md:text-base line-clamp-2">{description}</p>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg md:text-xl font-semibold text-secondary">{price}</h3>
                    <span className="text-xs text-gray-400">#{id}</span>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;