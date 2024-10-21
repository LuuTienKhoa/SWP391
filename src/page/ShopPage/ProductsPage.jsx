import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Button from "../../component/button/Button";
import ShoppingCart from "../../component/ShoppingCart";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { ShoppingBagIcon } from "lucide-react";
import ComparisonCart from "../../component/Comparison";
import Pagination from '../../component/Pagination';
const ProductsPage = () => {
  const [koiFishs, setKoiFishs] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [compareItems, setCompareItems] = useState(() => {
    const savedCompare = localStorage.getItem("compareItems");
    return savedCompare ? JSON.parse(savedCompare) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [ageRange, setAgeRange] = useState([0, 10]);
  const [priceRange, setPriceRange] = useState([0, 1000000000]);
  const [sizeRange, setSizeRange] = useState([0, 100]);
  const [color, setColor] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  //Pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8); // Number of batches per page
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = koiFishs.slice(firstPostIndex, lastPostIndex);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchKoiFish = useCallback(async () => {
    try {
      const endpoint = "/koi/Koi/Filter";
      const params = new URLSearchParams({
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
        minAge: ageRange[0].toString(),
        maxAge: ageRange[1].toString(),
        minSize: sizeRange[0].toString(),
        maxSize: sizeRange[1].toString(),
      });

      if (color) {
        params.append("color", color);
      }

      if (searchQuery) {
        params.append("name", searchQuery);
      }

      const response = await api.get(`${endpoint}?${params.toString()}`);
      let sortedData = response.data;

      if (sortOrder !== "normal") {
        sortedData = sortedData.sort((a, b) => {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        });
      }

      setKoiFishs(sortedData);
    } catch (error) {
      console.error("Error fetching koi fish:", error);
      alert(
        "Failed to fetch koi fish. Please check the console for more details."
      );
    }
  }, [priceRange, ageRange, sizeRange, color, searchQuery, sortOrder]);

  useEffect(() => {
    if (location.pathname === "/products") {
      fetchKoiFish();
    }
  }, [
    location,
    searchQuery,
    sortOrder,
    ageRange,
    priceRange,
    sizeRange,
    color,
    fetchKoiFish,
  ]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("compareItems", JSON.stringify(compareItems));
  }, [compareItems]);

  const handleAddToCart = (koiFish) => {
    setCartItems((prevItems) => [...prevItems, koiFish]);
    alert(`${koiFish.name} has been added to cart`);
  };

  const handleRemoveFromCart = (koiFishId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.koiID !== koiFishId)
    );
  };

  const handleCompare = (koiFish) => {
    setCompareItems((prevItems) => {
      if (prevItems.find((item) => item.koiID === koiFish.koiID)) {
        return prevItems.filter((item) => item.koiID !== koiFish.koiID);
      } else if (prevItems.length < 2) {
        return [...prevItems, koiFish];
      }
      return prevItems;
    });
  };

  const handleRemoveFromCompare = (koiFishId) => {
    setCompareItems((prevItems) =>
      prevItems.filter((item) => item.koiID !== koiFishId)
    );
  };

  const handleCompareNow = () => {
    if (compareItems.length === 2) {
      navigate("/products/comparison");
      console.log("Comparing items:", compareItems);
    }
  };

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  const handleNavigateToPayment = (koiFish) => {
    navigate(`/payment/${koiFish.koiID}`, { state: { koiFish } });
  };

  const availableColors = ["Red", "Black", "Orange", "White", "Blue", "Yellow"];

  return (
    <div className="bg-orange-100 min-h-screen">
      <div className="container mx-auto px-4 py-7">
        <div className="w-full text-5xl mb-2 flex flex-col items-center">
          <h1>F Koi Shop</h1>
        </div>

        <div className="flex justify-between items-center mb-8 p-4">
          {/* Search by Title */}
          <div className="flex-1 mr-4">
            <input
              type="text"
              placeholder="Search koi fish by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={() => setFilterVisible(!filterVisible)}
              className={`px-4 py-2 rounded ${
                filterVisible ? "bg-orange-600" : "bg-orange-400"
              }`}
            >
              Filter
            </Button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center  text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition duration-300"
            >
              <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {filterVisible && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 p-4 border rounded-lg bg-gray-50">
            {/* Search by Color */}
            <div>
              <label className="font-bold">Search by color:</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">All Colors</option>
                {availableColors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Search by Size */}
            <div>
              <label className="font-bold">Search by size (cm):</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  inputMode="numeric"
                  value={sizeRange[0]}
                  onChange={(e) => setSizeRange([e.target.value, sizeRange[1]])}
                  onBlur={(e) => setSizeRange([+e.target.value, sizeRange[1]])}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Min"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  value={sizeRange[1]}
                  onChange={(e) => setSizeRange([sizeRange[0], e.target.value])}
                  onBlur={(e) => setSizeRange([sizeRange[0], +e.target.value])}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Search by Price */}
            <div>
              <label className="font-bold">Search by price ($):</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  inputMode="numeric"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([e.target.value, priceRange[1]])
                  }
                  onBlur={(e) =>
                    setPriceRange([+e.target.value, priceRange[1]])
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Min"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], e.target.value])
                  }
                  onBlur={(e) =>
                    setPriceRange([priceRange[0], +e.target.value])
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4 p-4">
          <button
            onClick={toggleCartVisibility}
            className="flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-600 text-white border-none rounded-full px-6 py-3 shadow-lg hover:from-orange-500 hover:to-orange-700 transition duration-300 transform hover:scale-105"
          >
            <span className="mr-2">🔄</span>{" "}
            {/* Replace with an icon if needed */} So sánh (
            {compareItems.length})
          </button>
          <div className="flex justify-end ">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
            >
              <option value="normal">Price</option>
              <option value="asc">Price: Ascending</option>
              <option value="desc">Price: Descending</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {koiFishs.map((koiFish) => (
            <div key={koiFish.koiID} className="max-w-xs overflow-hidden">
              <Link to={`/view-details/${koiFish.koiID}`}>
                <img
                  src={
                    koiFish.image ??
                    "https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0503s054-re-260x421.jpg"
                  }
                  alt={koiFish.name}
                  className="w-full h-100 object-cover"
                />
              </Link>
              <div className="p-4">
                <h1 className="text-lg font-semibold">{koiFish.name}</h1>
                <p className="text-sm text-gray-500">#{koiFish.koiID}</p>
                <p className="text-red-500 font-bold mt-2">
                  Price: ${koiFish.price.toFixed(2) || "N/A"}
                </p>

                <div className="mt-4">
                  <p className="text-sm">
                    <strong>Age:</strong> {koiFish.age || "Unknown"}
                  </p>
                  <p className="text-sm">
                    <strong>Sex:</strong> {koiFish.gender || "Unknown"}
                  </p>
                  <p className="text-sm">
                    <strong>Size:</strong> {koiFish.size || "Unknown"}
                  </p>
                  <p className="text-sm">
                    <strong>Color:</strong> {koiFish.color || "Unknown"}
                  </p>
                  <p className="text-red-500 text-sm">
                    <strong>Specie:</strong> {koiFish.species || "Unknown"}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleAddToCart(koiFish)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
                  >
                    <ShoppingBagIcon className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleNavigateToPayment(koiFish)}
                    className="bg-white text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-100 transition duration-300"
                  >
                    Pay Now
                  </button>
                  <button
                    onClick={() => handleCompare(koiFish)}
                    className={`px-4 py-2 rounded ${
                      compareItems.find((item) => item.koiID === koiFish.koiID)
                        ? "bg-blue-600"
                        : "bg-blue-400"
                    }`}
                  >
                    {compareItems.find((item) => item.koiID === koiFish.koiID)
                      ? "Remove from Compare"
                      : "Compare"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isCartVisible && (
          <ComparisonCart
            compareItems={compareItems}
            onRemove={handleRemoveFromCompare}
            onCompare={handleCompareNow}
            onClose={toggleCartVisibility}
          />
        )}

        {/* Shopping Cart Dialog */}
        <ShoppingCart
          open={cartOpen}
          setOpen={setCartOpen}
          products={cartItems}
          onRemove={handleRemoveFromCart} // Pass the function here
        />
      </div>

      <Pagination
        totalPosts={koiFishs.length}
        postPerPage={postsPerPage}
        paginate={paginate}
      />
    </div>
  );
};

export default ProductsPage;
