// src/page/ManageOrder/ManageOrder.jsx

import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import { useNavigate } from 'react-router-dom';

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/Order');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await api.delete(`/Order/${id}`);
      fetchOrders(); // Refresh the order list
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-orange-100">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="flex flex-wrap gap-4">
        {orders.map(order => (
          <div className="bg-orange-200 border border-gray-300 rounded-lg p-4 w-72 shadow-md" key={order.orderID}>
            <div><strong>Order ID:</strong> {order.orderID}</div>
            <div><strong>Total Amount:</strong> {order.totalAmount}</div>
            <div><strong>Status:</strong> {order.status}</div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-2 mr-2"
              onClick={() => deleteOrder(order.orderID)}
            >
              Delete Order
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => navigate(`/admin/manageOrder/updateOrder/${order.orderID}`)}
            >
              Update Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageOrder;
