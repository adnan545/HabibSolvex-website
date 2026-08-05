import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBox, FaShip, FaFileAlt, FaShieldAlt } from 'react-icons/fa';
const Export = () => {
  const destinations = [
    { flag: '🇺🇸', region: 'North America', countries: 'USA, Canada, Mexico' },
    { flag: '🇪🇺', region: 'Europe', countries: 'UK, Germany, France, Italy' },
    { flag: '🇦🇪', region: 'Middle East', countries: 'UAE, Saudi Arabia, Kuwait' },
    { flag: '🌏', region: 'Asia Pacific', countries: 'Singapore, Malaysia, Australia' },
    { flag: '🌍', region: 'Africa', countries: 'South Africa, Nigeria, Kenya' },
    { flag: '🌎', region: 'South America', countries: 'Brazil, Argentina, Chile' }
  ];

  const capabilities = [
    { icon: FaBox, title: 'Packaging Options', desc: 'PET bottles, Tins, Drums, Flexitanks, IBC Totes' },
    { icon: FaShip, title: 'Shipping', desc: 'FCL, LCL, Breakbulk, Air Freight (samples)' },
    { icon: FaFileAlt, title: 'Documentation', desc: 'COO, Health Certificates, FSSAI, ISO, Lab Reports' },
    { icon: FaShieldAlt, title: 'Certifications', desc: 'ISO 22000, FSSAI, Halal, Kosher (upon request)' }
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-[32px] p-8 md:p-16 mt-4">
        <span className="badge"><i className="fas fa-globe"></i> Export</span>
        <h1 className="text-3xl md:text-5xl font-bold text-[#0a3d3a] mt-3">
          Global <span className="text-[#c49a2c]">Presence</span>
        </h1>
        <p className="text-[#3a4a48] max-w-xl mt-3">
          Exporting premium edible oils to over 40 countries across 6 continents.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        {[
          { number: '40+', label: 'Export Countries' },
          { number: '6', label: 'Continents' },
          { number: '500+', label: 'Container Shipments' },
          { number: 'ISO', label: '22000 Certified' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl text-center shadow-lg border border-[#0a3d3a]/10"
          >
            <span className="text-3xl md:text-4xl font-bold text-[#c49a2c]">{stat.number}</span>
            <p className="text-sm text-[#3a4a48] font-medium mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Destinations */}
      <section className="my-12">
        <div className="section-header">
          <span className="badge">Destinations</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a]">
            Export <span className="text-[#c49a2c]">Destinations</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((dest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white p-4 rounded-xl shadow-md border-l-4 border-[#c49a2c]"
            >
              <h4 className="text-lg font-bold text-[#0a3d3a]">{dest.flag} {dest.region}</h4>
              <p className="text-sm text-[#3a4a48]">{dest.countries}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="my-12">
        <div className="section-header">
          <span className="badge">Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a]">
            Export <span className="text-[#c49a2c]">Capabilities</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-[#0a3d3a]/10 text-center"
            >
              <cap.icon className="text-4xl text-[#c49a2c] mx-auto" />
              <h4 className="text-lg font-bold text-[#0a3d3a] mt-3">{cap.title}</h4>
              <p className="text-sm text-[#3a4a48]">{cap.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="my-12">
        <div className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a]">
            Interested in <span className="text-[#c49a2c]">Exporting</span> With Us?
          </h2>
          <p className="text-[#3a4a48] max-w-lg mx-auto mt-3">
            Contact our export team for a quote, samples, and shipping details.
          </p>
          <Link to="/contact" className="btn-gold inline-flex items-center gap-2 mt-6">
            Send Export Inquiry →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Export;