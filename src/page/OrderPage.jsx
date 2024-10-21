import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import { jwtDecode } from 'jwt-decode';

const OrderPage = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError('Token not found');
        setLoading(false);
        return;
      }

      try {
        // Giải mã token để lấy userID
        const decodedToken = jwtDecode(token);
        const userID = decodedToken.userID;

        // Gửi yêu cầu API kèm token trong header
        const response = await api.get('/Order', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Lọc đơn hàng theo customerID (khớp với userID của token)
        const customerOrders = response.data.filter(order => order.customerID === userID);
        setOrders(customerOrders);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Your Order History</h1>
      <ul>
        {orders.map(order => (
          <li key={order.orderID}>
            <p><strong>Order ID:</strong> {order.orderID}</p>
            <p><strong>Total Amount:</strong> {order.totalAmount}</p>
            <p><strong>Created At:</strong> {new Date(order.createAt).toLocaleString()}</p>
            {order.updateAt && (
              <p><strong>Updated At:</strong> {new Date(order.updateAt).toLocaleString()}</p>
            )}

            {/* Nếu có giao dịch */}
            {order.transactions.length > 0 ? (
              <div>
                <h3>Transactions:</h3>
                {order.transactions.map(transaction => (
                  <div key={transaction.transactionID}>
                    <p><strong>Transaction ID:</strong> {transaction.transactionID}</p>
                    <p><strong>Amount:</strong> {transaction.amount}</p>
                    <p><strong>Payment Method:</strong> {transaction.paymentMethod?.methodName || 'N/A'}</p>
                    <p><strong>Created At:</strong> {new Date(transaction.createAt).toLocaleString()}</p>
                    {transaction.endAt && (
                      <p><strong>End At:</strong> {new Date(transaction.endAt).toLocaleString()}</p>
                    )}
                    <p><strong>Status:</strong> {transaction.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No transactions available</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderPage;
