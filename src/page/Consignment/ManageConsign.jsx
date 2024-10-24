import React, { useState, useEffect } from 'react';
import api from '../../config/axios';

const ManageConsignmentPage = () => {
  const [consignments, setConsignments] = useState([]);
  const [error, setError] = useState(null);

  const fetchConsignments = async () => {
    try {
      const response = await api.get('/Consignment/');
      console.log('API response:', response.data); // Inspect the response to ensure fosterKois is present
      setConsignments(response.data);
    } catch (error) {
      setError('Failed to load consignments');
    }
  };
  

  // Fetch consignments when component mounts
  useEffect(() => {
    fetchConsignments();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Consignment Page</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consignments.map((consignment) => (
          <div
            key={consignment.consignmentID}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Card with consignment details */}
            <h2 className="text-xl font-bold mb-4">
              Consignment ID: {consignment.consignmentID}
            </h2>

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


            {/* General Consignment Information */}
            <div className="mb-2">
              <span className="font-semibold">Type: </span>
              {consignment.type === 0 ? 'Sell' : 'Foster'}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Foster Price: </span>
              {consignment.fosterPrice}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status: </span>
              {consignment.status === 0
                ? 'Available'
                : consignment.status === 1
                ? 'Finished'
                : consignment.status === 2
                ? 'Raising'
                : 'Pending'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageConsignmentPage;
