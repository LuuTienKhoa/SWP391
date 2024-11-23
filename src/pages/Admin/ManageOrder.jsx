import React, { useState, useEffect } from "react";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaClock, FaCheckCircle, FaTimesCircle, FaGlobe, FaStore } from "react-icons/fa";
import Pagination from "../../components/Pagination";
const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();
  const userRole = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

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
    const orderToDelete = orders.find((order) => order.orderID === id);
    if (orderToDelete && orderToDelete.status !== 2) {
      alert("Chỉ có thể xóa đơn hàng có trạng thái 'Cancelled'.");
      return;
    }

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
    return type === 0 ? (
      <span className="flex items-center justify-center text-blue-500">
        <FaGlobe className="mr-1" /> Online
      </span>
    ) : (
      <span className="flex items-center justify-center text-green-500">
        <FaStore className="mr-1" /> Offline
      </span>
    );
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return (
          <span className="flex items-center justify-center text-yellow-500">
            <FaClock className="mr-1" /> Pending
          </span>
        );
      case 1:
        return (
          <span className="flex items-center justify-center text-green-500">
            <FaCheckCircle className="mr-1" /> Completed
          </span>
        );
      case 2:
        return (
          <span className="flex items-center justify-center text-red-500">
            <FaTimesCircle className="mr-1" /> Cancelled
          </span>
        );
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesType =
      filterType === "all" || order.type === (filterType === "online" ? 0 : 1);
    const matchesStatus =
      filterStatus === "all" ||
      order.status ===
      (filterStatus === "pending"
        ? 0
        : filterStatus === "completed"
          ? 1
          : 2);
    return matchesType && matchesStatus;
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredOrders.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Order</th>
              <th className="py-2 px-4 border">Koi ID</th>
              <th className="py-2 px-4 border">ConsigKoi ID</th>
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Customer ID</th>
              <th className="py-2 px-4 border">Staff ID</th>
              <th className="py-2 px-4 border">Purchase Date</th>
              <th className="py-2 px-4 border">Updated Date</th>
              <th className="py-2 px-4 border">Promotion </th>
              <th className="py-2 px-4 border">Total Amount</th>
              <th className="py-2 px-4 border">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-gray-200 border-none outline-none text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </th>
              <th className="py-2 px-4 border">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-gray-200 border-none outline-none text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((order) => (
              <tr key={order.orderID} className="text-center border-b">
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => {
                      const path =
                        userRole === 0
                          ? navigate(
                            "/admin/manageOrder/orderDetail/${order.orderID}"
                          )
                          : userRole === 1
                            ? `/staff/manageOrder/orderDetail/${order.orderID}`
                            : null;
                      if (path) {
                        navigate(path);
                      } else {
                        alert(
                          "You do not have permission to access this page."
                        );
                      }
                    }}
                    className="text-blue-500 underline"
                  >
                    {order.orderID}
                  </button>
                </td>

                <td className="py-2 px-4 border">
                  {order.orderDetails?.[0]?.koi?.koiID || order.orderDetails?.[0]?.consignmentKoi?.consignmentKoiID}
                </td>
                <td className="py-2 px-4 border">
                  {order.orderDetails?.[0]?.consignmentKoi?.consignment?.consignmentID}
                </td>
                <td className="py-2 px-4 border">
                  <img
                    src={order.orderDetails?.[0]?.koi?.image || order.orderDetails?.[0]?.consignmentKoi?.image}
                    alt={order.orderDetails?.[0]?.koi?.name || order.orderDetails?.[0]?.consignmentKoi?.name}
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>
                <td className="py-2 px-4 border">{order.customerID}</td>
                <td className="py-2 px-4 border">{order.staffID}</td>
                <td className="py-2 px-4 border">{formatDate(order.createAt)}</td>
                <td className="py-2 px-4 border">{formatDate(order.updateAt)}</td>
                <td className="py-2 px-4 border">{order.promotionID}</td>
                <td className="py-2 px-4 border">{order.totalAmount}</td>
                <td className="py-2 px-4 border">{getTypeLabel(order.type)}</td>
                <td className="py-2 px-4 border">{getStatusLabel(order.status)}</td>

                <td className="p-2 border">
                  {order.status === 2 && (
                    <button
                      onClick={() => deleteOrder(order.orderID)}
                      className="bg-red-500 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <Pagination
          totalPosts={filteredOrders.length}
          postPerPage={postsPerPage}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default ManageOrder;
