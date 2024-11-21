import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { Checkbox, DatePicker, Select } from 'antd';
import loadingInformation from '../../assets/animations/loading.json'
import Lottie from 'lottie-react';
import moment from "moment";

const PaymentPage = () => {
  const location = useLocation();
  const { koiFish, batch, consignment, promotion, customerId = 0 } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('VNPay'); // Default to VNPay
  const [promotionID, setPromotionID] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [buyingAmount, setBuyingAmount] = useState(0);
  const [wantConsign, setWantConsign] = useState(false);
  const [priceListId, setPriceListId] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({ address: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');
  const pricePerDay = {
    1: 100000, // Option 1 price per day
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get('/Promotion/UserAvailable');
        setPromotions(response.data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };

    fetchPromotions();
  }, []);
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
      setLoading(true);
      const orderData = {
        promotionID: parseInt(promotionID, 10) || 0,
        paymentMethod: paymentMethod === 'VNPay' ? 0 : 1,
        ...(batch && { batchs: [[batch.batchID, buyingAmount]] }),
        ...(koiFish?.consignmentKoiID && { consignmentKois: [koiFish.consignmentKoiID] }),
        ...(koiFish?.koiID && { kois: [koiFish.koiID] }),
        ...(wantConsign && endDate && priceListId && {
          consignment: {
            endDate: endDate.toISOString(),
            priceListId,
          },
        }),

      };

      const response = await api.post('/Order/create', orderData);
      const orderId = response.data.orderID;

      if (paymentMethod === 'VNPay') {
        handleDelivery(orderId, customerId);
      }

      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error('Error processing payment:', error);
      setWarningMessage(
        "We're sorry! Something went wrong while processing your payment. Please try again or contact support if the issue persists."
      );
    } finally {
      setLoading(false);
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0, // No decimals for VND
    }).format(value);
  };


  const getTotalCost = () => {
    if (priceListId && endDate) {
      const startDate = new Date();
      const endDateFormatted = new Date(endDate);

      const timeDifference = endDateFormatted - startDate;
      const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;

      if (days > 0) {
        return days * pricePerDay[priceListId];
      }
    }
    return 0;
  };

  const handleBuyingAmountChange = (value) => {
    if (value > batch.remainBatch) {
      setWarningMessage(`The number of batches you want to buy exceeds the available quantity (${batch.remainBatch}).`);
    } else {
      setWarningMessage('');
    }
    setBuyingAmount(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 lg:flex lg:space-x-8">
        <div className="lg:w-1/2 flex flex-col items-center">
          <img
            src={
              batch?.image ||
              koiFish?.image ||
              "https://via.placeholder.com/300"
            }
            alt={batch?.name || koiFish?.name}
            className="w-full max-w-md rounded-lg shadow-md"
          />
          <h2 className="text-3xl font-bold mt-4">
            {batch
              ? `${batch.name} #${batch.batchID}`
              : `${koiFish?.name} #${koiFish?.koiID || koiFish?.consignmentKoiID}`}
          </h2>
          <p className="text-gray-600 mt-2">
            {batch
              ? `Price Per Batch: ${formatCurrency(batch.pricePerBatch)}`
              : `Price: ${formatCurrency(koiFish?.price)}`}
          </p>
          {batch ? (
            <>
              <p className="text-gray-600 mt-2">
                Quantity Koi per batch: {batch.quantityPerBatch}
              </p>
              <p className="text-gray-600 mt-2">
                Remaining quantity available: {batch.remainBatch}
              </p>
            </>
          ) : (
            <p className="text-gray-600 mt-2"></p>
          )}

        </div>

        <div className="lg:w-1/2 mt-6 lg:mt-0">
          <h3 className="text-2xl font-semibold mb-4">Payment Details</h3>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <label className="block text-lg font-medium">Payment Method</label>
            <select
              className="w-full mt-2 p-3 rounded-lg border-gray-300"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="VNPay">VNPay - Pay Full Amount</option>
              <option value="Direct-Payment">
                Direct Payment - Pay 50% Upfront
              </option>
            </select>
          </div>

          {!batch && koiFish && (
            <div className="mb-6">
              <Checkbox
                checked={wantConsign}
                onChange={(e) => setWantConsign(e.target.checked)}
              >
                Want to consign this koi?
              </Checkbox>
            </div>
          )}
          {wantConsign && (
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Consignment Details</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Select Option (Price Per Day)
                </label>
                <Select
                  placeholder="Select price per day"
                  className="w-full"
                  onChange={(value) => setPriceListId(value)}
                >
                  <Select.Option value={1}>100,000 VND/day</Select.Option>
                </Select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">End Date</label>
                <DatePicker
                  className="w-full"
                  onChange={(date) => setEndDate(date ? date.toDate() : null)} // Convert to JS Date object
                />

              </div>
              <div>
                <span>
                  Estimated total cost:{" "}
                  {getTotalCost() > 0
                    ? `${getTotalCost()} VND`
                    : "Invalid Date or Option"}
                </span>
              </div>
            </div>
          )}

          {batch && (
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">How many batches do you want to buy:</label>
              <input
                type="number"
                name="quantity"
                className="w-full p-3 bg-gray-200 rounded-lg text-gray-800"
                placeholder="0"
                value={buyingAmount}
                onChange={(e) => handleBuyingAmountChange(parseInt(e.target.value) || 0)}
              />
              {warningMessage && <p className="text-red-500 text-sm mt-2">{warningMessage}</p>}
            </div>
          )}

          {/* Price */}
          <div className="bg-gray-200 p-6 rounded-lg mb-6">
            <p className="text-4xl font-bold">
              {batch
                ? formatCurrency(batch.pricePerBatch * (paymentMethod === 'Direct-Payment' ? 0.5 : 1))
                : formatCurrency(koiFish?.price * (paymentMethod === 'Direct-Payment' ? 0.5 : 1))}
            </p>
            <p className="text-sm mt-2">
              {paymentMethod === 'Direct-Payment'
                ? "You need to pay 50% of the product value upfront. The remaining amount must be paid upon pickup or delivery."
                : "You are paying the full price of the product through VNPay. Please note that any discount codes will be applied after selecting the payment method."}
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
                  <a href="http://localhost:5173/profile" className="text-blue-500 underline"> HERE</a>.
                </p>
              </>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Select Discount Code</label>
            <select
              className="w-full p-3 bg-gray-200 rounded-lg text-gray-800"
              value={promotionID}
              onChange={(e) => setPromotionID(e.target.value)}
            >
              <option value="">Select a promotion</option>
              {promotions.map((promotion) => (
                promotion.customerID !== null && (
                  <option key={promotion.promotionID} value={promotion.promotionID}>
                    {promotion.code} - {promotion.description} ({promotion.discountRate}% off) -
                    Remaining: {promotion.remainingRedeem} - Ends on: {new Date(promotion.endDate).toLocaleDateString()}
                  </option>
                )
              ))}
            </select>
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
