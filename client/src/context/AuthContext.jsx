import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminLogin, userLogin, userRegister, logout } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Token from localStorage:', token);
      console.log('UserData from localStorage:', userData);
      
      if (token && userData && userData !== 'undefined') {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, isAdmin = false) => {
    try {
      const { data } = isAdmin ? await adminLogin({ email, password }) : await userLogin({ email, password });
      
      console.log('Login response data:', data);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // userId আলাদাভাবে স্টোর করুন
      if (data.user?.id || data.user?._id) {
        const userId = data.user.id || data.user._id;
        localStorage.setItem('userId', userId);
      }
      
      setUser(data.user);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await userRegister(userData);
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId'); // 👈 এই লাইনটি যোগ করুন
    setUser(null);
    toast.success('Logged out');
    
    // পেজ রিলোড করুন (কার্ট ক্লিয়ার করার জন্য)
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout: logoutUser,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};