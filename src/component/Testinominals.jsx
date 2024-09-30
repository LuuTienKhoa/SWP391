import React from 'react'
import { testimonials } from '../constants'
function Testinominals() {
  return (
    <>
      <div className="mt-20 tracking-wide">
        <h2 className="text-gray-700 text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20 font-thin">What people are saying</h2>
      </div>
      <div className="flex flex-wrap justify-center">
        {testimonials.map((testimonials, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2">
            <div className="bg-white border-solid rounded-md p-6  text-md">
              <p>{testimonials.text}</p>
              <div className="flex mt-8 items-start">
                <img
                  className="w-12 ml-5 h-12 rounded-full border border-neutral-300"
                  src={testimonials.image}
                  alt={testimonials.user}
                />
                <div className="ml-4 bo">
                  <h6>{testimonials.name}</h6>
                  <span className="text-sm  italic text-neutral-600">
                    {testimonials.company}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>

  );
}

export default Testinominals