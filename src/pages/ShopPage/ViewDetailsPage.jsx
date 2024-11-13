import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";

const ViewDetailsPage = () => {
  const { id } = useParams();
  const [koiFish, setKoiFish] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchKoiFishDetails = async () => {
      try {
      
        if (window.location.pathname.includes('/consignmentKoi/')) {
          const response = await api.get(`/ConsignmentKoi/${id}`); // Đường dẫn cho consignmentKoi
          setKoiFish(response.data);
        } else if (window.location.pathname.includes('/koi/')) {
          const response = await api.get(`/koi/Koi/${id}`); // Đường dẫn cho koi
          setKoiFish(response.data);
        }
      } catch (error) {
        console.error("Error fetching koi fish details:", error);
      }
    };

    fetchKoiFishDetails();
  }, [id]);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
  if (!koiFish) return <div className="text-center text-xl text-gray-800">Loading...</div>;

  // Prepare images: main image + certificates
  const images = [
    koiFish.image ?? "https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0503s054-re-260x421.jpg",
    koiFish?.addOn?.originCertificate,
    koiFish?.addOn?.healthCertificate,
    koiFish?.addOn?.ownershipCertificate,
  ].filter(Boolean); // Filter out any undefined or null images

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="container mx-auto max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
          {/* Main Image Display */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <img
              src={images[0]}
              alt={koiFish.name}
              className="w-full h-auto max-w-md object-cover rounded-lg  cursor-pointer"
              onClick={() => openModal(images[0])}
            />
            <div className="flex mt-4 space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg shadow-md cursor-pointer border border-black"
                  onClick={() => openModal(image)}
                />
              ))}
            </div>
          </div>

          {/* Fish Details */}
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-4xl font-bold text-black">{koiFish.name} - #{koiFish.koiID || koiFish.consignmentKoiID}</h1>
            <h1 className="text-4xl font-bold text-black">{koiFish.name} </h1>
            <p className="text-3xl font-semibold text-gray-800">{formatCurrency(koiFish.price)}</p>
            <div className="space-y-2 text-gray-700">
              <p className="text-lg"><strong>Gender:</strong> {koiFish.gender}</p>
              <p className="text-lg"><strong>Age:</strong> {koiFish.age} years</p>
              <p className="text-lg"><strong>Size:</strong> {koiFish.size} cm</p>
              <p className="text-lg"><strong>Color:</strong> {koiFish.color}</p>
              <p className="text-lg"><strong>Daily Feed Amount:</strong> {koiFish.dailyFeedAmount}g</p>
              <p className="text-lg"><strong>Personality:</strong> {koiFish.personality}</p>
              <p className="text-lg"><strong>Origin:</strong> {koiFish.origin}</p>
              <p className="text-lg"><strong>Selection Rate:</strong> {koiFish.selectionRate}</p>
              <p className="text-lg text-gray-800"><strong>Species:</strong> {koiFish.species}</p>
            </div>

            <div className="mt-6 flex space-x-4">
              <button className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-800 transition duration-300">Add to Cart</button>
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-900 transition duration-300">Payment</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for viewing larger image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-3xl w-full p-4">
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="w-full h-auto max-h-screen object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDetailsPage;
