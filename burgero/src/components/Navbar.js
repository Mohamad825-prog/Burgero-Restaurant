import React from 'react';
import { Link } from "react-router-dom";

const Navbar = ({ openOrderModal }) => {
    return (
        <header className="fixed w-full z-10 py-4 bg-tertiary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
            <div className="container flex flex-row justify-between items-center">
                <div>
                    <Link to="/">
                        <h1 className="font-semibold text-2xl text-secondary">Burgero Saida</h1>
                    </Link>
                </div>

                <nav className="hidden lg:flex gap-10 text-secondary font-semibold text-lg">
                    <Link to="/menu" className="hover:text-primary transition">Menu</Link>
                    <Link to="/meals" className="hover:text-primary transition">Hot Meals</Link>
                    <Link to="/special" className="hover:text-primary transition">Special Menu</Link>
                    <Link to="/testimonial" className="hover:text-primary transition">Testimonial</Link>
                    <Link to="/contact" className="hover:text-primary transition">Contact</Link>
                </nav>

                <div>
                    <button
                        onClick={openOrderModal}
                        className="bg-secondary py-2 px-4 text-white font-semibold rounded-md hover:scale-105 transition duration-300"
                    >
                        Order Now
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;