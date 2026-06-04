import React, { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Newsletter from '../components/home/Newsletter';
import axios from 'axios';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // API থেকে প্রোডাক্ট আনুন
      const response = await axios.get('https://ecommerce-8lhe.onrender.com/api/v1/user/all_product/?page_no=1&per_page=4', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        withCredentials: true
      });
      
      console.log('HomePage API Response:', response.data);
      
      if (response.data.success) {
        setFeaturedProducts(response.data.products || []);
      } else {
        setError(response.data.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <HeroSection />
        <CategorySection />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Newsletter />
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts products={featuredProducts} />
      <Newsletter />
    </div>
  );
};

export default HomePage;