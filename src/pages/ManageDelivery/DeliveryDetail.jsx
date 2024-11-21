import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";
import Modal from "../../components/Modal/Modal";
import Stepper from "../../components/Stepper";

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu cần
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (tháng bắt đầu từ 0)
  const year = date.getFullYear(); // Lấy năm
  return `${day}/${month}/${year}`; // Trả về định dạng dd/mm/yyyy
};

const DeliveryDetail = () => {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reason, setReason] = useState("");
  const [reasonImage, setReasonImage] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [newStatus, setNewStatus] = useState(null);

  const steps = ["Delivering", "Delivered",  "Failed","Cancelled"];

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await api.get(`/koi/Delivery/${id}`);

        if (response.status === 404) {
          return navigate("/404");  
        }
        
        setDelivery(response.data);
      } catch (error) {
        console.error("Error fetching delivery details:", error);
        setErrorMessage("Failed to fetch delivery details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [id]);

  const handleStatusChange = (status) => {
    setNewStatus(status);
    setShowReasonModal(true);
  };

  const updateDeliveryStatus = async () => {
    const today = new Date().toISOString().split("T")[0]; // Format today's date as YYYY-MM-DD
    const formData = new FormData();
    formData.append("DeliveryID", delivery.deliveryID);
    formData.append("OrderID", delivery.orderID);
    formData.append("CustomerID", delivery.customerID);
    formData.append("Status", newStatus);
    formData.append("StartDeliDay", delivery.startDeliDay);
    formData.append("EndDeliDay", today); // Set EndDeliDay to today's date
    formData.append("Address", delivery.address);
    formData.append("Reason", reason);
    if (reasonImage) formData.append("ReasonImage", reasonImage);
  
    try {
      await api.put(`/koi/Delivery/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(`Delivery status updated to ${steps[newStatus]}!`);
      setDelivery((prev) => ({ ...prev, status: newStatus, reason, endDeliDay: today }));
      
      // Reload the page after successful update
      window.location.reload();
    } catch (error) {
      console.error("Error updating delivery status:", error);
      setErrorMessage("Failed to update delivery status.");
    }
  };
  
  if (loading) return <div className="text-center text-xl">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Delivery Details</h1>

      <Stepper steps={steps} currentStep={delivery ? delivery.status : 0} />

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Basic Delivery Information</h2>
        <p><strong>Delivery ID:</strong> {delivery?.deliveryID}</p>
        <p><strong>Order ID:</strong> {delivery?.orderID}</p>
        <p><strong>Customer ID:</strong> {delivery?.customerID}</p>
        <p><strong>Start Delivery Day:</strong> {formatDate(new Date(delivery?.startDeliDay))}</p>
        <p><strong>End Delivery Day:</strong> {formatDate(new Date(delivery?.endDeliDay))}</p>
        <p><strong>Address:</strong> {delivery?.address}</p>
        <p><strong>Status:</strong> {steps[delivery?.status]}</p>
        <p><strong>Reason:</strong> {delivery?.reason || "N/A"}</p>
        {delivery?.reasonImage && (
          <img src={delivery.reasonImage} alt="Reason" className="mt-2" />
        )}
      </section>

      <div className="flex space-x-4 mb-4">
        {delivery?.status === 0 && (
          <>
            <button
              onClick={() => handleStatusChange(1)} // Delivered
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Mark as Delivered
            </button>
            <button
              onClick={() => handleStatusChange(3)} // Cancelled
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => handleStatusChange(2)} // Failed
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Mark as Failed
            </button>
          </>
        )}
      </div>

      {showReasonModal && (
        <Modal onClose={() => setShowReasonModal(false)}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Provide Reason and Image</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Reason</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Reason Image</label>
              <input
                type="file"
                onChange={(e) => setReasonImage(e.target.files[0])}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={() => {
                updateDeliveryStatus();
                setShowReasonModal(false);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded"
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

export default DeliveryDetail;
