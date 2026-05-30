// import React, { useState, useEffect } from 'react';

// import { useNavigate, useLocation } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { FiTruck, FiShield, FiClock, FiCheckCircle } from 'react-icons/fi';
// import axios from 'axios';

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { loadCartFromAPI } = useCart();
  
//   const [cartItems, setCartItems] = useState([]);
//   const [subtotal, setSubtotal] = useState(0);
//   const [shipping, setShipping] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [orderId, setOrderId] = useState('');
  
//   const [loading, setLoading] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [finalOrderId, setFinalOrderId] = useState(null);
  
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     zipCode: '',
//     paymentMethod: 'cod',
//     notes: ''
//   });

//   const [errors, setErrors] = useState({});

//   const getAuthToken = () => {
//     return localStorage.getItem('token') || sessionStorage.getItem('token');
//   };

//   const getUserId = () => {
//     return localStorage.getItem('userId') || sessionStorage.getItem('userId');
//   };

//   useEffect(() => {
//     if (location.state && location.state.cartItems) {
//       console.log('Received from CartPage:', location.state);
//       setCartItems(location.state.cartItems);
//       setSubtotal(location.state.subtotal || 0);
//       setShipping(location.state.shipping || 0);
//       setTotal(location.state.total || 0);
//       setOrderId(location.state.orderId || '');
//     } else {
//       navigate('/shop');
//     }
//   }, [location, navigate]);

//   const tax = subtotal * 0.05;
//   const finalTotal = total + tax;

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
//     if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
//     if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
//     if (!formData.address.trim()) newErrors.address = 'Address is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
//     return newErrors;
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     if (errors[e.target.name]) {
//       setErrors({
//         ...errors,
//         [e.target.name]: ''
//       });
//     }
//   };

//   // ✅ API কল সহ অর্ডার সাবমিট ফাংশন
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     console.log('=== PLACING ORDER ===');
//     console.log('Cart Items:', cartItems);
    
//     if (cartItems.length === 0) {
//       alert('Your cart is empty!');
//       return;
//     }
    
//     // Validate each item
//     for (let i = 0; i < cartItems.length; i++) {
//       const item = cartItems[i];
//       if (!item.product_id) {
//         alert(`Item "${item.name}" is missing product ID`);
//         return;
//       }
//       if (!item.quantity || item.quantity < 1) {
//         alert(`Item "${item.name}" has invalid quantity`);
//         return;
//       }
//     }
    
//     const newErrors = validateForm();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = getAuthToken();
//       const user_id = getUserId();
      
//       if (!token || !user_id) {
//         alert('Please login again');
//         navigate('/login');
//         return;
//       }
      
//       // ✅ Prepare order data for API
//       const orderData = {
//         items: cartItems.map(item => ({
//           product_id: item.product_id,
//           product_name: item.name,
//           quantity: Number(item.quantity),
//           price: Number(item.price),
//           colour: item.colour || '',
//           size: item.size || ''
//         })),
//         customer: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address,
//           city: formData.city,
//           zipCode: formData.zipCode
//         },
//         paymentMethod: formData.paymentMethod,
//         subtotal: subtotal,
//         shipping: shipping,
//         tax: tax,
//         total: finalTotal,
//         notes: formData.notes
//       };
      
//       console.log('Sending order to API:', JSON.stringify(orderData, null, 2));
      
//       // ✅ Call the order create API
//       const response = await axios.post(
//         'http://localhost:5000/api/v1/order/create',
//         orderData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             '_id': user_id,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       console.log('Order API Response:', response.data);
      
//       if (response.data.success) {
//         const newOrderId = response.data.orderId;
        
//         // ✅ Clear cart from backend (quantity 0 করে)
//         console.log('Clearing cart items...');
        
//         for (let i = 0; i < cartItems.length; i++) {
//           const item = cartItems[i];
          
//           const clearItemData = {
//             product_id: item.product_id,
//             product_name: item.name,
//             colour: item.colour || 'Default',
//             size: item.size || 'Default',
//             quantity: 0
//           };
          
//           console.log(`Removing item ${i+1}/${cartItems.length}:`, clearItemData);
          
//           try {
//             await axios.post(
//               'http://localhost:5000/api/v1/cart/Create',
//               clearItemData,
//               {
//                 headers: {
//                   'Authorization': `Bearer ${token}`,
//                   '_id': user_id,
//                   'Content-Type': 'application/json'
//                 }
//               }
//             );
//           } catch (err) {
//             console.error(`Error removing item ${item.name}:`, err);
//           }
//         }
        
//         // ✅ Refresh cart context
//         if (loadCartFromAPI) {
//           await loadCartFromAPI();
//         }
        
//         setFinalOrderId(newOrderId);
//         setOrderPlaced(true);
        
//         // ✅ Navigate to confirmation page
//         setTimeout(() => {
//           navigate('/order-confirmation', { 
//             state: { 
//               orderId: newOrderId, 
//               order: response.data.order 
//             } 
//           });
//         }, 2000);
//       } else {
//         throw new Error(response.data.message || 'Order failed');
//       }
      
//     } catch (error) {
//       console.error('Order failed:', error);
//       const errorMsg = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
//       alert(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cartItems.length === 0 && !orderPlaced) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
//           <div className="text-6xl mb-4">🛒</div>
//           <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
//           <p className="text-gray-600 mb-6">Please add some items to your cart before checkout.</p>
//           <button 
//             onClick={() => navigate('/shop')} 
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (orderPlaced) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
//           <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
//           <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
//           <p className="text-gray-600 mb-2">Order ID: <span className="font-semibold">{finalOrderId}</span></p>
//           <p className="text-gray-600 mb-6">Redirecting to confirmation page...</p>
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="text-3xl font-bold mb-2">Checkout</h1>
//         <p className="text-gray-600 mb-8">Complete your purchase</p>
        
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Checkout Form */}
//           <div className="lg:w-2/3">
//             <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//               <h2 className="text-xl font-bold mb-4 flex items-center">
//                 <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
//                 Shipping Information
//               </h2>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 mb-2 font-medium">First Name *</label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
//                         errors.firstName ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                     />
//                     {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-gray-700 mb-2 font-medium">Last Name *</label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
//                         errors.lastName ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                     />
//                     {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-gray-700 mb-2 font-medium">Email *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
//                       errors.email ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//                 </div>
                
//                 <div>
//                   <label className="block text-gray-700 mb-2 font-medium">Phone *</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
//                       errors.phone ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="+880 1234 567890"
//                   />
//                   {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//                 </div>
                
//                 <div>
//                   <label className="block text-gray-700 mb-2 font-medium">Address *</label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
//                       errors.address ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Street address, apartment, etc."
//                   />
//                   {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 mb-2 font-medium">City *</label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
//                         errors.city ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                     />
//                     {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-gray-700 mb-2 font-medium">Zip Code *</label>
//                     <input
//                       type="text"
//                       name="zipCode"
//                       value={formData.zipCode}
//                       onChange={handleChange}
//                       className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
//                         errors.zipCode ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                     />
//                     {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-gray-700 mb-2 font-medium">Payment Method *</label>
//                   <select
//                     name="paymentMethod"
//                     value={formData.paymentMethod}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                   >
//                     <option value="cod">Cash on Delivery</option>
//                     <option value="bkash">bKash</option>
//                     <option value="nagad">Nagad</option>
//                     <option value="card">Credit/Debit Card</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-gray-700 mb-2 font-medium">Order Notes (Optional)</label>
//                   <textarea
//                     name="notes"
//                     value={formData.notes}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                     placeholder="Special instructions for delivery..."
//                   />
//                 </div>
                
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full py-3 rounded-lg font-semibold transition ${
//                     loading 
//                       ? 'bg-gray-400 cursor-not-allowed' 
//                       : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
//                   }`}
//                 >
//                   {loading ? (
//                     <span className="flex items-center justify-center">
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Processing...
//                     </span>
//                   ) : (
//                     `Place Order - $${finalTotal.toFixed(2)}`
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
          
//           {/* Order Summary */}
//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
//               <h2 className="text-xl font-bold mb-4">Order Summary ({cartItems.length} items)</h2>
              
//               <div className="space-y-3 mb-4 max-h-64 overflow-auto">
//                 {cartItems.map((item, index) => (
//                   <div key={item.id || index} className="flex justify-between text-sm py-2 border-b">
//                     <div>
//                       <span className="font-medium">{item.name}</span>
//                       <span className="text-gray-500 text-xs ml-2">x{item.quantity}</span>
//                       <p className="text-xs text-gray-400 font-mono">{item.product_id}</p>
//                     </div>
//                     <span className="font-semibold">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="border-t pt-3 space-y-2">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Shipping</span>
//                   <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Tax (5%)</span>
//                   <span>${tax.toFixed(2)}</span>
//                 </div>
//                 <div className="border-t pt-2 mt-2">
//                   <div className="flex justify-between font-bold text-lg">
//                     <span>Total</span>
//                     <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="mt-6 space-y-2 border-t pt-4">
//                 <div className="flex items-center text-sm text-gray-500">
//                   <FiTruck className="mr-2" />
//                   <span>Free shipping on orders over $50</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-500">
//                   <FiShield className="mr-2" />
//                   <span>Secure payment guaranteed</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-500">
//                   <FiClock className="mr-2" />
//                   <span>Delivery within 3-5 business days</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTruck, FiShield, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadCartFromAPI, clearCart } = useCart();
  
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [finalOrderId, setFinalOrderId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cod',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getUserId = () => {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId');
  };

  useEffect(() => {
    if (location.state && location.state.cartItems) {
      console.log('Received from CartPage:', location.state);
      setCartItems(location.state.cartItems);
      setSubtotal(location.state.subtotal || 0);
      setShipping(location.state.shipping || 0);
      setTotal(location.state.total || 0);
    } else {
      // Try to load from context if no state
      const loadFromContext = async () => {
        const token = getAuthToken();
        if (token) {
          await loadCartFromAPI();
        }
      };
      loadFromContext();
      navigate('/shop');
    }
  }, [location, navigate, loadCartFromAPI]);

  const tax = subtotal * 0.05;
  const finalTotal = total + tax;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    if (errorMessage) setErrorMessage('');
  };

  // Clear single cart item
  const clearCartItem = async (item) => {
    const token = getAuthToken();
    const user_id = getUserId();
    
    try {
      await axios.post(
        'http://localhost:5000/api/v1/cart/Create',
        {
          product_id: item.product_id,
          product_name: item.name,
          colour: item.colour || 'Default',
          size: item.size || 'Default',
          quantity: 0
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (err) {
      console.error(`Error clearing item ${item.name}:`, err);
    }
  };

  // Create order from cart directly (alternative method)
  const createOrderFromCart = async (customerInfo, paymentMethod, notes) => {
    const token = getAuthToken();
    const user_id = getUserId();
    
    const response = await axios.post(
      'http://localhost:5000/api/v1/order/create-from-cart',
      {
        customer: customerInfo,
        paymentMethod: paymentMethod,
        notes: notes
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   console.log('=== PLACING ORDER ===');
  //   console.log('Cart Items:', cartItems);
    
  //   if (cartItems.length === 0) {
  //     setErrorMessage('Your cart is empty!');
  //     return;
  //   }
    
  //   // Validate each item
  //   for (let i = 0; i < cartItems.length; i++) {
  //     const item = cartItems[i];
  //     if (!item.product_id) {
  //       setErrorMessage(`Item "${item.name}" is missing product ID`);
  //       return;
  //     }
  //     if (!item.quantity || item.quantity < 1) {
  //       setErrorMessage(`Item "${item.name}" has invalid quantity`);
  //       return;
  //     }
  //   }
    
  //   const newErrors = validateForm();
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   setLoading(true);
  //   setErrorMessage('');

  //   try {
  //     const token = getAuthToken();
  //     const user_id = getUserId();
      
  //     console.log('Token exists:', !!token);
  //     console.log('User ID:', user_id);
      
  //     if (!token || !user_id) {
  //       setErrorMessage('Please login again');
  //       setTimeout(() => {
  //         navigate('/login');
  //       }, 2000);
  //       return;
  //     }
      
  //     // Prepare order data
  //     const orderData = {
  //       items: cartItems.map(item => ({
  //         product_id: item.product_id,
  //         product_name: item.name,
  //         quantity: Number(item.quantity),
  //         price: Number(item.price),
  //         colour: (item.colour || '').trim(),
  //         size: (item.size || '').trim()
  //       })),
  //       customer: {
  //         firstName: formData.firstName.trim(),
  //         lastName: formData.lastName.trim(),
  //         email: formData.email.trim(),
  //         phone: formData.phone.trim(),
  //         address: formData.address.trim(),
  //         city: formData.city.trim(),
  //         zipCode: formData.zipCode.trim()
  //       },
  //       paymentMethod: formData.paymentMethod,
  //       subtotal: Number(subtotal),
  //       shipping: Number(shipping),
  //       tax: Number(tax),
  //       total: Number(finalTotal),
  //       notes: formData.notes.trim()
  //     };
      
  //     console.log('Sending order to API:', JSON.stringify(orderData, null, 2));
      
  //     // Call the order create API
  //     const response = await axios.post(
  //       'http://localhost:5000/api/v1/order/create',
  //       orderData,
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );
      
  //     console.log('Order API Response:', response.data);
      
  //     if (response.data.success) {
  //       const newOrderId = response.data.orderId;
        
  //       // Clear all cart items from backend
  //       console.log('Clearing cart items...');
        
  //       for (let i = 0; i < cartItems.length; i++) {
  //         const item = cartItems[i];
  //         await clearCartItem(item);
  //       }
        
  //       // Refresh cart context
  //       if (loadCartFromAPI) {
  //         await loadCartFromAPI();
  //       }
        
  //       setFinalOrderId(newOrderId);
  //       setOrderPlaced(true);
        
  //       // Navigate to confirmation page
  //       setTimeout(() => {
  //         navigate('/order-confirmation', { 
  //           state: { 
  //             orderId: newOrderId, 
  //             order: response.data.order 
  //           } 
  //         });
  //       }, 2000);
  //     } else {
  //       throw new Error(response.data.message || 'Order failed');
  //     }
      
  //   } catch (error) {
  //     console.error('Order failed:', error);
  //     const errorMsg = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
  //     setErrorMessage(errorMsg);
      
  //     // Scroll to top to show error
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // ... ভ্যালিডেশন কোড ...
    
//     try {
//         const token = getAuthToken();
        
//         // অর্ডার তৈরি করুন
//         const orderResponse = await axios.post(
//             'http://localhost:5000/api/v1/order/create',
//             orderData,
//             { headers: { 'Authorization': `Bearer ${token}` } }
//         );
        
//         if (orderResponse.data.success) {
//             // যদি অনলাইন পেমেন্ট হয়
//             if (formData.paymentMethod !== 'cod') {
//                 // SSL Commerze পেমেন্ট ইনিশিয়েট করুন
//                 const paymentResponse = await axios.post(
//                     'http://localhost:5000/api/v1/payment/initiate',
//                     {
//                         orderId: orderResponse.data.orderId,
//                         total: finalTotal,
//                         customer: orderData.customer,
//                         productName: cartItems[0].name
//                     },
//                     { headers: { 'Authorization': `Bearer ${token}` } }
//                 );
                
//                 if (paymentResponse.data.success) {
//                     // পেমেন্ট পেইজে রিডাইরেক্ট করুন
//                     window.location.href = paymentResponse.data.redirectUrl;
//                 }
//             } else {
//                 // ক্যাশ অন ডেলিভারি
//                 navigate('/order-confirmation', {
//                     state: { orderId: orderResponse.data.orderId }
//                 });
//             }
//         }
//     } catch (error) {
//         console.error('Order failed:', error);
//         setErrorMessage(error.response?.data?.message || 'Order failed');
//     }
// };

// const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     console.log('=== PLACING ORDER ===');
//     console.log('Cart Items:', cartItems);
    
//     if (cartItems.length === 0) {
//         setErrorMessage('Your cart is empty!');
//         return;
//     }
    
//     // Validate each item
//     for (let i = 0; i < cartItems.length; i++) {
//         const item = cartItems[i];
//         if (!item.product_id) {
//             setErrorMessage(`Item "${item.name}" is missing product ID`);
//             return;
//         }
//         if (!item.quantity || item.quantity < 1) {
//             setErrorMessage(`Item "${item.name}" has invalid quantity`);
//             return;
//         }
//     }
    
//     const newErrors = validateForm();
//     if (Object.keys(newErrors).length > 0) {
//         setErrors(newErrors);
//         return;
//     }

//     setLoading(true);
//     setErrorMessage('');

//     try {
//         const token = getAuthToken();
//         const user_id = getUserId();
        
//         console.log('Token exists:', !!token);
//         console.log('User ID:', user_id);
        
//         if (!token || !user_id) {
//             setErrorMessage('Please login again');
//             setTimeout(() => {
//                 navigate('/login');
//             }, 2000);
//             return;
//         }
        
//         // ✅ Prepare order data (এখানে orderData ডিফাইন করুন)
//         const orderData = {
//             items: cartItems.map(item => ({
//                 product_id: item.product_id,
//                 product_name: item.name,
//                 quantity: Number(item.quantity),
//                 price: Number(item.price),
//                 colour: (item.colour || '').trim(),
//                 size: (item.size || '').trim()
//             })),
//             customer: {
//                 firstName: formData.firstName.trim(),
//                 lastName: formData.lastName.trim(),
//                 email: formData.email.trim(),
//                 phone: formData.phone.trim(),
//                 address: formData.address.trim(),
//                 city: formData.city.trim(),
//                 zipCode: formData.zipCode.trim()
//             },
//             paymentMethod: formData.paymentMethod,
//             subtotal: Number(subtotal),
//             shipping: Number(shipping),
//             tax: Number(tax),
//             total: Number(finalTotal),
//             notes: formData.notes.trim()
//         };
        
//         console.log('Sending order to API:', JSON.stringify(orderData, null, 2));
        
//         // Call the order create API
//         const orderResponse = await axios.post(
//             'http://localhost:5000/api/v1/order/create',
//             orderData,  // ← এখন orderData ডিফাইন করা আছে
//             {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
        
//         console.log('Order API Response:', orderResponse.data);
        
//         if (orderResponse.data.success) {
//             const newOrderId = orderResponse.data.orderId;
            
//             // Clear all cart items from backend
//             console.log('Clearing cart items...');
            
//             for (let i = 0; i < cartItems.length; i++) {
//                 const item = cartItems[i];
//                 await clearCartItem(item);
//             }
            
//             // Refresh cart context
//             if (loadCartFromAPI) {
//                 await loadCartFromAPI();
//             }
            
//             // Check if online payment
//             // if (formData.paymentMethod !== 'cod') {
//             //     // SSL Commerze payment initiate
//             //     try {
//             //         const paymentResponse = await axios.post(
//             //             'http://localhost:5000/api/v1/payment/initiate',
//             //             {
//             //                 orderId: newOrderId,
//             //                 total: finalTotal,
//             //                 customer: orderData.customer,
//             //                 productName: cartItems[0]?.name || 'Product'
//             //             },
//             //             {
//             //                 headers: {
//             //                     'Authorization': `Bearer ${token}`,
//             //                     'Content-Type': 'application/json'
//             //                 }
//             //             }
//             //         );
                    
//             //         if (paymentResponse.data.success) {
//             //             // Redirect to payment page
//             //             window.location.href = paymentResponse.data.redirectUrl;
//             //             return;
//             //         }
//             //     } catch (paymentError) {
//             //         console.error('Payment initiation failed:', paymentError);
//             //         // Still order is created, show confirmation
//             //         setFinalOrderId(newOrderId);
//             //         setOrderPlaced(true);
//             //         setTimeout(() => {
//             //             navigate('/order-confirmation', {
//             //                 state: {
//             //                     orderId: newOrderId,
//             //                     order: orderResponse.data.order
//             //                 }
//             //             });
//             //         }, 2000);
//             //         return;
//             //     }
//             // }
//             // CheckoutPage.jsx এর handleSubmit ফাংশনের পেমেন্ট অংশটি এভাবে আপডেট করুন:

// if (formData.paymentMethod !== 'cod') {
//     try {
//         // লাস্ট অর্ডার আইডি localStorage এ সেভ করুন
//         localStorage.setItem('lastOrderId', newOrderId);
        
//         const paymentResponse = await axios.post(
//             'http://localhost:5000/api/v1/payment/initiate',
//             {
//                 orderId: newOrderId,
//                 total: finalTotal,
//                 customer: orderData.customer,
//                 productName: cartItems[0]?.name || 'Product',
//                 // ✅ সঠিক URL গুলো দিন
//                 successUrl: `${window.location.origin}/payment-success`,
//                 failUrl: `${window.location.origin}/payment-fail`,
//                 cancelUrl: `${window.location.origin}/payment-cancel`
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
        
//         console.log('Payment Response:', paymentResponse.data);
        
//         if (paymentResponse.data.success && paymentResponse.data.redirectUrl) {
//             // পেমেন্ট পেজে রিডাইরেক্ট করুন
//             window.location.href = paymentResponse.data.redirectUrl;
//             return;
//         } else {
//             // পেমেন্ট ইনিশিয়েট না হলে অর্ডার কনফার্মেশন দেখান
//             setFinalOrderId(newOrderId);
//             setOrderPlaced(true);
//             setTimeout(() => {
//                 navigate('/order-confirmation', {
//                     state: {
//                         orderId: newOrderId,
//                         order: orderResponse.data.order,
//                         paymentStatus: 'pending'
//                     }
//                 });
//             }, 2000);
//         }
//     } catch (paymentError) {
//         console.error('Payment initiation failed:', paymentError);
//         setFinalOrderId(newOrderId);
//         setOrderPlaced(true);
//         setTimeout(() => {
//             navigate('/order-confirmation', {
//                 state: {
//                     orderId: newOrderId,
//                     order: orderResponse.data.order,
//                     paymentStatus: 'pending',
//                     paymentError: 'Payment gateway error. Please contact support.'
//                 }
//             });
//         }, 2000);
//     }
//     return;
// }
            
//             // Cash on delivery
//             setFinalOrderId(newOrderId);
//             setOrderPlaced(true);
            
//             setTimeout(() => {
//                 navigate('/order-confirmation', {
//                     state: {
//                         orderId: newOrderId,
//                         order: orderResponse.data.order
//                     }
//                 });
//             }, 2000);
//         } else {
//             throw new Error(orderResponse.data.message || 'Order failed');
//         }
        
//     } catch (error) {
//         console.error('Order failed:', error);
//         const errorMsg = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
//         setErrorMessage(errorMsg);
        
//         // Scroll to top to show error
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     } finally {
//         setLoading(false);
//     }
// };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== PLACING ORDER ===');
    console.log('Cart Items:', cartItems);
    
    if (cartItems.length === 0) {
        setErrorMessage('Your cart is empty!');
        return;
    }
    
    // Validate each item
    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        if (!item.product_id) {
            setErrorMessage(`Item "${item.name}" is missing product ID`);
            return;
        }
        if (!item.quantity || item.quantity < 1) {
            setErrorMessage(`Item "${item.name}" has invalid quantity`);
            return;
        }
    }
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
        const token = getAuthToken();
        const user_id = getUserId();
        
        console.log('Token exists:', !!token);
        console.log('User ID:', user_id);
        
        if (!token || !user_id) {
            setErrorMessage('Please login again');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            return;
        }
        
        // Prepare order data
        const orderData = {
            items: cartItems.map(item => ({
                product_id: item.product_id,
                product_name: item.name,
                quantity: Number(item.quantity),
                price: Number(item.price),
                colour: (item.colour || '').trim(),
                size: (item.size || '').trim()
            })),
            customer: {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                zipCode: formData.zipCode.trim()
            },
            paymentMethod: formData.paymentMethod,
            subtotal: Number(subtotal),
            shipping: Number(shipping),
            tax: Number(tax),
            total: Number(finalTotal),
            notes: formData.notes.trim()
        };
        
        console.log('Sending order to API:', JSON.stringify(orderData, null, 2));
        
        // Call the order create API
        const orderResponse = await axios.post(
            'http://localhost:5000/api/v1/order/create',
            orderData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Order API Response:', orderResponse.data);
        
        if (orderResponse.data.success) {
            const newOrderId = orderResponse.data.orderId;
            
            // Clear all cart items from backend
            console.log('Clearing cart items...');
            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i];
                await clearCartItem(item);
            }
            
            // Refresh cart context
            if (loadCartFromAPI) {
                await loadCartFromAPI();
            }
            
            // ========== পেমেন্ট প্রসেসিং ==========
            // ✅ এখানে সঠিক জায়গায় পেমেন্ট অংশ বসান
            if (formData.paymentMethod !== 'cod') {
                try {
                    localStorage.setItem('lastOrderId', newOrderId);
                    
                    const paymentResponse = await axios.post(
                        'http://localhost:5000/api/v1/payment/initiate',
                        {
                            orderId: newOrderId,
                            total: finalTotal,
                            customer: orderData.customer,
                            productName: cartItems[0]?.name || 'Product',
                            successUrl: `${window.location.origin}/payment-success`,
                            failUrl: `${window.location.origin}/payment-fail`,
                            cancelUrl: `${window.location.origin}/payment-cancel`
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    
                    console.log('Payment Response:', paymentResponse.data);
                    
                    if (paymentResponse.data.success && paymentResponse.data.redirectUrl) {
                        // পেমেন্ট পেজে রিডাইরেক্ট করুন
                        window.location.href = paymentResponse.data.redirectUrl;
                        return; // 👈 গুরুত্বপূর্ণ: এখানে ফাংশন শেষ করুন
                    } else {
                        throw new Error('No redirect URL received');
                    }
                } catch (paymentError) {
                    console.error('Payment initiation failed:', paymentError);
                    // পেমেন্ট ফেইল হলে কনফার্মেশন পেজ দেখান
                    setFinalOrderId(newOrderId);
                    setOrderPlaced(true);
                    setTimeout(() => {
                        navigate('/order-confirmation', {
                            state: {
                                orderId: newOrderId,
                                order: orderResponse.data.order,
                                paymentStatus: 'pending',
                                paymentError: 'Payment gateway error. Please contact support.'
                            }
                        });
                    }, 2000);
                    return;
                }
            }
            
            // ========== Cash on Delivery ==========
            // ✅ এখানে COD এর জন্য কনফার্মেশন
            setFinalOrderId(newOrderId);
            setOrderPlaced(true);
            
            setTimeout(() => {
                navigate('/order-confirmation', {
                    state: {
                        orderId: newOrderId,
                        order: orderResponse.data.order,
                        paymentStatus: 'success',
                        paymentMethod: 'cod'
                    }
                });
            }, 2000);
            
        } else {
            throw new Error(orderResponse.data.message || 'Order failed');
        }
        
    } catch (error) {
        console.error('Order failed:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
        setErrorMessage(errorMsg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
        setLoading(false);
    }
};

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Please add some items to your cart before checkout.</p>
          <button 
            onClick={() => navigate('/shop')} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">Order ID: <span className="font-semibold text-blue-600">{finalOrderId}</span></p>
          <p className="text-gray-600 mb-6">Redirecting to confirmation page...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600 mb-8">Complete your purchase</p>
        
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                Shipping Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+880 1234 567890"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Street address, apartment, etc."
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Zip Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Payment Method *</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="card">Credit/Debit Card</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Order Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Special instructions for delivery..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Place Order - $${finalTotal.toFixed(2)}`
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary ({cartItems.length} items)</h2>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-auto">
                {cartItems.map((item, index) => (
                  <div key={item.id || index} className="flex justify-between text-sm py-2 border-b">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 text-xs ml-2">x{item.quantity}</span>
                      <p className="text-xs text-gray-400 font-mono">{item.product_id}</p>
                      {item.colour && <p className="text-xs text-gray-400">Color: {item.colour}</p>}
                      {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                    </div>
                    <span className="font-semibold">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <FiTruck className="mr-2" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiShield className="mr-2" />
                  <span>Secure payment guaranteed</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiClock className="mr-2" />
                  <span>Delivery within 3-5 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;