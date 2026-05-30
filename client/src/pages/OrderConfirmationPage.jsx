// OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderInfo, setOrderInfo] = useState(null);
    
    useEffect(() => {
        const { orderId, paymentStatus, orderDetails } = location.state || {};
        
        if (!orderId) {
            navigate('/shop');
            return;
        }
        
        setOrderInfo({
            orderId,
            paymentStatus: paymentStatus || 'success',
            orderDetails
        });
        
        // Auto redirect to shop after 5 seconds
        const timer = setTimeout(() => {
            navigate('/shop');
        }, 5000);
        
        return () => clearTimeout(timer);
    }, [location, navigate]);
    
    if (!orderInfo) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                {orderInfo.paymentStatus === 'success' ? (
                    <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                ) : (
                    <FiAlertCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                )}
                
                <h1 className="text-2xl font-bold mb-4">
                    {orderInfo.paymentStatus === 'success' 
                        ? 'Order Placed Successfully!' 
                        : 'Order Created - Payment Pending'}
                </h1>
                
                <p className="text-gray-600 mb-2">
                    Order ID: <span className="font-semibold text-blue-600">{orderInfo.orderId}</span>
                </p>
                
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase! We'll send you a confirmation email shortly.
                </p>
                
                {orderInfo.paymentStatus !== 'success' && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800">
                            Please complete your payment to confirm the order.
                            You will be redirected to the payment page shortly.
                        </p>
                    </div>
                )}
                
                <button
                    onClick={() => navigate('/shop')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;