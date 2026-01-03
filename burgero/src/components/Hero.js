import React from 'react';
import HeroImg from '../assets/Hero.jpg';

const Hero = ({ openOrderModal }) => {
    return (
        <div>
            <div className="min-h-screen container flex flex-col justify-center md:flex-row md:justify-center items-center gap-8 px-6 md:gap-16">
                {/* content section */}
                <div className="w-full md:w-2/4 space-y-6 text-center md:text-start mt-24 md:mt-10">
                    <div>
                        <h3 className="font-bold text-4xl md:text-5xl">Welcome to Burgero</h3>
                        <h1 className="font-bold text-5xl md:text-7xl mt-2 text-primary">Burgero Restaurant</h1>
                    </div>
                    <p>Delicious jumping into the mouth</p>
                    <button
                        onClick={openOrderModal}
                        className="bg-primary py-2 px-4 text-white font-semibold rounded-md hover:scale-105 transition duration-300"
                    >
                        Order Now
                    </button>
                </div>

                {/* image section */}
                <div>
                    <img src={HeroImg} alt="img" />
                </div>
            </div>
        </div>
    );
};

export default Hero;
