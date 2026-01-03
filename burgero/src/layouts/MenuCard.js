import React from 'react';

const MenuCard = ({ id, name, price, description, image, isDefault = true }) => {
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
                onError={(e) => {
                    console.log('Image failed to load:', image);
                    e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(name)}`;
                    e.target.onerror = null;
                }}
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