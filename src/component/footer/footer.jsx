import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-orange-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-bold text-orange-600 mb-4">Kodama Koi Farm</h3>
            <p className="text-gray-600">
              Kodama Koi Farm is the premier destination for quality Japanese koi fish for sale. We are the largest importer of Koi in North America. We specialize in raising champion koi!
            </p>
            <p className="text-gray-600 mt-2">P.O. Box 893086, Mililani HI 96789</p>
            <p className="text-gray-600">Hours of Operation: Mon-Fri, 7:00 a.m. - 3:00 p.m. HST</p>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-bold text-orange-600 mb-4">Contact Us</h3>
            <p className="text-gray-600 flex items-center">
              <FaPhoneAlt className="mr-2" /> +1 (833) Koi Love (1-833-564-5683)
            </p>
            <p className="text-gray-600 flex items-center mt-2">
              <FaEnvelope className="mr-2" /> info@kodamakoi.com
            </p>
            <p className="text-gray-600">Help: info@kodamakoi.com</p>
          </div>

          {/* Account Information Section */}
          <div>
            <h3 className="text-lg font-bold text-orange-600 mb-4">Account Information</h3>
            <ul className="text-gray-600">
              <li><a href="/account/welcome">Welcome!</a></li>
              <li><a href="/account">My Account</a></li>
              <li><a href="/account/reset-password">Reset Password</a></li>
              <li><a href="/account/lost-password">Lost Password</a></li>
              <li><a href="/account/edit">Edit Account</a></li>
              <li><a href="/account/add-payment">Add Payment Method</a></li>
            </ul>
          </div>

          {/* For Koi Lovers Section */}
          <div>
            <h3 className="text-lg font-bold text-orange-600 mb-4">For Koi Lovers!</h3>
            <ul className="text-gray-600">
              <li><a href="/koi/nishikigoi">What is a Nishikigoi?</a></li>
              <li><a href="/koi/cost">How Much Do Koi Fish Cost?</a></li>
              <li><a href="/koi/care">How To Care For Your Koi Fish</a></li>
              <li><a href="/koi/pond-types">Types of Pond Fish</a></li>
              <li><a href="/koi/quarantine">Koi Quarantine Tank Setup</a></li>
              <li><a href="/koi/health">HELP, Is My Koi Sick?!?</a></li>
              <li><a href="/koi/move">How Can I Move My Koi Fish?</a></li>
              <li><a href="/koi/benefits-salt">Benefits of Salt in Koi Pond</a></li>
              <li><a href="/koi/medicated-food">Make Medicated Koi Food at Home</a></li>
              <li><a href="/koi/winter-survival">Koi Pond Winter Survival Guide</a></li>
              <li><a href="/koi/profit">Raising Koi Fish for Profit</a></li>
              <li><a href="/koi/show-prep">Koi Show Preparation Tips</a></li>
            </ul>
          </div>
        </div>

        {/* Payment Logos Section */}
        <div className="flex justify-center mt-8">
          <img
            src="/path-to-your-image.png"  // Replace with the correct path to your image
            alt="Visa, MasterCard, Discover"
            className="h-12"
          />
        </div>

        <div className="border-t border-orange-300 mt-8 pt-4 text-center text-gray-600">
          <p>© 2024 Kodama Koi Farm. All rights reserved.</p>
          <div className="flex justify-center mt-4 space-x-4">
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
    </footer>
  );
}

export default Footer;
