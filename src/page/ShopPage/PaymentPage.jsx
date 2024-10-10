import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

const PaymentPage = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handlePayment = async () => {
    try {
      // Replace with actual payment processing logic
      const response = await api.post("payment", paymentDetails);
      console.log("Payment successful:", response);
      alert("Payment successful!");
      navigate("/confirmation"); // Redirect to a confirmation page
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
      <div className="mb-4">
        <label className="block mb-2">Card Number</label>
        <input
          type="text"
          name="cardNumber"
          value={paymentDetails.cardNumber}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Expiry Date</label>
        <input
          type="text"
          name="expiryDate"
          value={paymentDetails.expiryDate}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">CVV</label>
        <input
          type="text"
          name="cvv"
          value={paymentDetails.cvv}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <button
        onClick={handlePayment}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
