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
    <div>
      <h1>Feedback List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {feedbacks.map(feedback => (
            <div key={feedback.feedbackID} style={{ border: '1px solid #ccc', padding: '10px', width: '300px' }}>
              <p><strong>Order ID:</strong> {feedback.orderID}</p>
              <p><strong>Customer ID:</strong> {feedback.customerID}</p>
              <p><strong>Rating:</strong> {feedback.rating}</p>
              <p><strong>Comment:</strong> {feedback.comment}</p>
              <p><strong>Date:</strong> {new Date(feedback.dateFb).toLocaleString()}</p>
              <button onClick={() => handleDeleteFeedback(feedback.feedbackID)} style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}>
                Delete Feedback
              </button>
              <button onClick={() => navigate(`/update-feedback/${feedback.feedbackID}`)} style={{ backgroundColor: 'blue', color: 'white' }}>
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