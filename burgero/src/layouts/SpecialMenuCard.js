import React from 'react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

const SpecialMenuCard = ({ img, title, price, stars = 4.5 }) => {
    // Function to render stars based on rating
    const renderStars = () => {
        const fullStars = Math.floor(stars);
        const hasHalfStar = stars % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <>
                {[...Array(fullStars)].map((_, i) => (
                    <BsStarFill key={`full-${i}`} />
                ))}
                {hasHalfStar && <BsStarHalf key="half" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <BsStar key={`empty-${i}`} />
                ))}
            </>
        );
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
            {/* Image */}
            <img
                className="w-full h-52 object-cover"
                src={img}
                alt={title}
                onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x300?text=${title}`;
                }}
            />

            {/* Content */}
            <div className="space-y-4 py-6 px-4">
                {/* Title */}
                <h3 className="font-semibold text-2xl text-primary text-center">
                    {title}
                </h3>

                {/* Stars */}
                <div className="flex justify-center text-secondary gap-1">
                    {renderStars()}
                    <span className="ml-2 text-sm text-gray-500">
                        ({stars.toFixed(1)})
                    </span>
                </div>

                {/* Price + Button */}
                <div className="flex items-center justify-center gap-4">
                    <h3 className="font-bold text-2xl text-secondary">{price}</h3>
                </div>
            </div>
        </div>
    );
};

export default SpecialMenuCard;