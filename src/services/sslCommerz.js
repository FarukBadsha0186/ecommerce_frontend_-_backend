// backend/src/services/sslCommerz.js
const axios = require('axios');
const SSLCommerz = require('ssl-commerz-node');
const orderModel = require('../models/orderModel');

// আপনার SSL Commerze কনফিগারেশন
const payment = new SSLCommerz.PaymentSession(
  'faruk69db6ef516a7f',      // আপনার SSL Commerz Store ID
  'faruk69db6ef516a7f@ssl',   // আপনার SSL Commerz Store Password
  false                        // false for sandbox, true for live
);

// Initialize payment
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, total, customer, productName } = req.body;
    
    console.log('=== SSL COMMERZE INITIATE ===');
    console.log('Order ID:', orderId);
    console.log('Total:', total);
    console.log('Customer:', customer);
    
    payment.setAmount(parseFloat(total));
    payment.setCurrency('BDT');
    payment.setOrderId(orderId);
    payment.setCustomerName(`${customer.firstName} ${customer.lastName}`);
    payment.setCustomerEmail(customer.email);
    payment.setCustomerPhone(customer.phone);
    payment.setCustomerAddress(customer.address);
    payment.setProductName(productName);
    payment.setProductCategory('General');
    payment.setProductProfile('general');
    
    // Set success and cancel URLs
    payment.setSuccessUrl(`http://localhost:5000/api/v1/payment/success`);
    payment.setCancelUrl(`http://localhost:5000/api/v1/payment/cancel`);
    payment.setFailedUrl(`http://localhost:5000/api/v1/payment/fail`);
    
    const paymentResponse = await payment.paymentInit();
    
    console.log('SSL Commerze Response:', paymentResponse);
    
    if (paymentResponse.GatewayPageURL) {
      return res.status(200).json({
        success: true,
        redirectUrl: paymentResponse.GatewayPageURL,
        sessionKey: paymentResponse.sessionkey
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment initialization failed'
      });
    }
  } catch (error) {
    console.error('SSL Commerz Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Handle payment success
exports.paymentSuccess = async (req, res) => {
  try {
    const { tran_id, val_id, amount, card_type } = req.body;
    
    console.log('=== PAYMENT SUCCESS ===');
    console.log('Transaction ID:', tran_id);
    console.log('Validation ID:', val_id);
    console.log('Amount:', amount);
    
    // Update order status to 'paid'
    await orderModel.findOneAndUpdate(
      { orderId: tran_id },
      { 
        paymentStatus: 'paid',
        orderStatus: 'processing',
        paymentDetails: {
          transactionId: val_id,
          amount: amount,
          cardType: card_type,
          paidAt: new Date()
        }
      }
    );
    
    // Redirect to frontend success page
    res.redirect(`http://localhost:3000/payment-success?orderId=${tran_id}`);
  } catch (error) {
    console.error('Payment Success Error:', error);
    res.redirect(`http://localhost:3000/payment-fail?error=${error.message}`);
  }
};

// Handle payment cancel
exports.paymentCancel = async (req, res) => {
  try {
    const { tran_id } = req.body;
    
    console.log('=== PAYMENT CANCELLED ===');
    console.log('Transaction ID:', tran_id);
    
    // Update order status to 'cancelled'
    await orderModel.findOneAndUpdate(
      { orderId: tran_id },
      { 
        paymentStatus: 'cancelled',
        orderStatus: 'cancelled'
      }
    );
    
    // Redirect to frontend cancel page
    res.redirect(`http://localhost:3000/payment-cancel?orderId=${tran_id}`);
  } catch (error) {
    console.error('Payment Cancel Error:', error);
    res.redirect('http://localhost:3000/cart');
  }
};

// Handle payment fail
exports.paymentFail = async (req, res) => {
  try {
    const { tran_id } = req.body;
    
    console.log('=== PAYMENT FAILED ===');
    console.log('Transaction ID:', tran_id);
    
    await orderModel.findOneAndUpdate(
      { orderId: tran_id },
      { 
        paymentStatus: 'failed',
        orderStatus: 'payment_failed'
      }
    );
    
    // Redirect to frontend fail page
    res.redirect(`http://localhost:3000/payment-fail?orderId=${tran_id}`);
  } catch (error) {
    console.error('Payment Fail Error:', error);
    res.redirect('http://localhost:3000/cart');
  }
};

// IPN Handler (Optional but recommended)
exports.paymentIPN = async (req, res) => {
  try {
    const { tran_id, status, val_id } = req.body;
    
    console.log('=== IPN RECEIVED ===');
    console.log('Transaction ID:', tran_id);
    console.log('Status:', status);
    
    if (status === 'VALID') {
      await orderModel.findOneAndUpdate(
        { orderId: tran_id },
        {
          paymentStatus: 'paid',
          paymentDetails: {
            transactionId: val_id,
            paidAt: new Date()
          },
          orderStatus: 'processing'
        }
      );
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('IPN Error:', error);
    res.status(500).send('Error');
  }
};