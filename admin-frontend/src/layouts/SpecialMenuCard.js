import React from 'react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

const SpecialMenuCard = ({ img, title, price, stars = 4.5 }) => {
    // Function to render stars based on rating
    const renderStars = () => {
        const fullStars = Math.floor(stars);
        const hasHalfStar = stars % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex justify-center items-center text-secondary gap-1">
                {[...Array(fullStars)].map((_, i) => (
                    <BsStarFill key={`full-${i}`} />
                ))}
                {hasHalfStar && <BsStarHalf key="half" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <BsStar key={`empty-${i}`} />
                ))}
            </div>
        );
    };

    // Generate fallback SVG
    const getFallbackImage = () => {
        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                <rect width="400" height="300" fill="#fef3c7"/>
                <circle cx="200" cy="150" r="80" fill="#f59e0b" opacity="0.8"/>
                <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#92400e" text-anchor="middle" dy=".3em">
                    ${title || 'Special'}
                </text>
            </svg>
        `;
        return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
    };

    const handleImageError = (e) => {
        console.log('Special menu image failed to load:', img);
        e.target.src = getFallbackImage();
        e.target.onerror = null;
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
            {/* Image */}
            <img
                className="w-full h-52 object-cover"
                src={img || getFallbackImage()}
                alt={title}
                onError={handleImageError}
            />

            {/* Content */}
            <div className="space-y-4 py-6 px-4">
                {/* Title */}
                <h3 className="font-semibold text-2xl text-primary text-center">
                    {title}
                </h3>

                {/* Stars */}
                {renderStars()}
                <div className="text-center text-sm text-gray-500">
                    ({stars.toFixed(1)} stars)
                </div>

                {/* Price */}
                <div className="flex items-center justify-center gap-4">
                    <h3 className="font-bold text-2xl text-secondary">{price}</h3>
                </div>
            </div>
        </div>
    );
};

export default SpecialMenuCard;