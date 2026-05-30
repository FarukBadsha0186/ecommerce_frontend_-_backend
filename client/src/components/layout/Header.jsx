import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth(); 
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ShopEase
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-600 transition">Shop</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</Link>
            
            {isAuthenticated && (
              <>
                <Link to="/my-orders" className="text-gray-700 hover:text-blue-600 transition">
                  My Orders
                </Link>
              </>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            {isAuthenticated && (
              <Link to="/cart" className="relative">
                <span className="text-gray-700 text-2xl">🛒</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <span className="text-2xl">👤</span>
                  <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-20">
                    <div className="p-3 border-b">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link 
                        to="/my-orders" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="mr-3">📋</span>
                        My Orders
                      </Link>
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="mr-3">👤</span>
                        My Profile
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="mr-3">❤️</span>
                        Wishlist
                      </Link>
                      <hr className="my-1" />
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-50"
                      >
                        <span className="mr-3">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/register" className="text-gray-700 hover:text-blue-600 transition">
                  Register
                </Link>
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/my-orders" 
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link 
                  to="/profile" 
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;