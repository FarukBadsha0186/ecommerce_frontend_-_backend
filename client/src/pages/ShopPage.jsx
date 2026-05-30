// pages/ShopPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { FiFilter } from 'react-icons/fi';
import axios from 'axios';

const ShopPage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 6;

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page_no', currentPage);
      params.append('per_page', productsPerPage);
      
      if (selectedCategory !== 'All') {
        // You'll need to map category name to ID
        // params.append('category_id', selectedCategory);
      }
      
      const response = await axios.get(`http://localhost:5000/api/v1/user/all_product/?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        withCredentials: true
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setProducts(response.data.products || []);
        
        // Calculate total pages
        const pages = Math.ceil((response.data.total || 0) / productsPerPage);
        setTotalPages(pages);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(
          (response.data.products || []).map(product => 
            product.category && product.category.length > 0 
              ? product.category[0]?.name 
              : 'Uncategorized'
          ).filter(Boolean)
        )];
        
        setCategories(uniqueCategories);
      } else {
        setError(response.data.message || 'Failed to load products');
      }
      
    } catch (err) {
      console.error('Error fetching products:', err);
      
      if (err.response?.status === 401) {
        setError('Please login to view products');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to load products. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter products by category (client-side)
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => {
        const productCategory = p.category && p.category.length > 0 
          ? p.category[0]?.name 
          : 'Uncategorized';
        return productCategory === selectedCategory;
      });

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          <p>{error}</p>
          {error.includes('login') && (
            <button 
              onClick={() => navigate('/login')}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Go to Login
            </button>
          )}
          {!error.includes('login') && (
            <button 
              onClick={fetchProducts}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-3 py-2 rounded transition ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <button 
              className="md:hidden flex items-center gap-2 bg-gray-100 px-4 py-2 rounded"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters
            </button>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  View all products
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-1">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;