import React, { useState, useEffect } from 'react';
import HeroImg from '../assets/Hero.jpg';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye, FaCog } from 'react-icons/fa';
import adminApiService from '../services/adminApiService';

const Hero = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        orders: 0,
        messages: 0,
        menuItems: 0,
        specialItems: 0
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [ordersRes, messagesRes, menuRes, specialRes] = await Promise.all([
                    adminApiService.getOrders(),
                    adminApiService.getMessages(),
                    adminApiService.getMenuItems(),
                    adminApiService.getSpecialItems()
                ]);

                setStats({
                    orders: (ordersRes || []).length,
                    messages: (messagesRes || []).length,
                    menuItems: (menuRes || []).length,
                    specialItems: (specialRes || []).length
                });
            } catch (error) {
                console.error('Error loading stats:', error);
                // Fallback to localStorage if API fails
                setStats({
                    orders: JSON.parse(localStorage.getItem('burgero_orders') || '[]').length,
                    messages: JSON.parse(localStorage.getItem('burgero_messages') || '[]').length,
                    menuItems: JSON.parse(localStorage.getItem('burgero_menu_items') || '[]').length + 6,
                    specialItems: JSON.parse(localStorage.getItem('burgero_special_items') || '[]').length + 3
                });
            }
        };

        loadStats();
        // Refresh stats every 10 seconds
        const interval = setInterval(loadStats, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="min-h-screen container flex flex-col justify-center md:flex-row md:justify-center items-center gap-8 px-6 md:gap-16">
                {/* content section */}
                <div className="w-full md:w-2/4 space-y-8 text-center md:text-start mt-24 md:mt-10">
                    <div>
                        <h3 className="font-bold text-4xl md:text-5xl">Welcome to Burgero</h3>
                        <h1 className="font-bold text-5xl md:text-7xl mt-2 text-primary">Admin Panel</h1>
                    </div>
                    <p className="text-lg text-gray-600">Manage your restaurant operations efficiently from one dashboard</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/orders')}
                            className="bg-primary py-3 px-6 text-white font-semibold rounded-md hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
                        >
                            <FaEye /> View Orders
                        </button>
                        <button
                            onClick={() => navigate('/add-item')}
                            className="bg-secondary py-3 px-6 text-white font-semibold rounded-md hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
                        >
                            <FaPlus /> Add New Item
                        </button>
                        <button
                            onClick={() => navigate('/contact-messages')}
                            className="bg-blue-500 py-3 px-6 text-white font-semibold rounded-md hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
                        >
                            <FaEye /> View Messages
                        </button>
                        <button
                            onClick={() => navigate('/menu')}
                            className="bg-green-500 py-3 px-6 text-white font-semibold rounded-md hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
                        >
                            <FaCog /> Manage Menu
                        </button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mt-4">
                        <h4 className="font-bold text-lg mb-2">Quick Stats</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-600">Orders:</span>
                                <span className="ml-2 font-bold">{stats.orders}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Messages:</span>
                                <span className="ml-2 font-bold">{stats.messages}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Menu Items:</span>
                                <span className="ml-2 font-bold">{stats.menuItems}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Special Items:</span>
                                <span className="ml-2 font-bold">{stats.specialItems}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* image section */}
                <div className="w-full md:w-2/4">
                    <img src={HeroImg} alt="admin dashboard" className="rounded-lg shadow-lg" />
                </div>
            </div>
        </div>
    );
};

export default Hero;