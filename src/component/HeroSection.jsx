  import React from 'react'
  // import video1 from '../assets/video1.mp4'
  // import video2 from '../assets/video2.mp4'


  function HeroSection() {
    return (
      <div className="flex flex-col items-center justify-center"
      >
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Georgia&display=swap');
            .font-georgia {
              font-family: 'Georgia', serif; /* Apply Georgia font */
            }
          `}
        </style>
        <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20 font-bold whitespace-nowrap tracking-wide font-georgia">
          Dive into Perfection - Discover the Beauty of Koi
        </h1>
        <h2 className="text-white md:text-2xl py-5 whitespace-nowrap font-georgia">
          The best Japanese Koi shop in Vietnam
        </h2>
        <p className="mt-10 text-lg text-center text-neutral-600 max-w-4xl">
          Please call us at (012)-3445-789 or email us at fkoi@gmail.com
        </p>
        <div className="flex justify-center my-10 space-x-3">
          <a href="#" className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors py-3 px-6 mx-3 rounded-md">
            Create Account
          </a>
          <a href="#" className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors py-3 px-6 mx-3 rounded-md">
            View Koi for Sale
          </a>
        </div>

      </div>
    )
  }

  export default HeroSection