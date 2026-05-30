import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyOrderById, cancelUserOrder } from '../services/api';

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getMyOrderById(orderId);
      console.log('Order details:', response.data);
      
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError(response.data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }
    
    setCancelling(true);
    try {
      const response = await cancelUserOrder(orderId);
      if (response.data.success) {
        alert('Order cancelled successfully');
        fetchOrderDetails(); // Refresh order details
      } else {
        alert(response.data.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <button onClick={() => navigate('/my-orders')} className="text-blue-600 hover:text-blue-800 mb-4">
            ← Back to Orders
          </button>
          <div className="bg-red-50 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-600">{error || 'Order not found'}</p>
            <button onClick={fetchOrderDetails} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={() => navigate('/my-orders')} className="text-blue-600 hover:text-blue-800 mb-4">
          ← Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold">Order #{order.orderId}</h1>
                <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Order Items */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{item.product_name}</h3>
                          {item.colour && <p className="text-sm text-gray-500">Color: {item.colour}</p>}
                          {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                          <p className="text-gray-600 mt-1">Price: ${item.price?.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                          <p className="font-semibold text-lg mt-1">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>${order.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span>${order.shipping?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span>${order.tax?.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-green-600">${order.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  <div className="space-y-1">
                    <p className="font-semibold">{order.customer?.firstName} {order.customer?.lastName}</p>
                    <p className="text-gray-600">{order.customer?.email}</p>
                    <p className="text-gray-600">{order.customer?.phone}</p>
                    <p className="text-gray-600">{order.customer?.address}</p>
                    <p className="text-gray-600">{order.customer?.city}, {order.customer?.zipCode}</p>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-semibold">{order.paymentMethod?.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </div>
                    {order.transactionId && (
                      <div>
                        <p className="text-gray-600 text-sm">Transaction ID:</p>
                        <p className="text-sm font-mono">{order.transactionId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => navigate(`/track-order/${order.orderId}`)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Track Order
                  </button>
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;