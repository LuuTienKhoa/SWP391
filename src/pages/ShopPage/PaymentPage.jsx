import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const PaymentPage = () => {
  const location = useLocation();
  const { koiFish, batch, consignment, promotion, customerId = 0 } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('VNPay'); // Default to VNPay
  const [promotionID, setPromotionID] = useState('');
  const [buyingAmount, setBuyingAmount] = useState(0);
  const navigate = useNavigate();
  const [user, setUser] = useState({ address: '', phone: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get('/User/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handlePayment = async () => {
    if (!koiFish && !batch) {
      alert("Koi data or batch data is missing!");
      return;
    }

    try {
      const orderData = {
        promotionID: parseInt(promotionID, 10) || 0,
        paymentMethod: paymentMethod === 'VNPay' ? 0 : 1,
        ...(batch && { batchs: [[batch.batchID, buyingAmount]] }),
        ...(koiFish?.consignmentKoiID && { consignmentKois: [koiFish.consignmentKoiID] }),
        ...(koiFish?.koiID && { kois: [koiFish.koiID] }),
        ...(consignment?.priceListId && { consignment: { endDate: consignment.endDate, priceListId: consignment.priceListId } }),

      };

      const response = await api.post('/Order/create', orderData);
      const orderId = response.data.orderID;

      if (paymentMethod === 'VNPay') {
        handleDelivery(orderId, customerId);
      }

      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  const handleDelivery = async (orderId, customerId) => {
    try {
      const deliveryData = {
        orderID: orderId,
        customerID: customerId,
        startDeliDay: new Date().toISOString(),
        endDeliDay: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      };

      await api.post('/koi/Delivery', deliveryData);
      alert(`Shipment delivery created for Order ID: ${orderId}`);
    } catch (error) {
      console.error('Error processing delivery:', error);
    }
  };

  const today = new Date();
  const deliveryDate = new Date(today);
  const packDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 10);
  packDate.setDate(today.getDate() + 3);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex justify-center items-center text-gray-900">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white p-8 rounded-lg shadow-lg border border-gray-300">
        <div className="lg:w-1/2 p-4 bg-white rounded-lg mb-6 lg:mb-0 flex flex-col items-center">
          {batch ? (
            <>
            <img
                src={batch?.image ?? "https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0503s054-re-260x421.jpg"}
                alt={batch?.name}
                className="h-auto max-w-xs flex flex-col justify-center items-center"
              />
              <h2 className="text-2xl font-semibold mb-2 mt-2">{batch.name} #{batch.batchID}</h2>
              <p className="text-gray-500 mb-4">Quantity: {batch.quantityPerBatch}</p>
              <p className="text-4xl font-bold text-gray-800">{batch.pricePerBatch} đ</p>
            </>
          ) : (
            <>
              <img
                src={koiFish?.image ?? "https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0503s054-re-260x421.jpg"}
                alt={koiFish?.name}
                className="h-auto max-w-xs flex flex-col justify-center items-center"
              />
              <h2 className="text-2xl font-semibold mb-2 mt-2">{koiFish?.name} # {koiFish?.koiID || koiFish.consignmentKoiID}</h2>
              <p className="text-gray-500 mb-4">{koiFish?.species}</p>
              <p className="text-4xl font-bold text-gray-800">{koiFish?.price} đ</p>
            </>
          )}
        </div>

        <div className="lg:w-1/2 lg:ml-8">
          <h2 className="text-3xl font-semibold mb-6">Payment</h2>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Select Payment Method</label>
            <select
              className="w-full p-3 bg-gray-200 rounded-lg text-gray-800"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="VNPay">VNPay</option>
              <option value="Direct-Payment">Direct Payment</option>
            </select>
          </div>

          {batch && (
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                className="w-full p-3 bg-gray-200 rounded-lg text-gray-800"
                placeholder="0"
                value={buyingAmount}
                onChange={(e) => setBuyingAmount(parseInt(e.target.value))}
              />
            </div>
          )}

                {/* Price */}
                <div className="bg-gray-200 p-6 rounded-lg mb-6">
            <p className="text-4xl font-bold">
              {batch 
                ? `${(batch.pricePerBatch * (paymentMethod === 'Direct-Payment' ? 0.5 : 1))} đ` 
                : `${(koiFish?.price * (paymentMethod === 'Direct-Payment' ? 0.5 : 1))} đ`}
            </p>
            <p className="text-sm mt-2">
              {paymentMethod === 'Direct-Payment' 
                ? "Please pay 50% of the product value."
                : "This is just the original amount of the product. It does not include the discount code."}
            </p>
          </div>
          {/* Address and Phone */}
          <div className="bg-gray-200 p-6 rounded-lg mb-6">
            {paymentMethod === 'Direct-Payment' ? (
              <>
                <p className="text-sm mt-2">Shop's Address:</p>
                <p className="text-2xl font-bold">123 Pham The Hien, Quan 8</p>
                <p className="text-sm mt-2">Shop's Phone:</p>
                <p className="text-2xl font-bold">0908228121</p>
                <p className="text-xl mt-2">Packed Date: {formatDate(packDate)}</p>
                <p className="text-xl mt-2">Expected Pickup Date: {formatDate(packDate)} to {formatDate(deliveryDate)}</p>
                <p className="text-sm mt-2">
                - The product will be packed within 3 days from the time the customer deposits.                </p>
                <p className="text-sm mt-2">
                - Please come at the right time after 3 days of packing and within 7 days to pick up the product.                </p>
                <p className="text-sm mt-2">
                - If the time is exceeded, the order will be canceled and we will not return the deposit to you                </p>

              </>
            ) : (
              <>
                <p className="text-sm mt-2">Your Address:</p>
                <p className="text-2xl font-bold">{user.address}</p>
                <p className="text-sm mt-2">Your Phone:</p>
                <p className="text-2xl font-bold">{user.phone}</p>
                <p className="text-xl mt-2">Estimated delivery date: {formatDate(deliveryDate)}</p>
                <p className="text-sm mt-2">
                  We will deliver to you based on the address you provided when registering. Any changes to the delivery address please change in 
                  <a href="http://localhost:5173/profile" className="text-blue-500 underline"> your information here</a>.
                </p>
              </>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Discount Code</label>
            <input
              type="text"
              name="discountCode"
              className="w-full p-3 bg-gray-200 rounded-lg text-gray-800"
              placeholder="Discount Code"
              value={promotionID}
              onChange={(e) => setPromotionID(e.target.value)}
            />
          </div>

          <button
            className="bg-gray-800 text-white w-full py-4 rounded-lg hover:bg-gray-900 transition"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
