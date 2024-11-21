import React from 'react';
import aboutBg from '../assets/about_bg.jpg';
import fish from '../assets/koi1.jpg'; // Replace with your actual koi image path
import Koi2 from '../assets/Koi7.png'
import { Button } from 'antd';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div className="relative">
      {/* Background Section */}
      <div className="relative">
        <img
          src={aboutBg}
          alt="Family History"
          className="w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50">
          <h1 className="text-white text-5xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display SC, serif' }}>
            About Our Family History
          </h1>
        </div>
      </div>

      {/* Mission Statement Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Mission
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              To provide the highest quality koi fish while promoting sustainable breeding practices 
              and educating enthusiasts about the art and science of koi keeping.
            </p>
          </div>
        </div>
      </div>

      {/* First Content Section */}
      <div className="container mx-auto pt-16 pb-16 px-4 sm:px-8 lg:px-16 xl:px-20">
        <div className="flex flex-col lg:flex-row items-center lg:space-x-10 bg-white py-10">
          {/* Left side content */}
          <div className="w-full lg:w-2/3">
            <p className="text-lg mb-4" style={{ fontFamily: 'Georgia, serif', fontSize: '18px', lineHeight: '1.8' }}>
              Our journey into the world of koi began many years ago, inspired by a passion for these elegant creatures and a commitment to excellence. From humble beginnings, our family-run farm has grown to become a leading name in the koi industry, providing top-quality koi fish to enthusiasts around the globe.
            </p>

            <p className="text-lg mb-4" style={{ fontFamily: 'Georgia, serif', fontSize: '18px', lineHeight: '1.8' }}>
              We specialize in breeding and raising Nishikigoi, also known as Japanese Koi, renowned for their vivid colors and intricate patterns. Each fish we raise embodies the dedication and expertise passed down through generations of koi breeders.
            </p>

            <p className="text-lg mb-4" style={{ fontFamily: 'Georgia, serif', fontSize: '18px', lineHeight: '1.8' }}>
              Whether you're a hobbyist or a professional, our koi bring unmatched beauty and joy to ponds everywhere. We take pride in every koi we send to its new home, knowing it will provide a lifetime of happiness to its new owner.
            </p>
          </div>

          {/* Right side content with YouTube embed */}
          <div className="w-full lg:w-1/3 flex justify-center items-center">
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0, overflow: 'hidden', width: '100%' }}>
              <img
                className="absolute top-0 left-0 w-full h-full"
                src={Koi2}
              >              
              </img>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Breeding Program */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Breeding Program</h3>
              <p className="text-gray-600">
                Our selective breeding program focuses on developing exceptional koi with 
                superior genetics, vibrant colors, and distinct patterns.
              </p>
            </div>
            
            {/* Consulting Services */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Expert Consultation</h3>
              <p className="text-gray-600">
                Get professional advice on koi selection, pond management, and health care 
                from our experienced team.
              </p>
            </div>
            
            {/* Health Care */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Health Care</h3>
              <p className="text-gray-600">
                Regular health checks and maintenance services to ensure your koi remain 
                healthy and vibrant.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Content Section */}
      <div className="container mx-auto pt-5 pb-16 px-4 sm:px-8 lg:px-16 xl:px-20">
        <div className="flex flex-col lg:flex-row items-start lg:space-x-10 bg-white py-10">
          {/* Left side content */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display , serif' }}>
              Raised with precision and care, delivering unparalleled quality.
            </h2>
            <p className="text-lg mb-4" style={{ fontFamily: 'Georgia, serif', fontSize: '18px', lineHeight: '1.8' }}>
              We are committed to raising high-quality koi fish that exceed expectations. Each koi is raised under controlled conditions, ensuring they grow with the best health and vibrancy.
            </p>

            <p className="text-lg mb-4" style={{ fontFamily: 'Georgia, serif', fontSize: '18px', lineHeight: '1.8' }}>
              Our koi fish thrive in an environment designed to mimic their natural habitat, providing them with the ideal conditions to flourish. With each generation, we refine our techniques to produce koi that stand out for their unique patterns and colors.
            </p>

            <p className="text-lg mb-4 font-semibold" >
              Our koi offer a mesmerizing display of beauty, with vibrant colors and intricate designs that captivate the eye.
            </p>

            <h3 className="text-3xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display , serif' }}>What makes our koi special?</h3>
            <p className="text-lg mb-4" style={{ fontFamily: 'Georgia, serif', fontSize: '18px', lineHeight: '1.8' }}>
              Our koi are not just fish; they are living works of art. Carefully bred for their stunning patterns and colors, each koi is a unique masterpiece. Our selective breeding process ensures that only the most exceptional koi are available for your pond.
            </p>

            <button className="button-74 py-2 px-4 rounded mt-4">
              Discover More About Our Koi
            </button>
          </div>

          <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
            <img
              src={fish}  
              alt="Beautiful Koi"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Quality Commitment Section */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Quality Commitment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">Premium Bloodlines</h3>
                <p>Carefully selected breeding pairs to ensure exceptional offspring</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Advanced Facilities</h3>
                <p>State-of-the-art breeding and growing facilities</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Expert Care</h3>
                <p>Dedicated team of experienced koi professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Start Your Koi Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a beginner or an experienced collector, we're here to help you 
            find the perfect koi for your collection.
          </p>
          <div className="flex justify-center items-center gap-4">
            <Button type="primary" size="large">
              Contact Us
            </Button>
            <Link to="/products">
              <Button size="large">
                View Our Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AboutPage;
