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
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/Order/${id}`);
      fetchOrders(); // Refresh the order list
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Order ID</th>
              <th className="py-2 px-4 border">Product</th>
              <th className="py-2 px-4 border">Customer ID</th>
              <th className="py-2 px-4 border">Staff ID</th>
              <th className="py-2 px-4 border">Date of purchase</th>
              <th className="py-2 px-4 border">Date of update </th>
              <th className="py-2 px-4 border">Promotion </th>
              <th className="py-2 px-4 border">Total Amount</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderID} className="text-center border-b">
                <td className="py-2 px-4 border">{order.orderID}</td>
                <td className="py-2 px-4 border">{order.orderDetails?.koi?.name || 'not'}</td>                
                <td className="py-2 px-4 border">{order.customerID}</td>
                <td className="py-2 px-4 border">{order.staffID}</td>
                <td className="py-2 px-4 border">{order.createAt}</td>
                <td className="py-2 px-4 border">{order.updateAt}</td>
                <td className="py-2 px-4 border">{order.promotionID}</td>
                <td className="py-2 px-4 border">{order.totalAmount}</td>
                <td className="py-2 px-4 border">{order.type}</td>
                <td className="py-2 px-4 border">{order.status}</td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded mr-2"
                    onClick={() => deleteOrder(order.orderID)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={() => navigate(`/admin/manageOrder/updateOrder/${order.orderID}`)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrder;
