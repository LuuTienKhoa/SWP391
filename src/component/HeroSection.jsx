import React from 'react';
import { Link } from 'react-router-dom'; 

function HeroSection() {
  return (
    <section className="relative bg-cover bg-center h-screen ">
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl text-center font-bold  tracking-wide pt-3">
          Kodama Koi Farm & Auction
        </h1>
        <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl text-center mt-4 tracking-wide ">
          The best Japanese koi for sale online and by phone!
        </h2>
        <div className="flex mt-8 space-x-4">
          <Link to="/shop" className="bg-white text-orange-600 font-semibold py-2 px-6 rounded-full hover:bg-orange-500 hover:text-white transition-all">
            View Koi for Sale
          </Link>
          <Link to="/login" className="bg-white text-orange-600 font-semibold py-2 px-6 rounded-full hover:bg-orange-500 hover:text-white transition-all">
            Create Account
          </Link>
        </div>
        <p className="mt-10 text-lg text-center text-neutral-200 max-w-4xl">
          Please call us at (012)-3445-789 or email us at fkoi@gmail.com
        </p>
      </div>
    </section>
  );
};

export default HeroSection
