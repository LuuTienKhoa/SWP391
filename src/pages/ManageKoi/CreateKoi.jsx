import React, { useState } from "react";
import api from "../../config/axios";

const CreateKoi = ({ onCreateSuccess }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/koi/Koi", formData);
      alert("Koi fish created successfully!");
      onCreateSuccess(response.data);
      setFormData({
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
    } catch (error) {
      console.error("Error creating koi fish:", error);
      alert("Failed to create koi fish.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Koi Fish</h2>
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
      <button type="submit" className="bg-green-500 text-white rounded px-4 py-2 mt-2">
        Create
      </button>
    </form>
  );
};

export default CreateKoi;