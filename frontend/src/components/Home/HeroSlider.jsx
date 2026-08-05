import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import slide1 from '../../assets/images/hero/slide1.jpg';
import slide2 from '../../assets/images/hero/slide2.jpg';
import slide3 from '../../assets/images/hero/slide3.jpg';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const HeroSlider = () => {
  const slides = [
    {
      title: 'For Healthy Food',
      subtitle: 'with Taste ka Tadka',
      description: 'Bring home the goodness of pure, healthy edible oils that make every meal special.',
      image: slide1,
      badge: 'Since 2014 · Pure & Natural',
      cta: 'Explore Products'
    },
    {
      title: 'Delivering Pure Quality',
      subtitle: 'Edible Oils with Trust',
      description: 'Premium refined oils for food service, retail, and industry — crafted with integrity and food-safe excellence.',
      image: slide2,
      badge: 'Trusted · Pure · Natural',
      cta: 'Shop Now'
    },
    {
      title: 'Trusted by Millions',
      subtitle: 'Across 40+ Countries',
      description: 'ISO 22000 certified. Exporting premium edible oils to global markets with consistent quality.',
      image: slide3,
      badge: 'Global Presence',
      cta: 'Export Inquiry'
    }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px] w-full"
        style={{ borderRadius: 0 }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a3d3a]/80 to-[#0a3d3a]/30"></div>
              
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="max-w-xl md:max-w-2xl text-white"
                  >
                    <span className="badge bg-[#e8d5a3] text-[#0a3d3a] mb-3 md:mb-4 inline-block text-[10px] md:text-xs">
                      {slide.badge}
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      {slide.title}
                      <br />
                      <span className="text-[#c49a2c]">{slide.subtitle}</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-white/90 mt-2 md:mt-4 max-w-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-3 md:gap-4 mt-4 md:mt-6">
                      <Link to="/products" className="btn-gold text-xs sm:text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
                        {slide.cta} →
                      </Link>
                      <Link to="/contact" className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:bg-white/30 transition-all border border-white/30 text-xs sm:text-sm md:text-base">
                        Get Quote
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;