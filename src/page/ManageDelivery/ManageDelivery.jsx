import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";

const ManageDelivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDelivery, setNewDelivery] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await api.get("/koi/Delivery");
      setDeliveries(response.data);
    } catch (err) {
      setError("Failed to fetch deliveries");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDelivery = async () => {
    try {
      const response = await api.post("/koi/Delivery", newDelivery);
      setDeliveries([...deliveries, response.data]);
      setNewDelivery({});
    } catch (error) {
      setError("Failed to create delivery");
    }
  };

  const handleDeleteDelivery = async (deliveryID) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    try {
      await api.delete(`/koi/Delivery/${deliveryID}`);
      setDeliveries(
        deliveries.filter((delivery) => delivery.deliveryID !== deliveryID)
      );
    } catch (error) {
      setError("Failed to delete delivery");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className=" p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Delivery Management
      </h1>
      <div className="mb-4">
        {/* Additional content for creating new delivery entries could be added here */}
      </div>
      <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Delivery ID</th>
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer ID</th>
            <th className="p-2 border">Start Delivery Day</th>
            <th className="p-2 border">End Delivery Day</th>
            <th className="p-2 border">Total Amount</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.deliveryID} className="text-center border-b">
              <td className="p-2 border">{delivery.deliveryID}</td>
              <td className="p-2 border">{delivery.orderID}</td>
              <td className="p-2 border">{delivery.customerID}</td>
              <td className="p-2 border">
                {new Date(delivery.startDeliDay).toLocaleString()}
              </td>
              <td className="p-2 border">
                {new Date(delivery.endDeliDay).toLocaleString()}
              </td>
              <td className="p-2 border">${delivery.order.totalAmount}</td>
              <td className="p-2 border">{delivery.status}</td>
              <td className="p-2 border">
                <button
                  onClick={() =>
                    navigate(
                      `/admin/managedelivery/updateDelivery/${delivery.deliveryID}`
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteDelivery(delivery.deliveryID)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageDelivery;
