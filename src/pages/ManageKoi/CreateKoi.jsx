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
    status: 0,
    image: null,
    addOn: {
      originCertificate: null,
      healthCertificate: null,
      ownershipCertificate: null,
    },
  });
  const [error, setError] = useState("");

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
    setError(""); // Clear any previous errors

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "addOn") {
        Object.entries(value).forEach(([subKey, subValue]) => {
          data.append(`addOn.${subKey}`, subValue);
        });
      } else {
        data.append(key, value);
      }
    });

    try {
      const response = await api.post("/koi/Koi", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
        status: 0,
        image: null,
        addOn: {
          originCertificate: null,
          healthCertificate: null,
          ownershipCertificate: null,
        },
      });
    } catch (error) {
      console.error("Error creating koi fish:", error);
      setError("Failed to create koi fish. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Koi Fish</h2>

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
          required
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

      <button type="submit" className="bg-green-500 text-white rounded px-4 py-2 mt-2">
        Create
      </button>
    </form>
  );
};

export default CreateKoi;
