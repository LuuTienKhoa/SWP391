import React from 'react'
import HeroSection from '../component/HeroSection'
import backgroundImage from '../assets/bg.jpg'
function HomePage (){
  return (
    <>
    <div className="bg-orange-200 min-h-screen">
      <div className="max-w-5xl mx-auto pt-20 px-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        maxWidth:'100%',
        backgroundRepeat:'no-repeat',
        backgroundSize:'cover',
      }}
      >
    <HeroSection />    
    </div>
    <div>HomePage</div>
    </div>
    
    </>    
  )
}
 export default HomePage
