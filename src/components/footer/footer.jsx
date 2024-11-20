import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-200 mb-4" style={{ fontFamily: 'sans-serif' }}>
              Kodama Koi Farm
            </h3>
            <p className="text-gray-400">
              F Koi farm is a new Koi Farm at Sai Gon, it provides a variety of koi types. Our location is Khu Cong Nghe Cao.
            </p>
            <p className="mt-2 text-gray-400">P.O. Box 893086, Mililani HI 96789</p>
            <p className="text-gray-400">Hours of Operation: Mon-Fri, 7:00 a.m. - 3:00 p.m. HST</p>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-200 mb-4" style={{ fontFamily: 'sans-serif' }}>
              Contact Us
            </h3>
            <p className="flex items-center text-gray-400">
              <FaPhoneAlt className="mr-2" /> +1 (833) Koi Love (1-833-564-5683)
            </p>
            <p className="flex items-center mt-2 text-gray-400">
              <FaEnvelope className="mr-2" /> info@fkoi.com
            </p>
            <p className="text-gray-400">Help: info@fkoi.com</p>
          </div>

          {/* Account Information Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-200 mb-4" style={{ fontFamily: 'sans-serif' }}>
              Account Information
            </h3>
            <ul className="text-gray-400">
              <li><a href="/" className="hover:text-orange-500">Welcome!</a></li>
              <li><a href="/account" className="hover:text-orange-500">My Account</a></li>
              <li><a href="/account/reset-password" className="hover:text-orange-500">Reset Password</a></li>
              <li><a href="/account/lost-password" className="hover:text-orange-500">Lost Password</a></li>
              <li><a href="/account/edit" className="hover:text-orange-500">Edit Information</a></li>
            </ul>
          </div>

          {/* For Koi Lovers Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-200 mb-4" style={{ fontFamily: 'sans-serif' }}>
              For Koi Lovers!
            </h3>
            <ul className="text-gray-400">
              <li><a href="/koi/nishikigoi" className="hover:text-orange-500">What is a Nishikigoi?</a></li>
              <li><a href="/koi/cost" className="hover:text-orange-500">How Much Do Koi Fish Cost?</a></li>
              <li><a href="/koi/pond-types" className="hover:text-orange-500">Types of Pond Fish</a></li>
              <li><a href="/koi/benefits-salt" className="hover:text-orange-500">Benefits of Salt in Koi Pond</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-900 text-center py-4">
        <p className="text-gray-400">© 2024 FKoi Farm. All rights reserved.</p>
        <div className="flex justify-center mt-4 space-x-4">
          <a href="https://facebook.com" className="text-gray-400 hover:text-orange-500">
            <FaFacebook size={24} />
          </a>
          <a href="https://instagram.com" className="text-gray-400 hover:text-orange-500">
            <FaInstagram size={24} />
          </a>
          <a href="https://twitter.com" className="text-gray-400 hover:text-orange-500">
            <FaTwitter size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
