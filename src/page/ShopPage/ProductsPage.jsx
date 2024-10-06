import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom"; // Add this import

const KoiFishProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [cart, setCart] = useState([]); // Cart state
  const [isCartOpen, setIsCartOpen] = useState(false); // Cart modal state

  useEffect(() => {
    // Load cart items from localStorage when the component mounts
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(savedCart);
    
    // Simulating API call to fetch products
    const fetchProducts = async () => {
      // In a real scenario, this would be an API call
      const dummyProducts = [
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

      ];
      setProducts(dummyProducts);
      setFilteredProducts(dummyProducts);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;
      const matchesColor =
        selectedColor === "" || product.color === selectedColor;
      const matchesSize = selectedSize === "" || product.size === selectedSize;
      const matchesCategory =
        selectedCategory === "" || product.category === selectedCategory;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesColor &&
        matchesSize &&
        matchesCategory
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "popularity") return b.popularity - a.popularity;
      return 0; // Default: no sorting
    });
    // Save cart items to localStorage whenever the cart changes
    localStorage.setItem("cartItems", JSON.stringify(cart));

    setFilteredProducts(sorted);
  }, [
    products,
    searchTerm,
    priceRange,
    selectedColor,
    selectedSize,
    selectedCategory,
    sortBy,
    cart,
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };
  const addToCart = (product) => {
    setCart((prev) => {
      const existingProduct = prev.find((item) => item.id === product.id);
      if (existingProduct) {
        // Item already exists in the cart, do not add again
        return prev; // Return the existing cart without changes
      }
      return [...prev, { ...product, quantity: 1 }]; // Add new item with quantity 1
    });
  };

  // Function to calculate total price of items in the cart
  const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Function to remove item from the cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const CartModal = ({ cartItems, onClose, removeFromCart, totalPrice }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-100">
        <h2 className="text-xl font-bold mb-2">Cart Items</h2>
        <ul>
          {cartItems.length === 0 ? (
            <li className="text-gray-500">Your cart is empty.</li>
          ) : (
            cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between mb-2"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-24 object-cover rounded"
                />
                <div className="flex-1 ml-2">
                  <span className="block font-semibold">{item.title}</span>
                  <span className="text-gray-500"> Price: ${item.price.toFixed(2)}</span>
                </div>
                <Link to={`/payment/${item.id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 m-3 rounded hover:bg-blue-600 transition duration-300">
                    Payment
                  </button>
                </Link>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold">Total Price: ${totalPrice.toFixed(2)}</span>
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            Close
          </button>
        </div>
        {/* Show Payment All button if total price is greater than 0 */}
        {totalPrice > 0 && (
          <Link to={{ pathname: "/payment", state: { cartItems } }}>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
              Payment All
            </button>
          </Link>
        )}
      </div>
    </div>
  );


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Koi Fish Products</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search Koi fish products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <div className="flex items-center">
          <button
            onClick={toggleFilterMenu}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-blue-600 transition duration-300"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="bg-white border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="popularity">Sort by Popularity</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </div>

      {isFilterMenuOpen && (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={toggleFilterMenu}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoMdClose size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block mb-2 font-medium">Price Range</label>
              <div className="flex items-center">
                <input
                  type="number"
                  name="min"
                  value={priceRange.min}
                  onChange={handlePriceRangeChange}
                  className="w-1/2 px-2 py-1 border rounded-l"
                  placeholder="Min"
                />
                <input
                  type="number"
                  name="max"
                  value={priceRange.max}
                  onChange={handlePriceRangeChange}
                  className="w-1/2 px-2 py-1 border rounded-r"
                  placeholder="Max"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium">Color</label>
              <select
                value={selectedColor}
                onChange={handleColorChange}
                className="w-full px-2 py-1 border rounded"
              >
                <option value="">All Colors</option>
                <option value="orange">Orange</option>
                <option value="black">Black</option>
                <option value="red">Red</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Size</label>
              <select
                value={selectedSize}
                onChange={handleSizeChange}
                className="w-full px-2 py-1 border rounded"
              >
                <option value="">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Category</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-2 py-1 border rounded"
              >
                <option value="">All Categories</option>
                <option value="ornamental">Ornamental</option>
                <option value="premium">Premium</option>
                <option value="standard">Standard</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300"
          >
            <Link to={`/view-details/${product.id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-100 object-cover"
              />
            </Link>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <span className="text-2xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>

              <div className="flex justify-between items-center">
                <Link to={`/payment/${product.id}`}>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300">
                    Payment
                  </button>
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No products found. Please try different filters.
        </div>
      )}

      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          <FaShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-2">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {isCartOpen && (
        <CartModal
          cartItems={cart}
          onClose={() => setIsCartOpen(false)}
          removeFromCart={removeFromCart}
          totalPrice={calculateTotalPrice(cart)} // Pass total price to CartModal
        />
      )}
    </div>
  );
};

export default KoiFishProducts;