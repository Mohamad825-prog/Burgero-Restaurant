import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaChartBar, FaCog, FaUsers } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className='bg-secondary text-white py-12'>
            <div className='container flex flex-col md:flex-row justify-between items-center gap-8'>

                {/* Brand */}
                <div className='text-center md:text-start'>
                    <h1 className='text-2xl font-bold'>Burgero Admin Panel</h1>
                    <p className='text-gray-200 mt-2'>Restaurant Management System</p>
                </div>

                {/* Admin Navigation Links */}
                <div className='flex flex-col md:flex-row gap-6'>
                    <Link to="/dashboard" className='hover:text-primary transition flex items-center gap-2'>
                        <FaChartBar /> Dashboard
                    </Link>
                    <Link to="/menu" className='hover:text-primary transition flex items-center gap-2'>
                        Menu Management
                    </Link>
                    <Link to="/orders" className='hover:text-primary transition flex items-center gap-2'>
                        Orders
                    </Link>
                    <Link to="/customers" className='hover:text-primary transition flex items-center gap-2'>
                        <FaUsers /> Customers
                    </Link>
                    <Link to="/settings" className='hover:text-primary transition flex items-center gap-2'>
                        <FaCog /> Settings
                    </Link>
                </div>

                {/* Social Icons */}
                <div className='flex gap-4'>
                    <a href="https://www.facebook.com/BurgeroSaida" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF className='hover:text-primary transition' />
                    </a>
                    <a href="https://www.instagram.com/burgero.saida" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className='hover:text-primary transition' />
                    </a>
                    <a href="https://twitter.com/burgero_saida" target="_blank" rel="noopener noreferrer">
                        <FaTwitter className='hover:text-primary transition' />
                    </a>
                </div>

            </div>

            <div className='text-center text-gray-300 mt-8'>
                &copy; {new Date().getFullYear()} Burgero Admin Panel. For internal use only.
            </div>
        </footer>
    );
};

export default Footer;