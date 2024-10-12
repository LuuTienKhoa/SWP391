import React from 'react'
import {Link} from 'react-router-dom'
import logo from '../../assets/logo.png'
import { IoLogInOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { reduxLogout } from '../../store/slices/authSlice';
function Header() {
  const dispatch = useDispatch();
  //Get the authentication from storre
  const{ isAuthenticated, userRole } = useSelector((state) => state.auth);
  const handleLogout = () =>{
    dispatch(reduxLogout());
  }

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
        {isAuthenticated && userRole === '0' &&(
          <li>
          <Link to="/admin" className="text-white hover:underline">Admin</Link>
        </li>
        )}        
      </ul>
      <div className="flex items-center space-x-6">
      {isAuthenticated ? (
          <button onClick={handleLogout} className="text-white hover:underline">
            Logout
          </button>
        ) : (
          // Otherwise, show the Login link
          <Link to="/login" className="text-white hover:underline flex items-center">
            Login
            <IoLogInOutline className="ml-1" />
          </Link>
        )}
      </div>
    </header>
  )
}
export default Header