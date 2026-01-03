import React from 'react';
import img from '../assets/EggliniBurger.jpg';

const Meals = () => {
    return (
        <div>
            <div className=' min-h-screen container flex flex-col justify-center pt-16 md:pt-0'>
                {/* Heading */}
                <h1 className=' font-semibold text-4xl text-center text-secondary mt-5'>Hot Meals</h1>

                <div className=' flex flex-col md:flex-row gap-10 mt-8'>
                    <div className=' w-full md:w-2/4 overflow-hidden rounded-lg'>
                        <img
                            className='w-full h-56 md:h-96 object-cover rounded-lg transition-transform duration-500 ease-in-out hover:scale-105'
                            src={img}
                            alt='Special combo'
                        />
                    </div>

                    { /* content section */}
                    <div className=' w-full md:w-2/4 text-center md:text-start space-y-4'>
                        <h1 className=' text-4xl md:text-5xl font-bold text-primary'>Special Combo</h1>
                        <h3 className=' text-3xl md:text-4xl font-semibold text-secondary'>Elevate your Meal with our special Bundle</h3>
                        <p className=' text-sm md:text-base text-gray-400'>Discover the true taste of Saida with Burgero s fresh,
                            handcrafted meals made to bring you bold flavor in every bite.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Meals;
