import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroVideo from '../../assets/videos/hero-video.mp4';

const HeroVideo = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  return (
    <section className="relative w-full bg-[#fcf9f2]">
      <div className="container mx-auto px-4 md:px-8">
        {/* Video Container - Full Width, No Crop */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#0a3d3a]">
          {/* 16:9 Aspect Ratio Container */}
          <div className="relative w-full aspect-video max-h-[600px]">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={heroVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Optional: Gradient overlay at bottom for text */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a3d3a]/60 to-transparent p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold text-lg md:text-xl">Premium Edible Oils</h3>
                  <p className="text-white/70 text-sm">Pure · Natural · Healthy</p>
                </div>
                <Link to="/products" className="btn-gold text-sm px-6 py-2">
                  Shop Now →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content Below */}
        <div className="text-center py-6 md:py-8">
          <h2 className="text-2xl md:text-4xl font-bold text-[#0a3d3a]">
            Pure Quality, <span className="text-[#c49a2c]">Trusted Since 2014</span>
          </h2>
          <p className="text-[#3a4a48] max-w-2xl mx-auto mt-2 text-sm md:text-base">
            Experience the finest edible oils crafted with care and precision.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroVideo;