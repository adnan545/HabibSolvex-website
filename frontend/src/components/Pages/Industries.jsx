import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHotel, FaStore, FaIndustry, FaShip, FaTruck, FaCogs } from 'react-icons/fa';
const Industries = () => {
  const industries = [
    {
      icon: FaHotel,
      title: 'Hotels & Restaurants',
      desc: 'Premium cooking oils for fine dining, buffet services, and kitchen operations. Consistent quality for every dish.',
      tags: ['Sunflower Oil', 'Palm Oil', 'Soybean Oil']
    },
    {
      icon: FaStore,
      title: 'Retail',
      desc: 'Consumer-packaged oils for supermarkets, grocery stores, and online retail. Available in multiple sizes.',
      tags: ['1L PET', '5L Jar', '15L Tin']
    },
    {
      icon: FaIndustry,
      title: 'Food Manufacturing',
      desc: 'Bulk oils for snacks, bakery, confectionery, and processed food production. Custom blends available.',
      tags: ['Bulk', 'Flexitanks', 'Custom']
    },
    {
      icon: FaShip,
      title: 'Export',
      desc: 'Global supply of premium edible oils to 40+ countries. ISO certified and food-safe packaging.',
      tags: ['ISO 22000', 'Global', '40+ Countries']
    },
    {
      icon: FaTruck,
      title: 'Wholesale Distribution',
      desc: 'Partner with us as a distributor. Competitive pricing, reliable supply, and bulk delivery.',
      tags: ['Distributor', 'Bulk', 'Pan India']
    },
    {
      icon: FaCogs,
      title: 'Industrial',
      desc: 'Specialty oils for industrial applications, biodiesel, and technical uses. Custom formulations available.',
      tags: ['Technical', 'Biodiesel', 'Custom']
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-[32px] p-8 md:p-16 mt-4">
        <span className="badge"><i className="fas fa-building"></i> Industries</span>
        <h1 className="text-3xl md:text-5xl font-bold text-[#0a3d3a] mt-3">
          Industries <span className="text-[#c49a2c]">We Serve</span>
        </h1>
        <p className="text-[#3a4a48] max-w-xl mt-3">
          Trusted by businesses across the globe for premium edible oil solutions.
        </p>
      </section>

      {/* Industries Grid */}
      <section className="my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-[#0a3d3a]/10"
            >
              <div className="w-16 h-16 bg-[#c49a2c]/20 rounded-xl flex items-center justify-center text-[#c49a2c] text-2xl mb-4">
                <industry.icon />
              </div>
              <h3 className="text-xl font-bold text-[#0a3d3a]">{industry.title}</h3>
              <p className="text-[#3a4a48] text-sm mt-2">{industry.desc}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {industry.tags.map((tag, i) => (
                  <span key={i} className="badge text-xs">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="my-12">
        <div className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a]">
            Ready to <span className="text-[#c49a2c]">Partner</span> With Us?
          </h2>
          <p className="text-[#3a4a48] max-w-lg mx-auto mt-3">
            Contact our team to discuss your requirements and get a customized solution.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 mt-6">
            Get in Touch →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Industries;