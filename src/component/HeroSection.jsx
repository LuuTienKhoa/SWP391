import React from 'react'
// import video1 from '../assets/video1.mp4'
// import video2 from '../assets/video2.mp4'
import backgroundImage from '../assets/bg.jpg'

function HeroSection() {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
        <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Georgia&display=swap');
          .font-georgia {
            font-family: 'Georgia', serif; /* Apply Georgia font */
          }
        `}
        </style>
        <h1 className="text-white text-3xl md:text-4xl font-bold whitespace-nowrap font-georgia">
        Dive into Perfection - Discover the Beauty of Koi
        </h1>
        <h2 className="text-white text-xl mt-2 font-serif"> 
        The best Japanese Koi shop in Vietnam
        </h2>
    </div>
  )
}

export default HeroSection