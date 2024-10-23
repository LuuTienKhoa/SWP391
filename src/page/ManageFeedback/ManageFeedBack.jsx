import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import api from '../../config/axios';

const ManageFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/Feedback");
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      alert("Failed to fetch feedback.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleDeleteFeedback = async (feedbackID) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this feedback?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/Feedback/${feedbackID}`);
      alert("Feedback deleted successfully!");
      setFeedbacks(feedbacks.filter((feedback) => feedback.feedbackID !== feedbackID));
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Failed to delete the feedback.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">FeedBacks</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {feedbacks.map(feedback => (
            <div key={feedback.feedbackID} className="border rounded-lg shadow-lg p-6 text-center bg-white">
              <p><strong>Order ID:</strong> {feedback.orderID}</p>
              <p><strong>Customer ID:</strong> {feedback.customerID}</p>
              <p><strong>Rating:</strong> {feedback.rating}</p>
              <p><strong>Comment:</strong> {feedback.comment}</p>
              <p><strong>Date:</strong> {new Date(feedback.dateFb).toLocaleString()}</p>
              <button onClick={() => handleDeleteFeedback(feedback.feedbackID)} className="bg-red-500 text-white px-4 py-2 rounded mt-2 mr-2">
                Delete Feedback
              </button>
              <button onClick={() => navigate(`/update-feedback/${feedback.feedbackID}`)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 mr-2">
                Update Feedback
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageFeedback;