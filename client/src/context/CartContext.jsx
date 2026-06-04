// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from '../services/api';
// import { useAuth } from './AuthContext';
// import toast from 'react-hot-toast';

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user) {
//       loadCartFromAPI();
//     } else {
//       loadCartFromLocal();
//     }
//   }, [user]);

//   const loadCartFromAPI = async () => {
//     try {
//       setLoading(true);
//       const { data } = await getCart();
//       setCartItems(data.items || []);
//     } catch (error) {
//       console.error('Failed to load cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadCartFromLocal = () => {
//     const saved = localStorage.getItem('guest_cart');
//     if (saved) setCartItems(JSON.parse(saved));
//   };

//   const saveToLocal = (items) => {
//     localStorage.setItem('guest_cart', JSON.stringify(items));
//   };

//   const addToCart = async (product, quantity = 1) => {
//     if (user) {
//       try {
//         await apiAddToCart(product.id, quantity);
//         await loadCartFromAPI();
//         toast.success(`${product.name} added to cart`);
//       } catch (error) {
//         toast.error('Failed to add to cart');
//       }
//     } else {
//       const existing = cartItems.find(i => i.id === product.id);
//       let newItems;
//       if (existing) {
//         newItems = cartItems.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
//       } else {
//         newItems = [...cartItems, { ...product, quantity }];
//       }
//       setCartItems(newItems);
//       saveToLocal(newItems);
//       toast.success(`${product.name} added to cart`);
//     }
//   };

//   const updateQuantity = async (productId, quantity) => {
//     if (user) {
//       try {
//         await updateCartItem(productId, quantity);
//         await loadCartFromAPI();
//       } catch (error) {
//         toast.error('Failed to update');
//       }
//     } else {
//       const newItems = cartItems.map(i => i.id === productId ? { ...i, quantity } : i);
//       setCartItems(newItems);
//       saveToLocal(newItems);
//     }
//   };

//   const removeFromCart = async (productId) => {
//     if (user) {
//       try {
//         await removeCartItem(productId);
//         await loadCartFromAPI();
//         toast.success('Item removed');
//       } catch (error) {
//         toast.error('Failed to remove');
//       }
//     } else {
//       const newItems = cartItems.filter(i => i.id !== productId);
//       setCartItems(newItems);
//       saveToLocal(newItems);
//       toast.success('Item removed');
//     }
//   };

//   const clearCartItems = () => {
//     setCartItems([]);
//     localStorage.removeItem('guest_cart');
//   };

//   const getCartTotal = () => cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
//   const getCartItemCount = () => cartItems.reduce((sum, i) => sum + i.quantity, 0);

//   return (
//     <CartContext.Provider value={{
//       cartItems, loading, addToCart, updateQuantity, removeFromCart,
//       clearCart: clearCartItems, getCartTotal, getCartItemCount
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };


import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper functions
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getUserId = () => {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId');
  };

  const isUserLoggedIn = () => {
    return !!(getAuthToken() && getUserId());
  };

  // Load cart from API
  const loadCartFromAPI = async () => {
    const token = getAuthToken();
    const user_id = getUserId();

    if (!token || !user_id) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('https://ecommerce-8lhe.onrender.com/api/v1/cart/Read', {
        headers: {
          'Authorization': `Bearer ${token}`,
          //'_id': user_id
        }
      });

      if (response.data.success) {
        // Format data to match your component structure
        const formattedItems = response.data.data.map(item => ({
          id: item.product_id || item.id,
          _id: item.product_id,
          cartId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          colour: item.colour,
          size: item.size,
          image: item.image || 'https://via.placeholder.com/80',
          stock: item.stock || 999
        }));
        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      if (error.response?.status === 401) {
        // Token expired, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load cart from localStorage (guest)
  const loadCartFromLocal = () => {
    const saved = localStorage.getItem('guest_cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    } else {
      setCartItems([]);
    }
  };

  // Save to localStorage (guest)
  const saveToLocal = (items) => {
    localStorage.setItem('guest_cart', JSON.stringify(items));
  };

  // Add to cart
  const addToCart = async (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    if (isUserLoggedIn()) {
      // Logged in user - save to database
      const token = getAuthToken();
      const user_id = getUserId();

      try {
        setLoading(true);
        
        const cartData = {
          product_id: product._id || product.id,
          product_name: product.title || product.name,
          colour: selectedColor || (product.color?.[0] || 'Default'),
          size: selectedSize || (product.size?.[0] || 'Default'),
          quantity: parseInt(quantity)
        };

        const response = await axios.post('https://ecommerce-8lhe.onrender.com/api/v1/cart/Create', cartData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            '_id': user_id,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          await loadCartFromAPI();
          toast.success(`${product.title || product.name} added to cart`);
          return true;
        } else {
          toast.error(response.data.message || 'Failed to add to cart');
          return false;
        }
      } catch (error) {
        console.error('Add to cart error:', error);
        toast.error(error.response?.data?.message || 'Failed to add to cart');
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - save to localStorage
      const existing = cartItems.find(i => i.id === product.id);
      let newItems;
      
      if (existing) {
        newItems = cartItems.map(i => 
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        newItems = [...cartItems, { 
          ...product, 
          id: product._id || product.id,
          quantity: quantity,
          name: product.title || product.name,
          price: product.price,
          image: product.images?.[0] || 'https://via.placeholder.com/80'
        }];
      }
      
      setCartItems(newItems);
      saveToLocal(newItems);
      toast.success(`${product.title || product.name} added to cart`);
      return true;
    }
  };

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    if (isUserLoggedIn()) {
      const token = getAuthToken();
      const user_id = getUserId();
      const item = cartItems.find(i => i.id === productId || i._id === productId);
      
      if (!item) return;

      try {
        setLoading(true);
        
        const response = await axios.post('https://ecommerce-8lhe.onrender.com/api/v1/cart/Create', {
          product_id: item._id || item.id,
          product_name: item.name,
          colour: item.colour || 'Default',
          size: item.size || 'Default',
          quantity: newQuantity
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            '_id': user_id,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          await loadCartFromAPI();
        }
      } catch (error) {
        console.error('Update quantity error:', error);
        toast.error('Failed to update quantity');
      } finally {
        setLoading(false);
      }
    } else {
      const newItems = cartItems.map(i => 
        i.id === productId ? { ...i, quantity: newQuantity } : i
      );
      setCartItems(newItems);
      saveToLocal(newItems);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    if (isUserLoggedIn()) {
      const token = getAuthToken();
      const user_id = getUserId();
      const item = cartItems.find(i => i.id === productId || i._id === productId);
      
      if (!item) return;

      try {
        setLoading(true);
        
        const response = await axios.post('https://ecommerce-8lhe.onrender.com/api/v1/cart/Create', {
          product_id: item._id || item.id,
          product_name: item.name,
          colour: item.colour || 'Default',
          size: item.size || 'Default',
          quantity: 0
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            '_id': user_id,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          await loadCartFromAPI();
          toast.success('Item removed from cart');
        }
      } catch (error) {
        console.error('Remove from cart error:', error);
        toast.error('Failed to remove item');
      } finally {
        setLoading(false);
      }
    } else {
      const newItems = cartItems.filter(i => i.id !== productId);
      setCartItems(newItems);
      saveToLocal(newItems);
      toast.success('Item removed');
    }
  };

  // Clear all cart items
  const clearCart = () => {
    if (isUserLoggedIn()) {
      // For logged in users, remove all items one by one
      cartItems.forEach(item => removeFromCart(item.id));
    } else {
      setCartItems([]);
      localStorage.removeItem('guest_cart');
      toast.success('Cart cleared');
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Load cart when user logs in/out
  // useEffect(() => {
  //   if (isUserLoggedIn()) {
  //     loadCartFromAPI();
  //   } else {
  //     loadCartFromLocal();
  //   }
  // }, [localStorage.getItem('token'), localStorage.getItem('userId')]);

  useEffect(() => {
  // শুধুমাত্র cart page এ load করবে
  const isCartPage = window.location.pathname.includes('/cart');
  
  if (isUserLoggedIn() && isCartPage) {
    loadCartFromAPI();
  } else if (!isUserLoggedIn()) {
    loadCartFromLocal();
  }
}, []);
  // Listen for storage events (cart updates from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      if (isUserLoggedIn()) {
        loadCartFromAPI();
      } else {
        loadCartFromLocal();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    loadCartFromAPI
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
