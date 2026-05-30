import React from 'react';
import ProductCard from '../products/ProductCard';

const FeaturedProducts = ({ products }) => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products && products.map((product) => (
            <ProductCard key={product._id} product={product} />  
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;