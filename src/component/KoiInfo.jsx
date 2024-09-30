import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import '../assets/wave.css';

const KoiInfo = () => {
  const navigate = useNavigate();  // Initialize useNavigate

  return (
    <>
      {/* Main Info Section */} 
<div className="text-center pt-5">
  <h1>Welcome to F Koi Farm: Our First Koi Shop</h1>
  <p>
    Discover the beauty of our world-class koi collection at F Koi Farm’s very first Koi Shop! 
    Whether you're new to koi keeping or an experienced enthusiast, our shop offers a wide selection of handpicked koi straight from Japan. 
    Browse our koi collection and find the perfect addition to your pond, all available for purchase online.
  </p>
  <p>
    At F Koi Farm, we focus on delivering healthy, high-quality koi fish, carefully raised in pristine conditions. 
    <button onClick={() => navigate('/register')}>
     Sign Up
    </button> 
    <span>{" "}or{" "}</span>
    <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-orange-400 to-orange-700 text-transparent bg-clip-text">
     Log In
    </button> 
    <span>{" "}to access our full range of koi, including exclusive offers for registered members. Start building your dream koi pond with our beautiful selection.</span>
  </p>

  {/* Buttons for Login, Sign Up, View All Koi */}
  <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
    <button 
      className="py-2.5 px-5"
      onClick={() => navigate('/login')}  
    >
      Login
    </button>
    <button 
      className="py-2.5 px-5"
      onClick={() => navigate('/register')}  
    >
      Sign Up
    </button>
    <button 
      className="py-2.5 px-5" 
      onClick={() => navigate('/koi-list')}  
    >
      View All Koi
    </button>
  </div>
</div>

      {/* Wave Section */}
      <section className="relative w-full h-[30vh] bg-orange-400 overflow-hidden">
        {/* Waves */}
        <div className="wave wave1 animate-animate z-[1000] opacity-100 bottom-0"></div>
        <div className="wave wave2 animate-animate2 z-[999] opacity-50 bottom-0"></div>
        <div className="wave wave3 animate-animate z-[1000] opacity-100 bottom-[10px]"></div>
        <div className="wave wave4"></div>
      </section>
    </>
  );
};

export default KoiInfo;
