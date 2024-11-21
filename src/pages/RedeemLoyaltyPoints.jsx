import React, { useEffect, useState } from 'react';
import api from '../config/axios';

const RedeemLoyaltyPoints = () => {
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [hasCustomerID, setHasCustomerID] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState(null);

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
        const response = await api.get('/Promotion/UserAvailable');
        setPromotions(response.data);
        setHasCustomerID(response.data.some(promo => promo.customerID !== null && promo.customerID !== 0));
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      }
    };

    fetchUserProfile();
    fetchPromotions();
  }, []);

  const handleRedeem = async () => {
    if (!selectedPoints) {
      alert("Please select loyalty points to redeem.");
      return;
    }
  
    try {
      const response = await api.post(`/Promotion/Redeem?loyaltyPointsToRedeem=${selectedPoints}`);
      alert("Promotion redeemed successfully!");   
      setPromotions((prev) => [...prev, response.data.promotion]);
      setLoyaltyPoints((prev) => prev - selectedPoints);
    } catch (error) {
      console.error("Failed to redeem promotion:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to redeem promotion.");
    }
  };
  
  return (
     <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Redeem Loyalty Points</h1>
      <p className="mb-4">Your Loyalty Points: {loyaltyPoints}</p>

      <h2 className="text-xl font-semibold mb-4">Redeemable Points</h2>
      <div className="mb-4">
        {[10, 50, 100, 200].map((points) => (
          <label key={points} className="mr-4">
            <input
              type="radio"
              name="loyaltyPoints"
              value={points}
              onChange={() => setSelectedPoints(points)}
            />{" "}
            {points} points for {points === 10 ? "10%" : points === 50 ? "15%" : points === 100 ? "20%" : "30%"} discount
          </label>
        ))}
      </div>

      <button
        onClick={handleRedeem}
        className="bg-green-500 text-white rounded px-4 py-2"
      >
        Redeem
      </button>

      <h2 className="text-xl font-semibold mt-6 mb-4">Your Promotions</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Discount Rate</th>
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Remaining Redeem</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion.promotionID}>
              <td className="border px-4 py-2">{promotion.code}</td>
              <td className="border px-4 py-2">{promotion.description}</td>
              <td className="border px-4 py-2">{promotion.discountRate}%</td>
              <td className="border px-4 py-2">{new Date(promotion.startDate).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{new Date(promotion.endDate).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{promotion.remainingRedeem}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RedeemLoyaltyPoints;
