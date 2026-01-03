import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestimonialCard from '../layouts/TestimonialCard';

const Testimonial = () => {

    const data = [
        {
            id: 1,
            name: "Ahmad",
            description: "Great food and excellent service! Highly recommend Burgero for a delicious meal.",
        },
        {
            id: 2,
            name: "Sara",
            description: "The ambiance is fantastic, and the staff is very friendly. Loved my experience at Burgero.",
        },
        {
            id: 3,
            name: "Lina",
            description: "Best burgers in Saida! The ingredients are fresh, and the flavors are amazing. Will come back for sure.",
        },
        {
            id: 4,
            name: "Khaled",
            description: "A must-visit place for burger lovers. The menu has a great variety, and everything I tried was top-notch.",
        },
        {
            id: 5,
            name: "Maya",
            description: "I had a wonderful time at Burgero. The staff made me feel welcome, and the food exceeded my expectations.",
        },
    ];

    const setting = {
        dots: true,
        infinite: true,
        slideToShow: 1,
        slideToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        arrows: false,
        responsive: [
            {
                breakPoint: 1023,
                setting: {
                    slideToShow: 1,
                    slideToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakPoint: 768,
                setting: {
                    slideToShow: 1,
                    slideToScroll: 1,
                    initialSlide: 1,
                },
            },
            {
                breakPoint: 480,
                setting: {
                    slideToShow: 1,
                    slideToScroll: 1,
                    initialSlide: 1,
                },
            },
        ],
    };

    return (
        <div>

            {/* heading */}
            <h1 className=' font-semibold text-4xl text-center text-secondary pt-24'>Our Testimonial</h1>

            <div className=' py-10 mx-4 md:mx-0'>
                <Slider {...setting}>
                    {data.map((item) => (
                        <TestimonialCard key={item.id} name={item.name} description={item.description} />
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default Testimonial;
