import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../config/axios";

const UpdateKoi = ({ onSuccess }) => {
  const { id } = useParams();
  const isCreating = id === "null";

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: 0,
    size: "",
    color: "",
    dailyFeedAmount: "",
    price: 0,
    personality: "",
    origin: "",
    selectionRate: "",
    species: "",
    addOn: "",
  });

  useEffect(() => {
    if (!isCreating) {
      const fetchKoiData = async () => {
        try {
          const response = await api.get(`/koi/Koi/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching koi data:", error);
        }
      };
      fetchKoiData();
    }
  }, [id, isCreating]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isCreating) {
        const response = await api.post("/koi/Koi", formData);
        alert("Koi fish created successfully!");
        onSuccess(response.data);
      } else {
        await api.put(`/koi/Koi/${id}`, formData);
        alert("Koi fish updated successfully!");
        onSuccess(formData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {isCreating ? "Create Koi Fish" : "Update Koi Fish"}
      </h2>
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
        {isCreating ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default UpdateKoi;
