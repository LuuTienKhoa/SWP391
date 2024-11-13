import React, { useState, useEffect } from "react";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const navigate = useNavigate();
  const userRole = 1;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/Order");
      const sortedOrders = response.data.sort((a, b) => b.orderID - a.orderID);
      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/Order/${id}`);
      fetchOrders(); // Refresh the order list
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const getTypeLabel = (type) => {
    return type === 0 ? "Online" : "Offline";
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Completed";
      case 2:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  const filteredOrders =
    selectedStatus === "All"
      ? orders
      : orders.filter(
          (order) => getStatusLabel(order.status) === selectedStatus
        );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Orders</h1>
      <div className="mb-4 text-center">
        <button
          onClick={() => setSelectedStatus("All")}
          className="bg--500 text-white px-4 py-1 rounded mr-2"
        >
          All
        </button>
        <button
          onClick={() => setSelectedStatus("Pending")}
          className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
        >
          Pending
        </button>
        <button
          onClick={() => setSelectedStatus("Completed")}
          className="bg-green-500 text-white px-4 py-1 rounded mr-2"
        >
          Completed
        </button>
        <button
          onClick={() => setSelectedStatus("Cancelled")}
          className="bg-red-500 text-white px-4 py-1 rounded mr-2"
        >
          Cancelled
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Order ID</th>
              <th className="py-2 px-4 border">Customer ID</th>
              <th className="py-2 px-4 border">Staff ID</th>
              <th className="py-2 px-4 border">Date of purchase</th>
              <th className="py-2 px-4 border">Date of update </th>
              <th className="py-2 px-4 border">Promotion </th>
              <th className="py-2 px-4 border">Total Amount</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Status</th>
              {userRole === 0 ? (
            <th className="p-2 border"></th>
            ) : null}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderID} className="text-center border-b">
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => {
                      const path = userRole === 0 
                        ? navigate("/admin/manageOrder/orderDetail/${order.orderID}")
                        : userRole === 1 
                        ? `/staff/manageOrder/orderDetail/${order.orderID}`
                        : null;
                      if (path) {
                        navigate(path);
                      } else {
                        alert("You do not have permission to access this page.");
                      }
                    }}
                    className="text-blue-500 underline"
                  >
                    {order.orderID}
                  </button>
                </td>
                <td className="py-2 px-4 border">{order.customerID}</td>
                <td className="py-2 px-4 border">{order.staffID}</td>
                <td className="py-2 px-4 border">{formatDate(order.createAt)}</td>
                <td className="py-2 px-4 border">{formatDate(order.updateAt)}</td>
                <td className="py-2 px-4 border">{order.promotionID}</td>
                <td className="py-2 px-4 border">{order.totalAmount}</td>
                <td className="py-2 px-4 border">{getTypeLabel(order.type)}</td>
                <td className="py-2 px-4 border">
                  {getStatusLabel(order.status)}
                </td>
                {order.status === 1 || order.status === 2 ? ( // Completed, Cancelled
                  userRole === 0 ? ( // Only show delete button for admin
                    <td className="p-2 border">
                      <button
                        onClick={() => deleteOrder(order.orderID)}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  ) : null
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrder;
