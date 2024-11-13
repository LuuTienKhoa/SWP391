import React, { useEffect, useState } from 'react';
import api from '../config/axios';

const RedeemLoyaltyPoints = () => {
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/User/CusProfile');
        setLoyaltyPoints(response.data.loyaltyPoints);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    const fetchPromotions = async () => {
      try {
        const response = await api.get('/Promotion');
        setPromotions(response.data);
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      }
    };

    fetchUserProfile();
    fetchPromotions();
  }, []);

  const handleRedeem = async () => {
    if (!selectedPromotion) {
      alert("Please select a promotion to redeem.");
      return;
    }

    try {
      await api.post('/Promotion/Redeem', { promotionID: selectedPromotion });
      alert("Promotion redeemed successfully!");
    } catch (error) {
      console.error("Failed to redeem promotion:", error);
      alert("Failed to redeem promotion.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Redeem Loyalty Points</h1>
      <p className="mb-4">Your Loyalty Points: {loyaltyPoints}</p>

      <h2 className="text-xl font-semibold mb-4">Available Promotions</h2>
      <select
        onChange={(e) => setSelectedPromotion(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">Select a promotion</option>
        {promotions.map((promotion) => (
          <option key={promotion.promotionID} value={promotion.promotionID}>
            {promotion.description} - {promotion.discountRate}% off
          </option>
        ))}
      </select>

      <button
        onClick={handleRedeem}
        className="bg-green-500 text-white rounded px-4 py-2"
      >
        Redeem
      </button>
    </div>
  );
};

export default RedeemLoyaltyPoints; 