import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative flex items-center justify-center h-screen">
      {/* Background Image */}
      <img
        src="https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg"
        alt="Home Decoration Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content Container */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative mt-24">
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            Best Collection For
            <br />
            Home Decoration
          </h1>
          <p className="text-lg text-gray-200 max-w-xl mx-auto md:mx-0 mb-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, assumenda? Quisquam itaque
            exercitationem labore vel, dolore quidem asperiores.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-black px-6 py-3 text-sm font-medium rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;