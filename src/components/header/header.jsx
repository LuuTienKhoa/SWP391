import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { IoLogInOutline } from "react-icons/io5";
import { FaHome, FaInfoCircle, FaFish, FaLayerGroup, FaClipboard, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaCaretDown, } from "react-icons/fa"; // Icon for dropdown
import api from "../../config/axios";
import UserContext from "../../context/userContext";
import { GiFishBucket } from 'react-icons/gi';
function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, userId, role, setRole } = useContext(UserContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const dropdownRef = useRef(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isLoggedIn) {
        try {
          const response = await api.get("/User/CusProfile");
          setLoyaltyPoints(response.data.loyaltyPoints);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [isLoggedIn]);

  // Handle user logout
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await api.post("/User/logout", refreshToken, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");

      setIsLoggedIn(false);
      setRole(null);

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="sticky top-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-md flex justify-between items-center px-8 py-4 text-white z-50">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8" />
        </Link>
        <span className="text-2xl font-bold">FKoi Boys</span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-8">
        <Link to="/" className="flex items-center space-x-2 hover:text-gray-300">
          <FaHome />
          <span>Home</span>
        </Link>
        <Link to="/about" className="flex items-center space-x-2 hover:text-gray-300">
          <FaInfoCircle />
          <span>About</span>
        </Link>
        <Link to="/products" className="flex items-center space-x-2 hover:text-gray-300">
          <FaFish />
          <span>Fish</span>
        </Link>
        <Link to="/koiBatch" className="flex items-center space-x-2 hover:text-gray-400">
          <GiFishBucket size={20} />
          <span>Batch</span>
        </Link>
        <Link to="/Consign" className="flex items-center space-x-2 hover:text-gray-300">
          <FaClipboard />
          <span>Consign</span>
        </Link>
      </nav>

      {/* Social Media & Cart */}
      <div className="flex items-center space-x-4">
        {/* Social Icons */}
        <a href="https://facebook.com" className="hover:text-blue-500">
          <FaFacebook size={20} />
        </a>
        <a href="https://instagram.com" className="hover:text-pink-400">
          <FaInstagram size={20} />
        </a>
        <a href="https://twitter.com" className="hover:text-blue-300">
          <FaTwitter size={20} />
        </a>

        {/* Account Dropdown */}
        {isLoggedIn && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-1 text-gray-300 hover:text-gray-400 focus:outline-none"
            >
              <span>Account</span>
              <FaCaretDown />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                {role !== "1" && role !== "0" && (
                  <>
                    <Link
                      to="/order"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Order
                    </Link>
                    <Link
                      to="/consigned"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Consign
                    </Link>
                    <Link
                      to="/your-koi"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Koi
                    </Link>
                    <Link
                      to="/redeemLoyaltyPoints"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Redeem Points
                    </Link>
                    <span className="block px-4 py-2 text-sm text-gray-400">
                      Loyalty Points: {loyaltyPoints}
                    </span>
                  </>
                )}
                {role === "1" && (
                  <Link
                    to="/staff"
                    className="block px-4 py-2 hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Staff
                  </Link>
                )}
                {role === "0" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Login Button */}
        {!isLoggedIn && (
          <Link to="/login" className="text-gray-300 hover:text-gray-400 flex items-center">
            Login
            <IoLogInOutline className="ml-1" />
          </Link>
        )}
      </div>
    </header>
  );
}


export default Header;
