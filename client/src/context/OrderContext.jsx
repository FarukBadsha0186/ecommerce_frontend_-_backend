import React, { createContext, useState, useContext } from 'react';
import { createOrder, createPayment } from '../services/api';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const placeOrder = async (orderData, cartItems, total) => {
    setLoading(true);
    try {
      // 1. Order তৈরি করুন
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        shippingAddress: {
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          zipCode: orderData.zipCode
        },
        paymentMethod: orderData.paymentMethod
      };

      const order = await createOrder(orderPayload);
      
      // 2. Payment তৈরি করুন (যদি কার্ড পেমেন্ট হয়)
      if (orderData.paymentMethod === 'card') {
        const paymentPayload = {
          orderId: order.id,
          amount: total,
          method: 'card'
        };
        await createPayment(paymentPayload);
      }
      
      toast.success('Order placed successfully!');
      return order;
      
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    placeOrder,
    loading,
    orders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};