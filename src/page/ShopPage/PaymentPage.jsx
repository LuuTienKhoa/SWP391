import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../../config/axios';


const PaymentPage = () => {
  const location = useLocation();
  const { koiFish } = location.state || {}; // Access koiFish from location state
  const { promotion } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  
  const [promotionID, setPromotionID] = useState('');


  

  const handlePayment = async () => {
    if (!koiFish) {
      alert("Koi fish data is missing!");
      return;
    }
  
    try {
      // Gửi yêu cầu tới backend để tạo URL thanh toán VNPay
      const response = await api.post('/Order/create', {
        kois: [koiFish.koiID],
         // Batch rỗng nếu chỉ có 1 cá
        promotionID: parseInt(promotionID, 10) || 0,
        paymentMethod: paymentMethod === 'VNPay' ? 1 : 0
      });
  
      // Chuyển hướng tới URL thanh toán VNPay
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    }
  };
  

  return (
    <div
   
     className="min-h-screen bg-white p-10 text-white flex justify-center items-center">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* Left - Product Information */}
        <div className="lg:w-1/2 p-4 bg-gray-800 rounded-lg mb-6 lg:mb-0 flex flex-col items-center"
         >
          <img
            src={koiFish.image ?? "https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0503s054-re-260x421.jpg"}
            alt={koiFish.name}
            className="h-auto max-w-xs flex flex-col justify-center items-center"
          />
          <h2 className="text-2xl font-semibold mb-2 mt-2">{koiFish?.name} # {koiFish.koiID}</h2>
          <p className="text-gray-400 mb-4">{koiFish?.species}</p>
          <p className="text-4xl font-bold text-blue-500">${koiFish?.price.toFixed(2)}</p>
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

          {/* Price */}
          <div className="bg-gray-700 p-6 rounded-lg mb-6">
            <p className="text-4xl font-bold">${koiFish?.price.toFixed(2)}</p>
            <p className="text-sm mt-2">
              We will save all details of your payment. You may stop future automatic payments anytime.
            </p>
          </div>

         

          {/* Discount Code */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Discount Code </label>
            <input
              type="text"
              name="discountCode"
              className="w-full p-3 bg-gray-700 rounded-lg"
              placeholder="Discount Code"
             
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
