// // import React, { useState, useEffect } from 'react';

// // import { useParams, Link, useNavigate } from 'react-router-dom';
// // import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
// // import axios from 'axios';
// // import { useCart } from '../context/CartContext'; // 👈 এই লাইনটি যোগ করুন

// // const ProductDetailPage = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const { addToCart } = useCart(); // 👈 এই লাইনটি যোগ করুন
// //   const [quantity, setQuantity] = useState(1);
// //   const [selectedImage, setSelectedImage] = useState(0);
// //   const [selectedColor, setSelectedColor] = useState('');
// //   const [selectedSize, setSelectedSize] = useState('');
// //   const [product, setProduct] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [addingToCart, setAddingToCart] = useState(false);
// //   const [cartMessage, setCartMessage] = useState(null);

// //   const getAuthToken = () => {
// //     return localStorage.getItem('token') || sessionStorage.getItem('token');
// //   };

// //   const getUserId = () => {
// //     return localStorage.getItem('userId') || sessionStorage.getItem('userId');
// //   };

// //   // Fetch product data
// //   useEffect(() => {
// //     const fetchProduct = async () => {
// //       try {
// //         setLoading(true);
        
// //         const response = await axios.get(`http://localhost:5000/api/v1/public/product/${id}`);
        
// //         console.log('API Response:', response.data);
        
// //         if (response.data.success) {
// //           setProduct(response.data.product);
          
// //           if (response.data.product.color && response.data.product.color.length > 0) {
// //             setSelectedColor(response.data.product.color[0]);
// //           }
// //           if (response.data.product.size && response.data.product.size.length > 0) {
// //             setSelectedSize(response.data.product.size[0]);
// //           }
// //         } else {
// //           setError(response.data.message || 'Failed to fetch product');
// //         }
// //       } catch (err) {
// //         console.error('Error fetching product:', err);
// //         setError(err.response?.data?.message || 'Error fetching product details');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (id) {
// //       fetchProduct();
// //     }
// //   }, [id]);

// //   // Add to cart function using CartContext
// //   const handleAddToCart = async () => {
// //     const token = getAuthToken();
// //     const user_id = getUserId();

// //     if (!token || !user_id) {
// //       setCartMessage({ 
// //         type: 'error', 
// //         text: 'Please login to add items to cart'
// //       });
// //       setTimeout(() => {
// //         setCartMessage(null);
// //         navigate('/login', { state: { from: `/product/${id}` } });
// //       }, 2000);
// //       return;
// //     }

// //     if (!selectedColor) {
// //       setCartMessage({ type: 'error', text: 'Please select a color' });
// //       setTimeout(() => setCartMessage(null), 3000);
// //       return;
// //     }

// //     if (!selectedSize) {
// //       setCartMessage({ type: 'error', text: 'Please select a size' });
// //       setTimeout(() => setCartMessage(null), 3000);
// //       return;
// //     }

// //     if (quantity > product.stock) {
// //       setCartMessage({ type: 'error', text: `Only ${product.stock} items available in stock` });
// //       setTimeout(() => setCartMessage(null), 3000);
// //       return;
// //     }

// //     try {
// //       setAddingToCart(true);
      
// //       // Use CartContext's addToCart function
// //       const success = await addToCart(product, quantity, selectedColor, selectedSize);
      
// //       if (success) {
// //         setCartMessage({ type: 'success', text: 'Added to cart successfully!' });
// //         setTimeout(() => setCartMessage(null), 3000);
// //       } else {
// //         setCartMessage({ type: 'error', text: 'Failed to add to cart' });
// //         setTimeout(() => setCartMessage(null), 3000);
// //       }
// //     } catch (err) {
// //       console.error('Add to cart error:', err);
// //       setCartMessage({ 
// //         type: 'error', 
// //         text: err.response?.data?.message || 'Error adding to cart. Please try again.' 
// //       });
// //       setTimeout(() => setCartMessage(null), 3000);
// //     } finally {
// //       setAddingToCart(false);
// //     }
// //   };

// //   const calculateDiscountPrice = () => {
// //     if (product?.is_discount && product?.discount_price) {
// //       const discountAmount = (product.price * product.discount_price) / 100;
// //       return product.price - discountAmount;
// //     }
// //     return product?.price || 0;
// //   };

// //   const renderStars = (rating = 4.5) => {
// //     const stars = [];
// //     const fullStars = Math.floor(rating);
    
// //     for (let i = 1; i <= 5; i++) {
// //       if (i <= fullStars) {
// //         stars.push(<FiStar key={i} className="fill-current text-yellow-400" />);
// //       } else {
// //         stars.push(<FiStar key={i} className="text-gray-300" />);
// //       }
// //     }
// //     return stars;
// //   };

// //   if (loading) {
// //     return (
// //       <div className="container mx-auto px-4 py-8">
// //         <div className="bg-white rounded-lg shadow-md p-8">
// //           <div className="flex justify-center items-center h-96">
// //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error || !product) {
// //     return (
// //       <div className="container mx-auto px-4 py-8">
// //         <div className="bg-white rounded-lg shadow-md p-8 text-center">
// //           <FiAlertCircle className="mx-auto text-red-500 text-5xl mb-4" />
// //           <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
// //           <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
// //           <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
// //             Go to Home
// //           </Link>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const finalPrice = calculateDiscountPrice();
// //   const discountPercentage = product.is_discount && product.discount_price ? product.discount_price : 0;

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       {cartMessage && (
// //         <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
// //           cartMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
// //         } text-white`}
// //         style={{ animation: 'slideIn 0.3s ease-out' }}>
// //           <span>{cartMessage.type === 'success' ? '✓' : '⚠️'}</span>
// //           <span>{cartMessage.text}</span>
// //         </div>
// //       )}

// //       <div className="bg-white rounded-lg shadow-md overflow-hidden">
// //         <div className="flex flex-col lg:flex-row">
// //           {/* Product Images */}
// //           <div className="lg:w-1/2 p-6">
// //             <div className="mb-4">
// //               <img
// //                 src={product.images && product.images[selectedImage] ? product.images[selectedImage] : 'https://via.placeholder.com/600x400'}
// //                 alt={product.title}
// //                 className="w-full h-96 object-cover rounded-lg"
// //               />
// //             </div>
// //             {product.images && product.images.length > 1 && (
// //               <div className="flex gap-2 overflow-x-auto">
// //                 {product.images.map((img, index) => (
// //                   <button
// //                     key={index}
// //                     onClick={() => setSelectedImage(index)}
// //                     className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
// //                       selectedImage === index ? 'border-blue-600' : 'border-gray-200'
// //                     }`}
// //                   >
// //                     <img src={img} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
// //                   </button>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Product Info */}
// //           <div className="lg:w-1/2 p-6">
// //             <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            
// //             {product.remark && (
// //               <span className="inline-block bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full mb-3">
// //                 {product.remark}
// //               </span>
// //             )}
            
// //             <div className="flex items-center mb-4">
// //               <div className="flex mr-2">
// //                 {renderStars()}
// //               </div>
// //               <span className="text-gray-600">(128 reviews)</span>
// //             </div>

// //             <div className="mb-4">
// //               {product.is_discount ? (
// //                 <div>
// //                   <span className="text-3xl font-bold text-blue-600">${finalPrice.toFixed(2)}</span>
// //                   <span className="text-gray-400 line-through ml-2">${product.price}</span>
// //                   <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
// //                     Save {discountPercentage}%
// //                   </span>
// //                 </div>
// //               ) : (
// //                 <span className="text-3xl font-bold text-blue-600">${product.price}</span>
// //               )}
// //             </div>

// //             {product.short_description && (
// //               <p className="text-gray-600 mb-4">{product.short_description}</p>
// //             )}

// //             {product.color && product.color.length > 0 && (
// //               <div className="mb-4">
// //                 <h3 className="font-semibold mb-2">Color:</h3>
// //                 <div className="flex gap-2 flex-wrap">
// //                   {product.color.map((color) => (
// //                     <button
// //                       key={color}
// //                       onClick={() => setSelectedColor(color)}
// //                       className={`px-4 py-2 border rounded-lg capitalize transition ${
// //                         selectedColor === color
// //                           ? 'border-blue-600 bg-blue-50 text-blue-600'
// //                           : 'border-gray-300 hover:border-blue-400'
// //                       }`}
// //                     >
// //                       {color}
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {product.size && product.size.length > 0 && (
// //               <div className="mb-4">
// //                 <h3 className="font-semibold mb-2">Size:</h3>
// //                 <div className="flex gap-2 flex-wrap">
// //                   {product.size.map((size) => (
// //                     <button
// //                       key={size}
// //                       onClick={() => setSelectedSize(size)}
// //                       className={`px-4 py-2 border rounded-lg transition ${
// //                         selectedSize === size
// //                           ? 'border-blue-600 bg-blue-50 text-blue-600'
// //                           : 'border-gray-300 hover:border-blue-400'
// //                       }`}
// //                     >
// //                       {size}
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {product.description && (
// //               <div className="mb-4">
// //                 <h3 className="font-semibold mb-2">Description:</h3>
// //                 <p className="text-gray-600">{product.description}</p>
// //               </div>
// //             )}

// //             <div className="border-t border-b py-4 my-4 space-y-2">
// //               <div className="flex items-center text-green-600">
// //                 <FiTruck className="mr-2" />
// //                 <span>Free Shipping on orders over $50</span>
// //               </div>
// //               <div className="flex items-center text-gray-600">
// //                 <FiShield className="mr-2" />
// //                 <span>1 Year Warranty</span>
// //               </div>
// //               <div className="flex items-center text-gray-600">
// //                 <FiRefreshCw className="mr-2" />
// //                 <span>30-Day Return Policy</span>
// //               </div>
// //             </div>

// //             <div className="flex items-center gap-4 mb-4">
// //               <div className="flex items-center border rounded-lg">
// //                 <button
// //                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
// //                   disabled={addingToCart}
// //                   className="px-3 py-2 border-r hover:bg-gray-100 disabled:opacity-50"
// //                 >
// //                   -
// //                 </button>
// //                 <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
// //                 <button
// //                   onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
// //                   disabled={addingToCart || quantity >= product.stock}
// //                   className="px-3 py-2 border-l hover:bg-gray-100 disabled:opacity-50"
// //                 >
// //                   +
// //                 </button>
// //               </div>
// //               <button
// //                 onClick={handleAddToCart}
// //                 disabled={addingToCart || product.stock === 0}
// //                 className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 {addingToCart ? (
// //                   <>
// //                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
// //                     Adding...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <FiShoppingCart />
// //                     Add to Cart
// //                   </>
// //                 )}
// //               </button>
// //               <button className="p-3 border rounded-lg hover:bg-gray-50">
// //                 <FiHeart className="text-gray-600" />
// //               </button>
// //             </div>

// //             {product.stock > 0 ? (
// //               <div>
// //                 <p className="text-green-600 mb-1">✓ In Stock ({product.stock} items available)</p>
// //                 {product.stock <= 10 && (
// //                   <p className="text-orange-600 text-sm">⚠️ Only {product.stock} items left! Order soon.</p>
// //                 )}
// //               </div>
// //             ) : (
// //               <p className="text-red-600">✗ Out of Stock</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       <style>{`
// //         @keyframes slideIn {
// //           from {
// //             transform: translateX(100%);
// //             opacity: 0;
// //           }
// //           to {
// //             transform: translateX(0);
// //             opacity: 1;
// //           }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default ProductDetailPage;

// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
// import axios from 'axios';
// import { useCart } from '../context/CartContext';

// const ProductDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [selectedColor, setSelectedColor] = useState('');
//   const [selectedSize, setSelectedSize] = useState('');
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [cartMessage, setCartMessage] = useState(null);

//   // 🔥 ইমেজ URL তৈরির function
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return 'https://via.placeholder.com/600x400?text=No+Image';
//     if (imagePath.startsWith('http')) return imagePath;
//     if (imagePath.startsWith('data:')) return imagePath;
//     return `http://localhost:5000${imagePath}`;
//   };

//   const getAuthToken = () => {
//     return localStorage.getItem('token') || sessionStorage.getItem('token');
//   };

//   const getUserId = () => {
//     return localStorage.getItem('userId') || sessionStorage.getItem('userId');
//   };

//   // Fetch product data
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
        
//         const response = await axios.get(`http://localhost:5000/api/v1/public/product/${id}`);
        
//         console.log('API Response:', response.data);
        
//         if (response.data.success) {
//           const productData = response.data.product;
//           setProduct(productData);
          
//           // 🔥 Color এবং Size সেট করা (API থেকে আসা ডাটা অনুযায়ী)
//           console.log('Product colors:', productData.color);
//           console.log('Product sizes:', productData.size);
          
//           if (productData.color && productData.color.length > 0) {
//             setSelectedColor(productData.color[0]);
//           }
//           if (productData.size && productData.size.length > 0) {
//             setSelectedSize(productData.size[0]);
//           }
//         } else {
//           setError(response.data.message || 'Failed to fetch product');
//         }
//       } catch (err) {
//         console.error('Error fetching product:', err);
//         setError(err.response?.data?.message || 'Error fetching product details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   // Add to cart function
//   const handleAddToCart = async () => {
//     const token = getAuthToken();
//     const user_id = getUserId();

//     if (!token || !user_id) {
//       setCartMessage({ 
//         type: 'error', 
//         text: 'Please login to add items to cart'
//       });
//       setTimeout(() => {
//         setCartMessage(null);
//         navigate('/login', { state: { from: `/product/${id}` } });
//       }, 2000);
//       return;
//     }

//     // 🔥 Color চেক করা (যদি product এ color array থাকে)
//     if (product.color && product.color.length > 0 && !selectedColor) {
//       setCartMessage({ type: 'error', text: 'Please select a color' });
//       setTimeout(() => setCartMessage(null), 3000);
//       return;
//     }

//     // 🔥 Size চেক করা (যদি product এ size array থাকে)
//     if (product.size && product.size.length > 0 && !selectedSize) {
//       setCartMessage({ type: 'error', text: 'Please select a size' });
//       setTimeout(() => setCartMessage(null), 3000);
//       return;
//     }

//     if (quantity > product.stock) {
//       setCartMessage({ type: 'error', text: `Only ${product.stock} items available in stock` });
//       setTimeout(() => setCartMessage(null), 3000);
//       return;
//     }

//     try {
//       setAddingToCart(true);
      
//       const success = await addToCart(product, quantity, selectedColor, selectedSize);
      
//       if (success) {
//         setCartMessage({ type: 'success', text: 'Added to cart successfully!' });
//         setTimeout(() => setCartMessage(null), 3000);
//       } else {
//         setCartMessage({ type: 'error', text: 'Failed to add to cart' });
//         setTimeout(() => setCartMessage(null), 3000);
//       }
//     } catch (err) {
//       console.error('Add to cart error:', err);
//       setCartMessage({ 
//         type: 'error', 
//         text: err.response?.data?.message || 'Error adding to cart. Please try again.' 
//       });
//       setTimeout(() => setCartMessage(null), 3000);
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   const calculateDiscountPrice = () => {
//     if (product?.is_discount && product?.discount_price) {
//       return product.discount_price;
//     }
//     return product?.price || 0;
//   };

//   const renderStars = (rating = 4.5) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
    
//     for (let i = 1; i <= 5; i++) {
//       if (i <= fullStars) {
//         stars.push(<FiStar key={i} className="fill-current text-yellow-400" />);
//       } else {
//         stars.push(<FiStar key={i} className="text-gray-300" />);
//       }
//     }
//     return stars;
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white rounded-lg shadow-md p-8">
//           <div className="flex justify-center items-center h-96">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white rounded-lg shadow-md p-8 text-center">
//           <FiAlertCircle className="mx-auto text-red-500 text-5xl mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
//           <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
//           <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
//             Go to Home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const finalPrice = calculateDiscountPrice();
//   const discountPercentage = product.is_discount && product.discount_price 
//     ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
//     : 0;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {cartMessage && (
//         <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
//           cartMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
//         } text-white`}
//         style={{ animation: 'slideIn 0.3s ease-out' }}>
//           <span>{cartMessage.type === 'success' ? '✓' : '⚠️'}</span>
//           <span>{cartMessage.text}</span>
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="flex flex-col lg:flex-row">
//           {/* Product Images */}
//           <div className="lg:w-1/2 p-6">
//             <div className="mb-4">
//               <img
//                 src={getImageUrl(product.images && product.images[selectedImage])}
//                 alt={product.title}
//                 className="w-full h-96 object-cover rounded-lg"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
//                 }}
//               />
//             </div>
//             {product.images && product.images.length > 1 && (
//               <div className="flex gap-2 overflow-x-auto">
//                 {product.images.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
//                       selectedImage === index ? 'border-blue-600' : 'border-gray-200'
//                     }`}
//                   >
//                     <img 
//                       src={getImageUrl(img)} 
//                       alt={`${product.title} ${index + 1}`} 
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = 'https://via.placeholder.com/80x80?text=Error';
//                       }}
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Info */}
//           <div className="lg:w-1/2 p-6">
//             <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            
//             {product.remark && (
//               <span className="inline-block bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full mb-3">
//                 {product.remark}
//               </span>
//             )}
            
//             <div className="flex items-center mb-4">
//               <div className="flex mr-2">
//                 {renderStars()}
//               </div>
//               <span className="text-gray-600">(128 reviews)</span>
//             </div>

//             <div className="mb-4">
//               {product.is_discount ? (
//                 <div>
//                   <span className="text-3xl font-bold text-blue-600">${finalPrice.toFixed(2)}</span>
//                   <span className="text-gray-400 line-through ml-2">${product.price}</span>
//                   <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
//                     Save {discountPercentage}%
//                   </span>
//                 </div>
//               ) : (
//                 <span className="text-3xl font-bold text-blue-600">${product.price}</span>
//               )}
//             </div>

//             {product.short_description && (
//               <p className="text-gray-600 mb-4">{product.short_description}</p>
//             )}

//             {/* 🔥 Color Section - API থেকে আসা color array দেখানো */}
//             {product.color && product.color.length > 0 && (
//               <div className="mb-4">
//                 <h3 className="font-semibold mb-2">
//                   Color: 
//                   <span className="text-blue-600 ml-2">{selectedColor || 'Select a color'}</span>
//                 </h3>
//                 <div className="flex gap-2 flex-wrap">
//                   {product.color.map((color) => (
//                     <button
//                       key={color}
//                       onClick={() => setSelectedColor(color)}
//                       className={`px-4 py-2 border rounded-lg capitalize transition ${
//                         selectedColor === color
//                           ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
//                           : 'border-gray-300 hover:border-blue-400'
//                       }`}
//                     >
//                       {color}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* 🔥 Size Section - API থেকে আসা size array দেখানো */}
//             {product.size && product.size.length > 0 && (
//               <div className="mb-4">
//                 <h3 className="font-semibold mb-2">
//                   Size: 
//                   <span className="text-blue-600 ml-2">{selectedSize || 'Select a size'}</span>
//                 </h3>
//                 <div className="flex gap-2 flex-wrap">
//                   {product.size.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`px-4 py-2 border rounded-lg transition ${
//                         selectedSize === size
//                           ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
//                           : 'border-gray-300 hover:border-blue-400'
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* 🔥 যদি color বা size না থাকে, তখন কোন alert আসবে না */}
//             {(!product.color || product.color.length === 0) && (!product.size || product.size.length === 0) && (
//               <div className="mb-4">
//                 <p className="text-gray-500 text-sm">No color/size options available</p>
//               </div>
//             )}

//             {product.description && (
//               <div className="mb-4">
//                 <h3 className="font-semibold mb-2">Description:</h3>
//                 <p className="text-gray-600">{product.description}</p>
//               </div>
//             )}

//             <div className="border-t border-b py-4 my-4 space-y-2">
//               <div className="flex items-center text-green-600">
//                 <FiTruck className="mr-2" />
//                 <span>Free Shipping on orders over $50</span>
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <FiShield className="mr-2" />
//                 <span>1 Year Warranty</span>
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <FiRefreshCw className="mr-2" />
//                 <span>30-Day Return Policy</span>
//               </div>
//             </div>

//             <div className="flex items-center gap-4 mb-4">
//               <div className="flex items-center border rounded-lg">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   disabled={addingToCart}
//                   className="px-3 py-2 border-r hover:bg-gray-100 disabled:opacity-50"
//                 >
//                   -
//                 </button>
//                 <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
//                 <button
//                   onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
//                   disabled={addingToCart || quantity >= product.stock}
//                   className="px-3 py-2 border-l hover:bg-gray-100 disabled:opacity-50"
//                 >
//                   +
//                 </button>
//               </div>
//               <button
//                 onClick={handleAddToCart}
//                 disabled={addingToCart || product.stock === 0}
//                 className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {addingToCart ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     <FiShoppingCart />
//                     Add to Cart
//                   </>
//                 )}
//               </button>
//               <button className="p-3 border rounded-lg hover:bg-gray-50">
//                 <FiHeart className="text-gray-600" />
//               </button>
//             </div>

//             {product.stock > 0 ? (
//               <div>
//                 <p className="text-green-600 mb-1">✓ In Stock ({product.stock} items available)</p>
//                 {product.stock <= 10 && (
//                   <p className="text-orange-600 text-sm">⚠️ Only {product.stock} items left! Order soon.</p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-red-600">✗ Out of Stock</p>
//             )}
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes slideIn {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProductDetailPage;


import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loadCartFromAPI } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);

  // ইমেজ URL তৈরির function
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('data:')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getUserId = () => {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId');
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`http://localhost:5000/api/v1/public/product/${id}`);
        
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          const productData = response.data.product;
          setProduct(productData);
          
          // Color এবং Size সেট করা
          console.log('Product colors:', productData.color);
          console.log('Product sizes:', productData.size);
          
          if (productData.color && Array.isArray(productData.color) && productData.color.length > 0) {
            setSelectedColor(productData.color[0]);
          }
          if (productData.size && Array.isArray(productData.size) && productData.size.length > 0) {
            setSelectedSize(productData.size[0]);
          }
        } else {
          setError(response.data.message || 'Failed to fetch product');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Add to cart function - সরাসরি API call করবে
  const handleAddToCart = async () => {
    const token = getAuthToken();
    const user_id = getUserId();

    console.log('🔍 Add to Cart Debug:', {
      hasToken: !!token,
      userId: user_id,
      product: product?.title,
      quantity: quantity,
      selectedColor: selectedColor,
      selectedSize: selectedSize
    });

    if (!token || !user_id) {
      setCartMessage({ 
        type: 'error', 
        text: 'Please login to add items to cart'
      });
      setTimeout(() => {
        setCartMessage(null);
        navigate('/login', { state: { from: `/product/${id}` } });
      }, 2000);
      return;
    }

    // Color চেক করা
    if (product.color && product.color.length > 0 && !selectedColor) {
      setCartMessage({ type: 'error', text: 'Please select a color' });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    // Size চেক করা
    if (product.size && product.size.length > 0 && !selectedSize) {
      setCartMessage({ type: 'error', text: 'Please select a size' });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    if (quantity > product.stock) {
      setCartMessage({ type: 'error', text: `Only ${product.stock} items available in stock` });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    try {
      setAddingToCart(true);
      
      // প্রস্তুত করা ডাটা Postman এর মত
      const finalColor = selectedColor || (product.color?.[0] || 'Default');
      const finalSize = selectedSize || (product.size?.[0] || 'Default');
      
      const cartData = {
        product_id: product._id || product.id,
        product_name: product.title || product.name,
        colour: finalColor.trim(),
        size: finalSize.trim(),
        quantity: quantity.toString() // String হিসেবে পাঠানো
      };
      
      console.log('📦 Sending cart data:', cartData);
      
      // সরাসরি API call
      const response = await axios.post(
        'http://localhost:5000/api/v1/cart/Create',
        cartData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ API Response:', response.data);
      
      if (response.data.success) {
        setCartMessage({ type: 'success', text: 'Added to cart successfully!' });
        setTimeout(() => setCartMessage(null), 3000);
        
        // Cart refresh করতে হলে
        if (loadCartFromAPI) {
          await loadCartFromAPI();
        }
      } else {
        setCartMessage({ type: 'error', text: response.data.message || 'Failed to add to cart' });
        setTimeout(() => setCartMessage(null), 3000);
      }
    } catch (err) {
      console.error('❌ Add to cart error:', err);
      console.error('Error details:', err.response?.data);
      
      let errorMessage = 'Error adding to cart. Please try again.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      } else if (err.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check backend.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setCartMessage({ 
        type: 'error', 
        text: errorMessage
      });
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const calculateDiscountPrice = () => {
    if (product?.is_discount && product?.discount_price) {
      return product.discount_price;
    }
    return product?.price || 0;
  };

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FiStar key={i} className="fill-current text-yellow-400" />);
      } else {
        stars.push(<FiStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FiAlertCircle className="mx-auto text-red-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const finalPrice = calculateDiscountPrice();
  const discountPercentage = product.is_discount && product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {cartMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          cartMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}
        style={{ animation: 'slideIn 0.3s ease-out' }}>
          <span>{cartMessage.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{cartMessage.text}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Product Images */}
          <div className="lg:w-1/2 p-6">
            <div className="mb-4">
              <img
                src={getImageUrl(product.images && product.images[selectedImage])}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                }}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={getImageUrl(img)} 
                      alt={`${product.title} ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80x80?text=Error';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            
            {product.remark && (
              <span className="inline-block bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full mb-3">
                {product.remark}
              </span>
            )}
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {renderStars()}
              </div>
              <span className="text-gray-600">(128 reviews)</span>
            </div>

            <div className="mb-4">
              {product.is_discount ? (
                <div>
                  <span className="text-3xl font-bold text-blue-600">${finalPrice.toFixed(2)}</span>
                  <span className="text-gray-400 line-through ml-2">${product.price}</span>
                  <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
                    Save {discountPercentage}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-blue-600">${product.price}</span>
              )}
            </div>

            {product.short_description && (
              <p className="text-gray-600 mb-4">{product.short_description}</p>
            )}

            {/* Color Section */}
            {product.color && product.color.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">
                  Color: 
                  <span className="text-blue-600 ml-2">{selectedColor || 'Select a color'}</span>
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {product.color.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg capitalize transition ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Section */}
            {product.size && product.size.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">
                  Size: 
                  <span className="text-blue-600 ml-2">{selectedSize || 'Select a size'}</span>
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {product.size.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.description && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Description:</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            <div className="border-t border-b py-4 my-4 space-y-2">
              <div className="flex items-center text-green-600">
                <FiTruck className="mr-2" />
                <span>Free Shipping on orders over $50</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiShield className="mr-2" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiRefreshCw className="mr-2" />
                <span>30-Day Return Policy</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={addingToCart}
                  className="px-3 py-2 border-r hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={addingToCart || quantity >= product.stock}
                  className="px-3 py-2 border-l hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiShoppingCart />
                    Add to Cart
                  </>
                )}
              </button>
              <button className="p-3 border rounded-lg hover:bg-gray-50">
                <FiHeart className="text-gray-600" />
              </button>
            </div>

            {product.stock > 0 ? (
              <div>
                <p className="text-green-600 mb-1">✓ In Stock ({product.stock} items available)</p>
                {product.stock <= 10 && (
                  <p className="text-orange-600 text-sm">⚠️ Only {product.stock} items left! Order soon.</p>
                )}
              </div>
            ) : (
              <p className="text-red-600">✗ Out of Stock</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;