import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../config/axios";

const KoiFishProducts = () => {
  const [koiFishs, setKoiFishs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedColors, setSelectedColors] = useState([]); // State for color filter
  const location = useLocation();
  const navigate = useNavigate();

  const fetchKoiFish = async () => {
    try {
      const response = await api.get("koi/Koi");
      setKoiFishs(response.data);
    } catch (error) {
      console.error("Error fetching koi fish:", error);
    }
  };

  useEffect(() => {
    if (location.pathname === "/products") {
      fetchKoiFish();
    }
  }, [location]);

  const handleAddToCart = async (koiFish) => {
    try {
      const response = await api.post("cart", {
        productId: koiFish.id,
        quantity: 1,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleColorChange = (color) => {
    setSelectedColors((prevSelectedColors) =>
      prevSelectedColors.includes(color)
        ? prevSelectedColors.filter((c) => c !== color)
        : [...prevSelectedColors, color]
    );
  };

  // Updated filtering logic to handle multiple colors
  const filteredAndSortedKoiFishs = useMemo(() => {
    return koiFishs
      .filter((koiFish) =>
        koiFish.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((koiFish) => {
        const koiColors = koiFish.color.toLowerCase().split(", "); // Split the color string into an array
        return selectedColors.length === 0 || selectedColors.some(color => koiColors.includes(color));
      })
      .sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
  }, [koiFishs, searchQuery, selectedColors, sortOrder]);

  const availableColors = ["red", "white", "black", "yellow", "blue", "orange"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search koi fish by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded"
        />

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="mb-4 p-2 bg-gray-200 rounded"
        >
          Sort by Price: {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      <div className="mb-4">
        <span className="font-bold">Filter by Color:</span>
        <div className="flex space-x-4 mt-2">
          {availableColors.map((color) => (
            <label key={color} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={color}
                onChange={() => handleColorChange(color)}
                checked={selectedColors.includes(color)}
              />
              <span className="capitalize">{color}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredAndSortedKoiFishs.map((koiFish) => (
          <div
            key={koiFish.koiID}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={koiFish.image}
              alt={koiFish.name}
              className="w-full h-100 object-cover"
            />
            <div className="p-4">
              <Link to={`/view-details/${koiFish.koiID}`}>
                <h2 className="text-xl font-semibold mb-2">{koiFish.name}</h2>
              </Link>
              <span className="text-2xl font-bold text-blue-600">
                ${koiFish.price.toFixed(2)}
              </span>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleAddToCart(koiFish)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                >
                  Add to Cart
                </button>
              
                <button
                  onClick={() => navigate("/payment")}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                >
                  Payment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KoiFishProducts;
