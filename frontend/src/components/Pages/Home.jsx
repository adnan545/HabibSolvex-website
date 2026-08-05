import React from 'react';
import HeroVideo from '../Home/HeroVideo';
import OilFoodShowcase from '../Home/OilFoodShowcase';
import StatsSection from '../Home/StatsSection';
import BrandShowcase from '../Home/BrandShowcase';
import ContactBanner from '../Home/ContactBanner';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Video - Full width, perfect fit */}
      <HeroVideo />

      {/* About Snippet - Clear separation */}
      <section className="section pt-6 md:pt-10 pb-8 md:pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="badge">About Us</span>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#0a3d3a] mt-2">
                  Nourishing Lives. <br className="block sm:hidden" />
                  <span className="text-[#c49a2c]">Nurturing the Nation</span>
                </h2>
              </div>
              <Link to="/about" className="btn-outline text-sm md:text-base flex items-center gap-2" onClick={scrollToTop}>
                Our Story <FaArrowRight />
              </Link>
            </div>
            <p className="max-w-3xl text-[#3a4a48] text-base md:text-lg mt-4">
              Habib Solvex has been at the forefront of India's edible oil industry, evolving through decades of quality and trust. 
              From sourcing to refining, we deliver edible oils that meet global food safety standards. 
              Trusted by hotels, restaurants, and food manufacturers across 6 continents.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 mt-4">
              <div className="flex items-center gap-2 text-sm md:text-base"><FaCheckCircle className="text-[#c49a2c] text-sm" /> ISO 22000 · FSSAI</div>
              <div className="flex items-center gap-2 text-sm md:text-base"><FaCheckCircle className="text-[#c49a2c] text-sm" /> 100% Natural</div>
              <div className="flex items-center gap-2 text-sm md:text-base"><FaCheckCircle className="text-[#c49a2c] text-sm" /> Zero Trans Fat</div>
              <div className="flex items-center gap-2 text-sm md:text-base"><FaCheckCircle className="text-[#c49a2c] text-sm" /> Sustainable Sourcing</div>
            </div>
          </motion.div>
        </div>
      </section>

      <OilFoodShowcase />
      <StatsSection />
      <BrandShowcase />
      <ContactBanner />
    </div>
  );
};

export default Home;