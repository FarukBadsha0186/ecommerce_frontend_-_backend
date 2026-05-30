// pages/PaymentCancel.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';

const PaymentCancel = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/checkout');
        }, 3000);
        
        return () => clearTimeout(timer);
    }, [navigate]);
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                <FiXCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
                <p className="text-gray-600 mb-4">You have cancelled the payment process.</p>
                <p className="text-gray-500">Redirecting to checkout...</p>
                <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
            </div>
        </div>
    );
};

export default PaymentCancel;