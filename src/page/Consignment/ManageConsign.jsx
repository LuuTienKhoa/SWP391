import React, { useState, useEffect, useContext } from 'react';
import api from '../../config/axios';
import UserContext from "../../context/userContext";

const ManageConsignmentPage = () => {
  const [consignments, setConsignments] = useState([]);
  const [error, setError] = useState(null);
  const { isLoggedIn, role } = useContext(UserContext);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editConsignID, setEditConsignID] = useState(null);  // Track the consignment being edited
  const [newConsignData, setNewConsignData] = useState({});  // Store the editable consignment data

  const fetchConsignments = async () => {
    try {
      const response = await api.get('/Consignment/');
      setConsignments(response.data);  // Set the fetched consignments
    } catch (error) {
      setError('Failed to load consignments');
    }
  };

  useEffect(() => {
    fetchConsignments();
  }, []);

  // Handle input change during editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewConsignData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log("No token found. Redirect to login.");
        navigate('/login');
        return;
      }

      // Send the consignment data as query parameters in the PUT request
      const response = await api.put(`/ConsignmentKoi`, null, {
        params: {
          id: newConsignData.id,
          name: newConsignData.name,
          gender: newConsignData.gender,
          age: newConsignData.age,
          size: newConsignData.size,
          color: newConsignData.color,
          dailyFeedAmount: newConsignData.dailyFeedAmount,
          personality: newConsignData.personality,
          origin: newConsignData.origin,
          selectionRate: newConsignData.selectionRate,
          species: newConsignData.species,
          price: newConsignData.price,
          fosteringDays: newConsignData.fosteringDays,
          consignmentId: newConsignData.consignmentId
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204 || response.status === 200) {
        setConsignments(
          consignments.map((consignment) =>
            consignment.consignmentID === newConsignData.consignmentID ? { ...consignment, ...newConsignData } : consignment
          )
        );
        setEditConsignID(null);  // Exit editing mode
      } else {
        console.error("Consignment edit failed:", response.status);
      }
    } catch (err) {
      console.error("Failed to edit consignment", err);
    }
  };



  // Cancel editing mode
  const handleCancel = () => {
    setEditConsignID(null);
    setNewConsignData({});
  };

  // Start editing a consignment
  const startEditing = (consignment) => {
    if (consignment.consignmentKois && consignment.consignmentKois.length > 0) {
      const koi = consignment.consignmentKois[0];  // Get the first Koi associated with the consignment
      setEditConsignID(consignment.consignmentID);
      setNewConsignData({
        id: koi.consignmentKoiID || '',  // Correctly setting the consignmentKoiID from the selected Koi
        name: koi.name || '',
        gender: koi.gender || '',
        age: koi.age || '',
        size: koi.size || '',
        color: koi.color || '',
        dailyFeedAmount: koi.dailyFeedAmount || '',
        personality: koi.personality || '',
        origin: koi.origin || '',
        selectionRate: koi.selectionRate || '',
        species: koi.species || '',
        price: koi.price || '',
        fosteringDays: koi.fosteringDays || '',
        consignmentId: consignment.consignmentID
      });
    } else {
      console.error('No consignmentKois found for this consignment.');
    }
  };
  const handleDelete = async (consignmentID) => {
    try {
      if (!window.confirm('Are you sure you want to delete this consignment?')) return;

      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.delete(`/Consignment/${consignmentID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }, x
      });

      if (response.status === 204 || response.status === 200) {
        // Correct filter logic: Filtering out the consignment with the deleted consignmentID
        setConsignments(consignments.filter((consignment) => consignment.consignmentID !== consignmentID));
      } else {
        console.error("Consignment deletion failed:", response.status);
      }
    } catch (err) {
      console.error("Failed to delete consignment", err);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log("No token found. Redirect to login.");
        navigate('/login');
        return;
      }

      // Ensure newConsignData is filled with the data for the new consignment
      const response = await api.post(`/Consignment/create`, newConsignData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {  // 201 Created indicates successful creation
        const createdConsign = response.data; // The newly created consignment
        setConsignments([...consignments, createdConsign]);  // Add the new consignment to the list
        setNewConsignData({});  // Clear the input form after creating
      } else {
        console.error("Consignment creation failed:", response.status);
      }
    } catch (err) {
      console.error("Failed to create consignment", err);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConsignData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Consignment Page</h1>

      {error && <p className="text-red-500">{error}</p>}
      {isLoggedIn && role === '1' && (
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
        >
          {showCreateForm ? 'Cancel' : 'Create New Consignment'}
        </button>
      )}

{/* Display the Create Form if showCreateForm is true */}
{showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Consignment</h2>
          <form onSubmit={handleCreate}>
            {/* Add form inputs for each required field */}
            <div className="mb-4">
              <label className="block mb-2">Customer ID</label>
              <input
                type="number"
                name="customerID"
                value={newConsignData.customerID}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Type */}
            <div className="mb-4">
              <label className="block mb-2">Type</label>
              <select
                name="type"
                value={newConsignData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Type</option>
                <option value="0">Sell</option>
                <option value="1">Foster</option>
              </select>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block mb-2">Status</label>
              <select
                name="status"
                value={newConsignData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Status</option>
                <option value="0">Available</option>
                <option value="1">Finished</option>
                <option value="2">Raising</option>
                <option value="3">Pending</option>
              </select>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={newConsignData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block mb-2">Gender</label>
              <input
                type="text"
                name="gender"
                value={newConsignData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Age */}
            <div className="mb-4">
              <label className="block mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={newConsignData.age}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Size */}
            <div className="mb-4">
              <label className="block mb-2">Size</label>
              <input
                type="text"
                name="size"
                value={newConsignData.size}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Color */}
            <div className="mb-4">
              <label className="block mb-2">Color</label>
              <input
                type="text"
                name="color"
                value={newConsignData.color}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Daily Feed Amount */}
            <div className="mb-4">
              <label className="block mb-2">Daily Feed Amount</label>
              <input
                type="text"
                name="dailyFeedAmount"
                value={newConsignData.dailyFeedAmount}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Personality */}
            <div className="mb-4">
              <label className="block mb-2">Personality</label>
              <input
                type="text"
                name="personality"
                value={newConsignData.personality}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Origin */}
            <div className="mb-4">
              <label className="block mb-2">Origin</label>
              <input
                type="text"
                name="origin"
                value={newConsignData.origin}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Selection Rate */}
            <div className="mb-4">
              <label className="block mb-2">Selection Rate</label>
              <input
                type="text"
                name="selectionRate"
                value={newConsignData.selectionRate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Species */}
            <div className="mb-4">
              <label className="block mb-2">Species</label>
              <input
                type="text"
                name="species"
                value={newConsignData.species}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Price Per Day */}
            <div className="mb-4">
              <label className="block mb-2">Price Per Day</label>
              <input
                type="number"
                name="pricePerDay"
                value={newConsignData.pricePerDay}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Fostering Days */}
            <div className="mb-4">
              <label className="block mb-2">Fostering Days</label>
              <input
                type="number"
                name="fosteringDays"
                value={newConsignData.fosteringDays}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Create Consignment
            </button>
          </form>
        </div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consignments.map((consignment) => (
          <div
            key={consignment.consignmentID}  // Make sure the key is unique to prevent duplication
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-bold mb-4">Consignment ID: {consignment.consignmentID}</h2>

            {/* Customer information */}
            <div className="mb-2">
              <span className="font-semibold">Customer Name: </span>
              {consignment.customer?.user?.name || 'Unknown Customer'}
            </div>

            {/* Foster Kois Information */}
            {consignment.consignmentKois && consignment.consignmentKois.length > 0 ? (
              <>
                <h3 className="text-lg font-bold mb-2">Foster Koi Information</h3>
                {consignment.consignmentKois.map((koi) => (
                  <div key={koi.fosterKoiID} className="mb-4">
                    <div className="mb-2">
                      <span className="font-semibold">Foster Name: </span>
                      {koi.name || 'Unknown'}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Gender: </span>
                      {koi.gender || 'Unknown'}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Age: </span>
                      {koi.age || 'Unknown'} years
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Size: </span>
                      {koi.size || 'Unknown'}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Color: </span>
                      {koi.color || 'Unknown'}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Daily Feed Amount: </span>
                      {koi.dailyFeedAmount || 'Unknown'}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Personality: </span>
                      {koi.personality || 'Unknown'}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Origin: </span>
                      {koi.origin || 'Unknown'}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Species: </span>
                      {koi.species || 'Unknown'}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Fostering Days: </span>
                      {koi.fosteringDays || 'Unknown'} days
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>No Foster Koi data available.</p>
            )}

            {editConsignID === consignment.consignmentID ? (
              <>
                <div className="mb-2">
                  <label className="font-semibold">Name: </label>
                  <input
                    type="text"
                    name="name"
                    value={newConsignData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-2">
                  <label className="font-semibold">Gender: </label>
                  <input
                    type="text"
                    name="gender"
                    value={newConsignData.gender}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-2">
                  <label className="font-semibold">Age: </label>
                  <input
                    type="number"
                    name="age"
                    value={newConsignData.age}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-2">
                  <label className="font-semibold">Size: </label>
                  <input
                    type="text"
                    name="size"
                    value={newConsignData.size}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-2">
                  <label className="font-semibold">Color: </label>
                  <input
                    type="text"
                    name="color"
                    value={newConsignData.color}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-2">
                  <label className="font-semibold">Daily Feed Amount: </label>
                  <input
                    type="text"
                    name="dailyFeedAmount"
                    value={newConsignData.dailyFeedAmount}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-2">
                  <label className="font-semibold">Personality: </label>
                  <input
                    type="text"
                    name="personality"
                    value={newConsignData.personality}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-2">
                  <label className="font-semibold">Origin: </label>
                  <input
                    type="text"
                    name="origin"
                    value={newConsignData.origin}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-2">
                  <label className="font-semibold">Selection Rate: </label>
                  <input
                    type="text"
                    name="selectionRate"
                    value={newConsignData.selectionRate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-2">
                  <label className="font-semibold">Species: </label>
                  <input
                    type="text"
                    name="species"
                    value={newConsignData.species}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-2">
                  <label className="font-semibold">Price: </label>
                  <input
                    type="number"
                    name="price"
                    value={newConsignData.price}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-2">
                  <label className="font-semibold">Fostering Days: </label>
                  <input
                    type="number"
                    name="fosteringDays"
                    value={newConsignData.fosteringDays}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => handleSave()}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Non-editable view */}
                <div className="mb-2">
                  <span className="font-semibold">Name: </span>
                  {consignment.consignmentKois[0]?.name || 'Unknown'}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Foster Price: </span>
                  {consignment.fosterPrice}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Status: </span>
                  {consignment.status === 0 ? 'Available' : consignment.status === 1 ? 'Finished' : 'Unknown'}
                </div>
                <div className="mt-4">
                  {isLoggedIn && (role === '1' || role === '0') && (
                    <button
                      onClick={() => startEditing(consignment)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Edit
                    </button>
                  )}
                  {isLoggedIn && role === '0' && (
                    <button
                      onClick={() => handleDelete(consignment.consignmentID)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageConsignmentPage;
