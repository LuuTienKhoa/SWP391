import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { IoLogInOutline } from "react-icons/io5";
import api from "../../config/axios";
import UserContext from "../../context/userContext";


function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, role, setRole } = useContext(UserContext);

  // Handle user logout
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await api.post("/User/logout", refreshToken, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');

      setIsLoggedIn(false); 
      setRole(null);

      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-400 to-amber-900">
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-10" />
        </Link>
      </div>
      <ul className="hidden md:flex space-x-8 text-lg">
        <li>
          <Link to="/" className="text-white hover:underline">Home</Link>
        </li>
        <li>
          <Link to="/about" className="text-white hover:underline">About</Link>
        </li>
        <li>
          <Link to="/products" className="text-white hover:underline">Shop</Link>
        </li>
        <li>
          <Link to="/question" className="text-white hover:underline">FAQ</Link>
        </li>
        {isLoggedIn && role === '0' && (
          <li>
            <Link to="/admin" className="text-white hover:underline">Admin</Link>
          </li>
        )}
      </ul>
      <div className="flex items-center space-x-6">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-white hover:underline">Logout</button>
        ) : (
          <Link to="/login" className="text-white hover:underline flex items-center">
            Login
            <IoLogInOutline className="ml-1" />
          </Link>
        )}
      </div>
    </header>
  );
}
export default Header
