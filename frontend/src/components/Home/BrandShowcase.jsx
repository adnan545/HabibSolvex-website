import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const BrandShowcase = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const brands = [
    {
      name: 'Fortune',
      description: 'India\'s leading edible oil brand',
      color: 'bg-gradient-to-br from-[#c49a2c] to-[#e8b84c]',
      icon: '🛢️'
    },
    {
      name: 'Adani Wilmar',
      description: 'Trusted food solutions',
      color: 'bg-gradient-to-br from-[#0a3d3a] to-[#1a5c57]',
      icon: '🏭'
    },
    {
      name: 'Kohinoor',
      description: 'Premium rice since 1889',
      color: 'bg-gradient-to-br from-[#8B7355] to-[#A89070]',
      icon: '🍚'
    },
    {
      name: 'Tops',
      description: 'Pure and natural foods',
      color: 'bg-gradient-to-br from-[#2E7D32] to-[#4CAF50]',
      icon: '🌿'
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* <div className="section-header">
          <span className="badge">Our Brands</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#0a3d3a]">
            A Portfolio of <span className="text-[#c49a2c]">Everyday Essentials</span>
          </h2>
          <p className="text-[#3a4a48] text-lg">
            Built on trust and quality, our brands enrich lives and set new standards in the food industry.
          </p>
        </div> */}

        {/* <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${brand.color} rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 shadow-xl`}
            >
              <div className="text-5xl mb-3">{brand.icon}</div>
              <h3 className="text-xl font-bold">{brand.name}</h3>
              <p className="text-sm text-white/80">{brand.description}</p>
            </motion.div>
          ))}
        </div> */}

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