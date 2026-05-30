// E:/ostad_ecomerce/client/src/pages/PaymentMock.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentMock = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('orderId');
    const total = searchParams.get('total');
    
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('mobile');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleSendOtp = (e) => {
        e.preventDefault();
        if (!phoneNumber || phoneNumber.length < 11) {
            setError('Please enter a valid phone number');
            return;
        }
        
        setLoading(true);
        setError('');
        
        setTimeout(() => {
            setLoading(false);
            setStep('otp');
            alert('Demo OTP sent! Use OTP: 123456');
        }, 1000);
    };
    
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (!otp || otp.length < 6) {
            setError('Please enter the 6-digit OTP');
            return;
        }
        
        setLoading(true);
        setError('');
        
        setTimeout(() => {
            if (otp === '123456') {
                navigate(`/payment-success?orderId=${orderId}`);
            } else {
                setError('Invalid OTP. Please use 123456');
                setLoading(false);
            }
        }, 1000);
    };
    
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%', padding: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Test Payment</h1>
                    <p>Order: <strong>{orderId}</strong></p>
                    <p>Amount: <strong style={{ color: 'green' }}>${total}</strong></p>
                </div>
                
                <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
                    <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
                        <strong>Demo Instructions:</strong><br />
                        1. Enter any phone number<br />
                        2. Use OTP: <strong>123456</strong><br />
                        3. Mock payment - No real transaction
                    </p>
                </div>
                
                {step === 'mobile' && (
                    <form onSubmit={handleSendOtp}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Mobile Number</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="01712345678"
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                            />
                        </div>
                        
                        {error && (
                            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '8px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                                {error}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}
                
                {step === 'otp' && (
                    <form onSubmit={handleVerifyOtp}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                maxLength="6"
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', textAlign: 'center', fontSize: '24px', letterSpacing: '4px' }}
                            />
                            <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '8px' }}>Demo OTP: <strong>123456</strong></p>
                        </div>
                        
                        {error && (
                            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '8px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                                {error}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                        >
                            {loading ? 'Verifying...' : 'Verify & Pay'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => setStep('mobile')}
                            style={{ width: '100%', marginTop: '8px', backgroundColor: 'transparent', color: '#6b7280', padding: '8px', border: 'none', cursor: 'pointer' }}
                        >
                            ← Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PaymentMock;