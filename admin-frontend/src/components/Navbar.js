import React from 'react';
import { Link } from "react-router-dom";
import { FaPlus, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ onLogout }) => {
    return (
        <header className="fixed w-full z-10 py-4 bg-tertiary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
            <div className="container flex flex-row justify-between items-center">
                <div>
                    <Link to="/">
                        <h1 className="font-semibold text-2xl text-secondary">Burgero Admin Panel</h1>
                    </Link>
                </div>

                <nav className="hidden lg:flex gap-8 text-secondary font-semibold text-lg">
                    <Link to="/" className="hover:text-primary transition">Dashboard</Link>
                    <Link to="/orders" className="hover:text-primary transition">Orders</Link>
                    <div className="relative group">
                        <Link to="/add-item" className="hover:text-primary transition flex items-center gap-1">
                            <FaPlus className="text-sm" /> Add Item
                        </Link>
                    </div>
                    <Link to="/contact-messages" className="hover:text-primary transition">Contact Messages</Link>
                    <Link to="/menu" className="hover:text-primary transition">Menu</Link>
                </nav>

                <div className="flex gap-4 items-center">
                    <span className="text-secondary hidden md:block">
                        Welcome, {localStorage.getItem("username")}
                    </span>
                    <button
                        onClick={onLogout}
                        className="bg-red-500 py-2 px-4 text-white font-semibold rounded-md hover:scale-105 transition duration-300 flex items-center gap-2"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;