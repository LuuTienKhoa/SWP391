import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";

const ViewDetailsPage = () => {
  const { id } = useParams(); // Get koiID from the URL
  const [koiFish, setKoiFish] = useState(null);

  useEffect(() => {
    const fetchKoiFishDetails = async () => {
      try {
        const response = await api.get(`/koi/Koi/${id}`);
        setKoiFish(response.data);
      } catch (error) {
        console.error("Error fetching koi fish details:", error);
      }
    };

    fetchKoiFishDetails();
  }, [id]);

  if (!koiFish) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 ">
      <div className="bg-white rounded-lg shadow-lg p-6 md:flex md:space-x-8">
        <div className="md:w-1/2 flex flex-col justify-bewteen items-center ">
        <img 
          src={koiFish.image ?? "https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0503s054-re-260x421.jpg"
          }
          alt={koiFish.name}
          className="w-full h-auto max-w-xs object-cover rounded-md "
          />
          </div>
        <div className="p-4">
        <h2 className="text-3xl font-semibold mb-2">{koiFish.name} - #{koiFish.koiID}</h2>
          <p className="text-xl"><strong>Gender:</strong> {koiFish.gender}</p>
          <p className="text-xl"><strong>Age:</strong> {koiFish.age} years</p>
          <p className="text-xl"><strong>Size:</strong> {koiFish.size}</p>
          <p className="text-xl"><strong>Color:</strong> {koiFish.color}</p>
          <p className="text-xl"><strong>Daily Feed Amount:</strong> {koiFish.dailyFeedAmount}</p>
          <p className="text-xl"><strong>Personality:</strong> {koiFish.personality}</p>
          <p className="text-xl"><strong>Origin:</strong> {koiFish.origin}</p>
          <p className="text-xl"><strong>Selection Rate:</strong> {koiFish.selectionRate}</p>
          <p className="text-xl"><strong>Species:</strong> {koiFish.species}</p>
          
          <p className="text-2xl font-bold text-red-600 bg-yellow-200 p-2 rounded shadow-lg">Price: ${koiFish.price.toFixed(2)}</p>
          </div>
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsPage;
