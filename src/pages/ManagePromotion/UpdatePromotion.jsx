import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";

const UpdatePromotion = ({ onSuccess }) => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountRate: 0,
    startDate: '',
    endDate: '',
    remainingRedeem: 0,
  });

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await api.get(`/Promotion/${id}`);
        
        if (response.status === 404) {
          return navigate("/404");  
        }
        
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPromotion();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/Promotion/${id}`, formData);
      alert("Promotion updated successfully!");
      onSuccess(formData);
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Update Promotion</h2>
      {Object.keys(formData).map((key) => (
        <div className="mb-2" key={key}>
          <label className="block text-sm font-medium">{key}</label>
          <input
            type={typeof formData[key] === "number" ? "number" : "text"}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mt-2">
        Update
      </button>
    </form>
  );
};

export default UpdatePromotion;
