import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import api from '../../config/axios';

const ManagePromotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/Promotion");
      setPromotions(response.data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      alert("Failed to fetch promotions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleDeleteProduct = async (promotionID) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/Promotion/${promotionID}`);
      alert("Product deleted successfully!");
      setPromotions(promotions.filter((promotion) => promotion.promotionID !== promotionID));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product.");
    }
  }; 

  return (
    
      <div className="bg-orange-100 min-h-screen">
      <div className="container mx-auto px-4 py-7">
        <h1 className="text-5xl mb-4 text-center">Promotions</h1>
        <div className="mb-4 text-center">
          <button
            onClick={() => navigate("/admin/managePromotion/createPromotion")}
            className="bg-green-500 text-white rounded px-4 py-2"
          >
            Create Promotion
          </button>
        </div>



      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {promotions.map(promotion => (
            <div key={promotion.promotionID} style={{ border: '1px solid #ccc', padding: '20px' }}>
              <h2>{promotion.code}</h2>
              <p><strong>Description:</strong> {promotion.description}</p>
              <p><strong>Discount Rate:</strong> {promotion.discountRate}%</p>
              <p><strong>Start Date:</strong> {new Date(promotion.startDate).toLocaleString()}</p>
              <p><strong>End Date:</strong> {new Date(promotion.endDate).toLocaleString()}</p>
              <p><strong>Remaining Redeem:</strong> {promotion.remainingRedeem}</p>

              <button 
                onClick={() => handleDeleteProduct(promotion.promotionID)}
                className="bg-red-500 text-white rounded px-4 py-2 mt-2"

              >
                Delete Promotion
              </button>
              <button 
                onClick={() => navigate(`/admin/managePromotion/updatePromotion/${promotion.promotionID}`)}
                className="bg-blue-500 text-white rounded px-4 py-2 mt-2"

              >
                Update Promotion
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default ManagePromotion;
