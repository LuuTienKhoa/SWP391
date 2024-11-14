import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import ShoppingCart from "../../components/ShoppingCart";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { ShoppingBagIcon } from "lucide-react";
import ComparisonCart from "../../components/Comparison";
import Pagination from "../../components/Pagination";
import { FiRefreshCw } from "react-icons/fi";
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
  const [sortOrder, setSortOrder] = useState("normal");
  const [cartOpen, setCartOpen] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name"); 

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = koiFishs.slice(firstPostIndex, lastPostIndex);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const navigate = useNavigate();

  const fetchKoiFish = useCallback(async () => {
    try {
      const endpoint = "/koi/Koi/available";
      const response = await api.get(endpoint);
      let sortedData = response.data;

      if (sortOrder !== "normal") {
        sortedData = sortedData.sort((a, b) => {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        });
      }

      if (searchTerm) {
        sortedData = sortedData.filter((fish) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            fish.name.toLowerCase().includes(searchLower) ||
            fish.species.toLowerCase().includes(searchLower) ||
            (fish.origin && fish.origin.toLowerCase().includes(searchLower)) ||
            fish.color.toLowerCase().includes(searchLower)
          );
        });
      }

      setKoiFishs(sortedData);
    } catch (error) {
      console.error("Error fetching koi fish:", error);
      alert("Failed to fetch koi fish. Please check the console for more details.");
    }
  }, [sortOrder, searchTerm]);

  useEffect(() => {
    fetchKoiFish();
  }, [sortOrder, fetchKoiFish, searchTerm]);

  // Update search term
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on a new search
  };
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
    setCartItems((prevItems) => prevItems.filter((item) => item.koiID !== koiFishId));
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
    setCompareItems((prevItems) => prevItems.filter((item) => item.koiID !== koiFishId));
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
    const id = koiFish.consignmentKoiID || koiFish.koiID;
    navigate(`/payment/${id}`, { state: { koiFish } });
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="container mx-auto px-4 py-7">
        <div className="text-4xl font-bold mb-6 text-center">
          <h1>F Koi Shop</h1>
        </div>

        {/* Sort and Compare */}
        <div className="flex justify-between items-center mb-4 p-4">
          <button
            onClick={toggleCartVisibility}
            className="flex items-center justify-center bg-black text-white border-none rounded-full px-6 py-3 shadow-lg hover:bg-gray-900 transition duration-300 transform hover:scale-105"
          >
            <FiRefreshCw className="mr-2 text-white" size={20} /> 
            Compare ({compareItems.length})
          </button>

          <div className="flex justify-end items-center">
          
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center text-black px-4 py-2 rounded hover:bg-gray-100 transition duration-300"
            >
              <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-black rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
 
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4">
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
            <button
              onClick={() => setSearchType("name")}
              className={`p-2 rounded-lg ${searchType === "name" ? "bg-gray-800 text-white" : "bg-gray-300"}`}
            >
              Name
            </button>
            <button
              onClick={() => setSearchType("species")}
              className={`p-2 rounded-lg ${searchType === "species" ? "bg-gray-800 text-white" : "bg-gray-300"}`}
            >
              Species
            </button>
            <button
              onClick={() => setSearchType("origin")}
              className={`p-2 rounded-lg ${searchType === "origin" ? "bg-gray-800 text-white" : "bg-gray-300"}`}
            >
              Origin
            </button>
            <button
              onClick={() => setSearchType("color")}
              className={`p-2 rounded-lg ${searchType === "color" ? "bg-gray-800 text-white" : "bg-gray-300"}`}
            >
              Color
            </button>
          </div>

          <input
            type="text"
            placeholder={`Search by ${searchType}`}
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-3 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 bg-white w-full max-w-lg"
          />

          <div className="flex justify-end items-center mt-4 sm:mt-0">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-3 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 bg-white ml-4"
            >
              <option value="normal">Price</option>
              <option value="asc">Price: Ascending</option>
              <option value="desc">Price: Descending</option>
            </select>
          </div>
        </div>


        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((koiFish) => (
            <div
              key={koiFish.koiID}
              className="max-w-xs overflow-hidden border border-black rounded-lg shadow-lg"
            >
              <Link
                to={
                  koiFish.consignmentKoiID
                    ? `/view-detail/consignmentKoi/${koiFish.consignmentKoiID}`
                    : `/view-detail/koi/${koiFish.koiID}`
                }
              >
                <img
                  src={
                    koiFish.image ??
                    "https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0503s054-re-260x421.jpg"
                  }
                  alt={koiFish.name}
                  className="w-full h-auto max-h-80 object-contain border-b border-black"
                />
              </Link>
              <div className="p-4">
                <h1 className="text-lg font-semibold text-black">{koiFish.name}</h1>
                <p className="text-sm text-gray-500">#{koiFish.koiID || koiFish.consignmentKoiID}</p>
                <p className="text-gray-700 font-bold mt-2">Price: {formatCurrency(koiFish.price)}</p>

                <div className="mt-4 space-y-1">
                  <p className="text-sm"><strong>Age:</strong> {koiFish.age || "Unknown"}</p>
                  <p className="text-sm"><strong>Sex:</strong> {koiFish.gender || "Unknown"}</p>
                  <p className="text-sm"><strong>Size:</strong> {koiFish.size || "Unknown"}cm</p>
                  <p className="text-sm"><strong>Color:</strong> {koiFish.color || "Unknown"}</p>
                  <p className="text-sm"><strong>Species:</strong> {koiFish.species || "Unknown"}</p>
                </div>

                {/* Button Group */}
                <div className="flex flex-col space-y-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(koiFish)}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300 flex items-center justify-center font-medium"
                  >
                    <ShoppingBagIcon className="mr-2 h-5 w-5" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleNavigateToPayment(koiFish)}
                    className="bg-white text-black border border-black px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300 font-medium"
                  >
                    Pay Now
                  </button>

                  <button
                    onClick={() => handleCompare(koiFish)}
                    className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${compareItems.find((item) => item.koiID === koiFish.koiID)
                        ? "bg-gray-800 text-white hover:bg-gray-900"
                        : "bg-gray-500 text-white hover:bg-gray-600"
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
          onRemove={handleRemoveFromCart}
        />
      </div>

      <Pagination totalPosts={koiFishs.length} postPerPage={postsPerPage} paginate={paginate} />
    </div>
  );
};

export default ProductsPage;
