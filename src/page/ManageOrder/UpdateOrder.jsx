// src/page/UpdateOrder/UpdateOrder.jsx

import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    totalAmount: 0,
  type: 0,
  status: 0,
});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/Order/${id}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Order data being sent:', order); // Log the order data
    try {
      await api.put(`/Order/${id}`, order);
      navigate('/orders'); // Redirect to orders page
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-orange-100">
      <h1 className="text-2xl font-bold mb-4">Update Order</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Total Amount</label>
          <input
            type="number"
            name="totalAmount"
            value={order.totalAmount}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <input
            type="number"
            name="status"
            value={order.status}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Type</label>
          <input
            type="number"
            name="type"
            value={order.type}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Order
        </button>
      </form>
    </div>
  );
};

export default UpdateOrder;
