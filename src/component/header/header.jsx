import React from 'react'
import {Link} from 'react-router-dom'
function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-orange-800"> {/* Flex container */}
      <div className="flex items-center"> {/* Logo container */}
        <img src="/path/to/logo.png" alt="Logo" className="text-white h-8 w-auto mr-4" /> {/* Adjust path and size */}
      </div>
      <ul className="flex space-x-12 mx-auto"> {/* Centered links */}
        <li>
          <Link to="/" className="text-orange-200 hover:underline">Home</Link>
        </li>
        <li>
          <Link to="/about" className="text-orange-200 hover:underline">About</Link>
        </li>
        <li>
          <Link to="/products" className="text-orange-200 hover:underline">Shop</Link>
        </li>
        <li>
          <Link to="/question" className="text-orange-200 hover:underline">FAQ</Link>
        </li>
      </ul>
      <div>
        <Link to="/login" className="text-orange-200 hover:underline">Login</Link> {/* Right-aligned Login */}
      </div>
    </header>
  )
}
export default Header