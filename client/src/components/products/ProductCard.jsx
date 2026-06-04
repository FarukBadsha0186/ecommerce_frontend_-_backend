// components/products/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  // Debug: Check if product data is coming
  console.log('ProductCard received:', product);
  
  if (!product) {
    console.log('No product data');
    return null;
  }

  // Calculate price display
  const getPrice = () => {
    if (product.is_discount && product.discount_price) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 line-through text-sm">${product.price}</span>
          <span className="text-red-600 font-bold">${product.discount_price}</span>
        </div>
      );
    }
    return <span className="text-gray-900 font-bold">${product.price}</span>;
  };

  // Get first image
// const productImage = `http://localhost:5000${product.images[0]}`;
const productImage = product.images && product.images[0] 
    ? product.images[0].startsWith('http') 
        ? product.images[0]  // Cloudinary URL — directly use করো
        : `https://ecommerce-8lhe.onrender.com${product.images[0]}`
    : 'https://via.placeholder.com/300x200';

  // Get category name
  const categoryName = product.category && product.category.length > 0 
    ? product.category[0]?.name 
    : '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Link to={`/product/${product._id}`}>
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img 
            src={productImage} 
            alt={product.title || 'Product'} 
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
          {product.is_discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        {categoryName && (
          <p className="text-sm text-gray-500 mb-1">{categoryName}</p>
        )}
        
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 line-clamp-2">
            {product.title || 'Product Title'}
          </h3>
        </Link>
        
        {product.short_description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.short_description}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-2">
          {getPrice()}
          <button 
            disabled={product.stock === 0}
            className={`flex items-center gap-1 px-3 py-1 rounded transition ${
              product.stock === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FiShoppingCart size={16} />
            <span>Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;