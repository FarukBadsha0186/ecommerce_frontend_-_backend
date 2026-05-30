import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to ShopEase
          </h1>
          <p className="text-xl mb-8">
            Discover amazing products at unbeatable prices. Shop now and get the best deals!
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;