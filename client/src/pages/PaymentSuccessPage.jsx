// PaymentSuccessPage.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5000/api/v1/order/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setOrder(response.data.order);
  };

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Your payment has been completed successfully.</p>
        <p className="text-gray-600 mb-6">Order ID: <strong>{orderId}</strong></p>
        <button 
          onClick={() => navigate(`/order-confirmation/${orderId}`)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          View Order Details
        </button>
      </div>
    </div>
  );
};