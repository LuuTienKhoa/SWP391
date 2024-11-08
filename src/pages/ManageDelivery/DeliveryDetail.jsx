import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";
import EditDeliveryForm from "./EditDeliveryForm";
import Modal from "../../components/Modal/Modal";

const DeliveryDetail = () => {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchDeliveryDetail = async () => {
      try {
        const response = await api.get(`/koi/Delivery/${id}`);
        setDelivery(response.data);
      } catch (err) {
        setError("Failed to fetch delivery details");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetail();
  }, [id]);

  const handleSave = () => {
    setShowEditForm(false);
    window.location.reload();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Delivery Details
      </h1>
      {delivery ? (
        <div className="bg-white shadow-md rounded-lg p-4">
          <div>
            <p><strong>Delivery ID:</strong> {delivery.deliveryID}</p>
            <p><strong>Order ID:</strong> {delivery.orderID}</p>
            <p><strong>Customer ID:</strong> {delivery.customerID}</p>
            <p><strong>Start Delivery Day:</strong> {new Date(delivery.startDeliDay).toLocaleString()}</p>
            <p><strong>End Delivery Day:</strong> {new Date(delivery.endDeliDay).toLocaleString()}</p>
            <p><strong>Address:</strong> {delivery.address}</p>
            <p><strong>Total Amount:</strong> ${delivery.order.totalAmount}</p>
            <p><strong>Status:</strong> {getStatusLabel(delivery.status)}</p>
            <button onClick={() => setShowEditForm(true)} className="bg-blue-500 text-white p-2 mt-2">
              Edit
            </button>
          </div>
        </div>
      ) : (
        <div>No delivery details available.</div>
      )}

      {showEditForm && (
        <Modal onClose={() => setShowEditForm(false)}>
          <EditDeliveryForm
            delivery={delivery}
            onSave={handleSave}
            onCancel={() => setShowEditForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

const getStatusLabel = (status) => {
  switch (status) {
    case 0:
      return "Delivering";
    case 1:
      return "Delivered";
    case 2:
      return "Failed";
    case 3:
      return "Cancelled";
    default:
      return "Unknown Status";
  }
};

export default DeliveryDetail;
