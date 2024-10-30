import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";

const UpdateKoi = ({ onSuccess }) => {
  const { id } = useParams();

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
    status: 0,
    image: null,
    addOn: {
      originCertificate: null,
      healthCertificate: null,
      ownershipCertificate: null,
    },
  });
  const [error, setError] = useState("");

  // Fetch existing koi data for the specified id
  useEffect(() => {
    const fetchKoiData = async () => {
      try {
        const response = await api.get(`/koi/Koi/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching koi data:", error);
        setError("Failed to load koi data.");
      }
    };
    fetchKoiData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "image") {
        setFormData({ ...formData, image: files[0] });
      } else {
        setFormData({
          ...formData,
          addOn: { ...formData.addOn, [name]: files[0] },
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    // Initialize FormData
    const data = new FormData();
  
    // Append form data, stringifying objects as needed
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "addOn") {
        // Stringify the addOn object if it’s expected as a JSON string
        data.append("addOn", JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });
  
    try {
      // Send request without setting Content-Type, Axios will handle it
      await api.put(`/koi/Koi/${id}`, data);
      alert("Koi fish updated successfully!");
      onSuccess(formData);
    } catch (error) {
      console.error("Error updating koi fish:", error);
      setError("Failed to update koi fish. Please try again.");
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Update Koi Fish</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {Object.keys(formData).map((key) => (
        key !== "addOn" && key !== "image" && (
          <div className="mb-2" key={key}>
            <label className="block text-sm font-medium capitalize">{key}</label>
            <input
              type={typeof formData[key] === "number" ? "number" : "text"}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )
      ))}

      {/* File inputs */}
      <div className="mb-2">
        <label className="block text-sm font-medium">Image</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Origin Certificate</label>
        <input
          type="file"
          name="originCertificate"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Health Certificate</label>
        <input
          type="file"
          name="healthCertificate"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Ownership Certificate</label>
        <input
          type="file"
          name="ownershipCertificate"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mt-2">
        Update
      </button>
    </form>
  );
};

export default UpdateKoi;
