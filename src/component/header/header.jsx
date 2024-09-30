import React from 'react'
import {Link} from 'react-router-dom'
import logo from '../../assets/logo.png'
import { IoLogInOutline } from "react-icons/io5";
function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-400 to-amber-900"> 
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10" /> 
      </div>
      <ul className="hidden md:flex space-x-8 text-lg"> 
        <li>
          <Link to="/" className="text-white hover:underline">Home</Link>
        </li>
        <li>
          <Link to="/about" className="text-white hover:underline">About</Link>
        </li>
        <li>
          <Link to="/shop" className="text-white hover:underline">Shop</Link>
        </li>
        <li>
          <Link to="/question" className="text-white hover:underline">FAQ</Link>
        </li>
      </ul>
      <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-6">
        <Link to="/login" className="text-white hover:underline flex items-center">
          Login 
          <IoLogInOutline className="ml-1 " /> 
        </Link>
      </div>
      </div>
    </header>
  )
}
export default Header