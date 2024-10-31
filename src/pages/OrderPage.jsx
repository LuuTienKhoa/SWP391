import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import { Button, Card, CardContent, Typography, TextField, Rating,Snackbar,Alert } from '@mui/material';

const OrderPage = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({}); // State to hold feedback for each order
  const [ratings, setRatings] = useState({}); // State to hold ratings for each order
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/Order/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Sort orders by creation date (most recent first)
        const sortedOrders = response.data.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
        setOrders(sortedOrders);
      } catch (err) {
        if (err.response) {
          setError(`API Error: ${err.response.status} - ${err.response.data.message}`);
        } else if (err.request) {
          setError('No response received from API');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleFeedbackChange = (orderID, value) => {
    setFeedback(prev => ({ ...prev, [orderID]: value }));
  };

  const handleRatingChange = (orderID, value) => {
    setRatings(prev => ({ ...prev, [orderID]: value }));
  };

  const submitFeedback = async (orderID, customerID) => {
    const feedbackData = {
      Order: { id: orderID },       
      Customer: { id: customerID },  
      rating: ratings[orderID] || 5,
      comment: feedback[orderID] || '',
      dateFb: new Date().toISOString(),
    };
    
    

    try {
      await api.post('/feedback', feedbackData);
      alert('Feedback submitted successfully!');
      setFeedback(prev => ({ ...prev, [orderID]: '' }));
      setRatings(prev => ({ ...prev, [orderID]: 5 }));
      setNotification({ open: true, message: 'Feedback submitted successfully!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Failed to submit feedback.', severity: 'error' });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const getDeliveryLabel = (status) => {
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
  return (
    <div>
      <h1>Your Order History</h1>
      <div>
        {orders.map(order => (
          <Card key={order.orderID} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">Order ID: {order.orderID}</Typography>
              <Typography variant="body1">Total Amount: {order.totalAmount}</Typography>
              <Typography variant="body2">Created At: {new Date(order.createAt).toLocaleString()}</Typography>
              <Typography variant="body2">Customer ID: {order.customerID}</Typography> {/* Display customerID */}

              {/* Display Delivery Status */}
              <Typography variant="body2">Delivery Status: {getDeliveryLabel(order.status)}</Typography>
              {order.status === 1 && (
                <>
                  {/* Feedback Section */}
                  <Rating
                    name={`rating-${order.orderID}`}
                    value={ratings[order.orderID] || 5}
                    onChange={(event, newValue) => handleRatingChange(order.orderID, newValue)}
                    sx={{ marginTop: 2 }}
                  />
                  <TextField
                    label="Your Feedback"
                    variant="outlined"
                    fullWidth
                    value={feedback[order.orderID] || ''}
                    onChange={(e) => handleFeedbackChange(order.orderID, e.target.value)}
                    sx={{ marginTop: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => submitFeedback(order.orderID, order.customerID)}
                    sx={{ marginTop: 1 }}
                  >
                    Submit Feedback
                  </Button>

                </>
              )}
              {/* Snackar use to display a brief messages and fades out*/}
              <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={() => setNotification({ ...notification, open: false })}
              >
                <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
                  {notification.message}
                </Alert>
              </Snackbar>
              {/* Delivery Details Section */}
              <Typography variant="h6" sx={{ marginTop: 2 }}>Delivery Details</Typography>
              <Typography variant="body2">Start Delivery Day: {new Date(order.startDeliDay).toLocaleString()}</Typography>
              <Typography variant="body2">End Delivery Day: {order.endDeliDay ? new Date(order.endDeliDay).toLocaleString() : 'Not Available'}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
