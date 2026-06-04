// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
// import axios from 'axios';
// import { useCart } from '../context/CartContext'; // 👈 CartContext যোগ করুন

// const CartPage = () => {
//   const { cartItems: contextCartItems, loadCartFromAPI } = useCart(); // 👈 Context থেকে নিন
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updating, setUpdating] = useState(false);

//   const getAuthToken = () => {
//     return localStorage.getItem('token') || sessionStorage.getItem('token');
//   };

//   const getUserId = () => {
//     return localStorage.getItem('userId') || sessionStorage.getItem('userId');
//   };

//   // Fetch cart data
//   const fetchCartData = async () => {
//     const token = getAuthToken();
//     const user_id = getUserId();

//     if (!token || !user_id) {
//       setCartItems([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.get('https://ecommerce-8lhe.onrender.com/api/v1/cart/Read', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           '_id': user_id,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Cart API Response:', response.data);

//       if (response.data.success) {
//         // ফরম্যাট ডাটা
//         const formattedItems = response.data.data.map(item => ({
//           id: item.id || item._id,
//           product_id: item.product_id,
//           name: item.name,
//           price: item.price || 0,
//           quantity: item.quantity,
//           colour: item.colour,
//           size: item.size,
//           image: item.image || 'https://via.placeholder.com/80x80?text=Product'
//         }));
//         setCartItems(formattedItems);
//       } else {
//         setError(response.data.message);
//       }
//     } catch (err) {
//       console.error('Error fetching cart:', err);
//       if (err.response?.status === 401) {
//         setError('Session expired. Please login again.');
//       } else {
//         setError(err.response?.data?.message || 'Failed to load cart');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update quantity
//   const updateQuantity = async (itemId, newQuantity) => {
//     if (newQuantity < 1) {
//       // যদি quantity 0 হয়, তাহলে রিমুভ করুন
//       await removeFromCart(itemId);
//       return;
//     }
    
//     const token = getAuthToken();
//     const user_id = getUserId();
//     const item = cartItems.find(i => i.id === itemId);
    
//     if (!item) return;

//     try {
//       setUpdating(true);
      
//       const response = await axios.post('https://ecommerce-8lhe.onrender.com/api/v1/cart/Create', {
//         product_id: item.product_id,
//         product_name: item.name,
//         colour: item.colour || 'Default',
//         size: item.size || 'Default',
//         quantity: newQuantity
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           '_id': user_id,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         await fetchCartData(); // রিফ্রেশ কার্ট ডাটা
//         // কনটেক্সটও আপডেট করুন
//         if (loadCartFromAPI) {
//           await loadCartFromAPI();
//         }
//       }
//     } catch (err) {
//       console.error('Error updating quantity:', err);
//       setError('Failed to update quantity');
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Remove from cart
//   const removeFromCart = async (itemId) => {
//     const token = getAuthToken();
//     const user_id = getUserId();
//     const item = cartItems.find(i => i.id === itemId);
    
//     if (!item) return;

//     try {
//       setUpdating(true);
      
//       const response = await axios.post('https://ecommerce-8lhe.onrender.com/api/v1/cart/Create', {
//         product_id: item.product_id,
//         product_name: item.name,
//         colour: item.colour || 'Default',
//         size: item.size || 'Default',
//         quantity: 0
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           '_id': user_id,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         await fetchCartData(); // রিফ্রেশ কার্ট ডাটা
//         // কনটেক্সটও আপডেট করুন
//         if (loadCartFromAPI) {
//           await loadCartFromAPI();
//         }
//       }
//     } catch (err) {
//       console.error('Error removing item:', err);
//       setError('Failed to remove item');
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Clear entire cart
//   const clearCart = async () => {
//     if (window.confirm('Are you sure you want to clear your entire cart?')) {
//       const promises = cartItems.map(item => removeFromCart(item.id));
//       await Promise.all(promises);
//       await fetchCartData();
//     }
//   };

//   const getCartTotal = () => {
//     return cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
//   };

//   const subtotal = getCartTotal();
//   const shipping = subtotal > 50 ? 0 : 10;
//   const total = subtotal + shipping;

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!getAuthToken() || !getUserId()) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
//           <div className="text-6xl mb-4">🔒</div>
//           <h1 className="text-2xl font-bold mb-4">Please Login</h1>
//           <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
//           <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
//             Login Now
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
//           <div className="text-6xl mb-4">🛒</div>
//           <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
//           <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
//           <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Shopping Cart ({cartItems.length} items)</h1>
//         <button
//           onClick={clearCart}
//           disabled={updating}
//           className="text-red-500 hover:text-red-700 text-sm font-medium"
//         >
//           Clear All
//         </button>
//       </div>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Cart Items */}
//         <div className="lg:w-2/3">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             {cartItems.map((item, index) => (
//               <div key={item.id} className={`p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${index !== cartItems.length - 1 ? 'border-b' : ''}`}>
//                 <img 
//                   src={item.image || 'https://via.placeholder.com/80'} 
//                   alt={item.name} 
//                   className="w-20 h-20 object-cover rounded" 
//                 />
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-lg">{item.name}</h3>
//                   {item.colour && (
//                     <p className="text-gray-500 text-sm">Color: <span className="capitalize">{item.colour}</span></p>
//                   )}
//                   {item.size && (
//                     <p className="text-gray-500 text-sm">Size: {item.size}</p>
//                   )}
//                   <p className="text-blue-600 font-bold mt-1">${(item.price || 0).toFixed(2)}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button 
//                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                     disabled={updating}
//                     className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 w-8 h-8 flex items-center justify-center"
//                   >
//                     <FiMinus />
//                   </button>
//                   <span className="w-8 text-center font-medium">{item.quantity}</span>
//                   <button 
//                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                     disabled={updating}
//                     className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 w-8 h-8 flex items-center justify-center"
//                   >
//                     <FiPlus />
//                   </button>
//                 </div>
//                 <button 
//                   onClick={() => removeFromCart(item.id)}
//                   disabled={updating}
//                   className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2"
//                 >
//                   <FiTrash2 size={18} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="lg:w-1/3">
//           <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
//             <h2 className="text-xl font-bold mb-4">Order Summary</h2>
//             <div className="space-y-2 mb-4">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="font-medium">${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Shipping</span>
//                 <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
//               </div>
//               {shipping > 0 && (
//                 <div className="text-sm text-gray-500">
//                   Free shipping on orders over $50
//                 </div>
//               )}
//               <div className="border-t pt-2 mt-2">
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total</span>
//                   <span>${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//             <Link to="/checkout">
//               <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
//                 <FiShoppingCart />
//                 Proceed to Checkout
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
// import axios from 'axios';
// import { useCart } from '../context/CartContext';

// const CartPage = () => {
//   const { cartItems: contextCartItems, loadCartFromAPI } = useCart();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updating, setUpdating] = useState(false);

//   const getAuthToken = () => {
//     return localStorage.getItem('token') || sessionStorage.getItem('token');
//   };

//   const getUserId = () => {
//     return localStorage.getItem('userId') || sessionStorage.getItem('userId');
//   };

//   // Fetch cart data
//   const fetchCartData = async () => {
//     const token = getAuthToken();
//     const user_id = getUserId();

//     if (!token || !user_id) {
//       setCartItems([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.get('https://ecommerce-8lhe.onrender.com/api/v1/cart/Read', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           '_id': user_id,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Cart API Response:', response.data);

//       if (response.data.success) {
//         const formattedItems = response.data.data.map(item => ({
//           id: item.id || item._id,
//           product_id: item.product_id,
//           name: item.name || item.product_name,
//           price: item.price || 0,
//           quantity: item.quantity,
//           colour: item.colour,
//           size: item.size,
//           image: item.image || 'https://via.placeholder.com/80x80?text=Product'
//         }));
//         setCartItems(formattedItems);
//       } else {
//         setError(response.data.message);
//       }
//     } catch (err) {
//       console.error('Error fetching cart:', err);
//       if (err.response?.status === 401) {
//         setError('Session expired. Please login again.');
//       } else {
//         setError(err.response?.data?.message || 'Failed to load cart');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FIXED: Delete single item using DELETE method
//   const removeFromCart = async (itemId) => {
//     const token = getAuthToken();
//     const user_id = getUserId();
//     const item = cartItems.find(i => i.id === itemId);
    
//     if (!item) return;

//     try {
//       setUpdating(true);
      
//       // Optimistic update - UI থেকে সরিয়ে ফেলুন
//       setCartItems(prev => prev.filter(i => i.id !== itemId));
      
//       // সঠিক DELETE method এবং URL ব্যবহার করুন (দুটি স্ল্যাশ নয়)
//       const response = await axios.delete(
//         `https://ecommerce-8lhe.onrender.com/api/v1/cart/delete/${item.product_id}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             '_id': user_id,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         // Context আপডেট করুন
//         if (loadCartFromAPI) {
//           await loadCartFromAPI();
//         }
//       } else {
//         // যদি fail হয়, আবার fetch করুন
//         await fetchCartData();
//         setError(response.data.message || 'Failed to remove item');
//         setTimeout(() => setError(null), 3000);
//       }
//     } catch (err) {
//       console.error('Error removing item:', err);
//       // Rollback - আবার fetch করুন
//       await fetchCartData();
//       setError(err.response?.data?.message || 'Failed to remove item');
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // ✅ FIXED: Clear entire cart using DELETE method
//   const clearCart = async () => {
//     if (!window.confirm('Are you sure you want to clear your entire cart?')) {
//       return;
//     }
    
//     const token = getAuthToken();
//     const user_id = getUserId();
    
//     if (!token || !user_id || cartItems.length === 0) return;

//     try {
//       setUpdating(true);
      
//       // সঠিক URL ব্যবহার করুন (ট্রেইলিং স্ল্যাশ ছাড়া)
//       const response = await axios.delete(
//         'https://ecommerce-8lhe.onrender.com/api/v1/all_cart_clear',
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             '_id': user_id,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         // UI খালি করুন
//         setCartItems([]);
        
//         // Context আপডেট করুন
//         if (loadCartFromAPI) {
//           await loadCartFromAPI();
//         }
        
//         // সাফল্যের মেসেজ
//         setError(null);
//       } else {
//         setError(response.data.message || 'Failed to clear cart');
//         setTimeout(() => setError(null), 3000);
//         await fetchCartData(); // Rollback
//       }
//     } catch (err) {
//       console.error('Error clearing cart:', err);
//       setError(err.response?.data?.message || 'Failed to clear cart');
//       setTimeout(() => setError(null), 3000);
//       await fetchCartData(); // Rollback
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Update quantity
//   const updateQuantity = async (itemId, newQuantity) => {
//     if (newQuantity < 1) {
//       await removeFromCart(itemId);
//       return;
//     }
    
//     const token = getAuthToken();
//     const user_id = getUserId();
//     const item = cartItems.find(i => i.id === itemId);
    
//     if (!item) return;

//     try {
//       setUpdating(true);
      
//       // Optimistic update
//       setCartItems(prev => prev.map(i => 
//         i.id === itemId ? { ...i, quantity: newQuantity } : i
//       ));
      
//       const response = await axios.post('https://ecommerce-8lhe.onrender.com/api/v1/cart/Create', {
//         product_id: item.product_id,
//         product_name: item.name,
//         colour: item.colour || 'Default',
//         size: item.size || 'Default',
//         quantity: newQuantity
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           '_id': user_id,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         await fetchCartData();
//         if (loadCartFromAPI) {
//           await loadCartFromAPI();
//         }
//       } else {
//         await fetchCartData(); // Rollback
//         setError(response.data.message);
//         setTimeout(() => setError(null), 3000);
//       }
//     } catch (err) {
//       console.error('Error updating quantity:', err);
//       await fetchCartData(); // Rollback
//       setError('Failed to update quantity');
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const getCartTotal = () => {
//     return cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
//   };

//   const subtotal = getCartTotal();
//   const shipping = subtotal > 50 ? 0 : 10;
//   const total = subtotal + shipping;

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!getAuthToken() || !getUserId()) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
//           <div className="text-6xl mb-4">🔒</div>
//           <h1 className="text-2xl font-bold mb-4">Please Login</h1>
//           <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
//           <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
//             Login Now
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
//           <div className="text-6xl mb-4">🛒</div>
//           <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
//           <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
//           <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Shopping Cart ({cartItems.length} items)</h1>
//         <button
//           onClick={clearCart}
//           disabled={updating}
//           className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
//         >
//           Clear All
//         </button>
//       </div>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Cart Items */}
//         <div className="lg:w-2/3">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             {cartItems.map((item, index) => (
//               <div key={item.id} className={`p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${index !== cartItems.length - 1 ? 'border-b' : ''}`}>
//                 <img 
//                   src={item.image || 'https://via.placeholder.com/80'} 
//                   alt={item.name} 
//                   className="w-20 h-20 object-cover rounded" 
//                 />
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-lg">{item.name}</h3>
//                   {item.colour && (
//                     <p className="text-gray-500 text-sm">Color: <span className="capitalize">{item.colour}</span></p>
//                   )}
//                   {item.size && (
//                     <p className="text-gray-500 text-sm">Size: {item.size}</p>
//                   )}
//                   <p className="text-blue-600 font-bold mt-1">${(item.price || 0).toFixed(2)}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button 
//                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                     disabled={updating}
//                     className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 w-8 h-8 flex items-center justify-center"
//                   >
//                     <FiMinus />
//                   </button>
//                   <span className="w-8 text-center font-medium">{item.quantity}</span>
//                   <button 
//                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                     disabled={updating}
//                     className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 w-8 h-8 flex items-center justify-center"
//                   >
//                     <FiPlus />
//                   </button>
//                 </div>
//                 <button 
//                   onClick={() => removeFromCart(item.id)}
//                   disabled={updating}
//                   className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2"
//                 >
//                   <FiTrash2 size={18} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="lg:w-1/3">
//           <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
//             <h2 className="text-xl font-bold mb-4">Order Summary</h2>
//             <div className="space-y-2 mb-4">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="font-medium">${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Shipping</span>
//                 <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
//               </div>
//               {shipping > 0 && (
//                 <div className="text-sm text-gray-500">
//                   Free shipping on orders over $50
//                 </div>
//               )}
//               <div className="border-t pt-2 mt-2">
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total</span>
//                   <span>${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//             <Link to="/checkout">
//               <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
//                 <FiShoppingCart />
//                 Proceed to Checkout
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
// import axios from 'axios';
// import { useCart } from '../context/CartContext';

// const CartPage = () => {
//   const { cartItems: contextCartItems, loadCartFromAPI } = useCart();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updating, setUpdating] = useState(false);

//   const getAuthToken = () => {
//     return localStorage.getItem('token') || sessionStorage.getItem('token');
//   };

//   const getUserId = () => {
//     return localStorage.getItem('userId') || sessionStorage.getItem('userId');
//   };

//   // Fetch cart data
//   const fetchCartData = async () => {
//     const token = getAuthToken();
//     const user_id = getUserId();

//     if (!token || !user_id) {
//       setCartItems([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.get('https://ecommerce-8lhe.onrender.com/api/v1/cart/Read', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           '_id': user_id,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Cart API Response:', response.data);

//       if (response.data.success) {
//         const formattedItems = response.data.data.map(item => ({
//           id: item.id || item._id,
//           product_id: item.product_id,
//           name: item.name || item.product_name,
//           price: item.price || 0,
//           quantity: item.quantity,
//           colour: item.colour,
//           size: item.size,
//           image: item.image || 'https://via.placeholder.com/80x80?text=Product'
//         }));
//         setCartItems(formattedItems);
//       } else {
//         setError(response.data.message);
//       }
//     } catch (err) {
//       console.error('Error fetching cart:', err);
//       if (err.response?.status === 401) {
//         setError('Session expired. Please login again.');
//       } else {
//         setError(err.response?.data?.message || 'Failed to load cart');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete single item
//   const removeFromCart = async (itemId) => {
//     const token = getAuthToken();
//     const user_id = getUserId();
//     const item = cartItems.find(i => i.id === itemId);
    
//     if (!item) return;

//     try {
//       setUpdating(true);
//       setCartItems(prev => prev.filter(i => i.id !== itemId));
      
//       const response = await axios.delete(
//         `https://ecommerce-8lhe.onrender.com/api/v1/cart/delete/${item.product_id}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             '_id': user_id,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         if (loadCartFromAPI) {
//           await loadCartFromAPI();
//         }
//       } else {
//         await fetchCartData();
//         setError(response.data.message || 'Failed to remove item');
//         setTimeout(() => setError(null), 3000);
//       }
//     } catch (err) {
//       console.error('Error removing item:', err);
//       await fetchCartData();
//       setError(err.response?.data?.message || 'Failed to remove item');
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Clear entire cart
//   const clearCart = async () => {
//     if (!window.confirm('Are you sure you want to clear your entire cart?')) {
//       return;
//     }
    
//     const token = getAuthToken();
//     const user_id = getUserId();
    
//     if (!token || !user_id || cartItems.length === 0) return;

//     try {
//       setUpdating(true);
      
//       const response = await axios.delete(
//         'https://ecommerce-8lhe.onrender.com/api/v1/all_cart_clear',
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             '_id': user_id,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         setCartItems([]);
//         if (loadCartFromAPI) {
//           await loadCartFromAPI();
//         }
//         setError(null);
//       } else {
//         setError(response.data.message || 'Failed to clear cart');
//         setTimeout(() => setError(null), 3000);
//         await fetchCartData();
//       }
//     } catch (err) {
//       console.error('Error clearing cart:', err);
//       setError(err.response?.data?.message || 'Failed to clear cart');
//       setTimeout(() => setError(null), 3000);
//       await fetchCartData();
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Update quantity
//   const updateQuantity = async (itemId, newQuantity) => {
//     if (newQuantity < 1) {
//       await removeFromCart(itemId);
//       return;
//     }
    
//     const token = getAuthToken();
//     const user_id = getUserId();
//     const item = cartItems.find(i => i.id === itemId);
    
//     if (!item) return;

//     try {
//       setUpdating(true);
      
//       setCartItems(prev => prev.map(i => 
//         i.id === itemId ? { ...i, quantity: newQuantity } : i
//       ));
      
//       const response = await axios.post('https://ecommerce-8lhe.onrender.com/api/v1/cart/Create', {
//         product_id: item.product_id,
//         product_name: item.name,
//         colour: item.colour || 'Default',
//         size: item.size || 'Default',
//         quantity: newQuantity
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           '_id': user_id,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         await fetchCartData();
//         if (loadCartFromAPI) {
//           await loadCartFromAPI();
//         }
//       } else {
//         await fetchCartData();
//         setError(response.data.message);
//         setTimeout(() => setError(null), 3000);
//       }
//     } catch (err) {
//       console.error('Error updating quantity:', err);
//       await fetchCartData();
//       setError('Failed to update quantity');
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const getCartTotal = () => {
//     return cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
//   };

//   const subtotal = getCartTotal();
//   const shipping = subtotal > 50 ? 0 : 10;
//   const total = subtotal + shipping;
  
//   // ✅ Generate temporary order ID
//   const tempOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!getAuthToken() || !getUserId()) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
//           <div className="text-6xl mb-4">🔒</div>
//           <h1 className="text-2xl font-bold mb-4">Please Login</h1>
//           <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
//           <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
//             Login Now
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
//           <div className="text-6xl mb-4">🛒</div>
//           <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
//           <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
//           <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Shopping Cart ({cartItems.length} items)</h1>
//         <button
//           onClick={clearCart}
//           disabled={updating}
//           className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
//         >
//           Clear All
//         </button>
//       </div>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Cart Items */}
//         <div className="lg:w-2/3">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             {cartItems.map((item, index) => (
//               <div key={item.id} className={`p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${index !== cartItems.length - 1 ? 'border-b' : ''}`}>
//                 <img 
//                   src={item.image || 'https://via.placeholder.com/80'} 
//                   alt={item.name} 
//                   className="w-20 h-20 object-cover rounded" 
//                 />
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-lg">{item.name}</h3>
//                   {/* ✅ Product ID added here */}
//                   <p className="text-gray-500 text-xs">Product ID: <span className="font-mono">{item.product_id}</span></p>
//                   {item.colour && (
//                     <p className="text-gray-500 text-sm">Color: <span className="capitalize">{item.colour}</span></p>
//                   )}
//                   {item.size && (
//                     <p className="text-gray-500 text-sm">Size: {item.size}</p>
//                   )}
//                   <p className="text-blue-600 font-bold mt-1">${(item.price || 0).toFixed(2)}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button 
//                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                     disabled={updating}
//                     className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 w-8 h-8 flex items-center justify-center"
//                   >
//                     <FiMinus />
//                   </button>
//                   <span className="w-8 text-center font-medium">{item.quantity}</span>
//                   <button 
//                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                     disabled={updating}
//                     className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 w-8 h-8 flex items-center justify-center"
//                   >
//                     <FiPlus />
//                   </button>
//                 </div>
//                 <button 
//                   onClick={() => removeFromCart(item.id)}
//                   disabled={updating}
//                   className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2"
//                 >
//                   <FiTrash2 size={18} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ✅ Updated Order Summary with Order ID, Product ID and Quantity */}
//         <div className="lg:w-1/3">
//           <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
//             <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
            
//             {/* ✅ Order ID Section */}
//             <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
//               <p className="text-xs text-gray-500 mb-1">🆔 Order ID (Preview)</p>
//               <p className="font-mono text-sm font-bold text-blue-600">{tempOrderId}</p>
//               <p className="text-xs text-gray-400 mt-1">*Final ID after confirmation</p>
//             </div>
            
//             {/* ✅ Items List with Product ID and Quantity */}
//             <div className="mb-4">
//               <p className="font-semibold text-gray-700 mb-2 text-sm">📦 Items Details:</p>
//               <div className="space-y-2 max-h-52 overflow-y-auto">
//                 {cartItems.map((item, idx) => (
//                   <div key={idx} className="text-sm p-2 bg-gray-50 rounded-lg border">
//                     <div className="flex justify-between mb-1">
//                       <span className="font-medium text-gray-800">{item.name}</span>
//                       <span className="font-bold text-blue-600">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
//                       <div>
//                         <span className="font-medium">Product ID:</span>
//                         <span className="font-mono ml-1 text-blue-600">{item.product_id}</span>
//                       </div>
//                       <div>
//                         <span className="font-medium">Quantity:</span>
//                         <span className="font-semibold ml-1 text-gray-700">{item.quantity}</span>
//                       </div>
//                     </div>
//                     {item.colour && (
//                       <div className="text-xs text-gray-500 mt-1">
//                         <span className="font-medium">Color:</span> {item.colour}
//                       </div>
//                     )}
//                     {item.size && (
//                       <div className="text-xs text-gray-500">
//                         <span className="font-medium">Size:</span> {item.size}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             {/* Price Summary */}
//             <div className="space-y-2 mb-4 border-t pt-3">
//               <div className="flex justify-between text-gray-600">
//                 <span>Subtotal</span>
//                 <span className="font-medium">${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Shipping</span>
//                 <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
//               </div>
//               {shipping > 0 && (
//                 <div className="text-xs text-gray-500 text-right">
//                   Free shipping on orders over $50
//                 </div>
//               )}
//               <div className="border-t pt-2 mt-2">
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total</span>
//                   <span className="text-blue-600">${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
            
//             {/* ✅ Checkout Button with Data */}
//             <Link to="/checkout" state={{ 
//               cartItems: cartItems,
//               subtotal: subtotal,
//               shipping: shipping,
//               total: total,
//               orderId: tempOrderId
//             }}>
//               <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
//                 <FiShoppingCart />
//                 Proceed to Checkout
//               </button>
//             </Link>
            
//             {/* ✅ Debug Info (optional - for development) */}
//             <details className="mt-3">
//               <summary className="text-xs text-gray-400 cursor-pointer">Debug Info</summary>
//               <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
//                 <pre className="text-[10px]">
// {JSON.stringify({
//   items: cartItems.map(i => ({
//     product_id: i.product_id,
//     name: i.name,
//     quantity: i.quantity,
//     price: i.price
//   })),
//   totals: { subtotal, shipping, total }
// }, null, 2)}
//                 </pre>
//               </div>
//             </details>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems: contextCartItems, loadCartFromAPI } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getUserId = () => {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId');
  };

  // Fetch cart data
  // const fetchCartData = async () => {
  //   const token = getAuthToken();
  //   const user_id = getUserId();

  //   if (!token || !user_id) {
  //     setCartItems([]);
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const response = await axios.get('https://ecommerce-8lhe.onrender.com/api/v1/cart/Read', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         '_id': user_id,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     console.log('Cart API Response:', response.data);

  //     if (response.data.success) {
  //       const formattedItems = response.data.data.map(item => ({
  //         id: item.id || item._id,
  //         product_id: item.product_id,
  //         name: item.name || item.product_name,
  //         price: item.price || 0,
  //         quantity: item.quantity,
  //         colour: item.colour,
  //         size: item.size,
  //         image: item.image || 'https://via.placeholder.com/80x80?text=Product'
  //       }));
  //       setCartItems(formattedItems);
  //     } else {
  //       setError(response.data.message);
  //     }
  //   } catch (err) {
  //     console.error('Error fetching cart:', err);
  //     if (err.response?.status === 401) {
  //       setError('Session expired. Please login again.');
  //     } else {
  //       setError(err.response?.data?.message || 'Failed to load cart');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // CartPage.js - fetchCartData ফাংশনটি আপডেট করুন:

const fetchCartData = async () => {
  const token = getAuthToken();
  const user_id = getUserId();

  console.log('🔄 Fetching cart data...', { 
    hasToken: !!token, 
    tokenValue: token?.substring(0, 20) + '...',  // token এর প্রথম 20 অক্ষর
    userId: user_id 
  });

  if (!token || !user_id) {
    console.log('❌ No token or user_id');
    setCartItems([]);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    
    console.log('📡 Sending request to: https://ecommerce-8lhe.onrender.com/api/v1/cart/Read');
    
    const response = await axios.get('https://ecommerce-8lhe.onrender.com/api/v1/cart/Read', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📦 Full Response:', response);
    console.log('📦 Response Status:', response.status);
    console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log('✅ Success true, data length:', response.data.data?.length);
      console.log('📊 Cart data:', response.data.data);
      console.log('📊 Cart summary:', response.data.summary);
      
      if (response.data.data && response.data.data.length > 0) {
        const formattedItems = response.data.data.map((item, index) => {
          console.log(`🛒 Processing item ${index}:`, item);
          return {
            id: item._id,
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            colour: item.colour,
            size: item.size,
            image: item.image || 'https://via.placeholder.com/80x80?text=Product'
          };
        });
        
        console.log('✅ Formatted items:', formattedItems);
        setCartItems(formattedItems);
      } else {
        console.log('⚠️ No items in cart response');
        setCartItems([]);
      }
    } else {
      console.log('❌ API success false, message:', response.data.message);
      setError(response.data.message);
      setCartItems([]);
    }
  } catch (err) {
    console.error('❌ Error fetching cart:', err);
    console.error('Error response:', err.response);
    console.error('Error message:', err.message);
    
    if (err.response?.status === 401) {
      console.log('🔐 401 Unauthorized - Token expired');
      setError('Session expired. Please login again.');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    } else if (err.response?.status === 404) {
      console.log('🔍 404 Not Found - Wrong endpoint');
      setError('Cart API endpoint not found. Please check backend route.');
    } else if (err.response?.status === 500) {
      console.log('💥 500 Server Error');
      setError('Server error. Please check backend console.');
    } else {
      setError(err.response?.data?.message || 'Failed to load cart');
    }
    setCartItems([]);
  } finally {
    setLoading(false);
  }
};

  // Remove from cart
  const removeFromCart = async (itemId) => {
    const token = getAuthToken();
    const user_id = getUserId();
    const item = cartItems.find(i => i.id === itemId);
    
    if (!item) return;

    try {
      setUpdating(true);
      setCartItems(prev => prev.filter(i => i.id !== itemId));
      
      const response = await axios.post('https://ecommerce-8lhe.onrender.com/api/v1/cart/Create', {
        product_id: item.product_id,
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
        if (loadCartFromAPI) {
          await loadCartFromAPI();
        }
      } else {
        await fetchCartData();
        setError(response.data.message || 'Failed to remove item');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Error removing item:', err);
      await fetchCartData();
      setError(err.response?.data?.message || 'Failed to remove item');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdating(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }
    
    const token = getAuthToken();
    const user_id = getUserId();
    
    if (!token || !user_id || cartItems.length === 0) return;

    try {
      setUpdating(true);
      
      for (const item of cartItems) {
        await axios.post('https://ecommerce-8lhe.onrender.com/api/v1/cart/Create', {
          product_id: item.product_id,
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
      }
      
      setCartItems([]);
      
      if (loadCartFromAPI) {
        await loadCartFromAPI();
      }
      
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.response?.data?.message || 'Failed to clear cart');
      setTimeout(() => setError(null), 3000);
      await fetchCartData();
    } finally {
      setUpdating(false);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    
    const token = getAuthToken();
    const user_id = getUserId();
    const item = cartItems.find(i => i.id === itemId);
    
    if (!item) return;

    try {
      setUpdating(true);
      
      setCartItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, quantity: newQuantity } : i
      ));
      
      const response = await axios.post('https://ecommerce-8lhe.onrender.com/api/v1/cart/Create', {
        product_id: item.product_id,
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
        await fetchCartData();
        if (loadCartFromAPI) {
          await loadCartFromAPI();
        }
      } else {
        await fetchCartData();
        setError(response.data.message);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      await fetchCartData();
      setError('Failed to update quantity');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;
  
  const tempOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  useEffect(() => {
    fetchCartData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!getAuthToken() || !getUserId()) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart ({cartItems.length} items)</h1>
        <button
          onClick={clearCart}
          disabled={updating}
          className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
        >
          Clear All
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cartItems.map((item, index) => (
              <div key={item.id} className={`p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${index !== cartItems.length - 1 ? 'border-b' : ''}`}>
                <img 
                  src={item.image || 'https://via.placeholder.com/80'} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded" 
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-xs">Product ID: <span className="font-mono">{item.product_id}</span></p>
                  {item.colour && (
                    <p className="text-gray-500 text-sm">Color: <span className="capitalize">{item.colour}</span></p>
                  )}
                  {item.size && (
                    <p className="text-gray-500 text-sm">Size: {item.size}</p>
                  )}
                  <p className="text-blue-600 font-bold mt-1">${(item.price || 0).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={updating}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 w-8 h-8 flex items-center justify-center"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={updating}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 w-8 h-8 flex items-center justify-center"
                  >
                    <FiPlus />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  disabled={updating}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary with Data Passing to Checkout */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
            
            {/* Order ID Preview */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">🆔 Order ID</p>
              <p className="font-mono text-sm font-bold text-blue-600">{tempOrderId}</p>
            </div>
            
            {/* Items Details with Product ID and Quantity */}
            <div className="mb-4">
              <p className="font-semibold text-gray-700 mb-2 text-sm">📦 Items:</p>
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="text-sm p-2 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-bold text-blue-600">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div>Product ID: <span className="font-mono">{item.product_id}</span></div>
                      <div>Quantity: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Summary */}
            <div className="space-y-2 mb-4 border-t pt-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Checkout Button with complete cart data */}
            <Link to="/checkout" state={{ 
              cartItems: cartItems.map(item => ({
                id: item.id,
                product_id: item.product_id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                colour: item.colour,
                size: item.size,
                image: item.image
              })),
              subtotal: subtotal,
              shipping: shipping,
              total: total,
              orderId: tempOrderId
            }}>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <FiShoppingCart />
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;