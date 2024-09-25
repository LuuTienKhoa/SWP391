import React from 'react'
import HeroSection from '../component/HeroSection'
import backgroundImage from '../assets/herosection.jpg'
import Testinominals from './Testinominals'
import OurAdvantage from '../component/OurAdvantage'
function HomePage (){
  return (
    <>
    <div className="bg-orange-200 min-h-screen">
      <div className="max-w-2xl mx-auto pt-20 px-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        maxWidth:'100%',
        backgroundSize:'cover',
      }}
      >
    <HeroSection />    
    </div>
    <div>HomePage</div>
    <OurAdvantage />
    <Testinominals />
    </div>
    </>    
  )
}
 export default HomePage
