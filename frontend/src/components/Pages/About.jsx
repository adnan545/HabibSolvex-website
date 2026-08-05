import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaEye, FaBullseye, FaHandshake, FaIndustry, 
  FaMapMarkerAlt, FaWarehouse 
} from 'react-icons/fa';

import facilityImg from '../../assets/images/about/facility.jpg';


const About = () => {
  const timeline = [
    { year: '2014', title: 'Founded', desc: 'Started operations in Hiriyur, Karnataka' },
    { year: '2016', title: 'First Export', desc: 'Expanded to international markets' },
    { year: '2020', title: 'ISO 22000', desc: 'Achieved food safety certification' },
    { year: '2024', title: 'New Facility', desc: 'State-of-the-art manufacturing plant' }
  ];

  const leaders = [
    { initials: 'HA', name: 'Mehmood Khan', role: 'Director' },
    { initials: 'PS', name: 'Nasir Khan', role: 'Director' },
    { initials: 'RM', name: 'Mudassir Khan', role: 'Director' }
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* ===== HERO SECTION - FIXED WITH RIGHT SIDE IMAGE ===== */}
      <section className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-[32px] p-8 md:p-16 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          <span className="badge"><i className="fas fa-info-circle"></i> About Us</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0a3d3a] mt-3">
            About <span className="text-[#c49a2c]">Habib Solvex</span>
          </h1>
          <p className="text-[#3a4a48] mt-3">
            Habib Solvex is committed to delivering reliable, high-quality solutions with a strong focus on innovation, 
            integrity, and customer satisfaction. We believe in building lasting relationships by providing dependable 
            services tailored to the unique needs of every client.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="badge">Since 2014</span>
            <span className="badge">ISO 22000</span>
            <span className="badge">FSSAI</span>
            <span className="badge">Export 40+ Countries</span>
          </div>
        </div>
        
        {/* Right Side - Image with Floating Badge */}
        <div className="relative">
          <img 
            src={facilityImg} 
            alt="Habib Solvex - Premium Edible Oils Manufacturing"
            className="w-full rounded-2xl shadow-xl object-cover h-64 lg:h-72"
          />
          <div className="absolute -bottom-4 -right-4 bg-[#0a3d3a] text-white text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[#c49a2c] rounded-full animate-pulse"></span>
            Manufacturing Excellence
          </div>
        </div>
      </section>

      {/* Company Banner */}
      <div className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-2xl p-6 md:p-8 my-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#0a3d3a]">Habib Solvex Pvt. Ltd.</h3>
          <p className="text-[#3a4a48]">NH4 Service Road, Hiriyur, Karnataka 577599</p>
          <p className="text-[#3a4a48] text-sm">
            ✉️ habibsolvex@gmail.com &nbsp;|&nbsp; 🌐 www.habibsolvex.com
          </p>
        </div>
        <span className="badge"><i className="fas fa-calendar"></i> Since 2014</span>
      </div>

      {/* Vision & Mission */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-[#0a3d3a]/10"
        >
          <div className="w-14 h-14 bg-[#c49a2c]/20 rounded-xl flex items-center justify-center text-[#c49a2c] text-2xl mb-4">
            <FaEye />
          </div>
          <h3 className="text-xl font-bold text-[#0a3d3a] mb-2">Our Vision</h3>
          <p className="text-[#3a4a48]">To be the most trusted edible oil brand globally, known for purity, innovation, and sustainable practices.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-[#0a3d3a]/10"
        >
          <div className="w-14 h-14 bg-[#c49a2c]/20 rounded-xl flex items-center justify-center text-[#c49a2c] text-2xl mb-4">
            <FaBullseye />
          </div>
          <h3 className="text-xl font-bold text-[#0a3d3a] mb-2">Our Mission</h3>
          <p className="text-[#3a4a48]">Deliver food-safe oils through responsible sourcing, advanced refining, and customer-centric service.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-[#0a3d3a]/10"
        >
          <div className="w-14 h-14 bg-[#c49a2c]/20 rounded-xl flex items-center justify-center text-[#c49a2c] text-2xl mb-4">
            <FaHandshake />
          </div>
          <h3 className="text-xl font-bold text-[#0a3d3a] mb-2">Our Values</h3>
          <p className="text-[#3a4a48]">Integrity, Quality, Innovation, Sustainability, and Customer First.</p>
        </motion.div>
      </section>

      {/* Leadership */}
      <section className="my-12">
        <div className="section-header">
          <span className="badge">Leadership</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a]">
            Our <span className="text-[#c49a2c]">Team</span>
          </h2>
          <p className="text-[#3a4a48]">Experienced leaders driving excellence in the edible oil industry.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaders.map((leader, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl text-center shadow-lg border border-[#0a3d3a]/10"
            >
              <div className="w-20 h-20 mx-auto bg-[#e8d5a3] rounded-full flex items-center justify-center text-2xl font-bold text-[#0a3d3a]">
                {leader.initials}
              </div>
              <h4 className="text-lg font-bold text-[#0a3d3a] mt-3">{leader.name}</h4>
              <p className="text-[#3a4a48] text-sm">{leader.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="my-12">
        <div className="section-header">
          <span className="badge">Journey</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a]">
            Company <span className="text-[#c49a2c]">Timeline</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border-l-4 border-[#c49a2c] shadow-md"
            >
              <h3 className="text-2xl font-bold text-[#c49a2c]">{item.year}</h3>
              <p className="font-semibold text-[#0a3d3a]">{item.title}</p>
              <p className="text-sm text-[#3a4a48]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Infrastructure */}
      <section className="my-12">
        <div className="section-header">
          <span className="badge">Infrastructure</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a]">
            Our <span className="text-[#c49a2c]">Facilities</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl text-center shadow-lg border border-[#0a3d3a]/10">
            <div className="w-16 h-16 mx-auto bg-[#c49a2c]/20 rounded-full flex items-center justify-center text-[#c49a2c] text-3xl">
              <FaIndustry />
            </div>
            <h4 className="text-lg font-bold text-[#0a3d3a] mt-3">Production Capacity</h4>
            <p className="text-2xl font-bold text-[#c49a2c]">500+ MT/day</p>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center shadow-lg border border-[#0a3d3a]/10">
            <div className="w-16 h-16 mx-auto bg-[#c49a2c]/20 rounded-full flex items-center justify-center text-[#c49a2c] text-3xl">
              <FaMapMarkerAlt />
            </div>
            <h4 className="text-lg font-bold text-[#0a3d3a] mt-3">Locations</h4>
            <p className="text-xl font-bold text-[#c49a2c]">2 Facilities</p>
            <p className="text-sm text-[#3a4a48]">Hiriyur · Bangalore</p>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center shadow-lg border border-[#0a3d3a]/10">
            <div className="w-16 h-16 mx-auto bg-[#c49a2c]/20 rounded-full flex items-center justify-center text-[#c49a2c] text-3xl">
              <FaWarehouse />
            </div>
            <h4 className="text-lg font-bold text-[#0a3d3a] mt-3">Warehousing</h4>
            <p className="text-xl font-bold text-[#c49a2c]">50,000+ sq.ft</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;