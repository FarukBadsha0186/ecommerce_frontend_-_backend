import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layouts';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/Register';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OrderConfirmation from './pages/OrderConfirmation';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';
import PaymentCancel from './pages/PaymentCancel';
import PaymentMock from './pages/PaymentMock';

// ডাইনামিক ইম্পোর্ট - ফাইল না থাকলে error দেখাবে না
let MyOrders, OrderDetails, TrackOrder;

try {
  MyOrders = require('./pages/MyOrders').default;
} catch (e) {
  console.warn('MyOrders component not found');
  MyOrders = () => <div className="p-8 text-center">My Orders page coming soon...</div>;
}

try {
  OrderDetails = require('./pages/OrderDetails').default;
} catch (e) {
  console.warn('OrderDetails component not found');
  OrderDetails = () => <div className="p-8 text-center">Order Details page coming soon...</div>;
}

try {
  TrackOrder = require('./pages/TrackOrder').default;
} catch (e) {
  console.warn('TrackOrder component not found');
  TrackOrder = () => <div className="p-8 text-center">Track Order page coming soon...</div>;
}

function App() {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/payment-mock" element={<PaymentMock />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-fail" element={<PaymentFail />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            
            {/* অর্ডার রাউটস */}
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-orders/:orderId" element={<OrderDetails />} />
            <Route path="/track-order/:orderId" element={<TrackOrder />} />
          </Routes>
        </Layout>
      </CartProvider>
    </Router>
  );
}

export default App;