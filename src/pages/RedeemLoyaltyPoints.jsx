import React, { useEffect, useState } from 'react';
import api from '../config/axios';

const RedeemLoyaltyPoints = () => {
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [hasCustomerID, setHasCustomerID] = useState(false);

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

      <h2 className="text-xl font-semibold mb-4">Your Promotions</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Promotion ID</th>
            <th className="px-4 py-2">Customer ID</th>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Discount Rate</th>
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Remaining Redeem</th>
          </tr>
        </thead>
        <tbody>
          {promotions.filter(promo => promo.customerID).map((promotion) => (
            <tr key={promotion.promotionID}>
              <td className="border px-4 py-2">{promotion.promotionID}</td>
              <td className="border px-4 py-2">{promotion.customerID}</td>
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

      <h2 className="text-xl font-semibold mb-4">Promotion you can redeem</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Discount Rate</th>
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Remaining Redeem</th>
            <th className="px-4 py-2">Select</th>
          </tr>
        </thead>
        <tbody>
          {promotions.filter(promo => !promo.customerID).map((promotion) => (
            <tr key={promotion.promotionID}>
              <td className="border px-4 py-2">{promotion.code}</td>
              <td className="border px-4 py-2">{promotion.description}</td>
              <td className="border px-4 py-2">{promotion.discountRate}%</td>
              <td className="border px-4 py-2">{new Date(promotion.startDate).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{new Date(promotion.endDate).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{promotion.remainingRedeem}</td>
              <td className="border px-4 py-2">
                <input
                  type="radio"
                  name="promotion"
                  value={promotion.promotionID}
                  onChange={() => setSelectedPromotion(promotion.promotionID)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
