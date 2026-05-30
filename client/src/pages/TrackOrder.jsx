import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackUserOrder } from '../services/api';

function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTrackingInfo();
  }, [orderId]);

  const fetchTrackingInfo = async () => {
    try {
      setLoading(true);
      const response = await trackUserOrder(orderId);
      console.log('Tracking response:', response.data);
      
      if (response.data.success) {
        setTracking(response.data.tracking);
      } else {
        setError(response.data.message || 'Failed to fetch tracking info');
      }
    } catch (err) {
      console.error('Error fetching tracking:', err);
      setError(err.response?.data?.message || 'Failed to fetch tracking info');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepStatus, currentStatus) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const stepIndex = steps.indexOf(stepStatus);
    const currentIndex = steps.indexOf(currentStatus);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const steps = [
    { status: 'pending', label: 'Order Placed', icon: '📝', description: 'Your order has been received and confirmed' },
    { status: 'processing', label: 'Processing', icon: '⚙️', description: 'Your order is being prepared' },
    { status: 'shipped', label: 'Shipped', icon: '🚚', description: 'Your order is on the way' },
    { status: 'delivered', label: 'Delivered', icon: '✅', description: 'Your order has been delivered' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tracking information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <button onClick={() => navigate('/my-orders')} className="text-blue-600 hover:text-blue-800 mb-4">
            ← Back to Orders
          </button>
          <div className="bg-red-50 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button onClick={fetchTrackingInfo} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button onClick={() => navigate('/my-orders')} className="text-blue-600 hover:text-blue-800 mb-4">
          ← Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Track Order #{orderId}</h1>
            <p className="text-blue-100 mt-1">
              Current Status: {tracking?.status?.toUpperCase() || 'PENDING'}
            </p>
          </div>

          <div className="p-6">
            {/* Tracking Timeline */}
            <div className="relative mb-8">
              {steps.map((step, index) => {
                const stepStatus = getStepStatus(step.status, tracking?.status || 'pending');
                
                return (
                  <div key={index} className="relative flex items-start mb-8 last:mb-0">
                    {index < steps.length - 1 && (
                      <div className={`absolute left-5 top-10 w-0.5 h-16 ${
                        stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                    
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      stepStatus === 'completed' ? 'bg-green-500' :
                      stepStatus === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      <span className="text-white text-xl">{step.icon}</span>
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className={`font-semibold ${
                        stepStatus === 'completed' || stepStatus === 'current' ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </h3>
                      <p className={`text-sm ${
                        stepStatus === 'completed' || stepStatus === 'current' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                      {stepStatus === 'current' && tracking?.currentLocation && (
                        <p className="text-sm text-blue-600 mt-1">📍 {tracking.currentLocation}</p>
                      )}
                      {stepStatus === 'current' && tracking?.estimatedDelivery && tracking?.status !== 'delivered' && (
                        <p className="text-sm text-gray-500 mt-1">
                          🚚 Estimated Delivery: {tracking.estimatedDelivery}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 flex gap-3 flex-wrap">
              <button
                onClick={() => navigate(`/my-orders/${orderId}`)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Order Details
              </button>
              <button
                onClick={fetchTrackingInfo}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Refresh Status
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;