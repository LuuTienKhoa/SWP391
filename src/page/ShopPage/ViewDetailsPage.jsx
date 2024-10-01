import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Simulating fetching product details based on the id
    const fetchProductDetails = async () => {
      const dummyProducts = [
        {
          id: 1,
          
          price: 199.99,
          description: "Vibrant orange Koi fish with white spots",
          image: "https://images.unsplash.com/photo-1588932390002-a763d6ef1f3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
        },
        {
          id: 2,
          title: "Black and White Koi",
          price: 249.99,
          description: "Elegant black and white patterned Koi",
          image: "https://images.unsplash.com/photo-1550489531-a42cb6889089?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
        },
        {
          id: 3,
          title: "Red and White Koi",
          price: 179.99,
          description: "Beautiful red and white Koi fish",
          image: "https://images.unsplash.com/photo-1579225067160-3ca17efe4d73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
        },
      ];

      const foundProduct = dummyProducts.find((p) => p.id === parseInt(id));
      setProduct(foundProduct);
    };

    fetchProductDetails();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
      <img src={product.image} alt={product.title} className="w-full h-64 object-cover mb-4" />
      <p className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
      <p className="mt-4">{product.description}</p>
    </div>
  );
};

export default ViewDetailsPage;
