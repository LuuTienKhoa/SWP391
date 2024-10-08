import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { products } from "../../constants";   

// Sample product data (replace with actual data fetching)


const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4 ">
      <div className="bg-white rounded-lg shadow-lg p-6 md:flex md:space-x-8">
        <div className="md:w-1/2 flex flex-col justify-bewteen items-center ">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto max-w-xs object-cover rounded-md "
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-4">{product.title}</h2>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-gray-600 mb-4">{product.details}</p>
          <p className="text-gray-600 mb-2"><strong>Color:</strong> {product.color}</p>
          <p className="text-gray-600 mb-2"><strong>Size:</strong> {product.size}</p>
          <p className="text-gray-600 mb-2"><strong>Category:</strong> {product.category}</p>
          <p className="text-gray-600 mb-4"><strong>Popularity:</strong> {product.popularity} / 5</p>
          <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          <div className="mt-6" key={product.id}>
            <Link to = {`/payment/${product.id}`}>
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-300"
              //onClick={() => alert('Proceed to Payment')} // Replace with actual payment logic
            >
              Payment
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
