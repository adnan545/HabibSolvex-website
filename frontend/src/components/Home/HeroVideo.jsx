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

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section className="relative w-full bg-[#f8f6f2] py-4 md:py-6">
      <div className="container mx-auto px-4 md:px-8">
        {/* Video Container - Full Width, No Crop, Frame Style */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#1a4d46] border border-[#e0f0ed]">
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

            {/* Gradient overlay at bottom for text */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a4d46]/80 to-transparent p-4 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold text-base md:text-xl">Premium Edible Oils</h3>
                  <p className="text-white/70 text-xs md:text-sm">Pure · Natural · Healthy</p>
                </div>
                <Link to="/products" className="bg-[#2d7d6b] hover:bg-[#4a9b8a] text-white text-xs md:text-sm px-4 py-2 md:px-6 md:py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl">
                  Shop Now →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content Below Video */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center py-6 md:py-8"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-[#1a4d46]">
            Pure Quality, <span className="text-[#2d7d6b]">Trusted Since 2014</span>
          </h2>
          <p className="text-[#5a6b7a] max-w-2xl mx-auto mt-2 text-sm md:text-base">
            Experience the finest edible oils crafted with care and precision.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroVideo;