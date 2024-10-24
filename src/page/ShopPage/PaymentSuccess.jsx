import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const { orderId } = location.state || {}; // Get orderId from state if passed

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
        {orderId && <p className="mt-4">Your Order ID: <strong>{orderId}</strong></p>}
        <p className="mt-2">Thank you for your purchase!</p>
        <p className="mt-4">You will receive a confirmation email shortly.</p>
        <a href="/products" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go to Products
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
