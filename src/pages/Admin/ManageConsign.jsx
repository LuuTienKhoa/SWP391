import React, { useState, useEffect, useContext } from 'react';
import api from '../../config/axios';
import UserContext from "../../context/userContext";

const ManageConsignmentPage = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newConsignData, setNewConsignData] = useState({});
  const { isLoggedIn, role } = useContext(UserContext);

  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      const response = await api.get('/Consignment/');
      setConsignments(response.data);
    } catch (err) {
      setError('Failed to fetch consignments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConsignment = async () => {
    try {
      const response = await api.post('/Consignment/create', newConsignData);
      setConsignments([...consignments, response.data]);
      setNewConsignData({});
    } catch (err) {
      setError('Failed to create consignment');
    }
  };

  const handleUpdateConsignment = async (id) => {
    try {
      const response = await api.put(`/ConsignmentKoi/${id}`, newConsignData);
      setConsignments(consignments.map(consignment => (consignment.consignmentID === id ? response.data : consignment)));
      setNewConsignData({});
    } catch (err) {
      setError('Failed to update consignment');
    }
  };

  const handleDeleteConsignment = async (id) => {
    try {
      await api.delete(`/Consignment/${id}`);
      setConsignments(consignments.filter(consignment => consignment.consignmentID !== id));
    } catch (err) {
      setError('Failed to delete consignment');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Consignment</h1>
      <div className="mb-4">
        {/* Additional content for creating new consignment entries could be added here */}
      </div>
      <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Consignment ID</th>
            <th className="p-2 border">Customer ID</th>
            <th className="p-2 border">Consignment Koi ID</th>
            <th className="p-2 border">Consignment Koi Name </th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Foster Price</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {consignments.map(consignment => (
            <tr key={consignment.consignmentID} className="text-center border-b">
              <td className="p-2 border">{consignment.consignmentID}</td>
              <td className="p-2 border">{consignment.customerID || 'Unknown'}</td>
              <td className="p-2 border">{consignment.consignmentKois?.[0]?.consignmentKoiID || 'Unknown'}</td>
              <td className="p-2 border">{consignment.consignmentKois?.[0]?.name || 'Unknown'}</td>

              <td className="p-2 border">{consignment.type || 'Unknown'}</td>
              <td className="p-2 border">{consignment.fosterPrice || 'Unknown'}</td>

              <td className="p-2 border">{consignment.status === 0 ? 'Available' : 'Finished'}</td>
              <td className="p-2 border">
                <button onClick={() => handleUpdateConsignment(consignment.consignmentID)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Update</button>
                <button onClick={() => handleDeleteConsignment(consignment.consignmentID)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageConsignmentPage;
