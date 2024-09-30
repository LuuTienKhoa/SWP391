import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Footer (){
  return (
    <footer className="bg-orange-200 pt-20">
      <hr className="border-t-2 border-orange-500 my-8"/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-bold text-orange-600 mb-4">About F Koi Farm</h3>
            <p className="text-gray-600">
              We are the leading provider of high-quality Japanese koi, handpicked from the best breeders in Japan. Our farm ensures that each koi is cared for with passion and expertise.
            </p>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-bold text-orange-600 mb-4">Contact Us</h3>
            <p className="text-gray-600 flex items-center">
              <FaPhoneAlt className="mr-2" /> +1 (833) Koi Love (1-833-564-5683)
            </p>
            <p className="text-gray-600 flex items-center mt-2">
              <FaEnvelope className="mr-2" /> info@fkoi.com
            </p>
            <p className="text-gray-600 mt-2">123 Koi St, Pond City, TX 78901</p>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-lg font-bold text-orange-600 mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Sign up for our newsletter to receive 10% off your first purchase and stay updated on the latest offers and news.
            </p>
            <form>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full p-2 rounded-md border border-gray-300 mb-4"
              />
              <button className="bg-orange-500 text-white py-2 px-4 w-full rounded-md hover:bg-orange-600 transition-all">
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Media Links Section */}
          <div>
            <h3 className="text-lg font-bold text-orange-600 mb-4">Follow Us</h3>
            <p className="text-gray-600 mb-4">Follow us on social media for updates, tips, and koi care information.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-orange-600 hover:text-orange-800">
                <FaFacebook size={24} />
              </a>
              <a href="https://instagram.com" className="text-orange-600 hover:text-orange-800">
                <FaInstagram size={24} />
              </a>
              <a href="https://twitter.com" className="text-orange-600 hover:text-orange-800">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-orange-300 mt-8 pt-4 text-center text-gray-600">
          <p>© 2024 F Koi Farm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
