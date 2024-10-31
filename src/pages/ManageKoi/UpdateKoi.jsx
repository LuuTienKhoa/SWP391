import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";

const UpdateKoi = ({ onUpdateSuccess }) => {
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
    originCertificate: null,
    healthCertificate: null,
    ownershipCertificate: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKoiData = async () => {
      try {
        const response = await api.get(`/koi/Koi/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching koi data:", error);
        alert("Failed to fetch koi data.");
      }
    };

    fetchKoiData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Handle file input
    });
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
      const response = await api.put(`/koi/Koi/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Koi fish updated successfully!");
      onUpdateSuccess(response.data);
    } catch (error) {
      console.error("Error updating koi fish:", error);
      alert("Failed to update koi fish.");
    }
  };


  const isFileField = (fieldName) => fieldName.includes("Certificate") || fieldName === "image";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Update Koi Fish</h2>
      {Object.keys(formData).map((key) => (
        <div className="mb-2" key={key}>
          <label className="block text-sm font-medium">{key}</label>
          <input
            type={["age", "price"].includes(key) ? "number" : isFileField(key) ? "file" : "text"}
            name={key}
            value={isFileField(key) ? undefined : formData[key]} // Prevent showing file input value
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required={!isFileField(key)} // Adjust required as needed
          />
          {isFileField(key) && formData[key] && (
            <p className="text-sm text-gray-00 mt-1">Selected file: {formData[key].name}</p>
          )}
        </div>
      ))}
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
