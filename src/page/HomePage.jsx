import React from 'react';
import HeroSection from '../component/HeroSection';
import backgroundImage from '../assets/herosection.jpg';
import Testinominals from '../component/Testinominals';
import OurAdvantage from '../component/OurAdvantage';
import KoiInfo from '../component/KoiInfo';
import PreKoiInfo from '../component/PreKoiInfo'

function HomePage() {
  return (
    <>
      <div className="bg-orange-300 min-h-screen">
        {/* Hero Section - No padding applied here */}
        <div
          className="max-w-2xl mx-auto pt-20"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            maxWidth: '100%',
            backgroundSize: 'cover',
          }}
        >
          <HeroSection />
        </div>

        {/* Wrap sections that need padding */}
        <div className="px-4 sm:px-8 lg:px-16 xl:px-20">
          <PreKoiInfo />
          {/* Koi Info Section */}
          <KoiInfo />

          {/* Our Advantage Section */}
          <OurAdvantage />

          {/* Testimoninals Section */}
          <Testinominals />
        </div>
      </div>
    </>
  );
}

export default HomePage;
