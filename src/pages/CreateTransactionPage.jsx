import React, { useState } from 'react';
import axios from '../config/axios'; // Make sure this path is correct for your Axios instance
import { TextField, Button, Snackbar, Alert } from '@mui/material';

const CreateTransactionPage = ({ token }) => {
  const [orderID, setOrderID] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async () => {
    try {
      await axios.post('/Transaction/createOffTransaction', orderID, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      setNotification({ open: true, message: 'Transaction created successfully!', severity: 'success' });
      setOrderID(''); // Clear input field after successful submission
    } catch (error) {
      setNotification({ open: true, message: 'Failed to create transaction.', severity: 'error' });
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Create Off Transaction</h2>
      <TextField
        label="Order ID"
        variant="outlined"
        value={orderID}
        onChange={(e) => setOrderID(parseInt(e.target.value))}
        fullWidth
        sx={{ marginBottom: '20px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!orderID} // Disable button if orderID is empty
      >
        Submit
      </Button>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateTransactionPage;
