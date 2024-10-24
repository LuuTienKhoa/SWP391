import React, { useEffect, useState } from 'react';
import api from '../config/axios';

const ManageDelivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDelivery, setNewDelivery] = useState({});

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await api.get('/koi/Delivery');
      setDeliveries(response.data);
    } catch (err) {
      setError('Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDelivery = async () => {
    try {
      const response = await api.post('/koi/Delivery', newDelivery);
      setDeliveries([...deliveries, response.data]);
      setNewDelivery({});
    } catch (err) {
      setError('Failed to create delivery');
    }
  };

  const handleUpdateDelivery = async (id) => {
    try {
      const response = await api.put(`/koi/Delivery/${id}`, newDelivery);
      setDeliveries(deliveries.map(delivery => (delivery.deliveryID === id ? response.data : delivery)));
      setNewDelivery({});
    } catch (err) {
      setError('Failed to update delivery');
    }
  };

  const handleDeleteDelivery = async (id) => {
    try {
      await api.delete(`/koi/Delivery/${id}`);
      setDeliveries(deliveries.filter(delivery => delivery.deliveryID !== id));
    } catch (err) {
      setError('Failed to delete delivery');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Delivery Management</h1>
      <div className="mb-4">
        
      </div>
      <h2 className="text-xl font-semibold mb-2">Existing Deliveries</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveries.map(delivery => (
          <div key={delivery.deliveryID} className="border rounded-lg p-4 shadow-lg bg-white">
            <h3 className="text-lg font-bold">Delivery ID: {delivery.deliveryID}</h3>
            <p><strong>Order ID:</strong> {delivery.orderID}</p>
            <p><strong>Customer ID:</strong> {delivery.customerID}</p>
            <p><strong>Status:</strong> {delivery.status}</p>
            <p><strong>Start Delivery Day:</strong> {new Date(delivery.startDeliDay).toLocaleString()}</p>
            <p><strong>End Delivery Day:</strong> {new Date(delivery.endDeliDay).toLocaleString()}</p>
            <h4 className="font-semibold mt-2">Order Details:</h4>
            <p><strong>Order ID:</strong> {delivery.order.orderID}</p>
            <p><strong>Total Amount:</strong> ${delivery.order.totalAmount}</p>
            <p><strong>Customer Loyalty Points:</strong> {delivery.order.customer.loyaltyPoints}</p>
            <div className="mt-4">
            <button onClick={() => handleDeleteDelivery(delivery.deliveryID)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
              <button onClick={() => handleUpdateDelivery(delivery.deliveryID)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Update</button>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDelivery;
