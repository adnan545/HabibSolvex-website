import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BrandShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const brands = [
    {
      name: 'Fortune',
      description: "India's leading edible oil brand",
      color: 'bg-gradient-to-br from-[#2d7d6b] to-[#4a9b8a]',
      icon: '🛢️'
    },
    {
      name: 'Adani Wilmar',
      description: 'Trusted food solutions',
      color: 'bg-gradient-to-br from-[#1a4d46] to-[#2d7d6b]',
      icon: '🏭'
    },
    {
      name: 'Kohinoor',
      description: 'Premium rice since 1889',
      color: 'bg-gradient-to-br from-[#3a4a48] to-[#5a6b7a]',
      icon: '🍚'
    },
    {
      name: 'Tops',
      description: 'Pure and natural foods',
      color: 'bg-gradient-to-br from-[#2d7d6b] to-[#4a9b8a]',
      icon: '🌿'
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="section-header">
          <span className="badge">Our Brands</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a4d46]">
            A Portfolio of <span className="text-[#2d7d6b]">Everyday Essentials</span>
          </h2>
          <p className="text-[#5a6b7a] text-lg">
            Built on trust and quality, our brands enrich lives and set new standards in the food industry.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${brand.color} rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 shadow-xl`}
            >
              <div className="text-5xl mb-3">{brand.icon}</div>
              <h3 className="text-xl font-bold">{brand.name}</h3>
              <p className="text-sm text-white/80">{brand.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/about" className="btn-outline">
            Discover Our Story →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;