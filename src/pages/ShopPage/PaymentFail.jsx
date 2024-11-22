import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import failAnimation from '../../assets/animations/fail.json';

const PaymentFail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionID = searchParams.get('transactionID');
  const amount = searchParams.get('amount');
  const status_text = searchParams.get('status_text');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl text-black max-w-lg w-full">
        <div className="text-center">
          <Lottie animationData={failAnimation} loop={false} className="w-32 h-32 mx-auto" />

          <h2 className="text-3xl font-bold mb-4 text-black">Payment Failed!</h2>
          <p className="text-gray-700 text-lg mb-6">
            Your transaction was failed!.
          </p>
          <p className="text-gray-800 text-sm mb-2">
            <strong>Transaction ID:</strong> {transactionID}
          </p>
          <p className="text-gray-800 text-sm mb-2">
            <strong>Amount Paid:</strong> {amount} VND
          </p>
          <p className="text-gray-800 text-sm mb-6">
            <strong>Status:</strong> {status_text}
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="bg-black w-full py-3 text-white rounded-lg hover:bg-gray-800 transition duration-300 shadow-md"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
