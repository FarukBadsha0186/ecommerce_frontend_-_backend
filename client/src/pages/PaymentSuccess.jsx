// // frontend/src/pages/PaymentSuccess.js
// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { FiCheckCircle } from 'react-icons/fi';
// import axios from 'axios';

// const PaymentSuccess = () => {
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();
//     const [order, setOrder] = useState(null);
//     const orderId = searchParams.get('orderId');

//     useEffect(() => {
//         if (orderId) {
//             fetchOrderDetails();
//         }
//     }, [orderId]);

//     const fetchOrderDetails = async () => {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`https://ecommerce-8lhe.onrender.com/api/v1/order/${orderId}`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
//         setOrder(response.data.order);
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//             <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
//                 <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
//                 <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
//                 <p className="text-gray-600 mb-2">Order ID: <strong>{orderId}</strong></p>
//                 <p className="text-gray-600 mb-6">Your payment has been completed successfully.</p>
//                 <button 
//                     onClick={() => navigate(`/order-confirmation/${orderId}`)}
//                     className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                     View Order Details
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PaymentSuccess;


// frontend/src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orderId, setOrderId] = useState(null);
    
    useEffect(() => {
        // URL থেকে orderId বা payment_id পাওয়ার চেষ্টা করুন
        const urlOrderId = searchParams.get('orderId');
        const paymentId = searchParams.get('payment_id');
        const sessionKey = searchParams.get('sessionkey');
        
        console.log('PaymentSuccess - URL params:', { urlOrderId, paymentId, sessionKey });
        
        if (urlOrderId) {
            setOrderId(urlOrderId);
            setLoading(false);
        } else if (sessionKey) {
            // সেশন কী থেকে অর্ডার আইডি fetch করুন
            fetchOrderBySession(sessionKey);
        } else {
            // localStorage থেকে last order id নিন
            const lastOrderId = localStorage.getItem('lastOrderId');
            if (lastOrderId) {
                setOrderId(lastOrderId);
                setLoading(false);
            } else {
                // 3 সেকেন্ড পরে শপ পেজে রিডাইরেক্ট
                setTimeout(() => {
                    navigate('/shop');
                }, 3000);
            }
        }
    }, [searchParams, navigate]);
    
    const fetchOrderBySession = async (sessionKey) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `https://ecommerce-8lhe.onrender.com/api/v1/order/by-session/${sessionKey}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (response.data.success) {
                setOrderId(response.data.orderId);
                localStorage.setItem('lastOrderId', response.data.orderId);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying payment...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
                {orderId && <p className="text-gray-600 mb-2">Order ID: <strong>{orderId}</strong></p>}
                <p className="text-gray-600 mb-6">Your payment has been completed successfully.</p>
                <button 
                    onClick={() => navigate(`/order-confirmation`, { 
                        state: { orderId: orderId, paymentStatus: 'success' }
                    })}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    View Order Details
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;