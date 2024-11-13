import  { useState,useEffect } from 'react';
import api from '../config/axios'; // Make sure this path is correct for your Axios instance
import { TextField, Button, Snackbar, Alert } from '@mui/material';

const CreateTransactionPage = () => {
  const [transactionData, setTransactionData] = useState(null);
  const [orderID, setOrderID] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Handle form inputs
  const handleChange = (e) => {
    setOrderID(e.target.value);
  };

  // Submit offline transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/Transaction/createOffTransaction", parseInt(orderID, 10), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setTransactionData(response.data);
    } catch (err) {
      console.error("Error creating transaction:", err);
      setError("Failed to create transaction. Please check the order ID and try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Create Offline Transaction</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Order ID</label>
          <TextField
            type="number"
            value={orderID}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            placeholder="Enter Order ID"
            InputProps={{ inputProps: { min: 1 } }}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          className="py-3"
        >
          {loading ? "Processing..." : "Create Transaction"}
        </Button>
      </form>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {/* Transaction Details */}
      {transactionData && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
          <p><strong>Transaction ID:</strong> {transactionData.transactionID}</p>
          <p><strong>Order ID:</strong> {transactionData.orderID}</p>
          <p><strong>Consignment ID:</strong> {transactionData.consignmentID ?? "N/A"}</p>
          <p><strong>Token:</strong> {transactionData.token}</p>
          <p><strong>Amount:</strong> {transactionData.amount.toLocaleString()} VND</p>
          <p><strong>Status:</strong> {
            transactionData.status === 0 ? "Pending" :
            transactionData.status === 1 ? "Completed" :
            transactionData.status === 3 ? "Failed" :
            transactionData.status === 4 ? "Cancelled" :
            "Unknown"
          }</p>
          <p><strong>Created At:</strong> {new Date(transactionData.createAt).toLocaleString()}</p>
          <p><strong>End At:</strong> {transactionData.endAt ? new Date(transactionData.endAt).toLocaleString() : "N/A"}</p>
        </div>
      )}

    </div>
  );
};


export default CreateTransactionPage;
