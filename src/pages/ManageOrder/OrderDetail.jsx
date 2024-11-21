import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";
import EditOrderForm from "./EditOrderForm";
import Modal from "../../components/Modal/Modal";
import Stepper from "../../components/Stepper";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reason, setReason] = useState("");
  const [reasonImage, setReasonImage] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [newStatus, setNewStatus] = useState(null);

  const steps = ["Pending", "Completed", "Cancelled"];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/Order/${id}`);
        
        if (response.status === 404) {
          return navigate("/404");  
        }
        
        setOrder(response.data);
      } catch (error) {
        setErrorMessage("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedOrder = { ...order, updateAt: new Date().toISOString() };
    try {
      await api.put(`/Order/${id}`, updatedOrder);
      alert("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrder((prevOrder) => ({
          ...prevOrder,
          reasonImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusChange = (status) => {
    setNewStatus(status);
    setShowReasonModal(true);
  };

  const updateOrderStatus = async (newStatus) => {
    const updatedOrder = {
      ...order,
      status: newStatus,
      reason,
      reasonImage,
      updateAt: new Date().toISOString(),
    };
    try {
      await api.put(`/Order/${id}`, updatedOrder);
      setOrder(updatedOrder);
      alert(`Order status updated to ${steps[newStatus]}!`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-dark">Order Details</h1>

      <Stepper steps={steps} currentStep={order ? order.status : 0} />

      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Basic Order Information</h2>
        <div className="grid grid-cols-2 gap-4 text-lg"> 
        <p><strong>Order ID:</strong> {order?.orderID}</p>
        <p><strong>Customer ID:</strong> {order?.customerID || "N/A"}</p>
        <p><strong>Staff ID:</strong> {order?.staffID || "N/A"}</p>
        <p><strong>Date of Purchase:</strong> {order ? new Date(order.createAt).toLocaleDateString() : "N/A"}</p>
        <p><strong>Last Updated:</strong> {order ? new Date(order.updateAt).toLocaleDateString() : "N/A"}</p>
        <p><strong>Total Amount:</strong> {order ? order.totalAmount.toLocaleString() : "N/A"} VND</p>
        <p><strong>Type:</strong> {order?.type === 0 ? "Online" : "Offline"}</p>
        <p><strong>Status:</strong> {order ? steps[order.status] : "N/A"}</p>
        </div>
        {order?.reason && (
          <div className="mt-4">
            <p>
              <strong>Reason:</strong> {order.reason}
            </p>
            {order.reasonImage && (
              <img
                src={order.reasonImage}
                alt="Reason"
                className="mt-2 border rounded-lg"
              />
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        {order?.status === 0 && (
          <>
            <button
              onClick={() => setShowEditForm(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Edit Order
            </button>
            <button
              onClick={() => handleStatusChange(1)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Mark as Completed
            </button>
            <button
              onClick={() => handleStatusChange(2)}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Cancel Order
            </button>
          </>
        )}
        {order?.status === 1 && (
          <p className="text-lg text-green-600 font-bold">
            Order is Completed.
          </p>
        )}
        {order?.status === 2 && (
          <p className="text-lg text-red-600 font-bold">
            Order is Cancelled.
          </p>
        )}
      </div>

      {/* Edit Order Form Modal */}
      {showEditForm && (
        <Modal onClose={() => setShowEditForm(false)}>
          <EditOrderForm
            order={order}
            handleChange={(e) => {
              const { name, value } = e.target;
              setOrder((prev) => ({ ...prev, [name]: value }));
            }}
            handleSave={() => {
              setShowEditForm(false);
              alert("Order updated successfully!");
            }}
          />
        </Modal>
      )}

      {/* Reason Modal */}
      {showReasonModal && (
        <Modal onClose={() => setShowReasonModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Provide Reason</h2>
            <label className="block mb-2 text-sm font-medium">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            />
            <label className="block mb-2 text-sm font-medium">Reason Image</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setReasonImage(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full border rounded-lg p-2"
            />
            <button
              onClick={() => {
                updateOrderStatus(newStatus);
                setShowReasonModal(false);
              }}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </Modal>
      )}

      {errorMessage && (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      )}
    </div>
  );
};

export default OrderDetail;
