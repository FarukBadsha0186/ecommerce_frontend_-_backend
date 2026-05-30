// pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/v1/single_product/${id}`);
      
      console.log('Product details:', response.data);
      
      let productData = response.data.product || response.data.data || response.data;
      setProduct(productData);
      
      // Set default selections
      if (productData.color && productData.color.length > 0) {
        setSelectedColor(productData.color[0]);
      }
      if (productData.size && productData.size.length > 0) {
        setSelectedSize(productData.size[0]);
      }
      
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/500'}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          
          {/* Price */}
          <div className="mb-4">
            {product.is_discount && product.discount_price ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">${product.discount_price}</span>
                <span className="text-xl text-gray-400 line-through">${product.price}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                  Save ${product.price - product.discount_price}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-gray-600 mb-6">{product.short_description}</p>
          )}

          {/* Colors */}
          {product.color && product.color.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Color:</h3>
              <div className="flex gap-3">
                {product.color.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded ${
                      selectedColor === color 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.size && product.size.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Size:</h3>
              <div className="flex gap-3">
                {product.size.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantity:</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border rounded hover:bg-gray-100"
              >
                +
              </button>
              <span className="text-gray-500">({product.stock} available)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button 
              disabled={product.stock === 0}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                product.stock === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <FiShoppingCart className="inline mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="px-6 py-3 border rounded-lg hover:bg-gray-50">
              <FiHeart className="inline" />
            </button>
            <button className="px-6 py-3 border rounded-lg hover:bg-gray-50">
              <FiShare2 className="inline" />
            </button>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {product.stock > 0 ? (
                <span className="text-green-600">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600">✗ Out of Stock</span>
              )}
            </p>
          </div>

          {/* Full Description */}
          {product.description && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">Product Details:</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;