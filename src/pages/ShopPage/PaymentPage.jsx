import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const PaymentPage = () => {
  const location = useLocation();
  const { koiFish, batch, consignment, promotion, customerId = 0 } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('VNPay'); // Default to VNPay
  const [promotionID, setPromotionID] = useState('');
  const [address, setAddress] = useState(''); // State to store the address
  const navigate = useNavigate();

  // Payment processing function
  const handlePayment = async () => {
    if (!koiFish && !batch && !consignment) {
      alert("Koi data or batch data is missing!");
      return;
    }

    try {
      const orderData = {
        promotionID: parseInt(promotionID, 10) || 0,
        paymentMethod: paymentMethod === 'VNPay' ? 0 : 1,
        ...(batch && { batchs: [[batch.batchID, batch.quantityPerBatch]] }),
        ...(koiFish && { kois: [koiFish.koiID] }),
      };

      // 1. Send payment request to the backend
      const response = await api.post('/Order/create', orderData);
      const orderId = response.data.orderID;

      // If payment method is VNPay, handle delivery
      if (paymentMethod === 'VNPay') {
        handleDelivery(orderId, customerId);
      }

      // Redirect to payment URL
      window.location.href = response.data.paymentUrl;

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  // Delivery handling function
  const handleDelivery = async (orderId, customerId, address) => {
    try {
      const deliveryData = {
        orderId: orderId,
        customerId: customerId,
        startDeliDay: new Date().toISOString(),
        endDeliDay: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        address: address // Use the address entered by the user
      };

      await api.post('/koi/Delivery', deliveryData);
      alert(`Shipment delivery created for Order ID: ${orderId}`);

    } catch (error) {
      console.error('Error processing delivery:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-10 text-white flex justify-center items-center">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* Left - Product Information */}
        <div className="lg:w-1/2 p-4 bg-gray-800 rounded-lg mb-6 lg:mb-0 flex flex-col items-center">
          {batch ? (
            <>
              <h2 className="text-2xl font-semibold mb-2 mt-2">{batch.name} #{batch.batchID}</h2>
              <p className="text-gray-400 mb-4">Quantity: {batch.quantityPerBatch}</p>
              <p className="text-4xl font-bold text-blue-500">${batch.pricePerBatch?.toFixed(2)}</p>
            </>
          ) : (
            <>
              <img
                src={koiFish?.image ?? "https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0503s054-re-260x421.jpg"}
                alt={koiFish?.name}
                className="h-auto max-w-xs flex flex-col justify-center items-center"
              />
              <h2 className="text-2xl font-semibold mb-2 mt-2">{koiFish?.name} # {koiFish?.koiID}</h2>
              <p className="text-gray-400 mb-4">{koiFish?.species}</p>
              <p className="text-4xl font-bold text-blue-500">${koiFish?.price?.toFixed(2)}</p>
            </>
          )}
        </div>

        {/* Right - Payment Section */}
        <div className="lg:w-1/2 lg:ml-8">
          <h2 className="text-3xl font-semibold mb-6">Payment</h2>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Select Payment Method</label>
            <select
              className="w-full p-3 bg-gray-700 rounded-lg"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="VNPay">VNPay</option>
              <option value="Direct-Payment">Direct Payment</option>
            </select>
          </div>

          {/* Address Input */}
          {paymentMethod === 'VNPay' && (
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Delivery Address</label>
              <input
                type="text"
                name="address"
                className="w-full p-3 bg-gray-700 rounded-lg"
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          )}

          {/* Price */}
          <div className="bg-gray-700 p-6 rounded-lg mb-6">
            <p className="text-4xl font-bold">
              {batch ? `$${batch.pricePerBatch?.toFixed(2)}` : `$${koiFish?.price?.toFixed(2)}`}
            </p>
            <p className="text-sm mt-2">
              We will save all details of your payment. You may stop future automatic payments anytime.
            </p>
          </div>

          {/* Discount Code */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Discount Code</label>
            <input
              type="text"
              name="discountCode"
              className="w-full p-3 bg-gray-700 rounded-lg"
              placeholder="Discount Code"
              value={promotionID}
              onChange={(e) => setPromotionID(e.target.value)}
            />
          </div>

          {/* Payment Button */}
          <button
            className="bg-blue-600 w-full py-4 rounded-lg hover:bg-blue-700 transition"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
