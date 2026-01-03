import React from 'react';

const MenuCard = ({ name, price, description, image }) => {
    // Generate a data URL as fallback
    const getFallbackImage = () => {
        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                <rect width="400" height="300" fill="#f3f4f6"/>
                <rect x="100" y="100" width="200" height="100" fill="#d1d5db" rx="10"/>
                <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#6b7280" text-anchor="middle" dy=".3em">
                    ${name || 'Burger'}
                </text>
            </svg>
        `;
        return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
    };

    const handleImageError = (e) => {
        console.log('Image failed to load:', image);
        e.target.src = getFallbackImage();
        e.target.onerror = null; // Prevent infinite loop
    };

    return (
        <div
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
            <img
                className="w-full h-64 object-cover rounded-t-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
                src={image || getFallbackImage()}
                alt={name}
                onError={handleImageError}
                loading="lazy"
            />
            <div className="p-5 space-y-3">
                <h2 className="text-xl md:text-2xl font-bold text-primary group-hover:text-secondary transition-colors">
                    {name}
                </h2>
                <p className="text-gray-600 text-sm md:text-base">{description}</p>
                <h3 className="text-lg md:text-xl font-semibold text-secondary">{price}</h3>
            </div>
        </div>
    );
};

export default MenuCard;