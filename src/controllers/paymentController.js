

// src/controllers/paymentController.js
const SSLCommerzPayment = require('sslcommerz-lts');

const store_id = process.env.SSL_STORE_ID || 'faruk69db6ef516a7f';
const store_passwd = process.env.SSL_STORE_PASSWORD || 'faruk69db6ef516a7f@ssl';
const is_live = false; // false = স্যান্ডবক্স

// পেমেন্ট ইনিশিয়েট
const initiatePayment = async (req, res) => {
    try {
        const { orderId, total, customer, productName } = req.body;
        
        console.log('📢 Initiating payment for order:', orderId);
        console.log('Store ID:', store_id);
        
        const data = {
            total_amount: total,
            currency: 'BDT',
            tran_id: orderId,
            success_url: `https://ecommerce-8lhe.onrender.com/api/v1/payment/success`,
            fail_url: `https://ecommerce-8lhe.onrender.com/api/v1/payment/fail`,
            cancel_url: `https://ecommerce-8lhe.onrender.com/api/v1/payment/cancel`,
            ipn_url: `https://ecommerce-8lhe.onrender.com/api/v1/payment/ipn`,
            shipping_method: 'Courier',
            product_name: productName,
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: `${customer.firstName} ${customer.lastName}`,
            cus_email: customer.email,
            cus_add1: customer.address,
            cus_city: customer.city,
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: customer.phone,
            ship_name: `${customer.firstName} ${customer.lastName}`,
            ship_add1: customer.address,
            ship_city: customer.city,
            ship_postcode: '1000',
            ship_country: 'Bangladesh',
        };
        
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        
        sslcz.init(data).then(apiResponse => {
            console.log('SSL Commerz Response:', apiResponse);
            
            if (apiResponse.GatewayPageURL) {
                res.json({
                    success: true,
                    redirectUrl: apiResponse.GatewayPageURL
                });
            } else {
                res.json({
                    success: false,
                    message: 'Payment initialization failed'
                });
            }
        }).catch(error => {
            console.error('SSL Commerz Error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        });
        
    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// পেমেন্ট সাকসেস
const paymentSuccess = async (req, res) => {
    try {
        console.log('✅ Payment Success Data:', req.body);
        const { tran_id, val_id } = req.body;
        
        // পেমেন্ট ভ্যালিডেট করুন (SSL Commerz থেকে আসা ডাটা চেক)
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const validation = await sslcz.validate({ val_id: val_id });
        
        console.log('Validation Response:', validation);
        
        // ফ্রন্টএন্ডে রিডাইরেক্ট (আপনার ফ্রন্টএন্ড পোর্ট অনুযায়ী)
        res.redirect(`http://localhost:5174/payment-success?orderId=${tran_id}`);
        
    } catch (error) {
        console.error('Payment success error:', error);
        res.redirect(`http://localhost:5174/payment-fail`);
    }
};

// পেমেন্ট ফেইল
const paymentFail = async (req, res) => {
    console.log('❌ Payment Fail Data:', req.body);
    const { tran_id } = req.body;
    res.redirect(`http://localhost:5174/payment-fail?orderId=${tran_id}`);
};

// পেমেন্ট ক্যান্সেল
const paymentCancel = async (req, res) => {
    console.log('🚫 Payment Cancel Data:', req.body);
    const { tran_id } = req.body;
    res.redirect(`http://localhost:5174/payment-cancel?orderId=${tran_id}`);
};

// IPN হ্যান্ডলার
const handleIPN = async (req, res) => {
    try {
        console.log('📞 IPN Received:', req.body);
        const { tran_id, val_id, status } = req.body;
        
        if (status === 'VALID' || status === 'SUCCESS') {
            const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
            const validation = await sslcz.validate({ val_id: val_id });
            
            if (validation.verify_sign) {
                console.log(`✅ Payment confirmed for order: ${tran_id}`);
                // এখানে আপনার ডাটাবেস আপডেট করুন
                // await Order.findOneAndUpdate({ orderId: tran_id }, { paymentStatus: 'paid' });
            }
        }
        
        res.sendStatus(200);
        
    } catch (error) {
        console.error('IPN error:', error);
        res.sendStatus(500);
    }
};

module.exports = {
    initiatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    handleIPN
};