import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className='bg-secondary text-white py-12'>
            <div className='container flex flex-col md:flex-row justify-between items-center gap-8'>

                {/* Brand */}
                <div className='text-center md:text-start'>
                    <h1 className='text-2xl font-bold'>Burgero Saida</h1>
                    <p className='text-gray-200 mt-2'>Delicious jumping into the mouth</p>
                </div>

                {/* Navigation Links */}
                <div className='flex flex-col md:flex-row gap-6'>
                    <Link to="/" className='hover:text-primary transition'>Home</Link>
                    <Link to="/menu" className='hover:text-primary transition'>Menu</Link>
                    <Link to="/meals" className='hover:text-primary transition'>Hot Meals</Link>
                    <Link to="/special" className='hover:text-primary transition'>Special Menu</Link>
                    <Link to="/testimonial" className='hover:text-primary transition'>Testimonials</Link>
                    <Link to="/contact" className='hover:text-primary transition'>Contact</Link>
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
                &copy; {new Date().getFullYear()} Burgero Saida. Mohamad Khairallah.
            </div>
        </footer>
    );
};

export default Footer;