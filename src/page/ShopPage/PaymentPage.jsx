import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { products } from '../../constants';

const PaymentPage = () => {
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [] }; // Get cart items from location state
  const { id } = useParams(); // Get the product ID from URL parameters
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
 
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    // Fetch payment methods from the database
    fetch('/api/payment-methods')    
      .then(response => response.json())
      .then(data => setPaymentMethods(data));

    // Fetch transaction details if needed
    fetch(`/api/transactions/${id}`)
      .then(response => response.json())
      .then(data => setTransaction(data));
  }, [id]);

  
  const handlePayment = () => {
    // Handle payment logic here
    console.log('Processing payment...');
  };
 
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

          {/* Price */}
          <div className="bg-gray-700 p-6 rounded-lg mb-6">
            <p className="text-4xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-sm mt-2">
              Please scan the QR code to pay.
            </p>
          </div>
          
          {/* QR code */}
          <div>
            <img src={paymentMethods.qrCode} alt="QR Code" />
          </div>

          {/* Discount Code */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Discount Code (Optional)</label>
            <input
              type="text"
              name="discountCode"
              className="w-full p-3 bg-gray-700 rounded-lg"
              placeholder="Discount Code"
             
            />
            <button className="bg-blue-600 w-full mt-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Apply
            </button>
          </div>         
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;