import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';


const PaymentPage = () => {
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [] }; // Get cart items from location state
  const { id } = useParams(); // Get the product ID from URL parameters
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    discountCode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handlePayment = () => {
    // Handle payment logic here
    console.log('Processing payment...');
  };
  const products = [ // Changed from 'newProduct' to 'products' array
    {
      id: '1',
      title: "Black and White Koi",
      price: 249.99,
      description: "Elegant black and white patterned Koi",
      image:"https://www.kodamakoifarm.com/wp-content/uploads/2024/08/w0812s001-260x421.jpg",
      color: "black",
      size: "large",
      category: "premium",
      popularity: 4.8,
    },//1
    {
      id: '2',
      title: "Orange Koi Fish",
      price: 199.99,
      description: "Vibrant orange Koi fish with white spots",
      image:"https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0508s002.jpg",
      color: "orange",
      size: "medium",
      category: "ornamental",
      popularity: 4.5,
    },//2
    
    {
      id: '3',
      title: "Red and White Koi",
      price: 179.99,
      description: "Beautiful red and white Koi fish fron VietNam",
      image: "https://www.kodamakoifarm.com/wp-content/uploads/2024/08/w0826s001-re-260x421.jpg",
      color: "red",
      size: "small",
      category: "standard",
      popularity: 4.2,
    },//3
    {
      id: '4',
      title: "Red Koi",
      price: 179.99,
      description: "Beautiful red and white Koi fish from japan",
      image:"https://www.kodamakoifarm.com/wp-content/uploads/2024/08/w0826s005-re-260x421.jpg",
      color: "red",
      size: "small",
      category: "standard",
      popularity: 4.2,
    },//4
    {
      id: '5',
      title: "Brown Koi",
      price: 179.99,
      description: "Beautiful red and white Koi fish from japan",
      image:"https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0506s089-260x421.jpg",
      color: "brown",
      size: "small",
      category: "standard",
      popularity: 4.2,
    },//5
    // Add more products as needed
    
  ];
  const product = products.find((p) => p.id === id); // Find product by ID
 
  
  
  

  return (
    <div
   
     className="min-h-screen bg-white p-10 text-white flex justify-center items-center">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* Left - Product Information */}
        <div className="lg:w-1/2 p-4 bg-gray-800 rounded-lg mb-6 lg:mb-0 flex flex-col items-center"
         >
          <img
            src={product.image}
            alt={product.title}
            className="h-auto max-w-xs flex flex-col justify-center items-center"
          />
          <h2 className="text-2xl font-semibold mb-2 mt-2">{product.title}</h2>
          <p className="text-gray-400 mb-4">{product.description}</p>
          <p className="text-4xl font-bold text-blue-500">${product.price.toFixed(2)}</p>
        </div>

        {/* Right - Payment Section */}
        <div className="lg:w-1/2 lg:ml-8">
          <h2 className="text-3xl font-semibold mb-6">Payment</h2>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Select Payment Method</label>
            <select
              className="w-full p-3 bg-gray-700 rounded-lg"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="paypal">Paypal</option>
              <option value="credit-card">Credit / Debit Card</option>
            </select>
          </div>

          {/* Price */}
          <div className="bg-gray-700 p-6 rounded-lg mb-6">
            <p className="text-4xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-sm mt-2">
              We will save all details of your payment. You may stop future automatic payments anytime.
            </p>
          </div>

          {/* Card Details Form */}
          {paymentMethod === 'credit-card' && (
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Card Holder Name</label>
              <input
                type="text"
                name="name"
                className="w-full p-3 bg-gray-700 rounded-lg mb-4"
                placeholder="Card Holder Name"
                value={cardDetails.name}
                onChange={handleInputChange}
              />
              <label className="block text-lg font-medium mb-2">Card Number</label>
              <input
                type="text"
                name="number"
                className="w-full p-3 bg-gray-700 rounded-lg mb-4"
                placeholder="Card Number"
                value={cardDetails.number}
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    className="w-full p-3 bg-gray-700 rounded-lg"
                    placeholder="MM / YY"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    className="w-full p-3 bg-gray-700 rounded-lg"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Discount Code */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Discount Code (Optional)</label>
            <input
              type="text"
              name="discountCode"
              className="w-full p-3 bg-gray-700 rounded-lg"
              placeholder="Discount Code"
              value={cardDetails.discountCode}
              onChange={handleInputChange}
            />
            <button className="bg-blue-600 w-full mt-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Apply
            </button>
          </div>

          {/* Payment Button */}
          <button
            className="bg-blue-600 w-full py-4 rounded-lg hover:bg-blue-700 transition"
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
